# The complete tour

Everything Quire does, page by page. The [README](../README.md) is the short
version, [the guide](guide.md) gets it running and shows you around, and
[how it is built](architecture.md) is for reading the code.

**Contents:** [Write](#write-the-bench) · [Jam](#jam-instrument-in-hand) ·
[Learn](#learn-the-contents) · [Instruments and sound](#instruments-and-sound) ·
[The journal and the look](#the-journal-and-the-look) · [The Mac app](#the-mac-app)

The app is an open notebook with three pages, as index tabs along the top
edge: **Learn**, **Jam** and **Write**. Each is a spread: the left page is
where the work happens, the right page keeps the journal.

## Write: the bench

Key and genre, the song's sections, the chords with every harmonic tool, the
melody workbench, the crab canon, and the reasons alongside.

### Key, mode and genre

- **Key**: all 12 tonics. **Mode** chips per genre: major, minor, Dorian,
  Phrygian, Lydian, Mixolydian.
- **19 genres**, 120 progression templates between them. Each genre brings its
  loops, the spices on its rack, the scales it recommends for soloing (and
  why), a voicing style, a strum or arpeggio pattern (swung where the style
  wants it), a drum pattern and a tempo.
- The genre row is folded until you want it: it shows the genre in play and
  its line from the genre book ("Open chords, borrowed ♭VII, tube amp
  optional."). **All 19 genres** unfolds every genre and the Genre lab,
  **Fold** puts them away, and the row stays the way you left it.
- **Genre lab**: build your own. Give it a name, the built-in genre it grooves
  like (its groove, scales and voicings are inherited), a tempo, power chords
  (off, plain chords only, or all), progressions typed one per line as
  `Name | mode | I vi IV V | note` and checked live against the numeral
  parser, and the spices on its rack. *Surprise me* rolls one at random.

<details>
<summary>The 19 genres, in their own words</summary>

| Genre | Tagline | Modes |
| --- | --- | --- |
| Classic Rock | Open chords, borrowed ♭VII, tube amp optional. | major, Dorian |
| 80's Rock | Big choruses, bigger hair, mandatory key change. | minor, major |
| Thrash Metal | Power chords, palm mutes, Phrygian everything. | minor, Phrygian |
| Prog | Odd meters, Lydian shimmer, chords with middle names. | Lydian, Dorian, minor, Mixolydian |
| Lofi Hip-Hop | Jazz chords on a rainy loop. Beats to spice chords to. | major, minor |
| Neo-Soul | Gospel hands, Dilla time, chords that smell like incense. | major, Dorian, minor |
| Funk | One chord, sixteen ways to hit it. | Dorian, Mixolydian |
| Blues | Twelve bars, three chords, one lifetime. | major, minor |
| Pop Punk | Four chords, downstrokes, feelings. | major |
| Shoegaze | Chords with the edges sanded off by reverb. | major, minor |
| Pop | Four chords and the chorus of the summer. | major |
| Grunge | Power chords that read poetry. | minor, major |
| Reggae | The chord lives on 2 and 4. The bass owns the rest. | major, minor |
| Country | Three chords and the truth, plus a V of V. | major |
| Synthwave | Minor chords at 100mph through a neon tunnel. | minor, major |
| Surf | Wet reverb, dry humor, double-picked everything. | major, minor, Phrygian |
| Indie | Jangle, shrug, repeat. | major, minor |
| Vaporwave | Smooth-jazz luxury at 80% speed, behind glass. | major, minor |
| Claude | Warm, curious harmony that shows its work. (Debussy was also named Claude. Coincidence?) | Lydian, major, Dorian |

</details>

### Progressions

- **New** puts one of the genre's templates on the bench.
- **Compose…** builds one to order from a functional grammar (home → motion →
  tension → release), leaning on chord-to-chord counts taken from the genre's
  own templates: 4, 6 or 8 chords (8 is a question-and-answer period), heat
  *Diatonic*, *Borrowed* or *Secondary*, an ending (genre taste, loop,
  authentic, plagal, deceptive, half), starting on the tonic or not.
- Click a card's bar count to cycle it (1, 2, 4, ½ bar); the arrows under a
  guitar grid cycle its voicings.
- The bench is laid out in the order you use it. Where a loop comes from
  (*Compose*, a named progression, *New*) sits beside its name. One row of
  tools runs above the cards: what changes the loop on the left (*Spice it up*,
  the heat, *Undo*, *A/B*, *Reset*), what takes it away on the right (*Copy
  tab*, *MIDI*, *Save*). How it is practised (count-in, tempo ramp, the band)
  is the strip under the cards.

### The spice rack

**Spice it up** rolls the rack: **Mild** uses only the gentle spices (colour
and quality changes, no structural surgery), **Medium** anything on the
genre's rack, **Hot** a bold structural move and then a second one on top.
Every chord card also offers, as chips, the moves that fit that chord. Every
application is explained in plain language in the journal. **Undo** takes one
back, **A/B** plays the loop before and after, **Reset** returns to the plain
progression.

<details>
<summary>The 23 spices, as the rack describes them</summary>

| Spice | What it does |
| --- | --- |
| Secondary dominant | Borrow the V7 of any chord to yank the ear toward it. |
| Borrowed iv | Steal the minor iv from the parallel minor key. |
| ♭VII stomp | The rock & roll back door, one whole step below home. |
| Mario cadence | ♭VI–♭VII–I: two borrowed chords climbing into victory. |
| Tritone sub | Swap any dominant for the one six frets away. |
| Color tones | Same chords, more vowels: 7ths and 9ths. |
| Sus & release | Hold the 4th where the 3rd should be, then let go. |
| Passing dim7 | A chromatic stepping stone between two chords. |
| Picardy third | End the gloom on a surprise major chord. |
| Andalusian slide | The flamenco staircase: i–♭VII–♭VI–V. |
| Truck driver's gear change | Last chorus? Take the whole thing up a step. |
| Backdoor dominant | ♭VII7 resolves home without the drama of V. |
| Half-step slide | Approach any chord from one fret above. |
| Line cliché | One minor chord, one inner voice walking down. |
| Pedal point | Park the bass on the tonic and let chords float over it. |
| Phrygian ♭II | The chord one half step above home. Menace included. |
| Devil's interval | Root to ♭5 — diabolus in musica. |
| Harmonic minor V | Raise the leading tone; give minor a real dominant. |
| Deceptive cadence | Promise them home; deliver the relative minor. |
| Chromatic mediant | The film-score jump-cut: chords a major third apart. |
| Common-tone dim | A dim7 that sparkles around the tonic without leaving it. |
| Neapolitan ♭II | The subdominant in a powdered wig, leaning onto V. |
| Deflated dominant | Let the air out of the V. |

</details>

All the music theory is computed, with correct enharmonic spelling per key
(B♭ in F, C♯ in A), and the chord-shape library is interval-verified by the
test suite.

### Writing chords

- **What next?** Continuations grouped by intention (settle, build tension,
  brighten, darken, surprise), each with a reason that names the actual notes.
- **Transition explainer**: click the arrow between any two cards (or ↻ for
  the loop seam) to see which voices hold, which slide, what the bass does,
  what the move *is*, a one-line thing to play, and a demo that plays the
  change one voice at a time. *Loop this change* drills just those two chords.
- **A/B listening**: after any spice, A/B loops the previous version and then
  the new one in the same groove, changed chords marked.
- **Song sections**: A, B, C… (up to eight), each with its own chords, melody
  and meter; an arrangement row (A A B A); **Play song** walks the bench
  through the sections; MIDI exports the whole song.
- **The key's chords**: on the right page, every diatonic chord in the key,
  plus a **borrow shelf** of idiomatic out-of-key chords that explain
  themselves when used.
- **Library** keeps whole songs (every section and melody) with names, tags,
  notes, search, and JSON export and import. The session itself is saved
  continuously: relaunch and you are where you left off.
- **Out of the app**: copy the progression as ASCII tab (or a key chart on the
  keyboards), export MIDI, save to the library.

### Melody workbench

- A piano roll whose **background is the harmony**: under every chord, rows
  are tinted by role, and notes take their role's colour. Click to add, drag
  to move or stretch, double-click to delete, lock the notes you never want to
  lose; 8th or 16th grid. **Record a pass** captures from any Listen source
  and quantizes it.
- **Motif tools** (chord-aware): *Sequence → next bar* (lands on the new
  chord's target — F♮ over Dm, not F♯), *Answer* (contour turned over, rests on
  the root), *New pitches*, *Change ending* (lean into the next chord or come
  to rest), *Stretch ×2*, *Squeeze ×½*, *Invert*, *Fix clashes*, octave up and
  down.
- **Coach**: reads the melody against the chords (which changes land, what is
  parked on a rub, whether it breathes, whether a motif repeats) and names the
  bar, the note and the fix.
- **Reharmonize**: for the selected bar, other chords that would carry the same
  melody (simple, suspended, richer, borrowed), with a fit meter and how each
  melody note functions.
- The melody is always shown as **tab with numbers**: each note's degree
  against its chord on a line underneath. Copy it as guitar tab (fingered
  inside the chosen neck position) or as an OP-1 key chart; it plays as the
  lead and exports to MIDI.

### Lick lab

In the melody workbench: bring in a lick you already play.

- **Paste tab**: paste its ASCII tab (hammer-ons and slides read as plain
  notes, two-digit frets and double-stops understood, one column is one grid
  step), or arm **Step entry** and click it in on the fretboard (← and → move
  the cursor, Backspace takes one back, strings are remembered).
- Read it as numbers, and flip the tab between **as played** and **in
  position** (re-fingered in the chosen neck position).
- **Same numbers → next bar** moves it by the distance between the chord
  roots, so every degree is unchanged; a major 3rd bends over a minor chord,
  the blue ♭3 is left alone.
- The **Lick shelf** saves a lick as numbers: it forgets its key and frets and
  drops onto any chord in any key. Five starter licks ("♭7 5 4 ♭3 R"…) are
  there to show the idea.

### Crab canon

- Your melody, met by itself walking backwards: Bach's *canon cancrizans*
  (Musical Offering, 1747) over your own chords. **Let the crab in** (or `k`)
  and a second voice plays the written line from the end, on a sound of its
  own; **Table** also turns it upside down along the scale (the sheet as the
  player across the table sees it).
- The line is drawn on a **Möbius strip**, one surface with one side, and
  while the loop runs two readers walk it: the playhead going round, the crab
  going the other way, reading the same notes from the end.
- The **verdict** scores how well the line agrees with itself: does the
  backwards voice land on friendly notes over the chords it now sits on, and
  where the two voices overlap, do they grind? Every miss is named the coach's
  way ("Bar 2: read backwards, the F♯ from bar 3 lands over Dm and is the note
  Dm bends out of shape. Try F in bar 3 — it works both ways") under a
  *Cancrizans* / *Walks nicely* / *Pinchy* / *Lost at sea* rating.
- **Mirror the chords** turns the section into a palindrome (I–IV–V →
  I–IV–V–IV–I), so any note that fits going forward fits going back by
  construction. **Crab-proof** moves each unlocked note to the nearest pitch
  that works over its own chord, over the chord its mirror lands on, and
  against the other voice. Locked notes stay, and it never hands back a worse
  score than it was given.
- The crab's voice rides along in the MIDI export, and Learn has a three-step
  **Meet the crab** path that finishes itself once the canon scores 85 with
  the voices overlapping for at least a quarter of the loop.

## Jam: instrument in hand

The cards shrink to a chord chart and the big diagram belongs to one tool at a
time: the **Solo lab**, the **Triad lab** or the **Neck drills**. The right
page listens and keeps the journal.

### Solo lab

- The scale diagram follows the chord changes. Over each chord every note is
  painted by what it *means*: root, chord tone, colour, passing (a half step
  over a chord tone), rub, or **spice** (a chord tone the scale doesn't own:
  add Dm in A major and F♮ lights up while F♯ stands down). A dashed ring marks
  the landing note for the *next* chord. Click any note to hear it and ring
  every copy of it.
- **Drill ladder**: roots only → one note, all rhythm → land on the 3rd →
  chord tones only → guide tones → three-note answer (call and response) →
  the full map. **Demo lick** plays a seeded phrase that obeys the drill, with
  a cursor walking the diagram (**Another** deals a new one).
- **Connected neck positions**: the home box plus the four boxes that join it
  up the neck (pentatonic shapes or CAGED windows); drills, demo licks and
  melody tab follow the box you pick. **Lefty** mirrors the neck.
- **Both** shows the same map on the fretboard and on keys at once (keys for
  string players, strings for the OP-1), cursor and pinned notes in sync.

### Fretboard fluency (guitar and bass)

Built for the player with a big vocabulary of shapes and licks and no grammar:
the goal is instant retrieval of *relationships*, not more material.

- **123 / ABC**: every diagram can speak in numbers counted from the chord
  that is sounding (R, ♭3, 5, ♭7…) instead of letters. The same fret changes
  number as the chords change; that *is* the lesson. Strings default to
  numbers, keys to letters.
- **The grip you already know**: in any neck position the Solo lab finds the
  chord grip from the shape library that lives there, rings it on the map,
  names its CAGED form and spells your fingers ("Here Dm is the Am-shape you
  already play (root on the A string, fret 5). Low string to high, your
  fingers are holding R 5 R ♭3 5"). Walk the five positions and one chord goes
  E → D → C → A → G shape.
- **Tab with numbers** and the **Lick lab** live in Write's melody workbench
  (above).
- Learn opens with the **Fretboard grammar** path: your grips, in numbers →
  intervals are shapes → see a dot, know its number → a 3rd near your hand,
  always → five grips, one chord → same note, next string → roots have names →
  your licks, in numbers.

### Triad lab

- Every chord as **three notes on three adjacent strings** (E-A-D, A-D-G,
  D-G-B, G-B-E; two sets on bass) or under one hand inside the OP-1 or piano
  window. The neck view shows all of the focused chord's close-voiced shapes
  climbing the neck (root position, 1st and 2nd inversion, coloured by root,
  3rd and 5th) with the path's choice lit, the **next chord's shape ghosted
  in**, and an arrow along each string that has to move (a double ring means
  that voice holds).
- A **path solver** voice-leads the whole progression: *Stay close* (least
  total movement), *Climb* or *Descend* (the top voice becomes a melody), and
  *Root position* as the baseline, with the count for both ("This path travels
  12 frets per loop, all three voices added up — root position everywhere
  would travel 52"). **Click any shape to pin it** and the rest of the path
  re-routes around your choice.
- **3-5-7**: over seventh chords, the simpler triad hiding in the top three
  notes (over Dm7, play an F triad: the chord's 3rd, 5th and 7th, with the bass
  supplying the root).
- **Demo arpeggio** rolls each shape over the loop with a cursor on the dots;
  **Comp with these** makes the band play the voice-led triads; Listen lights
  the dots you play and grades them as chord tones.
- The strip underneath is the whole path: mini grids per chord, and between
  them what each voice does (`=` holds, `↑1`, `↓2`).

### Neck drills

Ten-card timed sprints: *Interval from a root*, *Name that degree*, *Chord tone
in position*, *Same note, next string*, *Note names*. Click the neck, or play
the answer on your instrument through Listen. A miss stops and shows the rule
as a movement of the hand ("1 string higher, 1 fret back toward the nut — one
fret further than usual, because it crosses onto the B string"); missed tags
are dealt more often until they stop being missed. The score is accuracy, with
the last 20 points earned by speed (3 seconds a card or faster: you have
stopped counting frets).

### Listen: play along and get told something useful

- Sources: **Mic** (guitar, bass, voice, the OP-1's speaker; YIN pitch
  tracking, one note at a time; headphones keep the backing out of it),
  **Interface** (the Mac app only: the audio interface straight in, see
  [the Mac app](#the-mac-app)), **MIDI** (the OP-1 field or any controller over
  USB: Web MIDI in Chrome and Edge, CoreMIDI in the Mac app), and **Keys** (the
  computer keyboard as a two-octave piano on the Z and Q rows, key caps printed
  on the diagram).
- What you play lights up on every diagram. Each pass of the loop is placed on
  the transport clock and **graded against the drill**: ✓/✗ per chord change,
  the share of notes inside the drill, and a specific line ("Dm: you arrived on
  F♯ — aim for F"). Best scores per drill persist.

## Learn: the contents

Eight paths of short steps, 39 in all. Each step stages the bench (genre,
progression, drill, even the open transition) and sends you to the page where
the doing happens. Steps the app can measure finish themselves: a graded
play-along pass, a neck-drill sprint, the melody coach showing ✓ on every
chord, a floor of the burrow, or the crab canon's score. The rest are an
honest checkbox.

| Path | Steps |
| --- | --- |
| Fretboard grammar | Your grips, in numbers · Intervals are shapes · See a dot, know its number · A 3rd near your hand, always · Five grips, one chord · Same note, next string · Roots have names · Your licks, in numbers |
| Solo over four chords | Find every root · One note, all rhythm · Land on the 3rd · Chord tones only · Guide tones · Three-note answer · The whole map |
| Hear the borrowed chords | One note changes the weather · Before and after · Follow it with your hands · Which chord changed? |
| Down the burrow | Three floors, both loops · Hold the loop in your ear |
| Write an eight-bar melody | Start with one good bar · Say it again, higher or lower · Question and answer · Make every change land · A second section · Get it onto tape |
| Play the twelve-bar blues | Know the form · The rub is the blues · The famous half step · Call and response |
| Triads on three strings | Three shapes, one chord · Barely move · Be the rhythm guitarist · Make the top voice a melody · The triad inside the seventh chord |
| Meet the crab | A line that walks backwards · Harmony that reads both ways · Agree with yourself |

### The burrow

Transformational ear training as a descent, at the foot of Learn's left page.
The crab digs under one of your genre's loops a floor at a time. Every floor,
the spice rack changes one chord of the loop *as it now stands* (a sus, a
borrowed iv, a tritone sub, a passing diminished, whatever the rack finds room
for), the loop plays, and you say which chord is new or changed. Answer right
and the reveal is the spice's own explanation; the crab waits while you read,
then digs on.

- Floors 1–3 play the loop you know and then the changed one. From floor 4
  **only the new loop plays**: the old one is in your ear. You have one
  *Again* per descent.
- Where the genre carries the truck driver, floor 4 is **the burrow turning**:
  no question, the whole loop a whole step up, and everything below is spelled
  in the new key.
- From floor 8 two chords change at once. Pick both.
- When the rack has nothing left that would change a chord, or the loop is
  eight chords long, that is **bedrock**. Thrash Metal is shallow ground; Pop
  Punk and Vaporwave go down a long way.
- A floor is only asked when it can be heard one way: an inserted pair beside
  an identical chord can be parsed two ways, so the burrow never asks it.
- The burrow leans toward spices whose names have never appeared in your
  journal, so over weeks it becomes a curriculum of the moves you have not
  heard yet.
- Any ending (a miss, bedrock, or *Come up*) does the same generous thing: the
  page turns to Write, the loop as the burrow left it is on the bench (named
  "…, dug to floor 6", the gear change as the every-other-pass repeat), every
  floor is a dated line in the journal in the rack's own words, and the
  deepest floor per genre goes in the records. Save keeps it (⌘S in the Mac
  app); undo pops the whole descent back to the surface.

#### One descent, floor by floor

Classic Rock in A, under the loop *Garage stomp* (I–IV–V–IV), as `digFloor` in
[`src/practice/burrow.ts`](../src/practice/burrow.ts) digs it with a seeded
random number generator. **Bold** is what changed on that floor; in the app the
changed chord is inked in and the spice's name sits in the margin.

| Floor | The loop | The move |
| --- | --- | --- |
| surface | A · D · E · D | the loop you know |
| 1 · sand | A · **Dm** · E · D | Borrowed iv |
| 2 · grit | A · **Dm7** · E · D | Color tones |
| 3 · wet sand | A · Dm7 · E · **Dm** | Borrowed iv |
| 4 · clay | B · Em7 · F♯ · Em | up a step: the burrow turns, no question asked |
| 5 · peat | B · Em7 · **A** · Em | ♭VII stomp |
| 6 · silt | B · Em7 · A · **Em7** | Color tones |
| 7 · gravel | B · Em7 · A · **B7** · Em7 | Secondary dominant |
| 8 · marl | B · **B7** · Em7 · A · **B9** · Em7 | Color tones + Secondary dominant |
| 9 · chalk | B · **B9** · Em7 · **E7** · A · B9 · Em7 | Color tones + Secondary dominant |
| 10 · flint | B · B9 · Em7 · **E9** · A · B9 · Em7 | Color tones |

Floors 1–3 play both loops; from floor 4 only the new one. After floor 10 the
rack has nothing left that fits the loop, so the next dig is bedrock, and the
bench gets "Garage stomp, dug to floor 10", which climbs a whole step every
other pass.

### Today and the records

The right page is today. In a new journal it says where to start: the first
step of the first path, with what the step asks for and a **Begin** button.
From then on it leads with the step to take next (the one in hand, else the
next step of the first path you have begun), above the counters (steps done,
the day streak, graded passes) and the month as a **stamp card** with the crab
pressed on every day you practised. **Records** keep the best graded pass per
drill, the best sprint per neck drill and the deepest burrow per genre; they
are listed once there are any.

## Instruments and sound

### Four instruments

- **Guitar**: chord grids with voicings to cycle through (open grips, barre
  shapes, funk 9th grips…), defaults that keep consecutive grips near each
  other on the neck, full-neck scale maps with a position box, copyable ASCII
  tab.
- **Bass** (four strings): every chord as a root–fifth–octave box anchored on
  the lowest practical root, scale maps, bass tab; the pitch tracker opens a
  longer window and a lower floor to hear the low E.
- **Piano**: a 25-key right-hand window (C4–C6) voiced by the same fitter as
  the OP-1, plus a left-hand root in the C2 octave.
- **OP-1 field**: the real 24-key layout from F (black keys in groups of
  3-2-3-2), one-hand chord fittings with inversions (a big chord drops its 5th,
  never its colour tones), scale key maps, octave shift, a copyable key chart.

### Sound

Plain Web Audio, no samples, nothing to load: a Karplus-Strong plucked string
for guitar and bass, a percussive two-oscillator voice for piano, and a soft
two-oscillator synth for the OP-1, with per-genre strum patterns, swing and
drums. Click any chord to hear it, or play the whole loop.

### Transport

- Count-in, a tempo ramp (70% → 100%, +5% a pass), shift-click cards to loop a
  section, a backing band (chords, bass, drums, melody) you can mute live, and
  a choice of which sound plays the chords.
- **What you hear is what the lesson says**: odd-meter templates (7/8, 7/4,
  9/8, 5/8 + 7/8, 3/4) play in their real meter with accent-group grooves; the
  truck-driver repeat actually goes up a whole step every other pass (and the
  Solo and Triad labs move with it); MIDI export carries the meter, the gear
  change and the lead.

## The journal and the look

An open notebook on a desk. Two pages in a spread with a stitched gutter, cream
paper with a faint dot grid, a vermilion margin rule, running heads (the crab
and the wordmark on the left page, today's date on the right), folios in the
feet, and index tabs along the top for Learn, Jam and Write. Teaching text is
set in Newsreader, headings and the dateline in Fraunces, labels are typed in
IBM Plex Mono capitals, and the wordmark is Silkscreen. Harmonic function
(tonic, subdominant, dominant, borrowed, secondary) and note roles (root, chord
tone, colour, passing, rub, spice) keep their own inks because they mean
something.

Apart from one plate on the inside cover, the only decoration is a 32×24 pixel
crab, placed by hand in two frames (`src/ui/crabPixels.ts`) and drawn as SVG
rects so it stays crisp and takes its colours from the page. It is the
wordmark (walking while the band plays), the app icon, the canon's cursor on
the Möbius strip, the verdict's rating, and the stamp pressed on every
practice day. No emoji.

- **The spread stays put.** It fills the window, and each page scrolls on its
  own between its running head and its foot, so the transport, the tabs and
  the journal are in reach wherever the bench is scrolled to. Under 1100px
  wide the pages stack and the window scrolls instead.
- Every move the app explains (a spice, a reharmonisation, a mirrored song, a
  loaded save) is written into the **journal** on the right page with the
  time, and kept between sessions under day headings (Today, Yesterday, Mon
  21 Sep). New lines ink in. The page shows the six newest lines; *Earlier in
  the journal* unfolds the rest. A journal with nothing in it yet says what to
  press, and what will be written.
- **Inks that read.** Every ink that sets small type reaches 4.5:1 against the
  paper it is printed on, cream lettering sits on a vermilion deep enough to
  carry it, and keyboard focus is one ink ring everywhere. `npm run shots`
  measures the contrast on every page it visits.
- **Learn** opens on the contents: paths with hand-drawn ticks for finished
  steps; the right page is today and the stamp card.
- Turning to another page runs as a page turn (View Transitions where the
  browser has them); the active tab slides. Stamps and grades thump in.
  `prefers-reduced-motion` turns all of it off.
- The **inside cover** (click the wordmark): what the name means, a plate,
  "This journal belongs to", every keyboard shortcut, and a colophon.

## The Mac app

The same journal as a native macOS application (Tauri 2), with the things a web
page cannot do:

- **The interface, straight in.** In Jam, Listen has an **Interface** source:
  the app opens your audio interface through Core Audio
  (`src-tauri/src/audio.rs`), on the input you pick under **Sound…** (⌘,), and
  tracks pitch in Rust (`src-tauri/crates/quire-dsp`, the same YIN ears as the
  web build). Core Audio lets more than one app read an input at once, so an
  amp sim can keep the guitar too.
- **CoreMIDI.** The OP-1 field (or any controller) over USB, without Web MIDI:
  pick the port under Sound.
- **A menu bar** with the keys a Mac expects, a title bar the page draws
  under, and a window that remembers where it was. The inside cover lists the
  menu keys when it is opened in the app.

<details>
<summary>Every menu key</summary>

| Keys | Does |
| --- | --- |
| ⌘N · ⌘⇧N | New progression · Compose… |
| ⌘S · ⌘L | Save to library · Library… |
| ⌘E · ⌘⇧C | Export MIDI… · Copy tab or chart |
| ⌘P | Play / stop |
| ⌘⇧S · ⌘⇧A · ⌥⌘R | Spice it up · A/B the last spice · Reset to the plain progression |
| ⌥⌘Z | Undo last spice |
| ⌘⇧K · ⌘⇧M | Let the crab in · Mirror the chords |
| ⌘⇧D · ⌘⇧U | Drums · Mute |
| ⌘1 · ⌘2 · ⌘3 | Learn · Jam · Write |
| ⌥⌘1 – 4 | Guitar, bass, piano, OP-1 |
| ⌘, · ⌘I | Sound… · Inside cover |

</details>

### Playing next to an amp sim (AmpliTube, or any of them)

1. Plug the guitar into the interface. Point AmpliTube at the same interface,
   as you would anyway, and play through it as usual.
2. In Quire, open **Sound…** (⌘,), pick the interface and the **input** the
   guitar is on (usually 1), and press **Listen**: the meter moves and the
   note you play appears. Quire hears the dry string; AmpliTube shapes the
   tone you hear; both play out of the same output.
3. In Jam, set Listen to **Interface**, press play, and play along. Every
   diagram lights the notes you play and each pass is graded.

To have Quire grade the amp's sound instead of the dry string, route AmpliTube
into a virtual device (BlackHole, Loopback) and pick that device under Sound.
An interface input never hears the band, so headphones are optional there; a
microphone does hear it, so headphones keep it out.

Building the app, signing and the entitlements are in [the guide](guide.md#a-release-build).
