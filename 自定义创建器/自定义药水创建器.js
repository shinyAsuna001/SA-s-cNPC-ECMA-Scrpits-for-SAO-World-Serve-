var Potion_name="生命恢复药水"
var 等级=2
var rarity=1 //稀有度，填整数
var line1="§f"+"普通的药剂" //第一行物品描述，不要删掉§f,并且不要使用大括号、反斜杠
var line2="§f"+"由花妖的果实制成" //第二行物品描述，不要删掉§f,并且不要使用大括号、反斜杠
var line3="§f"+"粗制的" //第三行物品描述，不要删掉§f,并且不要使用大括号、反斜杠
var lineeffect=["提供生命恢复2 22秒"]//药水效果描述

function interact(e){
var item=e.player.getMainhandItem()
var item_name="§f"+Potion_name+等级.toString()+"阶"
item.setCustomName(item_name)
var stars=""
for(var i=0;i<rarity;i++){
    var stars="★"+stars
}
var lore=[]
for(var i=0;i<lineeffect.length+6;i++){
    lore.push("")
}
lore[0]="§f=============§7[§6物品描述§7]§f============="
lore[1]=line1
lore[2]=line2
lore[3]=line3
lore[4]="§f=============§7[§6物品属性§7]§f============="
lore[5]="§7⩺§l 稀有度："+"§e"+stars
for(var i=0;i<lineeffect.length;i++){
    lore[6+i]="§7⩺§l 效果："+"§7"+lineeffect[i]
}
item.getNbt().setInteger("HideFlags",127)
item.setLore(lore)
}