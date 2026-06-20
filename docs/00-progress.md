# Progress — DCC Gongfarmer's Almanac Classes

Living progress tracker for the module. Full per-class plan and status lives in
[CLASS_INVENTORY.md](CLASS_INVENTORY.md); this file is the high-level state +
how to resume.

_Last updated: 2026-06-19._

## Goal
Implement every playable PC class (and race-as-class) from the Gongfarmer's
Almanac collections (2015–2025) as DCC-system Foundry classes, each with a
level 1–10 progression pack, a class sheet tab, and live E2E coverage.

## Status: 51 / ~57 implemented

### Done & E2E-verified (51)
- **2015 V1:** Assassin, Dervish, Luchador, Sword Monger
- **2020:** Martial Grandmaster, Peasant, Barbearian, Heavenly Hitman, Human,
  Fowl Summoner, Tarantino Elf, Priest of the Old Father, Arcane Warrior,
  Mystic Arcanist, Spell Thief, Rune Sage
- **2016:** Hot-Dog Suit (V1), Barbarian (V1), Halfling Hucker (V1),
  Techno-necromancer (V6, Crawljammer)
- **2017 (V6 "Men and Magic" + V7):** Dwarf Sapper, Invincible Chicken,
  Orc (`orc-gfa`), Half-Orc, Paladin of Gambrinus, Bloody Hound (V7,
  Nowhere City Nights)
- **2018 (V1 "New Class Explosion!" + V6 Trench Crawl):** Bardic Rocker,
  Berserker, Faerie, Goat'o'war (`goat-o-war`), Gongfarmer, Kith of Kingspire
  (`kith-of-kingspire`), Lycanthrope, Pirate, Quantum Traveler, Sage, Scout,
  Soldier (V6, 5-level)
- **2019 (V11 "Classes & NPCs"):** Anti-Cleric, Cambion, Children of the Wild
  (`children-of-the-wild`), Godling, Fater
- **2021 (V1, V3, V4, V6):** Supernatural Model (V1), Aetherian Warcat (V3),
  Gnome (`gnome-gfa`, V4), Sin Eater of the Shudders (V6)
- **2024 (V5, V6):** Chimeraman (V5), Investigator (V5), Therapist (V5),
  Taurune (V6)

The DCC-native portions of the 2020, 2016, 2017, 2018, and 2019 collections are
complete, as are the buildable classes of the 2021 and 2024 collections.

#### Notes from the 2024 build
- **Chimeraman** (V5, Greg Setliff) is a chimeric **race** (HD 1d10, flat
  attack). It gains a chimeric-head-only **second action die** earlier than most
  (from level 2, growing per the table) and carries dual crit tables — table **M**
  for chimeric-head attacks, III→IV→V for everything else; the chart stores the
  general weapon table and the head-attack table M is described in notes. New
  display-only field `secondClassLevel` tracks the cap on the level-3 "secondary
  class." Head attacks, traits, and the creation tables are notes. No title table
  in source — titles are module-supplied (uniform across alignments).
- **Investigator** (V5, Stuart C. Killian) is a thief-adjacent **skill class**
  (HD 1d7, flat attack). Its **Expertise Die** (d4→d20, rollable) is added to
  every tactical roll (Action Die + Expertise + Luck); the display-only `tactics`
  column shows tactics known by tier ("T1 / T2 / T3"). The three tactic tiers are
  notes. Alignment-varying titles given for levels 1–4; 5–10 module-supplied.
- **Therapist** (V5, Matt Pelfrey) is a **skill class** (HD 1d6, flat attack,
  crit table I) whose **Technique Die** works like a warrior's deed die but fuels
  *therapy checks* (1d20 + Personality + technique die), NOT attacks — so it keeps
  `attackBonusMode: flat` and the technique die is a separate rollable field
  (d3→d8, then 1d10+1…1d10+4). The per-technique skill bonuses (which vary by the
  Healer/Success-Coach/Cult-Leader alignment paths) and the post-adventure trauma
  rules are notes. Alignment titles given 1–5; 6–10 module-supplied.
- **Taurune** (V6, Aaron Wolk) is a bovine warrior-**race** with a **Mighty Deed
  of Arms** — the Goat'o'war / Aetherian-Warcat pattern: `attackBonusMode: manual`,
  chart `attackBonus +0`, shared `deedDie` field (1d3→1d6+3), `mightyDeedsLink`
  (the deed die IS used for Mighty Deeds). HD 1d12, growing 2nd/3rd action die.
  Soulburn, Building the Path, Fell End, Horned Fury, Bellows, and Labyrinthine
  Cunning are notes. Alignment titles given 1–5; 6–10 module-supplied.
