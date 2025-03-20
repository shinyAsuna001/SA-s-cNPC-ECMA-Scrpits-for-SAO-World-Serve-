#自定义主手武器创建器

#----------------------------------[SAO-World Serve自定义主手武器创建器脚本`]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# 使用说明：用脚本魔杖打开此脚本方块，修改配置区的变量，随后在创造模式物品栏里面拿出想要的武器，比如一把木剑
# 然后用该物品右键点击这个脚本方块就可以创建了

# =====================
# |       配置区      |
# =====================

item_name=u'§8§l粗糙§f-青铜大剑' #武器名称，格式：分类-名称,不要改动§字符和u字符，需要改颜色就改§后面的那一个字母或者数字
wepontype=u"单手斧" #武器类型，填写"直剑""长剑""长枪""大剑""太刀""短剑""单手斧""居合刀""细剑"中的一个
attack_damage=12.0 #武器攻击伤害，填一位小数
attack_speed=0.85 #武器攻速，填两位小数
armor_negation=0 #武器穿甲率
endurance=0 #武器耐久增益，填整数
max_upgrade=2 #升级次数限制
impact=1 #武器冲击
line1=u'§f'+u'朴素坚实的青铜制大剑' #第一行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line2=u'§f'+u'沉稳 虽不起眼但耐用' #第二行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line3=u'§f'+u'简约实用 拥有高额伤害' #第三行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
levelneed=25 #武器等级需求

# --------脚本主体（不用修改）---------
def interact(c):
    player=c.player
    item=player.getMainhandItem()
    if item.getNbt().has('newitem')==False and item.isEmpty()==False:
        item.setCustomName(item_name)
        lore=["","","","","","","","","","","",""]
        lore[0]=u"§6强化次数§7:[§a0§7/§c"+str(max_upgrade)+u"§7]"
        lore[1]=u"§f=============§7[§6物品描述§7]§f============="
        lore[2]=line1
        lore[3]=line2
        lore[4]=line3
        lore[5]=u"§f=============§7[§6物品属性§7]§f============="
        lore[6]=u"§7⩺§l ATK §7:§c "+str(attack_damage)
        lore[7]=u"§7⩺§l ANG §7:§3 "+str(armor_negation)
        lore[8]=u"§7⩺§l END §7:§e "+str(endurance)
        lore[9]=u"§7⩺§l SPD §7:§d "+str(attack_speed)
        lore[10]=u"§f=============§7[§6使用要求§7]§f============="
        lore[11]=u"§e等级需求:"+str(levelneed)
        item.setLore(lore)
        item.setAttribute("minecraft:generic.attack_damage",attack_damage-1,0)
        item.setAttribute("minecraft:generic.attack_speed",attack_speed-4,0)
        if endurance!=0:
            item.addEnchantment("minecraft:unbreaking",endurance)
        item.getNbt().putString("newitem","true")
        item.getNbt().setInteger("HideFlags",127)
        item.getNbt().setInteger("levelneed",levelneed)
        if impact!=1:
            item.setAttribute("epicfight:impact",impact,0)
        if armor_negation!=0:
            item.setAttribute("epicfight:armor_negation",armor_negation,0)
        if wepontype==u"直剑":
            item.getNbt().putString("sword","true")
        if wepontype==u"长剑":
            item.getNbt().putString("longsword","true")
        if wepontype==u"长枪":
            item.getNbt().putString("spear","true")
        if wepontype==u"大剑":
            item.getNbt().putString("greatsword","true")
        if wepontype==u"短剑":
            item.getNbt().putString("dagger","true")
        if wepontype==u"太刀":
            item.getNbt().putString("tachi","true")
        if wepontype==u"细剑":
            item.getNbt().putString("swordthorn","true")
        if wepontype==u"居合刀":
            item.getNbt().putString("katana","true")
        if wepontype==u"单手斧":
            item.getNbt().putString("axe","true")
        player.message(u"自定义主手武器创建成功，记得不要用这个武器再次点击脚本方块！")
    elif item.getNbt().has('newitem')==True and item.isEmpty()==False:
        player.message(u"该物品已经是自定义武器了，请使用未修改的武器点击此脚本方块！")
        return False
    elif item.isEmpty()==True:
        player.message(u"请使用未修改过，直接从创造模式背包中取出的武器点击脚本方块！")
    else:
        player.message(u"自定义主手武器创建器出现未知错误，请询问服主")