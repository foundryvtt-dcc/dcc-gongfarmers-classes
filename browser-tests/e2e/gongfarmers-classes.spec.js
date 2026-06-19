/* eslint-disable no-undef -- browser globals (game, Actor, foundry, CONFIG) run inside page.evaluate */
/**
 * End-to-end coverage for every Gongfarmer's Almanac class shipped by this
 * module, driven against a live Foundry V14 world.
 *
 * For each class the suite asserts, end-to-end:
 *   1. the class is registered for level-data progression load
 *      (`CONFIG.DCC.classLevelNames`);
 *   2. its level-1 pack item exists and its `system.levelData` applies cleanly
 *      to a real Player actor (every path is a valid schema field);
 *   3. the registered sheet renders with the class tab, the class die input,
 *      and the credit line — with zero console errors.
 *
 * The CLASSES table is the single place to extend when a new class is added.
 */
const { createSessionTest, expect, MODULE_ID } = require('./fixtures')

const PACK = `${MODULE_ID}.gongfarmers-class-level-data`

/**
 * One row per class.
 * - id:         lowercase classId (pack item prefix + sheet CLASS_ID)
 * - sheetClass: value written to system.details.sheetClass
 * - flag:       core.sheetClass registration id
 * - dieField:   a class-specific skill field path the sheet must render (null if none)
 * - dieAtL1:    whether the level-1 item populates dieField (false if it starts blank)
 * - extraTab:   an additional sheet tab the class must show (e.g. 'clericSpells'), or null
 * - alignment:  alignment to apply (drives which title block is used)
 */
