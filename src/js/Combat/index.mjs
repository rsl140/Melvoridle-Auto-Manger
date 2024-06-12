const { arr: combatAreaArr, obj: combatAreaObj } = getMonsters(game.combatAreas);
const { arr: slayerAreaArr, obj: slayerAreaObj } = getMonsters(game.slayerAreas);
// const dungeonAreaArr = getMonsters(game.dungeonDisplayOrder);

function getMonsters (list) {
  const arr = [];
  const obj = {};
  list.forEach(e => {
    if (e.monsters.length > 0) {
      e.monsters.forEach(ele => {
        arr.push({
          key: ele.id,
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
    isDisableSetting: false,
    combatShow: true,
    slayerShow: true,
    // dungeonAreaArr,
    slayerAreaArr,
    combatAreaArr,
    combatAreaObj,
    slayerAreaObj,
    checkItem: null,
    combatCheckItems: [],
    slayerCheckItems: [],
    isFirst: true,
    slayerTaskType: SlayerTask.data,
    slayerTaskTypeSelect: 0,
    handleCombatClick (item) {
      const hasIndex = this.combatCheckItems.indexOf(item.name);
      if (hasIndex > -1) {
        this.combatCheckItems.splice(hasIndex, 1);
      } else {
        if (this.modeType === 'one' && (this.combatCheckItems.length > 0 || this.slayerCheckItems.length > 0)) {
          return
        }
        if (this.modeType === 'one') {
          this.checkItem = item
        } else {
          this.checkItem = null
        }
        this.combatCheckItems.push(item.name);
      }
    },
    mounted () {
      $('#x-slayer-btn-click').click(() => {
        if ($('#modal-x-combat').css('display') !== 'none') {
          this.isDisableSetting = true
        }
      });
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
        if (this.modeType === 'one') {
          this.checkItem = item
        } else {
          this.checkItem = null
        }
        this.slayerCheckItems.push(item.name);
      }
    },
    handleSlayerTaskType (index) {
      this.slayerTaskTypeSelect = index
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
    renderTask (monster, tier, killsLeft) {
      if (game.combat.slayerTask && game.combat.slayerTask.monster) {
        if (game.combat.slayerTask.monster.name !== this.checkItem.name) {
          game.combat.slayerTask.monster = monster;
          game.combat.slayerTask.tier = tier;
          game.combat.slayerTask.killsLeft = killsLeft;
          game.combat.slayerTask.renderTask();
        }
      } else {
        // 没有任务时，直接赋值
        game.combat.slayerTask.clickNewTask()
        game.combat.slayerTask.selectTask(tier, true, true, true)
        combatMenus.slayerTask.closeTaskSelection()
        game.combat.slayerTask.monster = monster;
        game.combat.slayerTask.tier = tier;
        game.combat.slayerTask.killsLeft = killsLeft;
        combatMenus.slayerTask.setTaskMonster(monster, killsLeft, tier)
        game.combat.slayerTask.renderTask();
      }
    },
    skipMonster () {
      const areaData = game.getMonsterArea(game.combat.slayerTask.monster)
      const slayerMonsterName = game.combat.slayerTask.monster.name || ''

      // Is equip the items
      let slayerLevelReq = 0;
      if (areaData instanceof SlayerArea) {
        slayerLevelReq = areaData.slayerLevelRequired;
      }
      const canCombat = game.checkRequirements(areaData.entryRequirements, false, slayerLevelReq)

      if (!canCombat || this.combatCheckItems.indexOf(slayerMonsterName) > -1 || this.slayerCheckItems.indexOf(slayerMonsterName) > -1) {
        const tier = this.slayerTaskTypeSelect;
        game.combat.slayerTask.selectTask(tier, false, false);
      } else {
        game.combat.slayerTask.jumpToTaskOnClick()
      }
    },
    start () {
      if (!this.modeType) {
        notifyPlayer(game.attack, this.lang.tips.noSelect1, 'danger');
        return
      }

      if (this.isFirst) {
        this.ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
          if (!this.isDisableSetting && this.modeType === 'one') {
            const targetMonsterId = game.monsters.getObjectByID(this.checkItem.key)
            this.renderTask(targetMonsterId, 0, 100);
          }
        });

        this.ctx.patch(SlayerTask, 'setTask').after(() => {
          if (!this.isDisableSetting && this.modeType === 'skip') {
            this.skipMonster();
          }
        });
        this.isFirst = false
      };

      if (this.modeType === 'skip') {
        // SlayerTask.data
        setTimeout(() => {
          this.skipMonster();
        }, 0);
      } else if (this.modeType === 'one') {
        if (this.combatCheckItems.length > 0 || this.slayerCheckItems.length > 0) {
          const targetMonsterId = game.monsters.getObjectByID(this.checkItem.key)
          game.combat.selectMonster(targetMonsterId, game.getMonsterArea(targetMonsterId))
          setTimeout(() => {
            this.renderTask(targetMonsterId, 0, 100);
          }, 0);
        } else {
          notifyPlayer(game.attack, this.lang.tips.noSelect2, 'danger');
          return
        }
      }
      this.isDisableSetting = false;
      this.dialog.close();
    }
  };
}