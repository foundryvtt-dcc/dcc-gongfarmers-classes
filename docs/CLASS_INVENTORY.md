# Gongfarmer's Almanac — Class Inventory & Build Plan

Inventory of playable PC classes (and race-as-class writeups) across the
Gongfarmer's Almanac collections present in `~/Documents/DCC/`, for
implementation in this module. Compiled 2026-06-19.

Legend — **type**: martial · caster · race (race-as-class) · skill · hybrid · NPC.
Status: ✅ done & E2E-verified · ⬜ pending.

## 2015 Collection (V1: Men & Magic)
| Class | Type | Status |
|-------|------|--------|
| Assassin | martial (poison die) | ✅ |
| Dervish | martial (deed die) | ✅ |
| Luchador | martial (lucha die) | ✅ |
| Sword Monger | martial (deed die) | ✅ |
| (Chirumancy — V4) | NPC class | ⬜ (NPC; lower priority) |

## 2020 Collection
| Class | Vol | Type | Status |
|-------|-----|------|--------|
| Martial Grandmaster | 7 | martial | ✅ |
| Peasant | 7 | skill | ✅ |
| Barbearian | 8 | race | ✅ |
| Heavenly Hitman | 8 | caster (cleric) + thief | ✅ |
| Human | 7 | basic | ✅ |
| Fowl Summoner | 7 | caster | ✅ |
| Hive Master | 7 | caster | ❌ excluded — no level table/hit die/progression (only a d7+Luck swarm table) |
| Tarantion Elf | 7 | race/caster | ✅ |
| Priest of the Old Father | 8 | caster (cleric) | ✅ |
| Arcane Warrior | 8 | caster (wizard)+martial | ✅ |
| Mystic Arcanist | 8 | caster | ✅ |
| Rune Sage | 8 | caster (rune system) | ⬜ |
| Spell Thief | 8 | caster + thief | ⬜ |
| Runelords | 8 | caster (custom rune system) | ⬜ |
| Moremen | 13 | race (mutant) | ⬜ |
| Scholar | 14 | skill | ⬜ |
| Mastermind | 14 | skill (psionic) | ⬜ |
| Insectaur | 14 | race (mutant) | ⬜ |
| Geologian | 14 | race (mutant) | ⬜ |
| ~~Kraken Slayer~~ | 10 | — | ❌ not a class (magic item in an NPC writeup) |

## 2016 Collection
| Class | Vol | Type |
|-------|-----|------|
| Hot-Dog Suit | 1 | skill (joke class) |
| Barbarian | 1 | martial (warrior variant) ⚠ generic name |
| Halfling Hucker | 1 | race (halfling variant) |
| Techno-necromancer | 6 | caster (Crawljammer) |

## 2017 Collection
| Class | Vol | Type |
|-------|-----|------|
| Dwarf Sapper | 6 | race |
| Invincible Chicken | 6 | hybrid (novelty) |
| Orc | 6 | race ⚠ classId collides with dcc-crawl-classes "orc" |
| Half-Orc | 6 | race |
| Paladin of Gambrinus | 6 | hybrid (divine) |
| Bloody Hound | 7 | skill (PI) |
| Orc Berserker | 6 | NPC stat block |

## 2018 Collection (V1: New Class Explosion! + V6)
| Class | Vol | Type |
|-------|-----|------|
| Bardic Rocker | 1 | caster (bard) |
| Berserker | 1 | martial |
| Faerie Class | 1 | race/caster |
| Goat'o'war | 1 | race |
| Gongfarmer | 1 | skill |
| Kith of Kingspire | 1 | hybrid race |
| Lycanthrope | 1 | template/overlay ⚠ may not fit standalone-class pattern |
| Pirate | 1 | martial |
| Quantum Traveler | 1 | skill (firearms) |
| Sage | 1 | caster |
| Scout | 1 | skill (thief variant) |
| Soldier | 6 | martial (Trench Crawl, firearms) |

