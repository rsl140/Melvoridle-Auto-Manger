const gameItems = new Map()
game.items.allObjects.forEach(val => {
  if (gameItems.has(val.category)) {
    gameItems.get(val.category).push(val)
  } else {
    if (val.category) {
      gameItems.set(val.category, [val])
    }
  }
})
const gameItemsObj = [...gameItems.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {})
const skills = []
game.skills.forEach((val) => {
  skills.push({
    id: val.localID,
    name: val.name,
    media: val.media
  })
})

export default function BankItems (props) {
  return {
    $template: '#x-bank-items',
    lang: props.lang,
    ctx: props.ctx,
    skills,
    skillSelect: null,
    masterSkillSelect: null,
    listMap: gameItemsObj,
    select: props.select,
    selectObj: {},
    addItemShow: true,
    gp: '',
    slayerCoins: '',
    prayerPoints: '',
    raidCoins: '',
    xp: '',
    masterXp: '',
    speed: '',
    handleClick (key, val) {
      this.selectObj[key] = val
    },
    handleAdd (key) {
      const num = $(`#${key}-input`).val();
      if (!this.selectObj[key] || !num) {
        fireBottomToast('add error');
      } else {
        game.bank.addItemByID(this.selectObj[key].id, +num, true, true, false);
        this.selectObj[key] = null;
        $(`#${key}-input`).val('');
        fireBottomToast('success');
      }
    },
    hideAddItem (val) {
      this.addItemShow = val;
    },
    handleAddGp () {
      if (this.gp) {
        game.gp.add(+this.gp);
        this.gp = '';
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    handleAddSlayerCoins () {
      if (this.slayerCoins) {
        game.slayerCoins.add(+this.slayerCoins);
        this.slayerCoins = '';
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    handleAddPrayerPoints () {
      if (this.prayerPoints) {
        game.combat.player.addPrayerPoints(+this.prayerPoints);
        this.prayerPoints = '';
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    handleAddRaidCoins () {
      if (this.raidCoins) {
        game.raidCoins.add(+this.raidCoins);
        this.raidCoins = '';
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    handleSkillClick (val) {
      this.skillSelect = val;
    },
    handleAddSkillClick () {
      if (this.xp && this.skillSelect) {
        game[this.skillSelect.id.toLowerCase()].addXP(+this.xp);
        this.xp = '';
        this.skillSelect = null;
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    handleMasterSkillClick (val, index) {
      if (+index < 7) {
        return
      }
      this.masterSkillSelect = val;
    },
    handleAddMasterPollClick () {
      if (this.masterXp && this.masterSkillSelect) {
        game[this.masterSkillSelect.id.toLowerCase()].addMasteryPoolXP(+this.masterXp);
        this.masterXp = '';
        this.masterSkillSelect = null;
        fireBottomToast('success');
      } else {
        fireBottomToast('add error');
      }
    },
    setSpeed () {
      if (this.speed && this.speed > 0) {
        this.ctx.patch(Skill, 'addXP').replace((o, amount, masteryAction) => {
          return o(amount * this.speed, masteryAction);
        });
        this.speed = '';
        fireBottomToast('success');
      }
    }
  };
}