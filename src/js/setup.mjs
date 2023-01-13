// Modules
// You can import script modules and have full type completion
import Dialog from './Dialog/index.mjs'
import BankItems from './BankItems/index.mjs'
import XCombat from './Combat/index.mjs'
import * as XButtons from './Button/index.mjs'
import * as Drop from './Drop/index.mjs'

// js
import lang from '../lang/index.js'

// Data
// Game data for registration
// import ModData from '../data/data.json'

// Styles
// Will automatically load your styles upon loading the mod
import '../css/styles.css'

// Images
// To bundle your mod's icon
import '../img/M.png'
// Reference images using `ctx.getResourceUrl`
// import LargeIcon from '../img/M_large.png';
import LargeSidebarIcon from '../img/icon_large.png'

/**
 * @param {ModContext} ctx
 */
export async function setup (ctx) {
  // await ctx.gameData.addPackage(ModData)
  // ctx.onModsLoaded(() => {
  //   console.warn('Hello From My Mod!');
  // });

  ctx.onModsLoaded(async (ctx) => {
    Drop.dropPetHtml(ctx);
  });

  ctx.onInterfaceReady(async () => {
    // setting lang
    let currentLang = lang[setLang]
    if (!currentLang) {
      currentLang = lang['en']
    }

    // cheat
    const dialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-cheat',
      modalTitle: currentLang.cheating.name,
      modalContent: `<div id="x-table-Items"></div>`
    })
    ui.create(dialog, document.getElementById('page-container'))
    ui.create(
      BankItems({ select: 'select', ctx, lang: currentLang }),
      document.getElementById('x-table-Items')
    )
    // inster cheat button into sidebar
    sidebar
      .category('X Auto Manger', { toggleable: true, after: 'Modding' })
      .item(currentLang.cheating.name, {
        icon: ctx.getResourceUrl(LargeSidebarIcon),
        onClick () {
          dialog.open()
        }
      })

    // combat
    const combatDialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-combat',
      modalTitle: currentLang.button.slayerSetting,
      modalContent: `<div id="x-combat-dialog"></div>`
    })
    ui.create(combatDialog, document.getElementById('page-container'))
    ui.create(
      XCombat({
        select: 'select',
        ctx,
        dialog: combatDialog,
        lang: currentLang
      }),
      document.getElementById('x-combat-dialog')
    )
    ui.create(
      XButtons.xSlayerButton({ ctx, dialog: combatDialog, lang: currentLang }),
      $('#combat-slayer-task-menu').children()[0]
    )

    // Drop
    Drop.drop(ctx)
    // pet
    Drop.dropPetInterfaceHtml()

    // Auto Buttons
    XButtons.xAutoLootButton(ctx, currentLang)
    XButtons.xAttackStyles(ctx, currentLang)

  })
}
