#!/usr/bin/env node
// Retakes the README's pictures from the running app, and checks every page while it is there.
//
//   npm run dev                         the app on http://localhost:1430, in another terminal
//   npm run shots                       writes docs/screenshots/*.png, exits 1 if a check fails
//   npm run shots -- --check-only       the checks alone
//   npm run shots -- --film             also records docs/screenshots/quire.gif (needs ffmpeg)
//   npm run shots -- --seed 12          another roll of the spice rack (the default seed is the README's)
//
// The checks, on every page the session visits:
//   margins    no text touches the vermilion margin rule, and no margin note leaves the page
//   contrast   every piece of text reaches 4.5:1 against what is behind it (3:1 for large type)
//   errors     nothing was thrown and nothing was logged with console.error
//
// Needs Node 22+ and Google Chrome (set CHROME to the binary if it lives somewhere unusual). No
// dependencies: a headless Chrome is driven over the DevTools protocol with Node's own fetch and
// WebSocket, in a throwaway profile, so the journal in every picture is the one this session wrote.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.QUIRE_URL ?? 'http://localhost:1430';
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WINDOW = { width: 1400, height: 940 }; // the Mac app's default window (src-tauri/tauri.conf.json)
export const DEFAULT_SEED = 16;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchChrome() {
  if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}. Set CHROME to the binary.`);
  const profile = mkdtempSync(join(tmpdir(), 'quire-shots-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const port = await new Promise((res, rej) => {
    let err = '';
    proc.stderr.on('data', (d) => { err += d; const m = err.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//); if (m) res(Number(m[1])); });
    proc.on('exit', () => rej(new Error('Chrome exited before it was ready:\n' + err)));
  });
  const close = async () => {
    // wait for Chrome to go before clearing its profile: it is still writing as it shuts down
    const gone = new Promise((res) => proc.once('exit', res));
    proc.kill();
    await Promise.race([gone, sleep(3000)]);
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
  };
  return { port, close };
}

/** Runs in the page before anything else: seeded dice, and a note of everything that goes wrong. */
const preamble = (seed) => `(() => {
  window.__quireErrors = [];
  addEventListener('error', (e) => window.__quireErrors.push(String(e.message)));
  addEventListener('unhandledrejection', (e) => window.__quireErrors.push('unhandled rejection: ' + String(e.reason)));
  const consoleError = console.error;
  console.error = (...a) => { window.__quireErrors.push(a.map(String).join(' ').slice(0, 240)); consoleError(...a); };
  ${seed === null ? '' : `let a = ${Number(seed)} >>> 0;
  // the spice rack rolls dice: a seeded Math.random makes the same session, and so the same pictures, every time
  Math.random = () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };`}
})()`;

/** One tab, with the few verbs the staging below needs. */
export async function openPage(port, { seed = null, scale = 1.5 } = {}) {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const waiting = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id); pending.delete(msg.id);
      if (msg.error) rej(new Error(msg.error.message)); else res(msg.result);
    } else if (msg.method && waiting.has(msg.method)) {
      for (const fn of waiting.get(msg.method).splice(0)) fn(msg.params);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const once = (method) => new Promise((res) => { if (!waiting.has(method)) waiting.set(method, []); waiting.get(method).push(res); });
  let pixelRatio = scale;
  const viewport = (width, height, ratio = pixelRatio) => { pixelRatio = ratio; return send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: ratio, mobile: false }); };

  await send('Page.enable'); await send('Runtime.enable');
  await viewport(WINDOW.width, WINDOW.height);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: preamble(seed) });

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  const goto = async (query, settle = 700) => {
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url: BASE + '/' + query });
    await loaded;
    await evaluate('document.fonts.ready.then(() => true)');
    await sleep(settle);
  };
  /** Click the nth visible element with exactly this text (case-insensitive). */
  const click = async (text, { tag = 'button', nth = 0, settle = 450 } = {}) => {
    const ok = await evaluate(`(() => {
      const want = ${JSON.stringify(text)}.toLowerCase();
      const el = [...document.querySelectorAll(${JSON.stringify(tag)})].filter((e) => e.offsetParent !== null && e.textContent.trim().toLowerCase() === want)[${nth}];
      if (!el) return false;
      el.click();
      return true;
    })()`);
    if (!ok) throw new Error(`nothing to click: <${tag}> "${text}"`);
    await sleep(settle);
  };
  /** Bring a heading to the top of the page it is on (each page scrolls on its own; a stacked page scrolls the window). */
  const scrollToHeading = (text, above = 14) => evaluate(`(() => {
    const h = [...document.querySelectorAll('h1,h2,h3,h4')].find((e) => e.textContent.trim().toLowerCase().startsWith(${JSON.stringify(text.toLowerCase())}));
    if (!h) return false;
    const pane = h.closest('.page-scroll');
    const scrolls = pane && getComputedStyle(pane).overflowY !== 'visible';
    if (scrolls) pane.scrollTop += h.getBoundingClientRect().top - pane.getBoundingClientRect().top - ${above};
    else window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - 70);
    return true;
  })()`);
  const scrollToTop = () => evaluate(`(() => { for (const p of document.querySelectorAll('.page-scroll')) p.scrollTop = 0; window.scrollTo(0, 0); })()`);
  /** Grow the window until nothing on either page is cut off (up to a limit), for the tools taller than a screen. */
  const fitHeight = async (max = 1500) => {
    await viewport(WINDOW.width, WINDOW.height);
    const extra = await evaluate(`Math.max(document.documentElement.scrollHeight - innerHeight, ...[...document.querySelectorAll('.page-scroll')].map((p) => p.scrollHeight - p.clientHeight))`);
    await viewport(WINDOW.width, Math.max(WINDOW.height, Math.min(max, WINDOW.height + Math.ceil(extra))));
    await sleep(250);
  };
  const shot = async (file) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(file, Buffer.from(data, 'base64'));
  };
  const close = async () => { await send('Page.close').catch(() => {}); ws.close(); };
  return { send, evaluate, goto, click, scrollToHeading, scrollToTop, fitHeight, viewport, shot, close };
}

/**
 * The margin rule is a boundary: notes sit to its left, the text block to its right, and nothing is
 * set across it. Returns one line per piece of text that touches the rule (within 3px) or that has
 * left the page on the other side.
 */
export const MARGIN_CHECK = `(() => {
  const out = [];
  for (const body of document.querySelectorAll('.page-body')) {
    const b = body.getBoundingClientRect();
    const ruleX = b.left + parseFloat(getComputedStyle(body, '::before').left);
    const page = body.closest('.page').classList.contains('page-right') ? 'right page' : 'left page';
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || !n.parentElement.offsetParent) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width === 0) continue;
        const what = '"' + n.textContent.trim().slice(0, 24) + '" (' + (n.parentElement.className || n.parentElement.tagName.toLowerCase()) + ')';
        if (r.left < ruleX + 3 && r.right > ruleX - 3) out.push(page + ': ' + what + ' touches the margin rule');
        else if (r.left < b.left - 0.5) out.push(page + ': ' + what + ' starts ' + (b.left - r.left).toFixed(1) + 'px outside the page');
      }
    }
  }
  return [...new Set(out)];
})()`;

/**
 * Text contrast (WCAG 2 AA): every piece of HTML text against what is behind it, opacity included.
 * 4.5:1, or 3:1 for large type; disabled controls are exempt, and so are the diagrams (SVG), where
 * the faint dots are the rest of the neck and are meant to recede. One line per failing style.
 */
export const CONTRAST_CHECK = `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return [0, 0, 0, 0]; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const backdrop = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const bg = parse(getComputedStyle(n).backgroundColor); if (bg[3] > 0) layers.push(bg); if (bg[3] === 1) break; }
    let c = [255, 255, 255, 1];
    for (const l of layers.reverse()) c = over(l, c);
    return c;
  };
  const seen = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.textContent.trim() || !el || !el.offsetParent || el.closest('svg, [aria-hidden="true"], :disabled, [aria-disabled="true"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    let opacity = 1;
    for (let p = el; p && p.nodeType === 1; p = p.parentElement) opacity *= parseFloat(getComputedStyle(p).opacity);
    const bg = backdrop(el);
    const fg = parse(cs.color); fg[3] *= opacity;
    const r = ratio(over(fg, bg), bg);
    const size = parseFloat(cs.fontSize);
    const need = size >= 24 || (parseInt(cs.fontWeight, 10) >= 700 && size >= 18.66) ? 3 : 4.5;
    if (r + 0.005 >= need) continue;
    const name = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).join('.') : el.tagName.toLowerCase();
    const key = name + ' ' + cs.color + ' on rgb(' + bg.slice(0, 3).map(Math.round).join(', ') + ')';
    if (!seen.has(key)) seen.set(key, r.toFixed(2) + ':1 where ' + need + ':1 is wanted: ' + key + ', ' + size + 'px, e.g. "' + n.textContent.trim().slice(0, 24) + '"');
  }
  return [...seen.values()];
})()`;

/**
 * A short film of the app in use, for the README: play, two rolls of the spice rack, a page turn to
 * Jam. Frames are taken at a steady rate while the session is driven in real time, then ffmpeg makes
 * a GIF with one palette for the whole film.
 */
async function film(port, seed, file) {
  if (spawnSync('ffmpeg', ['-version']).status !== 0) { console.error('  --film needs ffmpeg on the PATH; skipped'); return; }
  const FPS = 10, WIDTH = WINDOW.width, HEIGHT = WINDOW.height, OUT_WIDTH = 1000;
  const frames = mkdtempSync(join(tmpdir(), 'quire-film-'));
  const page = await openPage(port, { seed, scale: 1 });
  try {
    await page.viewport(WIDTH, HEIGHT, 1);
    // the film opens on a clean journal (this is the script's own throwaway profile)
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV', 200);
    await page.evaluate('localStorage.clear()');
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV', 900);
    let n = 0, rolling = true;
    const camera = (async () => {
      const t0 = Date.now();
      while (rolling) {
        const due = t0 + n * (1000 / FPS);
        if (Date.now() < due) await sleep(due - Date.now());
        const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(join(frames, `f${String(n++).padStart(4, '0')}.png`), Buffer.from(data, 'base64'));
      }
    })();
    await sleep(900);
    await page.click('▶ Play', { settle: 2600 });
    await page.click('Spice it up', { settle: 2800 });
    await page.click('Spice it up', { settle: 3000 });
    await page.click('Jam', { settle: 4200 });
    await page.click('■ Stop', { settle: 700 });
    rolling = false;
    await camera;
    const made = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'),
      '-vf', `scale=${OUT_WIDTH}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`,
      '-loop', '0', file], { stdio: 'inherit' });
    if (made.status === 0) console.log(`  ${file.split('/').pop()} (${n} frames at ${FPS} a second)`);
  } finally {
    await page.close();
    rmSync(frames, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check-only');
  const seed = args.includes('--seed') ? Number(args[args.indexOf('--seed') + 1]) : DEFAULT_SEED;
  const out = join(ROOT, 'docs', 'screenshots');
  if (!checkOnly) mkdirSync(out, { recursive: true });
  try { await fetch(BASE); } catch { console.error(`Nothing is answering at ${BASE}. Start the app first: npm run dev`); process.exit(2); }

  const chrome = await launchChrome();
  const problems = [];
  try {
    const page = await openPage(chrome.port, { seed });
    const check = async (where) => {
      // let whatever is inking in or turning finish first: a line caught mid-fade is not a faint line
      await page.evaluate(`Promise.race([Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 2000))]).then(() => true)`);
      for (const line of await page.evaluate(MARGIN_CHECK)) problems.push(`${where}: margins: ${line}`);
      for (const line of await page.evaluate(CONTRAST_CHECK)) problems.push(`${where}: contrast: ${line}`);
      for (const line of await page.evaluate('window.__quireErrors.splice(0)')) problems.push(`${where}: error: ${line}`);
    };
    const take = async (name, where) => {
      await check(where);
      if (!checkOnly) { await page.shot(join(out, name)); console.log('  ' + name); }
    };

    // a journal nobody has written in: the first page of Write, and Learn saying where to start
    await page.goto('');
    await check('Write, first run');
    await page.click('Learn', { settle: 700 });
    await take('learn.png', 'Learn, first run');

    // Write: four chords in A, spiced twice, so the journal on the right page has real entries in it
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV');
    await page.click('Spice it up');
    await page.click('Spice it up', { settle: 800 });
    await take('write.png', 'Write');

    // every genre unfolded, then folded again (checked, not pictured)
    await page.click('All 19 genres');
    await check('Write, genres unfolded');
    await page.click('Fold');

    // the same bench on the OP-1 field's keys, then back
    await page.click('OP-1');
    await take('write-op1.png', 'Write, OP-1');
    await page.click('Guitar');

    // Jam: the solo lab over the last chord of the loop, then the triad lab
    await page.click('Jam', { settle: 700 });
    await page.evaluate(`(() => { const row = [...document.querySelectorAll('.control-label')].find((e) => e.textContent.trim().toLowerCase() === 'over')?.parentElement; const chips = row ? [...row.querySelectorAll('button')].filter((b) => !/loop/i.test(b.textContent)) : []; chips.at(-1)?.click(); })()`);
    await sleep(500);
    await page.fitHeight();
    await take('jam-solo-lab.png', 'Jam, solo lab');
    await page.click('Triad lab');
    await page.fitHeight();
    await take('jam-triad-lab.png', 'Jam, triad lab');
    await page.click('Neck drills');
    await check('Jam, neck drills');

    // Write again: a melody from a lick, met by itself walking backwards
    await page.viewport(WINDOW.width, WINDOW.height);
    await page.click('Write', { settle: 700 });
    await page.click('Seed from lick');
    await page.click('Let the crab in');
    await page.click('Mirror the chords');
    await page.click('Crab-proof', { settle: 900 });
    await page.viewport(WINDOW.width, 1240);
    await page.scrollToHeading('Melody workbench');
    await sleep(900);
    await take('melody-and-crab-canon.png', 'Write, melody and crab canon');

    // the inside cover
    await page.viewport(WINDOW.width, WINDOW.height);
    await page.scrollToTop();
    await page.evaluate(`document.querySelector('.brand').click()`);
    await sleep(800);
    await take('inside-cover.png', 'the inside cover');

    // last, because they change the song: a lesson in hand, and a second section for the ORDER row beside SONG
    await page.goto('?view=learn');
    await page.click('▶ Begin', { settle: 900 });
    await check('Jam, a lesson in hand');
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV');
    await page.click('+ copy');
    await check('Write, two sections');
    await page.close();

    if (args.includes('--film') && !checkOnly) await film(chrome.port, seed, join(out, 'quire.gif'));
  } finally {
    await chrome.close();
  }

  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log('checks: margins, contrast and errors are clean on every page');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