const CLASSES = [
  { id: 'assassin', sheetClass: 'Assassin', flag: 'dcc-gongfarmers-classes-assassin.ActorSheetAssassin', dieField: 'system.skills.poisonDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'dervish', sheetClass: 'Dervish', flag: 'dcc-gongfarmers-classes-dervish.ActorSheetDervish', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'n' },
  { id: 'luchador', sheetClass: 'Luchador', flag: 'dcc-gongfarmers-classes-luchador.ActorSheetLuchador', dieField: 'system.skills.luchaDie.die', dieAtL1: true, extraTab: null, alignment: 'l' },
  { id: 'sword-monger', sheetClass: 'Sword-Monger', flag: 'dcc-gongfarmers-classes-sword-monger.ActorSheetSwordMonger', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'l' },
  { id: 'martial-grandmaster', sheetClass: 'Martial-Grandmaster', flag: 'dcc-gongfarmers-classes-martial-grandmaster.ActorSheetMartialGrandmaster', dieField: 'system.skills.unarmedDamage.die', dieAtL1: true, extraTab: null, alignment: 'n' },
  { id: 'peasant', sheetClass: 'Peasant', flag: 'dcc-gongfarmers-classes-peasant.ActorSheetPeasant', dieField: 'system.skills.hobbyDie.die', dieAtL1: false, extraTab: null, alignment: 'n' },
  { id: 'barbearian', sheetClass: 'Barbearian', flag: 'dcc-gongfarmers-classes-barbearian.ActorSheetBarbearian', dieField: 'system.skills.ragesPerDay.value', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'heavenly-hitman', sheetClass: 'Heavenly-Hitman', flag: 'dcc-gongfarmers-classes-heavenly-hitman.ActorSheetHeavenlyHitman', dieField: null, dieAtL1: false, extraTab: 'clericSpells', alignment: 'n' },
  { id: 'human', sheetClass: 'Human', flag: 'dcc-gongfarmers-classes-human.ActorSheetHuman', dieField: null, dieAtL1: false, extraTab: null, alignment: 'n' },
  { id: 'fowl-summoner', sheetClass: 'Fowl-Summoner', flag: 'dcc-gongfarmers-classes-fowl-summoner.ActorSheetFowlSummoner', dieField: null, dieAtL1: false, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'tarantino-elf', sheetClass: 'Tarantino-Elf', flag: 'dcc-gongfarmers-classes-tarantino-elf.ActorSheetTarantinoElf', dieField: null, dieAtL1: false, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'priest-of-the-old-father', sheetClass: 'Priest-Of-The-Old-Father', flag: 'dcc-gongfarmers-classes-priest-of-the-old-father.ActorSheetPriestOldFather', dieField: null, dieAtL1: false, extraTab: 'clericSpells', alignment: 'n' },
  { id: 'arcane-warrior', sheetClass: 'Arcane-Warrior', flag: 'dcc-gongfarmers-classes-arcane-warrior.ActorSheetArcaneWarrior', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'mystic-arcanist', sheetClass: 'Mystic-Arcanist', flag: 'dcc-gongfarmers-classes-mystic-arcanist.ActorSheetMysticArcanist', dieField: null, dieAtL1: false, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'spell-thief', sheetClass: 'Spell-Thief', flag: 'dcc-gongfarmers-classes-spell-thief.ActorSheetSpellThief', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'rune-sage', sheetClass: 'Rune-Sage', flag: 'dcc-gongfarmers-classes-rune-sage.ActorSheetRuneSage', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'l' },
  { id: 'hot-dog-suit', sheetClass: 'Hot-Dog-Suit', flag: 'dcc-gongfarmers-classes-hot-dog-suit.ActorSheetHotDogSuit', dieField: null, dieAtL1: false, extraTab: null, alignment: 'n', levels: 4 },
  { id: 'barbarian', sheetClass: 'Barbarian', flag: 'dcc-gongfarmers-classes-barbarian.ActorSheetBarbarian', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'halfling-hucker', sheetClass: 'Halfling-Hucker', flag: 'dcc-gongfarmers-classes-halfling-hucker.ActorSheetHalflingHucker', dieField: 'system.class.luckDie', dieAtL1: true, extraTab: null, alignment: 'n' },
  { id: 'techno-necromancer', sheetClass: 'Techno-Necromancer', flag: 'dcc-gongfarmers-classes-techno-necromancer.ActorSheetTechnoNecromancer', dieField: null, dieAtL1: false, extraTab: 'wizardSpells', alignment: 'c' },
  { id: 'dwarf-sapper', sheetClass: 'Dwarf-Sapper', flag: 'dcc-gongfarmers-classes-dwarf-sapper.ActorSheetDwarfSapper', dieField: 'system.class.luckDie', dieAtL1: true, extraTab: null, alignment: 'l' },
  { id: 'invincible-chicken', sheetClass: 'Invincible-Chicken', flag: 'dcc-gongfarmers-classes-invincible-chicken.ActorSheetInvincibleChicken', dieField: null, dieAtL1: false, extraTab: null, alignment: 'l' },
  { id: 'orc-gfa', sheetClass: 'Orc-Gfa', flag: 'dcc-gongfarmers-classes-orc-gfa.ActorSheetOrc', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'half-orc', sheetClass: 'Half-Orc', flag: 'dcc-gongfarmers-classes-half-orc.ActorSheetHalfOrc', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'paladin-of-gambrinus', sheetClass: 'Paladin-Of-Gambrinus', flag: 'dcc-gongfarmers-classes-paladin-of-gambrinus.ActorSheetPaladinGambrinus', dieField: 'system.skills.smiteDie.die', dieAtL1: true, extraTab: 'clericSpells', alignment: 'n' },
  { id: 'bloody-hound', sheetClass: 'Bloody-Hound', flag: 'dcc-gongfarmers-classes-bloody-hound.ActorSheetBloodyHound', dieField: null, dieAtL1: false, extraTab: null, alignment: 'n' },
  { id: 'bardic-rocker', sheetClass: 'Bardic-Rocker', flag: 'dcc-gongfarmers-classes-bardic-rocker.ActorSheetBardicRocker', dieField: 'system.skills.performanceDie.die', dieAtL1: true, extraTab: 'clericSpells', alignment: 'n' },
  { id: 'berserker', sheetClass: 'Berserker', flag: 'dcc-gongfarmers-classes-berserker.ActorSheetBerserker', dieField: 'system.skills.savageInstinctDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'faerie', sheetClass: 'Faerie', flag: 'dcc-gongfarmers-classes-faerie.ActorSheetFaerie', dieField: 'system.skills.sizeBonus.value', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'c' },
  { id: 'goat-o-war', sheetClass: 'Goat-O-War', flag: 'dcc-gongfarmers-classes-goat-o-war.ActorSheetGoatOWar', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'gongfarmer', sheetClass: 'Gongfarmer', flag: 'dcc-gongfarmers-classes-gongfarmer.ActorSheetGongfarmer', dieField: null, dieAtL1: false, extraTab: null, alignment: 'n' },
  { id: 'kith-of-kingspire', sheetClass: 'Kith-Of-Kingspire', flag: 'dcc-gongfarmers-classes-kith-of-kingspire.ActorSheetKith', dieField: 'system.skills.deedDie.die', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'c' },
  { id: 'lycanthrope', sheetClass: 'Lycanthrope', flag: 'dcc-gongfarmers-classes-lycanthrope.ActorSheetLycanthrope', dieField: 'system.skills.wolfFormBonus.value', dieAtL1: true, extraTab: null, alignment: 'c' },
  { id: 'pirate', sheetClass: 'Pirate', flag: 'dcc-gongfarmers-classes-pirate.ActorSheetPirate', dieField: null, dieAtL1: false, extraTab: null, alignment: 'c' },
  { id: 'quantum-traveler', sheetClass: 'Quantum-Traveler', flag: 'dcc-gongfarmers-classes-quantum-traveler.ActorSheetQuantumTraveler', dieField: 'system.class.luckDie', dieAtL1: true, extraTab: null, alignment: 'n' },
  { id: 'sage', sheetClass: 'Sage', flag: 'dcc-gongfarmers-classes-sage.ActorSheetSage', dieField: 'system.skills.curseDie.die', dieAtL1: true, extraTab: 'wizardSpells', alignment: 'n' },
  { id: 'scout', sheetClass: 'Scout', flag: 'dcc-gongfarmers-classes-scout.ActorSheetScout', dieField: 'system.class.luckDie', dieAtL1: true, extraTab: null, alignment: 'n' },
  { id: 'soldier', sheetClass: 'Soldier', flag: 'dcc-gongfarmers-classes-soldier.ActorSheetSoldier', dieField: null, dieAtL1: false, extraTab: null, alignment: 'n', levels: 5 }
]

const consoleErrors = []
const test = createSessionTest()

test.beforeEach(async ({ page }) => {
  // Clean any probe actors a prior (possibly crashed) run left behind.
  await page.evaluate(async () => {
    for (const a of game.actors.filter(a => a.name?.startsWith('ZZ E2E '))) await a.delete()
    for (const w of Object.values(ui.windows)) { try { await w.close() } catch (_) {} }
  })
  consoleErrors.length = 0
})

// Attach console/error capture once per worker page.
test.beforeAll(async ({ page }) => {
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
  page.on('pageerror', (err) => consoleErrors.push(String(err)))
})

test.afterEach(async ({ page }) => {
  await page.evaluate(async () => {
    for (const a of game.actors.filter(a => a.name?.startsWith('ZZ E2E '))) await a.delete()
  })
})

test('registers every class for progression load', async ({ page }) => {
  const registered = await page.evaluate(() => Object.keys(CONFIG.DCC.classLevelNames || {}))
  for (const c of CLASSES) expect(registered, `classLevelNames should include ${c.id}`).toContain(c.id)
})

test('ships a 40+ item level-data pack', async ({ page }) => {
  const size = await page.evaluate((pack) => game.packs.get(pack)?.index?.size ?? 0, PACK)
  // Most classes ship 10 level items; a few (e.g. the 4-level Hot-Dog Suit)
  // ship fewer, so expect the per-class sum rather than CLASSES.length * 10.
  const expectedItems = CLASSES.reduce((n, c) => n + (c.levels ?? 10), 0)
  expect(size).toBeGreaterThanOrEqual(expectedItems)
})

test('ships a reference journal crediting every class with the downloads link', async ({ page }) => {
  const journalPack = `${MODULE_ID}.gongfarmers-almanac-reference`
  const out = await page.evaluate(async (pack) => {
    const p = game.packs.get(pack)
    if (!p) return { found: false }
    const docs = await p.getDocuments()
    const entry = docs[0]
    const content = entry.pages.map(pg => pg.text?.content || '').join('\n')
    return {
      found: true,
      documentName: p.documentName,
      entryCount: docs.length,
      pageCount: entry.pages.size,
      hasDownloadsLink: content.includes('https://gongfarmersalmanac.com/downloads/'),
      creditLines: (content.match(/<li>/g) || []).length
    }
  }, journalPack)
  expect(out.found, 'reference journal pack exists').toBe(true)
  expect(out.documentName).toBe('JournalEntry')
  expect(out.entryCount).toBeGreaterThanOrEqual(1)
  expect(out.pageCount).toBeGreaterThanOrEqual(2)
  expect(out.hasDownloadsLink, 'links to the almanac downloads page').toBe(true)
  // One credit line per shipped class.
  expect(out.creditLines).toBe(CLASSES.length)
})

for (const c of CLASSES) {
  test(`${c.id}: level-1 data applies and the sheet renders cleanly`, async ({ page }) => {
    const result = await page.evaluate(async ({ c, pack }) => {
      const out = { ok: false }
      const actor = await Actor.create({ name: 'ZZ E2E ' + c.id, type: 'Player' })
      await actor.update({ 'system.details.sheetClass': c.sheetClass, 'system.details.alignment': c.alignment })

      // Apply the level-1 item's data the way the level-change flow does:
      // base block + the matching alignment block.
      const p = game.packs.get(pack)
      const entry = p.index.find(e => e.name === c.id + '-1')
      out.itemFound = !!entry
      const item = await p.getDocument(entry._id)
      const align = { l: item.system.levelDataLawful, n: item.system.levelDataNeutral, c: item.system.levelDataChaotic }[c.alignment] || ''
      const text = (item.system.levelData + '\n' + align).trim()
      const data = text.split('\n').reduce((acc, line) => {
        const i = line.indexOf('='); if (i < 0) return acc
        const k = line.slice(0, i).trim(); const v = line.slice(i + 1).trim()
        if (k) acc[k] = (v !== '' && !isNaN(v)) ? Number(v) : v
        return acc
      }, {})
      // Mirror the system's level-change flow: a multi-die action-dice value
      // (e.g. "1d20,1d14") goes to config.actionDice in full, while
      // attributes.actionDice.value keeps only the first die (the field
      // validates single dice notation). See actor-level-change.js.
      const ad = data['system.attributes.actionDice.value']
      if (ad !== undefined) {
        data['system.config.actionDice'] = ad
        if (String(ad).includes(',')) data['system.attributes.actionDice.value'] = String(ad).split(',')[0].trim()
      }
      await actor.update(data)

      out.dieValue = c.dieField ? foundry.utils.getProperty(actor, c.dieField) : null
      out.critTable = actor.system.attributes.critical.table

      // Render the registered sheet.
      await actor.setFlag('core', 'sheetClass', c.flag)
      const app = actor.sheet
      out.sheetClass = app.constructor.name
      await app.render(true)
      await new Promise(resolve => setTimeout(resolve, 900))
      const el = app.element
      out.classTab = !!el?.querySelector(`section[data-tab="${c.id}"]`)
      out.dieInput = c.dieField ? !!el?.querySelector(`input[name="${c.dieField}"]`) : null
      out.extraTabPresent = c.extraTab ? !!el?.querySelector(`section[data-tab="${c.extraTab}"]`) : null
      out.hasCredit = !![...(el?.querySelectorAll('.class-note') || [])].find(n => /Almanac/.test(n.textContent))
      await app.close()
      out.ok = true
      return out
    }, { c, pack: PACK })

    expect(result.itemFound, `${c.id}-1 pack item exists`).toBe(true)
    expect(result.critTable, `${c.id} level-1 data applied (crit table set)`).toBeTruthy()
    expect(result.classTab, `${c.id} class tab rendered`).toBe(true)
    expect(result.hasCredit, `${c.id} credit line rendered`).toBe(true)
    if (c.dieField) expect(result.dieInput, `${c.id} class die/value input rendered`).toBe(true)
    if (c.dieAtL1) expect(result.dieValue, `${c.dieField} populated from level-1 data`).toBeTruthy()
    if (c.extraTab) expect(result.extraTabPresent, `${c.id} ${c.extraTab} tab rendered`).toBe(true)
    expect(consoleErrors.filter(e => !e.includes('favicon')), `no console errors for ${c.id}`).toEqual([])
  })
}