- **Excluded — Tommyknocker** (V5, Justin Davis): "Dark Inheritances," a set of
  Weird Frontiers **mien/power options** (Mummy, Vampyire, …) bolted onto the
  existing WF tommyknocker — no HD / saves / crit / level table. Same rationale as
  Enmascarado.
- **Excluded — Adventurer** (V5, Max Moon): the "Master of None" has **no fixed
  progression of its own** — each level it gains the level-1 benefits of a randomly
  rolled core class, so its chart literally reads "Per Class" for levels 2–5 and
  "retire" at level 6 (only levels 1 and 7–10 give concrete numbers). Not faithfully
  representable as a static level pack; excluded by user decision (2026-06-19).
- **Source-PDF note (2024):** only the combined **`Gongfarmers Almanac 2024
  Collection.pdf`** is supplied (no per-volume PDFs); it has a clean text layer
  (`pdftotext -layout`). Classes live in Vol 5 (Monsters, Classes & Rules) and
  Vol 6 (Rules, Items, Classes & Adventures).

#### Notes from the 2021 build
- **Aetherian Warcat** (V3, Dan Steeby) is a warrior-style **deed-die** race-class
  (HD 1d12, `attackBonusMode: manual`, `mightyDeedsLink`, like Goat'o'war): the
  deed die drives attack/damage/initiative and Mighty Deeds begin at level 2. It
  has a **growing second action die** (1d8→1d20, then a third die from level 7),
  stored as comma action-dice strings, and a per-level **Base Movement** column
  mapped natively to `system.attributes.speed.value` (45'→65'). No title table in
  source — titles are module-supplied.
- **Gnome** (V4, Mike McKeown, based on Crawl! #6) ships as **`gnome-gfa`** (plain
  `gnome` collides with `dcc-crawl-classes`). Illusionist **wizard caster** (`int`,
  wizardSpells tab), HD 1d5, base move 20'. Its **Trick Die** (caster-level die,
  d3→d7) is a custom rollable field; Known Spells / Max Spell Level are display
  columns. Titles 6–10 module-supplied (source lists only 1–5).
- **Sin Eater of the Shudders** (V6, Daniel J. Bishop) is a **cleric caster**
  (`per`, clericSpells tab) fuelled by consumed sins — no disapproval (failed
  checks instead manifest sin/tarnish silver). HD 1d8. Display columns: Spells
  Known (1/2/3 counts), Hide/Disguise bonus, Sneak bonus. The action-die
  "starvation" mechanic and Silver Implement charges are notes.
- **Supernatural Model** (V1, Stefan Surratt) is an innate **Personality caster**
  (`per`, wizardSpells tab; spellburn in d3s, caster level = class level) with a
  fixed beauty/charm spell list. HD 1d8, flat attack. Known Spells / Max Spell
  Level display columns (shared fields). Titles 6–10 module-supplied (source 1–5).
- **Shared display fields & label bleed:** `knownSpells`/`maxSpellLevel` are now
  used by Children of the Wild, Gnome **and** Supernatural Model. Because every
  class mixin re-declares these shared schema fields (last registration wins for
  the field `initial`), each class now **pins its own label in `defaults.literal`**
  (`skills.knownSpells.label`, etc.) — Children of the Wild was retrofitted to do
  the same. Follow this pattern for any future class reusing a shared skill field.
- **Excluded — Enmascarado** (V1, Yamil Camacho): not a leveled class, but a
  **mask subsystem** (Paths Righteous/Damned/Walk-the-Line, à-la-carte mask
  powers, Lucha de Apuestas) layered on the Weird Frontiers luchador — no HD /
  saves / crit / action-dice table. Same rationale as Hive Master / Runelords.
- **Deferred — Street Rat** (V1; author byline is title-art only, not OCR-
  recovered — input thanks to Kurt A. Rauch): a real class (HD 1d7,
  **skullduggery** deed-die, Path "on the line", thief-style skills), but the
  **supplied PDF's progression chart prints only levels 1–2** —
  the rest of the page is decorative artwork. A faithful 10-level pack can't be
  built; revisit if a complete table surfaces.
- **Source-PDF note (2021):** V3/V4/V6 have clean text layers (`pdftotext`). **V1
  is a scanned image** (no text layer) — rendered at 200–450 DPI with `pdftoppm`
  and OCR'd with `tesseract` (the table pages needed 450 DPI + `--psm 6`).

