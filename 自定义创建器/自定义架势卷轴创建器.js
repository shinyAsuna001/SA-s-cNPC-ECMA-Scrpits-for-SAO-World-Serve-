var 架势名称="防守架势"
var 架势nbt="guard"
var 可用武器nbt="tachi"
var 对应普攻模板名称="太刀防守"
var item_name="§f"+架势名称+"架势卷轴" //武器名称，格式：分类-名称,不要改动§字符和u字符，需要改颜色就改§后面的那一个字母或者数字
var rarity=1 //稀有度，填整数
var line1="§f适用武器大类："+"太刀" //第一行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
var line2="§f适合防守的普攻架势" //第二行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
var line3="§f步伐移动较小，攻击范围较大" //第三行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠

function interact(e){
var item=e.player.getMainhandItem()
item.getNbt().putString("posename",架势nbt)
item.getNbt().putString("canapply",可用武器nbt)
item.getNbt().putString("skillname",对应普攻模板名称)
item.setCustomName(item_name)
var stars=""
for(var i=0;i<rarity;i++){
    var stars="★"+stars
}
var lore=["","","","","",""]
lore[0]="§f=============§7[§6物品描述§7]§f============="
lore[1]=line1
lore[2]=line2
lore[3]=line3
lore[4]="§f=============§7[§6物品属性§7]§f============="
lore[5]="§7⩺§l 稀有度："+"§e"+stars
item.getNbt().setInteger("HideFlags",127)
item.setLore(lore)
}