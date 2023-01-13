export function drop (ctx) {
  ctx.patch(CombatManager, 'getMonsterDropsHTML').replace(function (o, monster, respectArea) {
    let drops = ''
    if (monster.lootChance > 0 && monster.lootTable.size > 0 && !(respectArea && this.areaType === CombatAreaType.Dungeon)) {
      drops = monster.lootTable.sortedDropsArray.map((drop) => {
        let dropText = templateLangString('BANK_STRING', '40', {
          qty: `${drop.maxQuantity}`,
          itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
          itemName: drop.item.name
        })
        dropText += ` (${((monster.lootChance * drop.weight) / monster.lootTable.weight).toFixed(2)}%)
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
        `
        return dropText
      }
      ).join('<br>')
    }
    let bones = ''
    if (monster.bones !== undefined && !(respectArea && this.selectedArea instanceof Dungeon && !this.selectedArea.dropBones)) {
      bones = `${getLangString('MISC_STRING', '7')}<br><small><img class="skill-icon-xs mr-2" src="${monster.bones.item.media}">${monster.bones.item.name}</small><br><br>`
    } else {
      bones = getLangString('COMBAT_MISC', '107') + '<br><br>'
    }
    let html = `<span class="text-dark">${bones}<br>`
    if (drops !== '') {
      html += `${getLangString('MISC_STRING', '8')}<br><small>${getLangString('MISC_STRING', '9')}</small><br>${drops}`
    }
    html += '</span>'
    return html
  });

  // items
  function viewItemContents(item) {
    const dropsOrdered = item.dropTable.sortedDropsArray;
    const drops = dropsOrdered.map((drop) => {
      let dropText = templateString(getLangString('BANK_STRING', '40'), {
        qty: `${numberWithCommas(drop.maxQuantity)}`,
        itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
        itemName: drop.item.name,
      });
      dropText += ` (${((100 * drop.weight) / item.dropTable.totalWeight).toFixed(2)}%)
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
      return dropText
    }
    ).join('<br>');
    SwalLocale.fire({
      title: item.name,
      html: getLangString('BANK_STRING', '39') + '<br><small>' + drops,
      imageUrl: item.media,
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: item.name,
    });
  }
  window.viewItemContents = viewItemContents
}