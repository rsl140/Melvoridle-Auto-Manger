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
    renderTask (monster, tier, killsLeft) {
      if (game.combat.slayerTask.monster.name !== this.combatCheckItems[0]) {
        game.combat.slayerTask.monster = monster;
        game.combat.slayerTask.tier = tier;
        game.combat.slayerTask.killsLeft = killsLeft;
        game.combat.slayerTask.renderTask();
      }
    },
    start () {
      if (this.modeType === 'one') {
        if (this.combatCheckItems.length > 0) {
          const targetMonsterId = game.monsters.getObjectByID(this.combatAreaObj[this.combatCheckItems[0]].id)
          game.combat.selectMonster(targetMonsterId, game.getMonsterArea(targetMonsterId))
          this.renderTask(targetMonsterId, 0 , 100);

          if (this.isFirst) {
            this.ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
              this.renderTask(targetMonsterId, 0 , 100);
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