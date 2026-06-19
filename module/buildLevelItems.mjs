/**
 * buildLevelItems.mjs
 *
 * Generate the `packs/gongfarmers-class-level-data/src/` JSON documents
 * (one Folder per class + one `level` Item per class/level) from the
 * authoritative `assets/json/{class}-combined-chart.json` files.
 *
 * The DCC level-data-pack loader assembles a class progression from the
 * `{classId}-{level}` items registered via
 * `game.dcc.registerLevelDataPack` + `registerHomebrewClassForProgressionLoad`.
 * Each item's `system.levelData` is a newline-separated `key=value` block
 * applied to the actor on level change; per-alignment `levelDataLawful/
 * Neutral/Chaotic` blocks carry the level title.
 *
 * Run with `npm run build-levels`, then `npm run todb` to compile to
 * LevelDB. IDs are derived deterministically from `{classId}-{level}` so
 * re-running produces a stable, reviewable diff.
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CHART_DIR = path.join(ROOT, 'assets', 'json')
const SRC_DIR = path.join(ROOT, 'packs', 'gongfarmers-class-level-data', 'src')

// Auto-discover classes from the combined-chart files so adding a class is
// just dropping a `{classId}-combined-chart.json` + registering it.
const CLASSES = fs.readdirSync(CHART_DIR)
  .filter(f => f.endsWith('-combined-chart.json'))
  .map(f => f.replace('-combined-chart.json', ''))
  .sort()
const ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Deterministic 16-char Foundry-style id derived from a seed string, so
 * repeated runs keep the same _id/_key (stable git diffs).
 * @param {string} seed
 * @returns {string}
 */
function stableId (seed) {
  const hash = crypto.createHash('sha256').update(seed).digest()
  let id = ''
  for (let i = 0; i < 16; i++) id += ID_ALPHABET[hash[i] % ID_ALPHABET.length]
  return id
}

/**
 * Turn an object of `key: value` pairs into the newline-separated
 * `key=value` text the level-change applier parses.
 */
function toLevelDataText (pairs) {
  return Object.entries(pairs).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'
}

const stats = {
  compendiumSource: null,
  duplicateSource: null,
  exportSource: null,
  coreVersion: '13.348',
  systemId: 'dcc',
  systemVersion: '0.70.0',
  createdTime: 0,
  modifiedTime: 0,
  // Must be a valid 16-char alphanumeric document id (Foundry validates
  // _stats.lastModifiedBy on load; an invalid value aborts world boot).
  lastModifiedBy: 'dccGongfarmer000'
}

// Reset the src directory so removed levels don't linger.
fs.rmSync(SRC_DIR, { recursive: true, force: true })
fs.mkdirSync(SRC_DIR, { recursive: true })

let fileCount = 0
for (const classId of CLASSES) {
  const chart = JSON.parse(fs.readFileSync(path.join(CHART_DIR, `${classId}-combined-chart.json`), 'utf8'))

  // Folder document for this class's level items.
  const folderId = stableId(`folder:${classId}`)
  const folderName = classId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' Level Items'
  const folderFile = `${folderName.replaceAll(' ', '_')}_${folderId}.json`
  fs.writeFileSync(path.join(SRC_DIR, folderFile), JSON.stringify({
    name: folderName,
    type: 'Item',
    color: '#a9a9a9',
    folder: null,
    _id: folderId,
    description: '',
    sorting: 'a',
    sort: 0,
    flags: {},
    _stats: { ...stats },
    _key: `!folders!${folderId}`
  }, null, 2) + '\n')
  fileCount++

  for (const [level, data] of Object.entries(chart)) {
    const id = stableId(`${classId}-${level}`)
    const system = {
      class: classId,
      level: String(level),
      levelData: toLevelDataText(data.level_info)
    }
    if (data.titles) {
      system.levelDataLawful = `system.details.title.value=${data.titles.lawful}\n`
      system.levelDataNeutral = `system.details.title.value=${data.titles.neutral}\n`
      system.levelDataChaotic = `system.details.title.value=${data.titles.chaotic}\n`
    }
    const doc = {
      img: 'modules/dcc-core-book/assets/svg/game-icons-net/up-card.svg',
      system,
      name: `${classId}-${level}`,
      type: 'level',
      folder: folderId,
      _id: id,
      effects: [],
      sort: Number(level) * 100,
      ownership: { default: 0 },
      flags: {},
      _stats: { ...stats },
      _key: `!items!${id}`
    }
    fs.writeFileSync(path.join(SRC_DIR, `${classId.replaceAll('-', '_')}_${level}_${id}.json`), JSON.stringify(doc, null, 2) + '\n')
    fileCount++
  }
}

console.log(`Wrote ${fileCount} source documents for ${CLASSES.length} classes to ${path.relative(ROOT, SRC_DIR)}`)
