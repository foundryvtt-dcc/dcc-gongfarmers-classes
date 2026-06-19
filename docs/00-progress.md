# Progress — DCC Gongfarmer's Almanac Classes

Living progress tracker for the module. Full per-class plan and status lives in
[CLASS_INVENTORY.md](CLASS_INVENTORY.md); this file is the high-level state +
how to resume.

_Last updated: 2026-06-19._

## Goal
Implement every playable PC class (and race-as-class) from the Gongfarmer's
Almanac collections (2015–2025) as DCC-system Foundry classes, each with a
level 1–10 progression pack, a class sheet tab, and live E2E coverage.

## Status: 14 / ~57 implemented

### Done & E2E-verified (14)
- **2015 V1:** Assassin, Dervish, Luchador, Sword Monger
- **2020:** Martial Grandmaster, Peasant, Barbearian, Heavenly Hitman, Human,
  Fowl Summoner, Tarantion Elf, Priest of the Old Father, Arcane Warrior,
  Mystic Arcanist

### Excluded (not leveled classes — documented)
- Kraken Slayer (2020) — a magic item, not a class
- Hive Master (2020) — no level table / hit die / progression (swarm table only)

### Pending (~43)
- **Rest of 2020 (8):** Rune Sage, Spell Thief, Runelords, Moremen, Scholar,
  Mastermind, Insectaur, Geologian
- **2016 (4), 2017 (6), 2018 (12), 2019 (5), 2021 (6), 2024 (6), 2025 (4)** —
  see CLASS_INVENTORY.md for the per-class list, types, and build flags.

Build order: finish 2020, then 2016 → 2025.

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
5. Lang keys in `lang/en.json`.
6. An E2E row in `browser-tests/e2e/gongfarmers-classes.spec.js` `CLASSES`.

## Build / verify commands
```bash
node module/buildLevelItems.mjs     # regenerate pack src from all charts
node module/buildClassTemplates.mjs # regenerate generated class templates
npm run todb                        # compile pack → LevelDB (Foundry must be DOWN)
npx standard --fix module/ browser-tests/e2e/*.js

# E2E (Foundry must be UP on the v14 world with this module enabled):
#   npx @foundryvtt/foundryvtt-cli launch --world=v14
cd browser-tests/e2e && npm test
```

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
