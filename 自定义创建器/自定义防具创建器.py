#自定义防具创建器

#----------------------------------[SAO-World Serve自定义防具创建器脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# 使用说明：用脚本魔杖打开此脚本方块，修改配置区的变量，随后在创造模式物品栏里面拿出想要的防具，比如皮革盔甲
# 然后用该物品右键点击这个脚本方块就可以创建了

# =====================
# |       配置区      |
# =====================

item_name=u'§a§l'+u'初始'+u'§f-'+u'丛林狼头盔 §6EX' #防具名称，格式：分类-名称,不要改动§字符和u字符，需要改颜色就改§后面的那一个字母或者数字
slot=5#防具放在哪一格 2:靴子, 3:护腿, 4:胸甲, 5:头盔
armor=2.0 #防具物理防御，填一位小数
healthboost=25 #血量增益，填整数
weight=2.0 #防具重量，填小数
endurance=2 #防具耐久增益，填整数
max_upgrade=5 #升级次数限制
line1=u'§f'+u'防护力不错的铠甲' #第一行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line2=u'§f'+u'主要由丛林狼的骨头和皮革制成' #第二行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line3=u'§f'+u'类型：§e中甲' #第三行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
suit="coyotesuit"
levelneed=15
suiteffect1=u"§72件⨠§d 提升体力上限4点"
suiteffect2=u"§74件⨠§d 继续提升体力上限4点"

# --------脚本主体（不用修改）---------
def interact(c):
    player=c.player
    item=player.getMainhandItem()
    if item.getNbt().has('IsArmor')==False and item.isEmpty()==False:
        item.setCustomName(item_name)
        lore=["","","","","","","","","","","","","","","",""]
        lore[0]=u"§6强化次数§7:[§a0§7/§c"+str(max_upgrade)+u"§7]"
        lore[1]=u"§f=============§7[§6物品描述§7]§f============="
        lore[2]=line1
        lore[3]=line2
        lore[4]=line3
        lore[5]=u"§f=============§7[§6物品属性§7]§f============="
        lore[6]=u"§7⩺§l DEF §7:§c "+str(armor)
        lore[7]=u"§7⩺§l WEI §7:§3 "+str(weight)
        lore[8]=u"§7⩺§l END §7:§e "+str(endurance)
        lore[9]=u"§7⩺§l MHP §7:§d "+str(healthboost)
        lore[10]=u"§f=============§7[§6使用要求§7]§f============="
        lore[11]=u"§e等级需求:"+str(levelneed)
        lore[12]=u"§f=============§7[§6套装效果§7]§f============="
        lore[13]=suiteffect1
        lore[14]=suiteffect2
        item.setLore(lore)
        item.setAttribute("minecraft:generic.armor",armor,slot)
        item.setAttribute("epicfight:weight",weight,slot)
        item.setAttribute("minecraft:generic.max_health",healthboost,slot)
        if endurance!=0:
            item.addEnchantment("minecraft:unbreaking",endurance)
        item.getNbt().putString("IsArmor","true")
        item.getNbt().putString("suit",suit)
        item.getNbt().setInteger("HideFlags",127)
        item.getNbt().setInteger("levelneed",levelneed)
        if slot==2:
            armortype="boots"
        elif slot==3:
            armortype="leggings"
        elif slot==4:
            armortype="chestplate"
        elif slot==5:
            armortype="helmet"
        item.getNbt().putString("armortype",armortype)
        player.message(u"自定义防具创建成功，记得不要用这个武器再次点击脚本方块！")
    elif item.getNbt().has('IsArmor')==True and item.isEmpty()==False:
        player.message(u"该物品已经是自定义防具了，请使用未修改的武器点击此脚本方块！")
        return False
    elif item.isEmpty()==True:
        player.message(u"请使用未修改过，直接从创造模式背包中取出的盔甲点击脚本方块！")
    else:
        player.message(u"自定义防具创建器出现未知错误，请询问服主")