# How it is built

Quire is a Tauri 2 app: a React 19 and TypeScript front end, built with Vite,
inside a small native shell written in Rust. The same front end runs in a
browser with everything but the native pieces. Diagrams are SVG, sound is Web
Audio with no samples, tests are Vitest (and `cargo test` for the Rust crate).
The runtime dependencies are React, Tauri's JavaScript API and plugins (loaded
only inside the desktop app), and four bundled typefaces: Newsreader, Fraunces,
IBM Plex Mono and Silkscreen, all under the SIL Open Font License.

## The rule

Music logic is pure and tested (`src/theory`, `src/practice`,
`src/input/pitch.ts`, `src/audio/groove.ts`); the controller wires it to React;
components only render.

Pure here means data in, data out: the music in those folders never touches
React, the DOM or the audio engine, so all of it runs in a test. (The one
browser API in them is localStorage, in the load and save helpers of
`src/practice/progress.ts`.) The burrow, for example, is a handful of functions
in `src/practice/burrow.ts` (pick a surface, dig a floor, judge the picks, write
the closing line); the controller keeps a `BurrowState` and plays each floor
through the engine; `src/ui/Burrow.tsx` draws the shaft. The same split holds for the crab canon (`src/theory/crab.ts`,
the controller's `crabReport`, `CrabCanon.tsx` with the Möbius geometry in
`src/ui/mobius.ts`) and the triad solver (`src/theory/triads.ts`,
`src/ui/triadModel.ts`, `TriadLab.tsx`).

## A map of the source

```
src/brand.ts     the name, in one place: wordmark, window title, file names, storage keys
src/state/       reducer.ts      the document: key, genre, sections (chords + melody), undo, view
                 controller.tsx  useAppController(): all behaviour in one hook (derived music,
                                 playback, input capture + grading, lessons, the burrow,
                                 persistence, the menu bar's commands)
                 AppContext.tsx  useApp(); views stay dumb
                 session.ts      resume where you left off
                 journal.ts      the book: every log line with its time, kept between sessions
                 dates.ts        datelines, day and week of the year, the month grid
                 storage.ts      localStorage under the app's name (+ carry-over from the old one)
                 sound.ts        which input, which MIDI port
src/theory/      notes, scales, chords, roman numerals, progressions, spices, compose
                 solo.ts (note roles + drills) · lick.ts (demo licks) · transitions.ts
                 melody.ts (motif moves + coach) · suggest.ts (next-chord intents, reharmonize)
                 crab.ts (the crab canon: mirror voice, verdict, crab-proof solver, palindrome chords)
                 triads.ts (inversions on string sets / key windows + the voice-leading path solver)
src/practice/    grade.ts (takes vs drills) · fretDrills.ts (fluency sprints) · progress.ts
                 burrow.ts (the descent: floors, gear, bedrock, the landing)
src/audio/       engine.ts (voices, buses, backing-band scheduler, transport clock)
                 groove.ts (bar events shared by playback AND midi.ts) · midi.ts
src/input/       pitch.ts (YIN + note tracker) · mic.ts · midiIn.ts · qwerty.ts
                 native.ts (the desktop app's ears and MIDI port)
src/data/        genres.ts (the genre book) · lessons.ts (learning paths) · customGenres.ts
src/guitar/      shapes, voicings, tab, positions.ts (connected boxes), caged.ts (form + known grip),
                 melodyTab.ts, licks.ts (tab parser + licks stored as numbers)
src/op1/ src/piano/ src/bass/    instrument layouts + chord fitting
src/ui/          App.tsx (desk + book) · Tabs · Spread (pages, running heads, folios) · pageTurn.ts
                 views/{Learn,Jam,Write}View · Stamps · CoverModal · Burrow · SoloLab · TriadLab
                 FretDrills · MelodyRoll · MelodyWorkbench · CrabCanon + MobiusStrip (mobius.ts is
                 the geometry) · ListenPanel · SoundModal · ProgressionPanel · TransitionPanel · …
                 crabPixels.ts (the crab, pixel by pixel, two frames) · PixelCrab.tsx (draws it)
src-tauri/       src/lib.rs (commands, plugins, window) · audio.rs (Core Audio in, pitch in Rust)
                 midi.rs (CoreMIDI) · menu.rs (the menu bar)
                 crates/quire-dsp    the YIN detector, ported and tested
scripts/         shots.mjs (retakes the screenshots, checks the margins)
```

Tests sit next to what they test (`*.test.ts`).

## The Mac shell

`src-tauri` is a Tauri 2 app with three jobs a web page cannot do: read the
audio interface, listen to CoreMIDI, and put a menu in the menu bar. It also
writes files where the save dialog says.

- **Commands** (`src/lib.rs`): `audio_devices`, `audio_start(device, channel,
  low)`, `audio_stop`, `midi_ports`, `midi_start(port)`, `midi_stop`,
  `save_file`.
