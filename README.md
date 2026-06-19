# Gongfarmer's Almanac Classes for Dungeon Crawl Classics in Foundry VTT

Expands the [Dungeon Crawl Classics system](https://github.com/cyface/foundryvtt-dcc/)
for the [Foundry Virtual Tabletop](https://foundryvtt.com) with player classes
from **The Gongfarmer's Almanac Collections** (2015 & 2020).

Manifest URL: https://raw.githubusercontent.com/foundryvtt-dcc/dcc-gongfarmers-classes/main/latest.json

## Classes

| Class | Source | Hit Die | Attack | Highlights |
|-------|--------|---------|--------|------------|
| **Assassin** | 2015 V1 | 1d6 | Poison Die (manual) | Backstab + thief skills, Gift of Venom, Assassinations, Hidden Weapon |
| **Dervish** | 2015 V1 | 1d10 | Deed Die (manual) | Holy warrior, Lay on Hands, two thieving skills, Tracking, Survival |
| **Luchador** | 2015 V1 | 2d5 | Flat + Lucha Die | Masked unarmed warrior, Tecnico/Rudo paths, Mighty Deeds of Wrestling |
| **Sword Monger** | 2015 V1 | 1d10 | Deed Die (manual) | Swords only, widening crit range, Blade Luck, Immortality, Sense Sibling |
| **Martial Grandmaster** | 2020 V7 | 2d6 | Flat | Master of all weapons, Combat Luck, unarmed 1d5+level, Critical Choices, Monster crit table |
| **Peasant** | 2020 V7 | 1d4 | Flat | Occupation expert, Hobby Die, Life of Adventure respec |
| **Barbearian** | 2020 V8 | 1d12 | Natural weapons | Bear race-as-class, Berzerker Rage, Thick Skin, Bear Hug |
| **Heavenly Hitman** | 2020 V8 | 1d6 | Flat | Cleric-style caster + thief skills, Divine Wrath / Channel Harm |
| **Human** | 2020 V7 | 1d8 | Flat | Highly Skilled, Master of Diplomacy, Infinite Variety |
| **Fowl Summoner** | 2020 V7 | 1d5 | Flat | Wizard caster (Personality), bird summoning |
| **Tarantino Elf** | 2020 V7 | 1d8 | Flat | Elf wizard, dual crit dice, widening threat range, Legendary Move |
| **Priest of the Old Father** | 2020 V8 | 1d8 | Flat | Elf cleric caster, King of Elfland patron |
| **Arcane Warrior** | 2020 V8 | 1d8 | Magic die | Wizard caster + warrior deed die ("Magic or Might") |
| **Mystic Arcanist** | 2020 V8 | 1d6 | Flat | Hybrid cleric + wizard caster (both via Intelligence) |

14 classes implemented and E2E-verified so far; more Almanac years (2016–2025)
are in progress — see [docs/CLASS_INVENTORY.md](docs/CLASS_INVENTORY.md) for the
full plan and per-class status.

Each class adds a level-1–10 progression to the DCC level-up system via the
`gongfarmers-class-level-data` compendium pack, plus a class sheet tab with
the class abilities and reference tables.

## Credits

The Gongfarmer's Almanac is written, illustrated, and produced by the DCC RPG
G+ Community. The classes implemented here are:

* **Assassin** — Julian Bernick (2015 Collection, V1: Men & Magic)
* **Dervish** — Edgar Johnson (2015 Collection, V1: Men & Magic)
* **Luchador** — Reid "Reidzilla" San Filippo (2015 Collection, V1: Men & Magic)
* **Sword Monger** — David Baity (2015 Collection, V1: Men & Magic)
* **Martial Grandmaster** — bygrinstow, art by Matt Sutton (2020 Collection, V7: Character Classes)
* **Peasant** — Matthew Carr, art by Colin Mills (2020 Collection, V7: Character Classes)
* **Barbearian** — Randy Andrews, art by Jonathan Byrne (2020 Collection, V8)
* **Heavenly Hitman** — Ed Kabara (2020 Collection, V8: Character Class — Styles & Rules)

## Maintainers

* Tim L. White (@cyface)

## Development

* `npm run build-levels` — regenerate the pack source JSON from
  `assets/json/*-combined-chart.json`
* `npm run todb` — compile the pack source to LevelDB (Foundry must be shut down)
* `npm run tojson` — extract the LevelDB pack back to JSON
* `npm run format` — StandardJS auto-fix
