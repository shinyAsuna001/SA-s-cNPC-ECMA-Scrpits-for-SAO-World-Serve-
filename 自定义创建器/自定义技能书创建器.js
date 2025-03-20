//自定义物品管理器


var skill_name='长剑速反' //技能名称,不要添加§字符
var rarity=2 //稀有度，填整数
var CustomModelData=0 //材质参数
var line1='§f'+'可学习技能：'+skill_name //第一行物品描述，不要删掉§f,并且不要使用大括号、反斜杠

// --------脚本主体（不用修改）---------
var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE
var item_name='§f'+skill_name+'技能书'
var Item_Name=""
function interact(c){
    var player=c.player
    var item=player.getMainhandItem()
    if (item.isEmpty()==false){
        item.setCustomName(item_name)
        var lore=["","","","","",""]
        lore[0]="§f=============§7[§6物品描述§7]§f============="
        lore[1]=line1
        lore[2]="§f=============§7[§6物品属性§7]§f============="
        lore[3]="§7⩺§l 稀有度："+"§e"+rarity+"★"
        item.getNbt().setInteger("HideFlags",127)
        item.getNbt().setInteger("CustomModelData",CustomModelData)
        item.setLore(lore)
        Item_Name=skill_name+"技能书"
        registerskillbook(c)
        player.message("自定义技能书创建成功")
        }else{
        player.message("请勿空手点击此脚本方块")
        }
}
function registerskillbook(c){
    var 自定义物品管理器=JSPluginManager.getPluginMain("自定义物品管理器")
    var item=c.player.getMainhandItem().getMCItemStack()
    自定义物品管理器.run("saveItem",Item_Name,item)
    var rt=自定义物品管理器.run("getItem",Item_Name)
    c.player.giveItem(c.API.getIItemStack(rt))
    c.player.message("注册成功!")
}