#### Notes from the 2019 build
- **Anti-Cleric** is a cleric in every mechanic — attack, crit, action dice,
  saves, hit die (1d8), and spells known all "as a cleric" — so its chart is the
  DCC cleric chart (no spell-slot fields, matching this module's other casters)
  with Chaos-themed titles. Only its fuel (Power!) and disapproval (Catastrophe!)
  differ, and those are descriptive notes. Spell check uses Personality (`per`)
  since DCC supports only int/per/sta. clericSpells tab.
- **Cambion** is a flat-attack martial using crit table **M** at every level. New
  custom fields: `beastDie` (natural-weapon damage die, rollable) and `aspects`
  (display-only count of demonic aspects gained). Its full Aspect lists (Vermin/
  Fungi/Ooze/Metal/Leviathan/Shadows) are notes.
- **Children of the Wild** is the 2019 Faerie class (distinct id
  `children-of-the-wild`, no collision with the 2018 `faerie`). Wizard caster
  (`int`, wizardSpells tab); new display-only fields `knownSpells` and
  `maxSpellLevel` per level. Critical Finesse (Agility to hit/damage with fae
  weapons) and Natural Luck (regains Luck as a thief, no Luck die) are notes.
- **Godling** is an à-la-carte hybrid: a flat-attack class (table III) whose
  `bloodlineAbilities` column tracks the cumulative count of "The Blood Tells"
  powers; the 20-power menu and Hereditary Doom are notes. No spell tab (it has
  no fixed spell list even though some powers grant casting). Source has no title
  table — titles are module-supplied flavor.
- **Fater** is a Deed-die class with **no fixed attack modifier** (`attackBonusMode:
  manual`, chart `attackBonus +0`, deed die carries the real bonus — like Dervish).
  Its deed die is explicitly **not** for Mighty Deeds (no `mightyDeedsLink`). Reuses
  the shared `deedDie` + `unarmedDamage` fields (labels pinned in defaults) and adds
  a display-only `wildHealing` field (amount + uses/day). Titles given in source.
- **Author bylines:** the Fater's author is title-art only (no text layer) — OCR'd
  to **Vasili Kaliman** (art Shawn Brewer). Others: Anti-Cleric (José Luiz Tzi),
  Cambion (L.J. LaLonde), Children of the Wild (R.S. Tilton), Godling (Dieter
  Zimmerman). The 2019 *collection* PDF is AES-encrypted — `pdftotext` (poppler)
  reads it; `pypdf` needs the `cryptography` package.

#### Notes from the 2018 build
- **Soldier is a 5-level class** (Trench Crawl Classics, V6, by Eric Betts).
  Its chart has only levels 1–5, so set `levels: 5` on its E2E row. Attack is
  "Per specialty" in the source (the chosen military specialty supplies the
  attack/skill bonus); modeled as flat `+0` with the specialties described in
  the class tab. It also carries a per-level **threat range** (`details.critRange`
  20→19) in the chart.
- **New custom mixin fields** (declared on the shared Player schema, driven
  per-level by the chart, shown as class-tab columns): `performanceDie` (Bardic
  Rocker), `savageInstinctDie` (Berserker — holds compound expressions like
  `2d8+d6+d4`, display-only/non-rollable), `sizeBonus` (Faerie), `curseDie`
  (Sage), `wolfFormBonus` + `wolfFormCrit` (Lycanthrope, the latter holds
  `1d12/M`-style strings). Deed-die classes reuse the shared `deedDie`
  (Goat'o'war, Kith martial focus).
- **Thief built-ins reused:** Quantum Traveler & Scout use `class.luckDie`;
  Scout additionally populates the canonical thief skill block (`sneakSilently`,
  `climbSheerSurfaces`, `findTrap`, `disableTrap`, `handlePoison`) per level
  from its single fixed (boss-bonus) table. Faerie's Sneak & Hide uses the
  halfling `skills.sneakAndHide`.
- **Casters:** Faerie / Kith / Sage cast as wizards (`spellCheckAbility: 'int'`,
  wizardSpells tab). Bardic Rocker has cleric-style disapproval but a Luck-based
  spell check — DCC only supports int/per/sta, so it ships `'per'` with the Luck
  rule noted in the Spells ability text (clericSpells tab).
- **Excluded from V1:** the Volume 1 "New Patrons", "Monsters", "New Rules",
  and "New Adventures" sections are not PC classes. No 2018 class was excluded
  as un-leveled — Lycanthrope ships as a full leveled class (its post-funnel
  "curse" overlay rules are notes).

#### Source-PDF note (2017)
The bundled **`Gongfarmers Almanac 2017 Collection.pdf` is a scanned image with
no text layer** (OCR of it comes back empty). Use the per-volume text PDFs
instead — `GFA_2017_Volume_6_Final.pdf` (classes) and `..._Volume_7_Final.pdf`
(Bloody Hound) — which have clean text. (2016/2018/2019/2020 collection PDFs and
the 2021 per-volume PDFs all have text layers; only the 2017 *collection* scan
is the exception.)

#### Notes from the 2017 build (canonical thief fields)
- Thief-style classes use the **DCC built-in fields**, not invented ones:
  `system.class.luckDie` (the luck-burn die, `dN` format) and
  `system.class.backstab`, plus the shared thief skill block
  (`system.skills.<skill>.value`). The core thief level pack
  (`dcc-core-book/.../thief_*.json`) drives these — and additionally varies them
  by **alignment** via `skills.{lawful,neutral,chaotic}` sub-blocks.
- This module's `buildLevelItems.mjs` still only emits `level_info` + a
  per-alignment **title** — it has **no `skills`-block (alignment-varying)
  support**. None of the classes built so far need it: Dwarf Sapper's thief
  skills are a *single fixed* table (placed directly in `level_info`). Extend
  `buildLevelItems.mjs` to merge `skills.{alignment}` blocks into
  `levelDataLawful/Neutral/Chaotic` if/when an alignment-varying thief class is
  added (and consider backfilling the simplified Assassin/Spell Thief/Heavenly
  Hitman skills then).
- **Retrofit:** the already-shipped **Halfling Hucker** was switched from a
  custom `skills.luckDie` field to the canonical `class.luckDie`.
- **Orc** ships as classId **`orc-gfa`** (plain `orc` collides with
  `dcc-crawl-classes`); sheetClass `Orc-Gfa`. **Orc & Half-Orc share one
  rage-die (deedDie) table**, differing only in hit die (1d12 vs 1d10).

#### Notes from the 2016 build
- **Hot-Dog Suit is a 4-level class** (then multiclasses). Its chart has only
  levels 1–4, so `buildLevelItems.mjs` emits 4 items for it. The E2E
  "ships a 40+ item level-data pack" test now sums a per-class `levels` field
  (default 10) instead of assuming `CLASSES.length * 10` — set `levels: 4` on
  the Hot-Dog Suit row.
- **Barbarian** is a deed-die warrior variant with two extra per-level columns
  (Savage Skills value + Smell Sorcery die, both custom skill mixin fields) and
  a **per-level crit threat range** (`system.details.critRange` 19→18→17 set in
  the chart). It borrows the warrior title table.
- **Halfling Hucker** uses the **standard DCC Halfling table** (copied from
  `dcc-core-book/assets/json/halfling-combined-chart.json`) for base attributes;
  only its Luck Die (custom field) and titles are class-specific. Sneak & Hide
  comes from the DCC built-in halfling mixin on the shared Player schema.

### Excluded (not leveled classes — documented)
- Kraken Slayer (2020) — a magic item, not a class
- Hive Master (2020) — no level table / hit die / progression (swarm table only)
- Runelords (2020 V8) — no level 1–10 table; an endowment subsystem (ability
  points passed dedicate→lord via forcibles), not a standard leveled PC class
- Moremen (2020 V13) — not a PC class; an antagonist faction ("The Mutants
  with More") plus a Lvl 1–3 mini-adventure with monster stat blocks only
- Orc Berserker (2017 V6) — an NPC stat block (battle madness/death throes),
  not a leveled PC class; orcs/half-orcs reduced below Int/Per 3 become these
- Enmascarado (2021 V1) — a mask subsystem (Paths, à-la-carte mask powers,
  Lucha de Apuestas) for the Weird Frontiers luchador; no level 1–10 table
- Tommyknocker (2024 V5) — "Dark Inheritances," Weird Frontiers mien/power
  options (Mummy, Vampyire, …) for the WF tommyknocker; no level 1–10 table
- Adventurer (2024 V5) — "Master of None": no fixed progression of its own,
  gains the level-1 benefits of a randomly rolled core class each level (chart
  reads "Per Class" for levels 2–5, "retire" at 6); not statically representable

### Deferred — incomplete source data
- Street Rat (2021 V1) — a complete class concept (HD 1d7, skullduggery deed
  die, Path mechanics, thief skills), but the supplied PDF's progression chart
  prints only levels 1–2 (the rest of the page is artwork). Build once a full
  level 1–10 table is available.

### Deferred — MCC (Mutant Crawl Classics) content (2020 V14)
- Scholar, Mastermind, Insectaur, Geologian (all by Tim Snider) have clean
  level 1–10 tables + titles, but are MCC/Terra A.D. classes (random mutations,
  Artifact Checks, AI-recognition rolls, glowburn/radburn, Clan-of-Cog/Curators
  alignments). No MCC system is installed, so they would have to be *adapted*
  to DCC (mutant traits as notes + an Artifact-Check value). **Decision
  (2026-06-19): keep this module DCC-native only — defer the MCC quartet** to a
  future dedicated MCC effort rather than mixing systems here.

### Pending (~4)
- **2025 (4)** —
  see CLASS_INVENTORY.md for the per-class list, types, and build flags.

Build order: 2020 + 2016 + 2017 + 2018 + 2019 + 2021 + 2024 done (DCC-native);
next 2025 (the last supplied collection).

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
