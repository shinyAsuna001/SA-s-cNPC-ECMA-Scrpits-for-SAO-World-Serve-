#自定义食物创建器

#----------------------------------[SAO-World Serve自定义食物创建器脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# 使用说明：用脚本魔杖打开此脚本方块，修改配置区的变量，随后在创造模式物品栏里面拿出想要的武器，比如一把木剑
# 然后用该物品右键点击这个脚本方块就可以创建了

# =====================
# |       配置区      |
# =====================

item_name=u'§f花妖果实' #武器名称，格式：分类-名称,不要改动§字符和u字符，需要改颜色就改§后面的那一个字母或者数字
level= 1#料理等级,填整数（1-6）
baoshidu=1#饱食度，填整数
baohechixu=1#饱和持续，填整数
extra_effect=""#额外效果描述，若无留空
line1=u'§f经过加工的花妖果实' #第一行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line2=u'§f味道很香' #第二行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠
line3=u'§f能够食用' #第三行物品描述，不要删掉u和§f,并且不要使用大括号、反斜杠

# --------脚本主体（不用修改）---------
list1=[u"§fD",u"§aC",u"§bB",u"§dA",u"§eS",u"§cSR"]
level=list1[level-1]
def interact(c):
    player=c.player
    item=player.getMainhandItem()
    if item.getNbt().has('newitem')==False and item.isEmpty()==False:
        item.setCustomName(item_name)
        lore=["","","","","","","","",""]
        lore[0]=u"§f=============§7[§6物品描述§7]§f============="
        lore[1]=line1
        lore[2]=line2
        lore[3]=line3
        lore[4]=u"§f=============§7[§6物品属性§7]§f============="
        lore[5]=u"§7⩺料理等级："+level
        lore[6]=u"§7⩺饱食度：§f"+str(baoshidu)
        lore[7]=u"§7⩺饱和持续：§f"+str(baohechixu)
        if extra_effect!="":
            lore[8]=u"§7⩺额外效果：§f"
        item.getNbt().setInteger("HideFlags",127)
        item.setLore(lore)
        player.message(u"自定义食物创建成功,请使用PlantsandEating插件创建食物")
    elif item.isEmpty()==True:
        player.message(u"请使用未修改过，直接从创造模式背包中取出的材料点击脚本方块！")
    else:
        player.message(u"自定义食物创建器出现未知错误，请询问服主")