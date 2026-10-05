#!/usr/bin/env node
// Retakes the README's screenshots from the running app, and checks the page margins while it is there.
//
//   npm run dev                         the app on http://localhost:1430, in another terminal
//   npm run shots                       writes docs/screenshots/*.png, exits 1 if a margin check fails
//   npm run shots -- --check-only       the margin checks alone
//   npm run shots -- --seed 12          another roll of the spice rack (the default seed is the README's)
//
// Needs Node 22+ and Google Chrome (set CHROME to the binary if it lives somewhere unusual). No
// dependencies: a headless Chrome is driven over the DevTools protocol with Node's own fetch and
// WebSocket, in a throwaway profile, so the journal in every picture is the one this session wrote.

import { spawn } from 'node:child_process';
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
  const viewport = (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });

  await send('Page.enable'); await send('Runtime.enable');
  await viewport(WINDOW.width, WINDOW.height);
  if (seed !== null) {
    // the spice rack rolls dice: a seeded Math.random makes the same session, and so the same pictures, every time
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => { let a = ${Number(seed)} >>> 0; Math.random = () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })()` });
  }

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
  const scrollToHeading = (text, above = 70) => evaluate(`(() => {
    const h = [...document.querySelectorAll('h1,h2,h3,h4')].find((e) => e.textContent.trim().toLowerCase().startsWith(${JSON.stringify(text.toLowerCase())}));
    window.scrollTo(0, h ? h.getBoundingClientRect().top + window.scrollY - ${above} : 0);
    return !!h;
  })()`);
  /** Grow the window until the page fits (up to a limit), so a tall tool is not cut off mid-diagram. */
  const fitHeight = async (max = 1500) => {
    await viewport(WINDOW.width, WINDOW.height);
    const need = await evaluate('document.documentElement.scrollHeight');
    await viewport(WINDOW.width, Math.max(WINDOW.height, Math.min(max, need)));
    await sleep(250);
  };
  const shot = async (file) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(file, Buffer.from(data, 'base64'));
  };
  const close = async () => { await send('Page.close').catch(() => {}); ws.close(); };
  return { send, evaluate, goto, click, scrollToHeading, fitHeight, viewport, shot, close };
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
    const check = async (where) => { for (const line of await page.evaluate(MARGIN_CHECK)) problems.push(`${where}: ${line}`); };
    const take = async (name, where) => {
      await check(where);
      if (!checkOnly) { await page.shot(join(out, name)); console.log('  ' + name); }
    };

    // Write: four chords in A, spiced twice, so the journal on the right page has real entries in it
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV');
    await page.click('Spice it up');
    await page.click('Spice it up', { settle: 800 });
    await take('write.png', 'Write');

    // the same bench on the OP-1 field's keys, then back
    await page.click('OP-1');
    await take('write-op1.png', 'Write, OP-1');
    await page.click('Guitar');

    // Jam: the solo lab over the last chord of the loop, then the triad lab
    await page.click('Jam');
    await page.evaluate(`(() => { const row = [...document.querySelectorAll('.control-label')].find((e) => e.textContent.trim().toLowerCase() === 'over')?.parentElement; const chips = row ? [...row.querySelectorAll('button')].filter((b) => !/loop/i.test(b.textContent)) : []; chips.at(-1)?.click(); })()`);
    await sleep(500);
    await page.fitHeight();
    await take('jam-solo-lab.png', 'Jam, solo lab');
    await page.click('Triad lab');
    await page.fitHeight();
    await take('jam-triad-lab.png', 'Jam, triad lab');
    await page.click('Neck drills');
    await check('Jam, neck drills');

    // Learn: the contents, the stamp card, the burrow
    await page.click('Learn');
    await page.viewport(WINDOW.width, WINDOW.height);
    await page.evaluate('window.scrollTo(0, 0)');
    await sleep(700);
    await take('learn.png', 'Learn');

    // Write again: a melody from a lick, met by itself walking backwards
    await page.click('Write');
    await sleep(500);
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
    await page.evaluate('window.scrollTo(0, 0)');
    await page.evaluate(`document.querySelector('.brand, [class*="brand"]')?.closest('button')?.click()`);
    await sleep(800);
    if (!checkOnly) { await page.shot(join(out, 'inside-cover.png')); console.log('  inside-cover.png'); }

    // last, because it changes the song: a second section, for the ORDER row beside SONG (checked, not pictured)
    await page.goto('?genre=classic-rock&tonic=A&view=write&prog=I,V,vi,IV');
    await page.click('+ copy');
    await check('Write, two sections');
    await page.close();
  } finally {
    await chrome.close();
  }

  if (problems.length) {
    console.error(`\n${problems.length} margin problem${problems.length === 1 ? '' : 's'}:`);
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log('margins: nothing touches the rule on any page');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
