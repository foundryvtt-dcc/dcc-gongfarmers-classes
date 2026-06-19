/**
 * buildReferenceJournal.mjs
 *
 * Generate the in-Foundry reference journal compendium
 * (`packs/gongfarmers-almanac-reference/src/`) — a single JournalEntry that
 * points players and judges back to the Gongfarmer's Almanac downloads page
 * and credits every class shipped by this module to its original author,
 * collection year, and volume.
 *
 * The per-class credit lines are read from `lang/en.json` (`*.Credit` keys),
 * so the journal stays in sync as new classes are added — just rebuild.
 *
 * Run: `node module/buildReferenceJournal.mjs` (then `npm run todb`).
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LANG = path.join(ROOT, 'lang', 'en.json')
const PACK = 'gongfarmers-almanac-reference'
const SRC_DIR = path.join(ROOT, 'packs', PACK, 'src')

const DOWNLOADS_URL = 'https://gongfarmersalmanac.com/downloads/'

/** Per-year almanac download page (the most granular stable official link). */
function yearUrl (year) {
  return `https://gongfarmersalmanac.com/downloads/gfa-${year}/`
}

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

// Collect every class credit line, grouped by Almanac collection year and then
// by volume within the year. The class name (the text before the first " by "
// or em-dash) drives the alphabetical sort within each volume.
const lang = JSON.parse(fs.readFileSync(LANG, 'utf8'))
const byYear = new Map()
let totalClasses = 0
for (const [key, value] of Object.entries(lang)) {
  if (!key.endsWith('.Credit')) continue
  const year = value.match(/Almanac\s+(\d{4})\s+Collection/)?.[1] ?? 'Other'
  const volume = Number(value.match(/Volume\s+(\d+)/)?.[1] ?? 0)
  const name = value.match(/^(.*?)(?:\s+by\s+|\s+—\s+)/)?.[1]?.trim() ?? value
  // The year/volume now live in the headings, so drop the trailing
  // "— The Gongfarmer's Almanac … Collection, Volume …" from each line.
  const credit = value.replace(/\s*—\s*The Gongfarmer.*$/u, '').trim()
  if (!byYear.has(year)) byYear.set(year, new Map())
  const byVolume = byYear.get(year)
  if (!byVolume.has(volume)) byVolume.set(volume, [])
  byVolume.get(volume).push({ name, credit })
  totalClasses++
}
const years = [...byYear.keys()].sort()

/** Build one text JournalEntryPage document embedded in the parent. */
function page (parentId, name, sort, contentHtml) {
  const id = stableId(`${PACK}:page:${name}`)
  return {
    sort,
    name,
    type: 'text',
    _id: id,
    title: { show: true, level: 1 },
    image: {},
    text: { format: 1, content: contentHtml, markdown: '' },
    video: { controls: true, volume: 0.5 },
    src: null,
    system: {},
    ownership: { default: -1 },
    flags: {},
    _stats: { ...stats },
    _key: `!journal.pages!${parentId}.${id}`
  }
}

const journalId = stableId(`${PACK}:journal:gongfarmers-almanac`)

const aboutHtml = `<p>The classes in this module come from <strong>The Gongfarmer's Almanac</strong>, a free, fan-made zine for the <em>Dungeon Crawl Classics</em> RPG produced each year by the DCC community (the "Gongfarmers") and released under Goodman Games' third-party / community-content terms.</p>
<p>Every volume is available — free, pay-what-you-want — from the official downloads page:</p>
<p><a href="${DOWNLOADS_URL}">${DOWNLOADS_URL}</a></p>
<p>If you enjoy these classes, please grab the original almanacs to read each class's full text, art, and the dozens of adventures, monsters, magic items, and patrons that ship alongside them. This module reproduces only the mechanical level progressions and sheet tabs needed to play the classes in Foundry VTT.</p>`

const creditsIntro = `<p>This module ships <strong>${totalClasses}</strong> classes drawn from the almanacs below. Each is credited to its original author(s) and artist(s) and the volume it first appeared in. All rights remain with the respective creators and Goodman Games.</p>`

const creditsByYear = years.map(year => {
  // Link each collection heading straight to that year's almanac download page.
  const heading = /^\d{4}$/.test(year)
    ? `<a href="${yearUrl(year)}">${year} Collection</a>`
    : `${year} Collection`

  const byVolume = byYear.get(year)
  const volumes = [...byVolume.keys()].sort((a, b) => a - b)
  const volumeBlocks = volumes.map(vol => {
    const items = byVolume.get(vol)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => `    <li>${c.credit}</li>`)
      .join('\n')
    const volHeading = vol ? `<h3>Volume ${vol}</h3>\n  ` : ''
    return `  ${volHeading}<ul>\n${items}\n  </ul>`
  }).join('\n')

  return `  <h2>${heading}</h2>\n${volumeBlocks}`
}).join('\n')

const creditsHtml = `${creditsIntro}\n${creditsByYear}`

const pages = [
  page(journalId, 'About the Gongfarmer’s Almanac', 100000, aboutHtml),
  page(journalId, 'Class Credits', 200000, creditsHtml)
]

const journal = {
  name: 'The Gongfarmer’s Almanac',
  _id: journalId,
  pages,
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  flags: {},
  _stats: { ...stats },
  _key: `!journal!${journalId}`
}

// Reset the src directory so stale docs don't linger.
fs.rmSync(SRC_DIR, { recursive: true, force: true })
fs.mkdirSync(SRC_DIR, { recursive: true })

const file = `The_Gongfarmers_Almanac_${journalId}.json`
fs.writeFileSync(path.join(SRC_DIR, file), JSON.stringify(journal, null, 2) + '\n')

console.log(`Wrote reference journal (${pages.length} pages, ${totalClasses} class credits) to packs/${PACK}/src`)
