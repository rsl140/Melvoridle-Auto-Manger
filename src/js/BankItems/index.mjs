import tableOfItems from '../../data/tableOfItems.json';
const map = new Map()

tableOfItems.forEach(val => {
  if (map.has(val.category)) {
    map.get(val.category).push(val)
  } else {
    map.set(val.category, [val])
  }
})
const obj = [...map.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {})
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
    skills,
    skillSelect: null,
    list: tableOfItems,
    listMap: obj,
    select: props.select,
    selectObj: {},
    addItemShow: true,
    gp: '',
    slayerCoins: '',
    prayerPoints: '',
    raidCoins: '',
    xp: '',
    handleClick (key, val) {
      this.selectObj[key] = val
    },
    handleAdd (key) {
      const num = $(`#${key}-input`).val();
      if (!this.selectObj[key] || !num) {
        SwalLocale.fire({
          title: 'add error'
        });
      } else {
        game.bank.addItemByID(this.selectObj[key].id, +num, true, true, false);
        this.selectObj[key] = null;
        $(`#${key}-input`).val('');
      }
    },
    hideAddItem (val) {
      this.addItemShow = val;
    },
    handleAddGp () {
      if (this.gp) {
        game.gp.add(+this.gp);
        this.gp = '';
      } else {
        SwalLocale.fire({
          title: 'add error'
        });
      }
    },
    handleAddSlayerCoins () {
      if (this.slayerCoins) {
        game.slayerCoins.add(+this.slayerCoins);
        this.slayerCoins = '';
      } else {
        SwalLocale.fire({
          title: 'add error'
        });
      }
    },
    handleAddPrayerPoints () {
      if (this.prayerPoints) {
        game.combat.player.addPrayerPoints(+this.prayerPoints);
        this.prayerPoints = '';
      } else {
        SwalLocale.fire({
          title: 'add error'
        });
      }
    },
    handleAddRaidCoins () {
      if (this.raidCoins) {
        game.raidCoins.add(+this.raidCoins);
        this.raidCoins = '';
      } else {
        SwalLocale.fire({
          title: 'add error'
        });
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
      } else {
        SwalLocale.fire({
          title: 'add error'
        });
      }
    }
  };
}