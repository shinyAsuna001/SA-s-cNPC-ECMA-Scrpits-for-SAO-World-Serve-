#----------------------------------[SAO-World Serve自定义修复台脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# =====================
# |       配置区      |
# =====================
NAME="minecraft:anvil"                      #方块模型
LIGHT=0                                     #光照等级
NE = "minecraft:ui.stonecutter.take_result" #存款不足提示音
SE = "minecraft:block.anvil.use"            #维修提示音
min_repair=10                                #最小维修值
max_repair=40                               #最大维修值
basecost=10                                 #基础花销
costP=1.3                                   #破损影响花销（花销计算公式：花销=basecost+破损值*costP）
costP_armor=0.4                             #破损影响防具花销
prio_quality=[0]                          #强化台可以强化的品质列表
#品质对应优先级：{"初始":0,"粗糙":1,"常见":2,"普通":3,"优秀":4,"稀有":5,"精良":6,"史诗":7,"传说":8,"神话":9,"稀世":10,"特殊":-1,"活动":-2,"遗物":-3,"专属":-4}


# --------脚本主体---------
#引用
import random
#全局变量
qualities={u"初始":0,u"粗糙":1,u"常见":2,u"普通":3,u"优秀":4,u"稀有":5,u"精良":6,u"史诗":7,u"传说":8,u"神话":9,u"稀世":10,u"特殊":-1,u"活动":-2,u"遗物":-3,u"专属":-4}
#a,8,7,2,b,5,d,g,e,c,6
#函数体
def init(c):
    block = c.block
    block.setModel(NAME)
    block.setLight(LIGHT)

def interact(c):
    player = c.player
    item=player.getMainhandItem()
    nbt=item.getNbt()
    damaged=nbt.getInteger("Damage")
    IsArmor=False
    if item.getNbt().has('IsArmor')==True:
        IsArmor=True
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=col.getValue()
    if len(item.getDisplayName())>=3:
        if item.getDisplayName()[0:2] in qualities:
            weapon_quality=qualities[item.getDisplayName()[0:2]]
            if weapon_quality not in prio_quality:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3修复系统§7] §e该修复台等级不足以修复该物品")
                return False
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3修复系统§7] §c该物品不支持修复")
            return False
    else:
        player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3修复系统§7] §c§n物品名称字符串序列错误")
        return False
    max_rep=max_repair
    min_rep=min_repair
    cost=int(basecost+damaged*costP)
    if IsArmor:
        cost=int(basecost+damaged*costP_armor)
    if int(max_rep)>damaged:
        max_rep=damaged
    if min_rep>damaged:
        min_rep=damaged
    if max_rep<min_rep:
        max_rep=min_rep
    gui = c.API.createCustomGui(1, 1000, 500, False)
    gui.addTexturedRect(1, "minecraft:textures/gui/upgrade_ui.png", 350, 170, 256, 180, 0, 0)
    gui.addItemSlot(-15,40,item)
    gui.addLabel(2, u"§8" + u"修复台", 360, 180 + 9, 29, 29, 16755200)
    gui.addLabel(3, u"§8" + u"破损值:"+str(damaged),480, 205 , 29, 29, 16755200)
    gui.addLabel(4, u"§8" + u"修复花费:"+str(cost),480, 215 , 29, 29, 16755200)
    gui.addLabel(5, u"§8" + u"预计修复值："+str(min_rep)+u"-"+str(max_rep),480, 225 , 29, 29, 16755200)
    gui.addButton(6, u"修复", 360 + 30, 225 + 15, 30, 20)
    gui.addLabel(7, u"§8存款:"+str(colnum), 480, 235 , 29, 29, 16755200)
    player.showCustomGui(gui)

def customGuiButton(c):
    gui = c.gui
    API = c.API
    player = c.player
    item=player.getMainhandItem()
    nbt=item.getNbt()
    damaged=nbt.getInteger("Damage")
    max_rep=max_repair
    min_rep=min_repair
    cost=int(basecost+damaged*costP)
    IsArmor=False
    if item.getNbt().has('IsArmor')==True:
        IsArmor=True
    if IsArmor:
        cost=int(basecost+damaged*costP_armor)
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=col.getValue()
    if int(max_rep)>damaged:
        max_rep=damaged
    if min_rep>damaged:
        min_rep=damaged
    if max_rep<min_rep:
        max_rep=min_rep
    if c.buttonId == 6:
        if colnum-cost>=0:
            col.setValue(colnum-cost)
            colnum=col.getValue()
            random_repair=random.randint(min_rep,max_rep)
            new_repair=damaged-random_repair
            if max_rep<0:
                max_rep=0
            nbt.setInteger("Damage",new_repair)
            damaged=nbt.getInteger("Damage")
            if int(max_rep)>damaged:
                max_rep=damaged
            if min_rep>damaged:
                min_rep=damaged
            if max_rep<min_rep:
                max_rep=min_rep
            label = gui.getComponent(3)
            label.setText(u"§8" + u"破损值:"+str(damaged))
            cost=int(basecost+damaged*costP)
            label2 = gui.getComponent(4)
            label2.setText(u"§8" + u"修复花费:"+str(int(cost)))
            label3 = gui.getComponent(5)
            label3.setText(u"§8" + u"预计修复值："+str(min_rep)+u"-"+str(max_rep))
            label4 = gui.getComponent(7)
            label4.setText(u"§8存款:"+str(colnum))
            gui.update(player)
            player.playSound(SE,1,1)
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3修复系统§7] 存款不足"+str(cost)+u"col,不可修复")
            player.playSound(NE, 1, 1)
            player.closeGui()
            return False
def customGuiSlotClicked(c):
    c.setCanceled(1)
        
        