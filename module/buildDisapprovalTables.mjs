/**
 * buildDisapprovalTables.mjs
 *
 * Generate the class disapproval RollTable compendium
 * (`packs/gongfarmers-disapproval/src/`). It holds the Anti-Cleric's
 * Catastrophe! table, which maps the `Nd10 - Luck modifier` total onto the
 * wizard corruption tables in the DCC core rulebook. Only the table numbers are
 * named here; the corruption results themselves stay in the rulebook.
 *
 * Run: `npm run build-tables` (then `npm run todb`).
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PACK = 'gongfarmers-disapproval'
const SRC_DIR = path.join(ROOT, 'packs', PACK, 'src')

const ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/** Deterministic 16-char Foundry-style id from a seed (stable git diffs). */
function stableId (seed) {
  const hash = crypto.createHash('sha256').update(seed).digest()
  let id = ''
  for (let i = 0; i < 16; i++) id += ID_ALPHABET[hash[i] % ID_ALPHABET.length]
  return id
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

const tableId = stableId(`${PACK}:table:catastrophe`)

// The open-ended bounds match the core Disapproval table's convention. A roll
// tops out near 200 (20d10 plus a negative Luck modifier), and DCC clamps
// anything below 1 to the first row.
const results = [
  { name: 'Minor Corruption', range: [-500, 10], description: 'Minor corruption: roll on DCC RPG table 5-3.' },
  { name: 'Major Corruption', range: [11, 20], description: 'Major corruption: roll on DCC RPG table 5-4.' },
  { name: 'Greater Corruption', range: [21, 500], description: 'Greater corruption: roll on DCC RPG table 5-5.' }
].map(({ name, range, description }) => {
  const id = stableId(`${PACK}:result:${name}`)
  return {
    _id: id,
    name,
    description,
    type: 'text',
    img: 'icons/svg/d20-black.svg',
    weight: 1,
    range,
    drawn: false,
    flags: {},
    _stats: { ...stats },
    _key: `!tables.results!${tableId}.${id}`
  }
})

const table = {
  _id: tableId,
  name: 'Catastrophe!',
  img: 'icons/svg/d20-grey.svg',
  description: 'The Anti-Cleric rolls this instead of normal disapproval: 1d10 for every point on the spell check, reduced by the Luck modifier.',
  // DCC builds the real formula from the natural roll. This one only serves a
  // manual draw from the table window, and 3d10 can reach all three bands.
  formula: '3d10',
  replacement: true,
  displayRoll: true,
  results,
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  flags: {},
  _stats: { ...stats },
  _key: `!tables!${tableId}`
}

// Reset the src directory so stale docs don't linger.
fs.rmSync(SRC_DIR, { recursive: true, force: true })
fs.mkdirSync(SRC_DIR, { recursive: true })

const file = `Catastrophe_${tableId}.json`
fs.writeFileSync(path.join(SRC_DIR, file), JSON.stringify(table, null, 2) + '\n')

console.log(`Wrote Catastrophe! table (${results.length} results) to packs/${PACK}/src`)
