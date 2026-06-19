/**
 * DCC Heavenly Hitman character sheet — parts/tabs/defaults come from the
 * DCC extension-API registries (see `gongfarmers-class-data.js`).
 */

import { DCCSheet } from '../../../../../../../systems/dcc/module/actor-sheets-dcc.js'

/**
 * @extends {DCCSheet}
 */
class ActorSheetHeavenlyHitman extends DCCSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: { height: 640 }
  }

  /** @inheritDoc */
  static CLASS_ID = 'heavenly-hitman'
}

export {
  ActorSheetHeavenlyHitman
}