## 2019 Collection (V11: Classes & NPCs)
| Class | Vol | Type |
|-------|-----|------|
| The Anti-Cleric | 11 | caster |
| The Cambion | 11 | martial (beast die) |
| Children of the Wild (Faerie) | 11 | race/caster |
| Godling | 11 | hybrid (powers menu) |
| Fater | 11 | skill |

## 2021 (Volumes 1, 3, 4, 6 supplied; 2 & 5 missing)
| Class | Vol | Type |
|-------|-----|------|
| Enmascarado | 1 | martial (masks) |
| Street Rat | 1 | skill (rogue) |
| Supernatural Model | 1 | hybrid |
| Aetherian Warcat | 3 | martial/race (unverified) |
| Gnome | 4 | race/caster ⚠ classId collides with dcc-crawl-classes "gnome" |
| Sin Eater of the Shudders | 6 | hybrid (ritual) |

## 2024 Collection
| Class | Vol | Type |
|-------|-----|------|
| Chimeraman | 5 | race |
| Adventurer | 5 | hybrid (cycles classes) |
| Investigator | 5 | skill |
| Therapist | 5 | skill (technique die) |
| Tommyknocker | 5 | race (Weird Frontiers; may be add-on options) |
| Taurune | 6 | race (minotaur, deed die) |

## 2025 Collection (V3: Classes & Judge's Tools)
| Class | Vol | Type |
|-------|-----|------|
| El Padre | 3 | hybrid (Weird Frontiers) ⚠ Hex-token system |
| The St(ranger) | 3 | martial (Weird Frontiers) ⚠ Hex tokens |
| The Demolitionist | 3 | martial (Weird Frontiers) ⚠ Hex tokens |
| Minovean Sage | 3 | race/caster |

## Totals
- **Done & E2E-verified:** 14 (✅) — 2015: all 4; 2020: Martial Grandmaster, Peasant, Barbearian, Heavenly Hitman, Human, Fowl Summoner, Tarantion Elf, Priest of the Old Father, Arcane Warrior, Mystic Arcanist.
- **Excluded (not leveled classes):** Kraken Slayer (magic item), Hive Master (no progression).
- **Pending:** ~43 — 2020: Rune Sage, Spell Thief, Runelords, Moremen, Scholar, Mastermind, Insectaur, Geologian (8); plus all of 2016/2017/2018/2019/2021/2024/2025.

## Tooling for the remaining build
- `node module/buildLevelItems.mjs` — auto-discovers every `assets/json/*-combined-chart.json` and regenerates pack source (then `npm run todb`).
- `node module/buildClassTemplates.mjs` — generates standard class-tab templates from a META map + chart. Add a class to its META to get a template.
- `browser-tests/e2e/gongfarmers-classes.spec.js` — add a row to its `CLASSES` table and the class is covered by the suite.

## Build considerations / flags
- **classId collisions** with the existing `dcc-crawl-classes` module: 2017 **Orc** and 2021 **Gnome** (crawl already ships `orc`/`gnome`). Disambiguate (e.g. `orc-gfa` / `gnome-gfa`) or skip if redundant. 2016 **Barbarian** / 2018 **Berserker** are warrior variants — keep distinct ids.
- **Spellcasters** (many): need a `clericSpells` or `wizardSpells` sheet part + `class.spellCheckAbility`, like Heavenly Hitman / the crawl Paladin. Pattern established.
- **Races/race-as-class:** racial traits go in the class tab as notes; level data still drives saves/crit/action dice/hit die.
- **Non-standard systems** that won't map cleanly to DCC fields: Runelords/Rune Sage (rune system), Weird Frontiers classes (Hex tokens, Fumble Die), Lycanthrope (overlay/template), Adventurer (cycles core classes). These need per-class design decisions; flag for review when reached.
- **2021 Vols 2 & 5** not supplied — any classes there are unknown.