- **Events**: `quire://audio` (`freq`, `midi`, `clarity`, `rms`, `level`, `t`),
  `quire://audio-state` (running, stopped, error), `quire://midi` (note on and
  off), `quire://midi-state`, and `quire://menu` (every menu item's id, which
  the controller's `onMenu` turns into a move).
- **The ears** (`src/audio.rs`): one thread owns the cpal (Core Audio) input
  stream for the chosen device and channel. cpal's macOS stream is not `Send`,
  so it is built, started and dropped on that thread, and whether opening
  worked comes back over a one-shot channel. The audio callback only
  de-interleaves the chosen input (or mixes them) and hands the chunk over. The
  thread keeps a rolling window (2048 samples, or 4096 with a lower floor for a
  bass), runs the detector on every second 512-sample hop, and emits what it
  heard: about 47 times a second at 48 kHz.
- **One set of ears**: `crates/quire-dsp` is the YIN detector ported from
  `src/input/pitch.ts`, with the same tests (sine sweeps, a loud 2nd harmonic,
  bass E1 with a 4096 window, mid-frame onsets, silence, noise and whispers,
  scratch reuse). The note tracker that turns the stream into note on and off
  stays in TypeScript, so the microphone, the interface and the tests share it.
  `src/input/native.ts` is the bridge on the page.
- **MIDI** (`src/midi.rs`): midir on its own thread. The desktop shell's
  WKWebView has no Web MIDI, so the app listens natively and forwards notes to
  the page.
- **The window** (`tauri.conf.json`): an overlay title bar the page draws under
  (the index tabs move over to leave the traffic lights room), a desk-coloured
  background, 1400×940 by default, and `tauri-plugin-window-state` to remember
  where it was. In a browser, `?shell=mac` previews that chrome.
- **macOS**: `Entitlements.plist` carries the audio-input entitlement for the
  hardened runtime; `Info.plist` says why the app asks for the microphone; the
  minimum system version is 12.0. The bundle identifier is still
  `com.tydacrabb.spicerack2`, on purpose: changing it would give the app a
  fresh data directory and lose everyone's songs, progress and library.

## What the tests pin down

`npm test` runs 278 tests in 31 files; `cargo test -p quire-dsp` (in
`src-tauri`) runs the Rust detector's 7.

| Area | Test files | What they pin down |
| --- | --- | --- |
| Theory | `theory`, `spices`, `solo`, `lick`, `melody`, `suggest`, `transitions`, `triads`, `compose`, `crab` | spelling and roman numerals; every genre's spices find something on its own templates; the solo map surfaces the borrowed iv's ♭3 and the blues rub; demo licks obey every drill; motif moves never move a locked note; something to say about every change in the genre book; the triad path moves far less than root position and re-routes around a pinned shape; the crab-proof solver is deterministic and never hands back a worse score |
| Practice | `grade`, `fretDrills`, `progress`, `burrow` | grading forgives human timing and names the change that missed; drill cards whose answers are really right, and the 4-fret unison across G–B; the burrow walks every genre floor by floor, turns exactly once where the rack allows, only asks floors that can be heard one way, and digs the same descent for the same seed |
| Ears | `pitch` | YIN at 44.1 and 48 kHz across the guitar's range, under a louder 2nd harmonic, down to bass E1, in a noisy room, silent on silence and white noise; a note tracker that rides out vibrato and hears re-attacks |
| Sound and MIDI | `groove`, `midi` | odd-meter grooves built from accent groups, swing on the upbeats; a structurally valid type-1 MIDI file with the meter, the gear-change repeat and the lead in it |
| Instruments | `guitar`, `caged`, `positions`, `licks`, `melodyTab`, `op1`, `piano`, `bass` | every voicing of every chord quality at every root spelled correctly; the five boxes up the neck; pasted tab parsed; a lick moved to another chord without changing a degree; the OP-1's 24 keys in 3-2-3-2 groups |
| State and data | `lessons`, `journal`, `dates`, `storage`, `sound` | lessons only stage things that exist, and their teaching text has no emoji; the journal's order and length; the one-time carry-over from the old storage keys |
| Geometry | `mobius` | the strip closes on itself with a half twist: one trip round and it faces the other way |

## The screenshots

`scripts/shots.mjs` (run as `npm run shots`, with `npm run dev` running)
launches a headless Chrome in a throwaway profile and drives it over the
DevTools protocol with Node's own `fetch` and `WebSocket`: no Puppeteer, no
Playwright, nothing to install beyond Node 22 and Chrome. It seeds
`Math.random` (seed 16) so the spice rack rolls the same way every time, stages
one session at the Mac app's default window size, and writes
`docs/screenshots/*.png`; `--film` also records the short film at the top of
the README (frames taken at a steady rate while the session is driven in real
time, then one ffmpeg pass with a single palette).

On every page it visits, it checks three things, and a miss exits 1
(`--check-only` runs the checks without writing pictures):

- **Margins.** No text touches the vermilion margin rule or leaves the page.
- **Contrast.** Every piece of HTML text is measured against what is behind it,
  opacity included, and must reach 4.5:1 (3:1 for large type). Disabled
  controls are exempt, and so are the diagrams, where the faint dots are the
  rest of the neck and are meant to recede.
- **Errors.** Nothing was thrown, and nothing was logged with `console.error`.

## The live build

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci`, the
tests, then `npm run build` with `VITE_BASE=/quire/`, and the bundle goes to
GitHub Pages at <https://crabbtech.github.io/quire/>. The web build keeps its
journal in the browser's localStorage, like the Mac app's webview does.

## Deep links

Handy for debugging and screenshots. Any of `genre`, `prog`, `tonic` or
`instrument` skips resuming the last session.

```
?genre=blues&tonic=E&instrument=op1&view=jam&prog=I,iv,V7,IV&lens=thirds&focus=1&xfer=0&scale=1&both=1&modulate=2&tool=triads|drills&drill=interval&labels=numbers
```

`?shell=mac` previews the Mac app's title-bar chrome in a browser.
