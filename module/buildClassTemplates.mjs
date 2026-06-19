/**
 * buildClassTemplates.mjs
 *
 * Generate standard class-tab templates (`templates/actor-partial-<id>.html`)
 * from a per-class META map + the authoritative combined-chart JSON. This
 * keeps the many Gongfarmer's Almanac class tabs visually consistent and lets
 * a new class be added by dropping a chart + a META entry rather than
 * hand-authoring HTML. The hand-written original classes (assassin, dervish,
 * luchador, sword-monger, martial-grandmaster, peasant, barbearian,
 * heavenly-hitman) are NOT in META and are left untouched.
 *
 * Each generated tab shows: a class-die/value input row (optional), an
 * abilities note list (localized), the level progression table built from the
 * chart, an optional titles table, and the credit line.
 *
 * Run: `node module/buildClassTemplates.mjs`
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CHART_DIR = path.join(ROOT, 'assets', 'json')
const TPL_DIR = path.join(ROOT, 'templates')

/**
 * META: one entry per generated class.
 * - prefix: lang-key namespace (e.g. "Human" → keys like "Human.Human").
 * - dice: rollable/value inputs shown above the notes. {labelKey, field, roll}
 *     roll=true → rollable skill-check label; roll=false → plain value field.
 * - abilities: lang-key suffixes; each renders <prefix.key> + <prefix.keyDesc>.
 * - tableDice: extra level-table columns pulled from the chart level_info.
 *     {header, key}  (key is the system path in level_info)
 * - caster: optional note string key shown under the table (e.g. spell tab).
 */
const META = {
  human: {
    prefix: 'Human',
    dice: [],
    abilities: ['HighlySkilled', 'MasterOfDiplomacy', 'InfiniteVariety', 'HumanHubris', 'Luck', 'Languages'],
    tableDice: []
  },
  'fowl-summoner': {
    prefix: 'FowlSummoner',
    dice: [],
    abilities: ['WeaponTraining', 'Spellcasting', 'Summoning', 'Patron', 'PersonalityLoss', 'PeckingOrder'],
    tableDice: [],
    caster: 'FowlSummoner.CasterNote'
  },
  'tarantino-elf': {
    prefix: 'TarantinoElf',
    dice: [],
    abilities: ['WeaponTraining', 'Spellcasting', 'CatchPhrase', 'Iron', 'UltraViolence', 'LegendaryMove'],
    tableDice: [],
    caster: 'TarantinoElf.CasterNote'
  },
  'priest-of-the-old-father': {
    prefix: 'PriestOldFather',
    dice: [],
    abilities: ['Magic', 'LayOnHands', 'Patrons', 'Luck', 'HeightenedSenses', 'ElfTraits'],
    tableDice: [],
    caster: 'PriestOldFather.CasterNote'
  },
  'arcane-warrior': {
    prefix: 'ArcaneWarrior',
    dice: [{ labelKey: 'ArcaneWarrior.MagicDie', field: 'system.skills.deedDie.die', roll: true }],
    abilities: ['WeaponTraining', 'MagicDieAbility', 'MagicOrMight', 'CasterLevel', 'Luck'],
    tableDice: [{ header: 'Magic Die', key: 'system.skills.deedDie.die' }],
    caster: 'ArcaneWarrior.CasterNote'
  },
  'spell-thief': {
    prefix: 'SpellThief',
    dice: [{ labelKey: 'SpellThief.MagicDie', field: 'system.skills.deedDie.die', roll: true }],
    abilities: ['WeaponTraining', 'ThievingSkills', 'Magic', 'StealSpell', 'Luck'],
    tableDice: [{ header: 'Magic Die', key: 'system.skills.deedDie.die' }],
    caster: 'SpellThief.CasterNote'
  },
  'rune-sage': {
    prefix: 'RuneSage',
    dice: [{ labelKey: 'RuneSage.MagicDie', field: 'system.skills.deedDie.die', roll: true }],
    abilities: ['WeaponTraining', 'Magic', 'Rune', 'SwordAndStone', 'DwarfTraits', 'Luck'],
    tableDice: [{ header: 'Magic Die', key: 'system.skills.deedDie.die' }],
    caster: 'RuneSage.CasterNote'
  },
  'mystic-arcanist': {
    prefix: 'MysticArcanist',
    dice: [],
    abilities: ['Powers', 'PatronRestriction', 'DisapprovalCorruption', 'Luck', 'WeaponTraining'],
    tableDice: [],
    caster: 'MysticArcanist.CasterNote'
  },
  'hot-dog-suit': {
    prefix: 'HotDogSuit',
    dice: [],
    abilities: ['ArmorWeapons', 'Baffle', 'PinkPaperFlyers', 'IgnoredOverlooked', 'ElementalInteractions', 'LuckyBastich', 'Advancement'],
    tableDice: []
  },
  barbarian: {
    prefix: 'Barbarian',
    dice: [{ labelKey: 'Barbarian.DeedDie', field: 'system.skills.deedDie.die', roll: true }],
    abilities: ['DeedDieAbility', 'MightyDeeds', 'Loincloth', 'AnimalInstincts', 'SavageSkillsAbility', 'ArmedWithAnything', 'SmellSorceryAbility', 'Superstitions', 'Primitive'],
    tableDice: [{ header: 'Savage Skills', key: 'system.skills.savageSkills.value' }, { header: 'Smell Sorcery', key: 'system.skills.smellSorcery.die' }]
  },
  'halfling-hucker': {
    prefix: 'HalflingHucker',
    dice: [{ labelKey: 'HalflingHucker.LuckDie', field: 'system.skills.luckDie.die', roll: false }],
    abilities: ['WeaponTraining', 'TwoFistedThrower', 'HalflingTraits', 'LuckyTosser', 'Prizewinner'],
    tableDice: [{ header: 'Luck Die', key: 'system.skills.luckDie.die' }]
  },
  'techno-necromancer': {
    prefix: 'TechnoNecromancer',
    dice: [],
    abilities: ['WeaponTraining', 'TechnoMagicalAccessory', 'Magic', 'CyberanimateDead', 'Luck', 'Languages'],
    tableDice: [],
    caster: 'TechnoNecromancer.CasterNote'
  }
}

