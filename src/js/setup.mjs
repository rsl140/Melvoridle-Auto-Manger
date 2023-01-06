// Modules
// You can import script modules and have full type completion
import Dialog from './Dialog/index.mjs';
import BankItems from './BankItems/index.mjs';
import XCombat from './Combat/index.mjs';
import XButton from './Button/index.mjs';

// Data
// Game data for registration
import ModData from '../data/data.json';

// Styles
// Will automatically load your styles upon loading the mod
import '../css/styles.css';

// Images
// To bundle your mod's icon
import '../img/M.png';
// Reference images using `ctx.getResourceUrl`
import LargeIcon from '../img/M_large.png';
import LargeSidebarIcon from '../img/icon_large.png';

/**
 * @param {ModContext} ctx
 */
export async function setup (ctx) {
  await ctx.gameData.addPackage(ModData);
  // ctx.onModsLoaded(() => {
  //   console.warn('Hello From My Mod!');
  // });

  ctx.onInterfaceReady(async () => {
    const dialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-cheat',
      modalTitle: 'Game Cheat',
      modalContent: `<div id="x-table-Items"></div>`
    })
    ui.create(dialog, document.getElementById('page-container'));
    ui.create(BankItems({ select: 'select', ctx }), document.getElementById('x-table-Items'));

    const combatDialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-combat',
      modalTitle: 'Game Cheat',
      modalContent: `<div id="x-combat-dialog"></div>`
    })
    ui.create(combatDialog, document.getElementById('page-container'));
    ui.create(XCombat({ select: 'select', ctx, dialog: combatDialog }), document.getElementById('x-combat-dialog'));
    // ui.create(XButton({ ctx, dialog: combatDialog }), document.getElementById('combat-slayer-task-menu'));
    ui.create(XButton({ ctx, dialog: combatDialog }), $('#combat-slayer-task-menu').children()[0]);
    sidebar.category('X Auto Manger', { toggleable: true, after: 'Modding' }).item('Game Cheat', {
      icon: ctx.getResourceUrl(LargeSidebarIcon),
      onClick () {
        dialog.open();
      }
    });
  });
}
