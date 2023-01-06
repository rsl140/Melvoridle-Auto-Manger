const { arr: combatAreaArr, obj: combatAreaObj } = getMonsters(game.combatAreaDisplayOrder);
const { arr: slayerAreaArr, obj: slayerAreaObj } = getMonsters(game.slayerAreaDisplayOrder);
// const dungeonAreaArr = getMonsters(game.dungeonDisplayOrder);

function getMonsters (list) {
  const arr = [];
  const obj = {};
  list.forEach(e => {
    if (e.monsters.length > 0) {
      e.monsters.forEach(ele => {
        arr.push({
          id: ele.localID,
          name: ele.name,
          media: ele.media
        })
        obj[ele.name] = ele;
      })
    }
  });
  return { arr, obj };
}

export default function XCombat (props) {
  return {
    $template: '#x-combat',
    lang: props.lang,
    ctx: props.ctx,
    dialog: props.dialog,
    modeType: 'one',
    combatShow: true,
    slayerShow: true,
    // dungeonAreaArr,
    slayerAreaArr,
    combatAreaArr,
    combatAreaObj,
    slayerAreaObj,
    combatCheckItems: [],
    slayerCheckItems: [],
    isFirst: true,
    lootAllBtn () {
      const div = document.createElement('div')
      div.className = 'block-content pt-0 pb-3'
      div.innerHTML = `
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="x-auto-loot" checked>
          <label class="custom-control-label" for="x-auto-loot">${this.lang.combat.autoLootAll}</label>
        </div>
      `
      $('#combat-loot').prepend(div);
    },
    handleCombatClick (item) {
      const hasIndex = this.combatCheckItems.indexOf(item.name);
      if (hasIndex > -1) {
        this.combatCheckItems.splice(hasIndex, 1);
      } else {
        if (this.modeType === 'one' && (this.combatCheckItems.length > 0 || this.slayerCheckItems.length > 0)) {
          return
        }
        this.combatCheckItems.push(item.name);
      }
    },
    modeSelect (type) {
      this.modeType = type;
      this.combatCheckItems = [];
      this.slayerCheckItems = [];
    },
    combatOption (type) {
      switch (type) {
        case 'all':
          this.combatCheckItems = Object.keys(combatAreaObj);
          break;
        case 'reverse':
          const arr = []
          combatAreaArr.forEach(ele => {
            if (this.combatCheckItems.indexOf(ele.name) === -1) {
              arr.push(ele.name);
            }
          })
          this.combatCheckItems = arr;
          break;
        case 'cancel':
          this.combatCheckItems = [];
          break;
      }
    },
    handleSlayerClick (item) {
      const hasIndex = this.slayerCheckItems.indexOf(item.name);
      if (hasIndex > -1) {
        this.slayerCheckItems.splice(hasIndex, 1);
      } else {
        if (this.modeType === 'one' && (this.combatCheckItems.length > 0 || this.slayerCheckItems.length > 0)) {
          return
        }
        this.slayerCheckItems.push(item.name);
      }
    },
    slayerOption (type) {
      switch (type) {
        case 'all':
          this.slayerCheckItems = Object.keys(slayerAreaObj);
          break;
        case 'reverse':
          const arr = []
          slayerAreaArr.forEach(ele => {
            if (this.slayerCheckItems.indexOf(ele.name) === -1) {
              arr.push(ele.name);
            }
          })
          this.slayerCheckItems = arr;
          break;
        case 'cancel':
          this.slayerCheckItems = [];
          break;
      }
    },
    renderTask (monster) {
      game.combat.slayerTask.monster = monster;
      game.combat.slayerTask.tier = 0;
      game.combat.slayerTask.killsLeft = 100;
      game.combat.slayerTask.renderTask();
    },
    getAttackStyles () {
      const obj = {};
      game.attackStyles.forEach(e => {
        obj[e.localID] = e;
      });
      return obj;
    },
    start () {
      if ($('#x-auto-loot').length === 0) {
        this.lootAllBtn();
      }
      if (this.modeType === 'one') {
        if (this.combatCheckItems.length > 0) {
          game.combat.selectMonster(game.monsters.getObjectByID(this.combatAreaObj[this.combatCheckItems[0]].id), game.getMonsterArea(game.monsters.getObjectByID(this.combatAreaObj[this.combatCheckItems[0]].id)))
          if (game.combat.slayerTask.monster.name !== this.combatCheckItems[0]) {
            // combatMenus.slayerTask.setTaskMonster(game.monsters.getObjectByID('melvorD:Plant'), 100, 0);
            // combatMenus.slayerTask.updateTaskExtension(false, 100);
            // game.combat.slayerTask.renderRequired = false;
            this.renderTask(game.monsters.getObjectByID(this.combatAreaObj[this.combatCheckItems[0]].id));
          }

          if (this.isFirst) {
            this.ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
              if (game.combat.slayerTask.monster.name !== this.combatCheckItems[0]) {
                this.renderTask(game.monsters.getObjectByID(this.combatAreaObj[this.combatCheckItems[0]].id));
              }

              const skillName = this.getAttackStyles();
              const obj = { 0: 'Stab', 1: 'Slash', 2: 'Block' };
              const skillLvArr = [game.attack.level, game.strength.level, game.defence.level];
              const min = Math.min(...skillLvArr);
              const index = skillLvArr.indexOf(min);
              game.combat.player.setAttackStyle(skillName[obj[index]].attackType, skillName[obj[index]]);

              const autoLootAll = $('#x-auto-loot')[0].checked;
              if (autoLootAll) {
                const drops = game.combat.loot.drops;
                const count = drops.length;
                if (count > 0) {
                  game.combat.loot.lootAll();
                }
              }
            });
            this.isFirst = false
          };

          this.dialog.close()
        } else {
          fireBottomToast('no combat item select!');
        }
      }
    }
  };
}