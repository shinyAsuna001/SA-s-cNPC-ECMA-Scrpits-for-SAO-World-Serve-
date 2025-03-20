#自定义材料创建器

#----------------------------------[SAO-World Serve自定义材料创建器脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# 使用说明：用脚本魔杖打开此脚本方块，修改配置区的变量，随后在创造模式物品栏里面拿出想要的武器，比如一把木剑
# 然后用该物品右键点击这个脚本方块就可以创建了

# =====================
# |       配置区      |
# =====================

item_name=u'§e狗头人鳞甲' #武器名称，格式：分类-名称,不要改动§字符和u字符，需要改颜色就改§后面的那一个字母或者数字
rarity=3 #稀有度，填整数
CustomModelData=0 #材质参数
line1=u'§f精英狗头人掉落素材' #第一行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line2=u'§f拥有卓越的硬度和强度' #第二行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line3=u'§f可以用来打造特殊的物品' #第三行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠

# --------脚本主体（不用修改）---------
def interact(c):
    player=c.player
    item=player.getMainhandItem()
    if item.getNbt().has('newitem')==False and item.isEmpty()==False:
        item.setCustomName(item_name)
        lore=["","","","","",""]
        lore[0]=u"§f=============§7[§6物品描述§7]§f============="
        lore[1]=line1
        lore[2]=line2
        lore[3]=line3
        lore[4]=u"§f=============§7[§6物品属性§7]§f============="
        lore[5]=u"§7⩺§l 稀有度："+u"§e"+rarity*u"★"
        item.getNbt().setInteger("HideFlags",127)
        item.getNbt().setInteger("CustomModelData",CustomModelData)
        item.setLore(lore)
        player.message(u"自定义材料创建成功，记得不要用这个材料再次点击脚本方块！")
    elif item.isEmpty()==True:
        player.message(u"请使用未修改过，直接从创造模式背包中取出的材料点击脚本方块！")
    else:
        player.message(u"自定义材料创建器出现未知错误，请询问服主")