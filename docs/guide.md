# A quick guide

Quire is a practice journal for chords: a desktop app (Tauri 2, React and a
little Rust) that also runs in a browser. This page gets it onto your machine
and shows you around. Every feature is in [the complete tour](features.md); how
the code fits together is in [how it is built](architecture.md).

To try it without installing anything, the web build is at
<https://crabbtech.github.io/quire/>. It is the whole app except the native
pieces (the audio interface input, CoreMIDI and the menu bar).

## Get the code

```bash
git clone https://github.com/CrabbTech/quire.git
cd quire
```

Everything is on `main`, at the root of the repository.

## What you need

| For | Install |
| --- | --- |
| The web build (browser, tests) | Node 22 or newer, and npm |
| The Mac app | Xcode's command line tools (`xcode-select --install`) and Rust via [rustup](https://rustup.rs) |
| Retaking the screenshots | Google Chrome |

Everything else comes from `npm ci`. Tauri's CLI is a dev dependency; the Rust
crates download on the first `tauri` build.

## Run it

```bash
npm ci
```

### In a browser

The fastest way to poke at it:

```bash
npm run dev
```

Open <http://localhost:1430>. Hot reload is on. The whole app works here
except the native pieces: the audio interface input, CoreMIDI and the menu
bar. The microphone, Web MIDI (Chrome and Edge) and the computer keyboard
still work.

### As the Mac app

```bash
npm run tauri dev
```

The first run compiles the Rust side and takes a few minutes; after that it is
quick. macOS asks for the microphone once, and that permission also covers
audio interfaces.

### Checks

```bash
npm test                    # 278 tests in 31 files, a few seconds
npx tsc --noEmit            # types
npm run build               # type-check, then the production bundle in dist/
(cd src-tauri && cargo check && cargo test -p quire-dsp)   # the Rust side; 7 pitch tests
```

### A release build

```bash
npm run tauri build    # Quire.app and a .dmg in src-tauri/target/release/bundle/
```

Signing and notarization go through `bundle.macOS.signingIdentity` in
`src-tauri/tauri.conf.json`, as for any Tauri app.
`src-tauri/Entitlements.plist` carries the audio-input entitlement the hardened
runtime needs, and the microphone prompt's wording is
`NSMicrophoneUsageDescription` in `src-tauri/Info.plist`.

### Retaking the screenshots

With `npm run dev` running in another terminal:

```bash
npm run shots                    # writes docs/screenshots/*.png and checks every page
npm run shots -- --check-only    # the checks alone
npm run shots -- --film          # also records docs/screenshots/quire.gif (needs ffmpeg)
npm run shots -- --seed 12       # another roll of the spice rack (16 is the README's)
```

The script drives a headless Chrome in a throwaway profile, so the journal in
every picture is the one that session wrote. On every page it visits it checks
three things: that no text touches the margin rule, that every piece of text
reaches 4.5:1 against what is behind it (3:1 for large type), and that nothing
was thrown or logged as an error. It exits 1 on a miss, and 2 if nothing is
answering at the dev server's address. Set `CHROME` if Chrome lives somewhere
unusual and `QUIRE_URL` to point it at another address.

### Serving the web build from a sub-path

`npm run build` makes a bundle that serves from `/`. To serve it from a
sub-path instead (a GitHub Pages project site, say), set `VITE_BASE`:

```bash
VITE_BASE=/quire/ npm run build
```

That is what `.github/workflows/deploy.yml` does on every push to `main`, after
the tests, to publish <https://crabbtech.github.io/quire/>.

## Finding your way around

The app is an open notebook with three pages, as tabs along the top:

- **Write** is the bench. Pick a key and a genre, get a progression, then
  *Spice it up* (mild, medium, hot) or use *What next*. Every move is
  explained in the journal on the right page, with the time it was written.
  Song sections, the melody workbench and the crab canon are here too.
- **Jam** is instrument in hand. Cards shrink to a chord chart; the big
  diagram belongs to the Solo lab, the Triad lab or the Neck drills. Press
  play and the app listens (mic, interface, MIDI or keyboard) and grades each
  pass.
- **Learn** is the contents page: eight short paths that stage the bench for
  you, the practice stamp card, the records, and **the burrow**. In a new
  journal its right page says where to start.

The spread fills the window, and each page scrolls on its own, so the
transport and the journal stay put while the bench scrolls.

The inside cover (click the crab and wordmark at the top left, or
<kbd>⌘</kbd> <kbd>I</kbd> in the Mac app) lists every keyboard shortcut. The
ones you will use first: <kbd>space</kbd> plays and stops, <kbd>s</kbd> spices,
<kbd>u</kbd> undoes, <kbd>x</kbd> A/Bs the last spice, <kbd>j</kbd> flips
between Jam and Write, <kbd>1</kbd>–<kbd>4</kbd> switch the instrument.

### The burrow

At the foot of Learn. Press **Dig**. The crab plays the genre's loop once,
then digs: each floor down, one chord of the loop is changed by one of the
spice rack's real moves, and you say which chord it was. Floors 1 to 3 play
both loops; from floor 4 only the new one, and you hold the old one in your
ear. Genres with the truck driver turn a whole step up at floor 4. From floor
8 two chords change. You get one **Again** per descent; spend it late. A miss,
bedrock (nothing left on the rack that fits) or **Come up** lands the loop on
the Write bench and writes the whole descent into the journal.

### Playing through an amp sim

Plug the guitar into your interface and run AmpliTube (or any amp sim) on it as
usual. In Quire open **Sound…** (<kbd>⌘</kbd> <kbd>,</kbd>), pick the same
interface and input, press Listen, and set Jam's Listen source to
**Interface**. Core Audio lets both apps read the input, so Quire hears the dry
string while the amp sim makes the tone. To grade the amp's sound instead,
route it into BlackHole or Loopback and pick that under Sound.

## Where your journal is kept

Your progress, journal, library and settings live in localStorage under the
`quire.` prefix, so they survive rebuilds; a fresh browser profile starts
empty. The first launch after the rename from Spicerack 2 copies any old
`spicerack2.` keys across once, never overwriting. The Mac app keeps the bundle
identifier `com.tydacrabb.spicerack2` on purpose: changing it would give the app
a fresh data directory, and everyone would lose their songs, progress and
library.
