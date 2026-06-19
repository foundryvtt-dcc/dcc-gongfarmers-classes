/* global Folder */
import DCCItem from '../../../systems/dcc/module/item.js'

/**
 * GM convenience helpers (exposed as `game.createGongfarmersClassItems` /
 * `game.createAllGongfarmersClassItems`) that materialize the level
 * items from the combined-chart JSON into the world as editable `level`
 * Items. The shipped compendium pack
 * (`gongfarmers-class-level-data`) is the real progression source used
 * at level-up — these helpers exist only for authoring/inspection.
 */

const baseUrl = '/modules/dcc-gongfarmers-classes/assets/json/'

export async function createClassItems (className) {
  const levelFileUrl = `${baseUrl}${className}-combined-chart.json`

  const titleCaseName = className
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  // Create a top-level folder to hold this class's level items.
  const folder = await Folder.create({
    name: `${titleCaseName} Level Items`,
    type: 'Item',
    color: '#a9a9a9'
  })

  const response = await fetch(levelFileUrl)
  const data = await response.json()

  for (const levelKey of Object.keys(data)) {
    let levelDataPairs = ''
    for (const [key, value] of Object.entries(data[levelKey].level_info)) {
      levelDataPairs += `${key}=${value}\n`
    }

    let levelDataLawfulPairs = ''
    let levelDataNeutralPairs = ''
    let levelDataChaoticPairs = ''
    if (data[levelKey].titles?.lawful) {
      levelDataLawfulPairs += `system.details.title.value=${data[levelKey].titles.lawful}\n`
    }
    if (data[levelKey].titles?.neutral) {
      levelDataNeutralPairs += `system.details.title.value=${data[levelKey].titles.neutral}\n`
    }
    if (data[levelKey].titles?.chaotic) {
      levelDataChaoticPairs += `system.details.title.value=${data[levelKey].titles.chaotic}\n`
    }

    await DCCItem.create({
      img: 'modules/dcc-core-book/assets/svg/game-icons-net/up-card.svg',
      'system.levelData': levelDataPairs,
      'system.levelDataLawful': levelDataLawfulPairs,
      'system.levelDataNeutral': levelDataNeutralPairs,
      'system.levelDataChaotic': levelDataChaoticPairs,
      'system.level': levelKey,
      'system.class': className,
      name: `${className}-${levelKey}`,
      type: 'level',
      folder: folder.id
    })
  }
}

export async function createAllClassItems () {
  await createClassItems('assassin')
  await createClassItems('dervish')
  await createClassItems('luchador')
  await createClassItems('sword-monger')
}
