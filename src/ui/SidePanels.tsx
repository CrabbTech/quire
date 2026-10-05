// The right-hand page in Write: the journal (what the app told you, with the
// time it said it, today and the days before), what could come next (by
// intention), and the full palette of the key.

import { CSSProperties, useRef, useState } from 'react';
import { useApp } from '../state/AppContext';
import { chordSymbol } from '../theory/chords';
import { keyLabel } from '../theory/progression';
import { prettyNumeral, resolveNumeral } from '../theory/roman';
import { INTENTS } from '../theory/suggest';
import { styleChord } from '../state/reducer';
import { journalDays } from '../state/journal';
import { timeLabel } from '../state/dates';

/** How many lines the journal shows before the rest are folded away: the page scrolls, the journal inside it does not. */
const JOURNAL_OPEN_AT = 6;

export function NextChordPanel() {
  const { nextOptions, addNextChord, realized } = useApp();
  const last = realized[realized.length - 1];
  return (
    <section className="panel next-panel">
      <div className="panel-head">
        <div>
          <h2>What next</h2>
          <div className="panel-sub">after {last ? chordSymbol(last.chord) : 'silence'}</div>
        </div>
      </div>
      {INTENTS.map((intent) => {
        const options = nextOptions.filter((o) => o.intent === intent.id);
        if (!options.length) return null;
        return (
          <div key={intent.id} className="next-row" title={intent.blurb}>
            <span className="next-intent">{intent.name}</span>
            <div className="next-options">
              {options.map((o) => (
                <button key={o.numeral} className={`pal-chord next-chord numeral-${o.chord.func}`} title={o.why} onClick={() => addNextChord(o)}>
                  <span className="pal-numeral">{prettyNumeral(o.numeral)}</span>
                  <span className="pal-symbol">{chordSymbol(o.chord)}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function JournalPanel({ firstPage = false }: { /** on a journal with nothing in it yet, say what will be written here */ firstPage?: boolean }) {
  const { journal } = useApp();
  // lines written since this page was opened — or in the moments before it opened, as a descent of the burrow lands — ink in; older ones are simply there
  const opened = useRef(new Set(journal.filter((e) => e.at < Date.now() - 4000).map((e) => e.id)));
  const [unfolded, setUnfolded] = useState(false);
  const allDays = journalDays(journal);
  let room = unfolded ? Infinity : JOURNAL_OPEN_AT;
  const days = allDays
    .map((d) => { const entries = d.entries.slice(0, Math.max(0, room)); room -= entries.length; return { ...d, entries }; })
    .filter((d) => d.entries.length);
  const folded = journal.length - days.reduce((n, d) => n + d.entries.length, 0);
  // lines that landed together (a descent of the burrow) ink in one after another, oldest first
  const freshOrder = new Map(journal.filter((e) => !opened.current.has(e.id)).map((e, i) => [e.id, i] as const));
  return (
    <section className="panel journal-panel">
      <div className="panel-head">
        <div>
          <h2>Journal</h2>
          <div className="panel-sub">every move, explained — and kept</div>
        </div>
      </div>
      <div className="journal">
        {!days.length && <div className="journal-empty">Nothing written yet. Spice a chord, pick what comes next, mirror the song — the reasons land here.</div>}
        {firstPage && !journal.some((e) => e.kind === 'spice') && journal.length <= 2 && (
          <div className="journal-first">
            <strong>The first page.</strong> Press play (or space) and listen to the loop once. Then press <em>Spice it up</em>: one chord changes, and why it works is written here, with the time it was said.
          </div>
        )}
        {days.map((d, di) => (
          <div key={d.day} className="journal-day">
            {(di > 0 || d.label !== 'Today') && <div className="journal-dayhead">{d.label}</div>}
            {d.entries.map((e) => (
              <div key={e.id} className={`journal-entry journal-${e.kind} ${opened.current.has(e.id) ? '' : 'journal-new'}`}
                style={{ '--i': freshOrder.get(e.id) ?? 0 } as CSSProperties}>
                <span className="journal-time">{timeLabel(e.at)}</span>
                <div className="journal-title">{e.title}</div>
                <div className="journal-text">{e.text}</div>
              </div>
            ))}
          </div>
        ))}
        {(folded > 0 || unfolded) && journal.length > JOURNAL_OPEN_AT && (
          <button className="journal-more" onClick={() => setUnfolded(!unfolded)}>
            {unfolded ? 'Fold the earlier lines away' : `Earlier in the journal · ${folded} more line${folded === 1 ? '' : 's'}`}
          </button>
        )}
      </div>
    </section>
  );
}

export function PalettePanel() {
  const { key, genre, palette, shelf, jazzyPalette, addPaletteChord, fakeSlot } = useApp();
  return (
    <section className="panel palette-panel">
      <div className="panel-head"><h2>Chords in {keyLabel(key)}</h2></div>
      <div className="palette">
        {palette.map((p) => {
          const numeral = jazzyPalette ? p.seventhNumeral : p.numeral;
          const c = resolveNumeral(numeral, key);
          return (
            <button key={p.numeral} className="pal-chord" onClick={() => addPaletteChord(numeral)}>
              <span className="pal-numeral">{prettyNumeral(numeral)}</span>
              <span className="pal-symbol">{chordSymbol(styleChord(fakeSlot(numeral), c, genre))}</span>
            </button>
          );
        })}
      </div>
      <div className="shelf-head">Borrow shelf</div>
      <div className="palette">
        {shelf.map((s) => {
          const c = resolveNumeral(s.numeral, key);
          return (
            <button key={s.numeral} className="pal-chord pal-borrowed" onClick={() => addPaletteChord(s.numeral, s.hook)} title={s.hook}>
              <span className="pal-numeral">{prettyNumeral(s.numeral)}</span>
              <span className="pal-symbol">{chordSymbol(c)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
