# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Foundry VTT module that adds player classes from **The Gongfarmer's Almanac
2015 Collection** (Volume 1: Men & Magic) to the Dungeon Crawl Classics (DCC)
RPG system. This module depends on the `dcc` system (v0.70.0+, ApplicationV2 /
V14) and registers each class through the DCC **extension API**
(`game.dcc.*`) — it does NOT use the legacy `Actors.registerSheet` /
`definePlayerSchema` patterns.

## Commands

```bash
npm run build-levels  # Regenerate packs/.../src/*.json from assets/json/*-combined-chart.json
npm run todb          # Compile JSON pack source to LevelDB (Foundry must be shut down)
npm run tojson        # Extract LevelDB packs to JSON source
npm run format        # StandardJS auto-fix
```

## Architecture

### Entry point
- `module/dcc-gongfarmers-classes.js` — `Hooks.once('init')`: registers the
  level-data pack (`dcc.registerLevelDataPack`), calls
  `registerGongfarmersClasses(game.dcc)`, and registers the per-class sheet
  stubs via `game.dcc.registerActorSheet('Player', …)`.

### Class registration
- `module/gongfarmers-class-data.js` — the single source of truth. Each class
  is one `GONGFARMERS_CLASSES` entry registered through four `game.dcc`
  registries: `registerClassMixin` (schema fields), `registerClassDefaults`
  (first-open identity/config), `registerSheetPart` (parts + tabs), and
  `registerHomebrewClassForProgressionLoad` (level-pack progression).
- `classId` (lowercase, hyphenated: `assassin`, `dervish`, `luchador`,
  `sword-monger`) matches each sheet stub's `static CLASS_ID`, the
  `{classId}-{level}` pack item names, and `system.details.sheetClass`
  lowercased.

### Sheets & templates
- `module/actor-sheets-*.js` — 5-line `DCCSheet` stubs (just `CLASS_ID` +
  window height).
- `templates/actor-partial-*.html` — the class tab: class dice, ability notes,
  and reference tables. Hyphenated tab ids use plain dotted Handlebars
  (`{{tabs.sword-monger.id}}`).

### Level-data pack
- `assets/json/{class}-combined-chart.json` — authoritative per-level data
  (saves, crit die/table, action dice, class dice, titles).
- `module/buildLevelItems.mjs` — generates `packs/gongfarmers-class-level-data/src/`
  (40 `level` Items + 4 Folders) from the charts, with deterministic ids.
- `compilePacks.js` / `extractPacks.js` use `@foundryvtt/foundryvtt-cli`.
- `system.levelData` is newline-separated `key=value` Foundry paths applied to
  the actor on level change; titles go in `levelDataLawful/Neutral/Chaotic`.

### Classes
2015 Collection (V1: Men & Magic): Assassin, Dervish, Luchador, Sword Monger.
2020 Collection: Martial Grandmaster (V7), with further 2020 classes in
progress. Each class = one combined-chart + one `GONGFARMERS_CLASSES` entry +
a sheet stub + a template + lang keys. Spellcaster classes additionally include
a `clericSpells`/`wizardSpells` sheet part and set `class.spellCheckAbility`.

## Code Style

StandardJS. The `standard` config ignores `assets/`, `metadata/`, `packs/`.
Foundry runtime globals (`foundry`, `game`, `Hooks`, `Folder`) go in
`/* global */` comments.