function cell (v) { return `<div class="divTableCell">${v}</div>` }
function head (v) { return `<div class="divTableHead">${v}</div>` }

function buildLevelTable (chart, meta) {
  const levels = Object.keys(chart).sort((a, b) => Number(a) - Number(b))
  const hasAtk = levels.some(l => chart[l].level_info['system.details.attackBonus'] !== undefined)
  const hasTitles = levels.some(l => chart[l].titles)

  const headers = ['{{localize "DCC.Level"}}']
  if (hasAtk) headers.push('Atk')
  headers.push('Crit Die/Table', 'Action Dice')
  for (const td of meta.tableDice) headers.push(td.header)
  headers.push('Ref', 'Fort', 'Will')
  if (hasTitles) headers.push('{{localize "DCC.Title"}}')

  const rows = levels.map(l => {
    const li = chart[l].level_info
    const cells = [l]
    if (hasAtk) cells.push(li['system.details.attackBonus'] ?? '&mdash;')
    const critDie = li['system.attributes.critical.die'] ?? '—'
    const critTable = li['system.attributes.critical.table'] ?? '—'
    cells.push(`${critDie}/${critTable}`)
    cells.push((li['system.attributes.actionDice.value'] ?? '1d20').replace(/,/g, '+'))
    for (const td of meta.tableDice) cells.push(li[td.key] ?? '&mdash;')
    cells.push(li['system.saves.ref.classBonus'] ?? '+0')
    cells.push(li['system.saves.frt.classBonus'] ?? '+0')
    cells.push(li['system.saves.wil.classBonus'] ?? '+0')
    if (hasTitles) cells.push(chart[l].titles ? chart[l].titles.neutral : '&mdash;')
    return `        <div class="divTableRow">${cells.map(cell).join('')}</div>`
  })

  return `    <h4 class="grid-col-span-12 label-font mt-8">{{localize "${meta.prefix}.LevelTable"}}</h4>
    <div class="divTable classTable grid-col-span-12">
      <div class="divTableHeading"><div class="divTableRow">${headers.map(head).join('')}</div></div>
      <div class="divTableBody">
${rows.join('\n')}
      </div>
    </div>`
}

function buildDice (meta, tabId) {
  if (!meta.dice.length) return ''
  return meta.dice.map(d => {
    if (d.roll) {
      const skill = d.field.split('.')[2]
      return `        <div class="grid-tpl-max-25" data-skill="${skill}">
          <label class="skill-check rollable" for="${d.field}" data-action="rollSkillCheck" data-drag="true" data-drag-action="skill" title="{{localize 'DCC.RollSkillCheckHint'}}">{{localize "${d.labelKey}"}}</label>
          <input type="text" id="${d.field}" name="${d.field}" value="{{${d.field}}}" data-dtype="String"/>
        </div>`
    }
    return `        <div class="grid-tpl-max-25">
          <label>{{localize "${d.labelKey}"}}</label>
          <input type="text" id="${d.field}" name="${d.field}" value="{{${d.field}}}" data-dtype="String"/>
        </div>`
  }).join('\n')
}

function buildAbilities (meta) {
  return meta.abilities.map(a =>
    `          <li>{{localize "${meta.prefix}.${a}"}}
            <ul class="class-note flexcol"><li>{{localize "${meta.prefix}.${a}Desc"}}</li></ul>
          </li>`
  ).join('\n')
}

let count = 0
for (const [tabId, meta] of Object.entries(META)) {
  const chart = JSON.parse(fs.readFileSync(path.join(CHART_DIR, `${tabId}-combined-chart.json`), 'utf8'))
  const casterNote = meta.caster ? `\n    <p class="grid-col-span-12 class-note data-font">{{localize "${meta.caster}"}}</p>` : ''
  const html = `{{!-- ${meta.prefix} Class Tab (generated by buildClassTemplates.mjs) --}}
<section class="tab {{tabs.${tabId}.id}} {{tabs.${tabId}.cssClass}}" data-tab="{{tabs.${tabId}.id}}"
         data-group="{{tabs.${tabId}.group}}">

  <div class="grid-container">
    <div class="grid-col-span-12 dark-border">
      <div class="box-title">{{localize "${meta.prefix}.Abilities"}}</div>
      <div class="grid-tpl-two grid-row-gap-8 p-5">
${buildDice(meta, tabId)}
        <ul class="class-note grid-col-span-2 data-font">
${buildAbilities(meta)}
        </ul>
      </div>
    </div>

${buildLevelTable(chart, meta)}${casterNote}

    <p class="grid-col-span-12 class-note data-font">{{localize "${meta.prefix}.Credit"}}</p>
  </div>
</section>
`
  fs.writeFileSync(path.join(TPL_DIR, `actor-partial-${tabId}.html`), html)
  count++
  console.log(`generated actor-partial-${tabId}.html`)
}
console.log(`Generated ${count} class templates.`)
