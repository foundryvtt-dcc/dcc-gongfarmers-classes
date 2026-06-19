# Progress — DCC Gongfarmer's Almanac Classes

Living progress tracker for the module. Full per-class plan and status lives in
[CLASS_INVENTORY.md](CLASS_INVENTORY.md); this file is the high-level state +
how to resume.

_Last updated: 2026-06-19._

## Goal
Implement every playable PC class (and race-as-class) from the Gongfarmer's
Almanac collections (2015–2025) as DCC-system Foundry classes, each with a
level 1–10 progression pack, a class sheet tab, and live E2E coverage.

## Status: 16 / ~57 implemented

### Done & E2E-verified (16)
- **2015 V1:** Assassin, Dervish, Luchador, Sword Monger
- **2020:** Martial Grandmaster, Peasant, Barbearian, Heavenly Hitman, Human,
  Fowl Summoner, Tarantino Elf, Priest of the Old Father, Arcane Warrior,
  Mystic Arcanist, Spell Thief, Rune Sage

The DCC-native portion of the 2020 collection is now complete.

### Excluded (not leveled classes — documented)
- Kraken Slayer (2020) — a magic item, not a class
- Hive Master (2020) — no level table / hit die / progression (swarm table only)
- Runelords (2020 V8) — no level 1–10 table; an endowment subsystem (ability
  points passed dedicate→lord via forcibles), not a standard leveled PC class
- Moremen (2020 V13) — not a PC class; an antagonist faction ("The Mutants
  with More") plus a Lvl 1–3 mini-adventure with monster stat blocks only

### Deferred — MCC (Mutant Crawl Classics) content (2020 V14)
- Scholar, Mastermind, Insectaur, Geologian (all by Tim Snider) have clean
  level 1–10 tables + titles, but are MCC/Terra A.D. classes (random mutations,
  Artifact Checks, AI-recognition rolls, glowburn/radburn, Clan-of-Cog/Curators
  alignments). No MCC system is installed, so they would have to be *adapted*
  to DCC (mutant traits as notes + an Artifact-Check value). **Decision
  (2026-06-19): keep this module DCC-native only — defer the MCC quartet** to a
  future dedicated MCC effort rather than mixing systems here.

### Pending (~35)
- **2016 (4), 2017 (6), 2018 (12), 2019 (5), 2021 (6), 2024 (6), 2025 (4)** —
  see CLASS_INVENTORY.md for the per-class list, types, and build flags.

Build order: 2020 done (DCC-native); next 2016 → 2025.

## How a class is added (the pattern)
1. `assets/json/<id>-combined-chart.json` — authoritative level 1–10 data
   (saves, crit die/table, action dice, class dice, titles).
2. A `GONGFARMERS_CLASSES` entry in `module/gongfarmers-class-data.js`
   (mixin fields, defaults incl. `attackBonusMode`/`spellCheckAbility`, sheet
   parts/tabs; casters add a `clericSpells`/`wizardSpells` part).
3. A 5-line sheet stub `module/actor-sheets-<id>.js` + its import/registration
   in `module/dcc-gongfarmers-classes.js`.
4. A class tab template — add the class to `module/buildClassTemplates.mjs` META
   and run it, or hand-author `templates/actor-partial-<id>.html`.
5. Lang keys in `lang/en.json` — **including a `<Prefix>.Credit` key (REQUIRED;
   see "Credits are mandatory" below).**
6. An E2E row in `browser-tests/e2e/gongfarmers-classes.spec.js` `CLASSES`.

## Credits are mandatory
Every class **must** ship a `<Prefix>.Credit` lang key in `lang/en.json`
crediting the original author(s)/artist(s), the collection year, and the volume
(e.g. `"Spell Thief by Ed Kabara — The Gongfarmer's Almanac 2020 Collection,
Volume 8: …"`). This is non-negotiable — the Almanac is community work and the
reference journal (`buildReferenceJournal.mjs`) is built entirely from these
`*.Credit` strings; a missing credit silently drops a class from the in-Foundry
credits page.

When adding (or auditing) classes, double-check none is missing:
```bash
python3 - <<'EOF'
import json, re
lang = json.load(open('lang/en.json'))
prefixes = {k.split('.')[0] for k in lang if re.match(r'^[A-Za-z]+\.ActorSheet', k)}
missing = sorted(p for p in prefixes if not lang.get(f'{p}.Credit', '').strip())
print('MISSING credits:', missing or 'none')
EOF
```
If a class genuinely has no named author in the source, still add the Credit key
with the collection/volume (the build strips the year/volume tail anyway, so the
journal will show at least the class name). Confirm the author against the
class's own writeup — watch for classes that share a byline (e.g. Ed Kabara's
"A Little Bit Of Magic For Everyone Else" covers Priest of the Old Father,
Heavenly Hitman, Arcane Warrior, Spell Thief, and Mystic Arcanist).

## Build / verify commands
```bash
node module/buildLevelItems.mjs     # regenerate pack src from all charts
node module/buildClassTemplates.mjs # regenerate generated class templates
node module/buildReferenceJournal.mjs # regenerate the About & Credits journal pack
npm run todb                        # compile packs → LevelDB (Foundry must be DOWN)
npx standard --fix module/ browser-tests/e2e/*.js

# E2E (Foundry must be UP on the v14 world with this module enabled):
#   npx @foundryvtt/foundryvtt-cli launch --world=v14
cd browser-tests/e2e && npm test
```

## Reference journal compendium
- `packs/gongfarmers-almanac-reference` (type `JournalEntry`) ships an
  in-Foundry "The Gongfarmer's Almanac" entry: an **About** page linking to
  <https://gongfarmersalmanac.com/downloads/> and a **Class Credits** page that
  credits every shipped class (author, collection year, volume).
- Generated by `module/buildReferenceJournal.mjs` from the `*.Credit` keys in
  `lang/en.json`, so it stays in sync — rebuild it (and `npm run todb`) whenever
  a class is added or a credit changes.

## Notes / gotchas learned
- `_stats.lastModifiedBy` in pack docs MUST be a valid 16-char id or world boot
  aborts. (`buildLevelItems.mjs` handles this.)
- Multi-die action dice (e.g. `1d20,1d14`) are invalid for
  `attributes.actionDice.value`; the level-change flow puts the full string in
  `config.actionDice` and only the first die in `actionDice.value`.
- Compiled LevelDB (`packs/**/*.ldb` …) is gitignored — fresh checkouts need
  `npm run todb`; releases bundle the compiled pack.
- classId collisions to handle when reached: 2017 **Orc** & 2021 **Gnome**
  already exist in `dcc-crawl-classes` — suffix (`orc-gfa`, `gnome-gfa`).
