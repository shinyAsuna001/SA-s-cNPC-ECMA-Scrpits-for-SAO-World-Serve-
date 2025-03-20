
#----------------------------------[SAO-World Serve自定义重铸台脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# =====================
# |       配置区      |
# =====================
SE1 = "customnpcs:songs.decision3"
SE2 = "customnpcs:songs.powerup"
SE3 = "customnpcs:songs.cancel2"
SE4 = "customnpcs:songs.buzzer1"
NE = "minecraft:ui.stonecutter.take_result"
NAME="minecraft:anvil"
LIGHT=0
SUCCESS="minecraft:item.bottle.empty"
CLEAR="minecraft:entity.turtle.egg_break"
BREAK="minecraft:item.shield.break"
prio_quality=[0,1] #强化台可以强化的品质列表
#品质对应优先级：{"初始":0,"粗糙":1,"常见":2,"普通":3,"优秀":4,"稀有":5,"精良":6,"史诗":7,"传说":8,"神话":9,"稀世":10,"特殊":-1,"活动":-2,"遗物":-3,"专属":-4}
cost=30
success_rate=20
clear_all_rate=30
destroy_rate=50
DEF=0
MHP=0
END=0



# --------脚本主体---------
#引用
import random
#全局变量
#a,8,7,2,b,5,d,g,e,c,6
qualities={u"初始":0,u"粗糙":1,u"常见":2,u"普通":3,u"优秀":4,u"稀有":5,u"精良":6,u"史诗":7,u"传说":8,u"神话":9,u"稀世":10,u"特殊":-1,u"活动":-2,u"遗物":-3,u"专属":-4}
numbers=["0","1","2","3","4","5","6","7","8","9","."]
target_lore_num=0
cycle=0
Info=[]
typeint=5
typeToInt={"helmet":5,"chestplate":4,"leggings":3,"boots":2}
#函数体
def init(c):
    block = c.block
    block.setModel(NAME)
    block.setLight(LIGHT)

def interact(c):
    player = c.player
    item=player.getMainhandItem()
    nbt=item.getNbt()
    lore=item.getLore()
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=col.getValue()
    global cycle
    cycle=readUpCount(lore)
    global Info
    Info=[]
    for i in range(cycle):
        global Info
        Info.append(readUpInfo(lore[-i-1]))
    global target_lore_num
    target_lore_num=0
    if item.getNbt().has('IsArmor')==False or item.isEmpty()==True:
        player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] 该手持物品不支持重铸")
        return False
    if len(item.getDisplayName())>=3:
        if item.getDisplayName()[0:2] in qualities:
            weapon_quality=qualities[item.getDisplayName()[0:2]]
            if weapon_quality not in prio_quality:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §e该重铸台无法操作该物品")
                return False
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §c该物品不支持重铸")
            return False
    else:
        player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §c§n物品名称字符串序列错误")
        return False
    global typeint
    typeint=typeToInt[item.getNbt().getString("armortype")]
    gui = c.API.createCustomGui(1, 1000, 500, False)
    gui.addTexturedRect(1, "minecraft:textures/gui/upgrade_ui2.png", 350, 170, 256, 180, 0, 0)
    gui.addItemSlot(-17,40+22,item)
    gui.addLabel(2, u"§8" + u"重铸台", 360, 180 + 9+11, 29, 29, 16755200)
    gui.addLabel(3, u"§8" + u"§n请选择需要重铸的词条",470, 195+22, 29, 29, 16755200)
    gui.addLabel(4, u"§8" + u"重铸花费:--",380, 245+22 , 29, 29, 16755200)
    gui.addLabel(5, u"§8" + u"成功概率:--",380, 255+22 , 29, 29, 16755200)
    gui.addLabel(6, u"§8" + u"清空所有强化概率:--",380, 265+22 , 29, 29, 16755200)
    gui.addLabel(7, u"§8" + u"防具损毁概率:--",380, 275+22 , 29, 29, 16755200)
    gui.addLabel(8, u"§8" + u"存款:"+str(colnum),380, 235+22 , 29, 29, 16755200)
    gui.addButton(9, u"重铸", 520 + 30, 175 + 15+22, 30, 20)
    for n in range(cycle):
        gui.addLabel(n*2+10, u"§8" + Info[cycle-n-1][0] + u": +" + str(Info[cycle-n-1][1]), 470, 215+22+n*10, 100, 100, 16755200)
        gui.addButton(n*2+11, u"选择", 490 + 30, 212+22+n*10, 50, 10).setTexture("minecraft:textures/misc/enchanted_item_glint.png")
    c.player.showCustomGui(gui)
    
    
    
    
def readUpInfo(lore):                           
    attribute=lore[24:27]
    num=float(lore[34:-2])
    return [attribute,num]
def readUpCount(lore):
    n=0
    for i in range(1,len(lore)+1):
        if lore[-i][0:23]==u"{\"translate\":\"§7[§a+§7]":
            n+=1
        elif lore[-i]==u"{\"translate\":\"§f=============§7[§6强化信息§7]§f=============\"}":
            break
    return n
def searchlore(c,lore,player):
    if u"§" not in lore:            #强化前的用法
        lore_num=lore[350:-14]
        DEF=lore_num[-1]
        for i in range(2,100):
            if lore_num[-i] in numbers:
                DEF = lore_num[-i]+DEF
            else:
                break
        lore_num=float(DEF)
        return lore_num
    else:                           #强化后的用法
        lore_num=lore[0:-2]
        DEF=lore_num[-1]
        for i in range(2,100):
            if lore_num[-i] in numbers:
                DEF = lore_num[-i]+DEF
            else:
                break
        lore_num=float(DEF)
        global is_lored
        is_lored=True
        return lore_num

def customGuiButton(c):
    gui = c.gui
    API = c.API
    player = c.player
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=col.getValue()
    item=player.getMainhandItem()
    lore=item.getLore()
    n=c.buttonId
    global DEF
    DEF=searchlore("DEF",lore[6],player)
    global MHP
    MHP=searchlore("MHP",lore[9],player)
    global END
    END=int(searchlore("END",lore[8],player))
    if c.buttonId > 9:
        global target_lore_num
        target_lore_num=-(cycle-(c.buttonId-11)/2)
        text=u"§a" + Info[cycle-(n-10)/2-1][0] + u": +" + str(Info[cycle-(n-10)/2-1][1])
        gui.getComponent(9).setHoverText([u"预期的目标：",u"重铸词条-> "+text])
        gui.getComponent(4).setText(u"§8" + u"重铸花费: "+str(cost))
        gui.getComponent(5).setText(u"§8" + u"成功概率: "+str(success_rate))
        gui.getComponent(6).setText(u"§8" + u"清空所有强化概率: "+str(clear_all_rate))
        gui.getComponent(7).setText(u"§8" + u"防具损毁概率: "+str(destroy_rate))
        gui.update(player)
    if c.buttonId == 9:
        count_lore=lore[0]
        if  u"§" in count_lore:    
            for i in range(len(count_lore)):
                if count_lore[i:i+2]==u'§a':
                    up_counti=i+2
                elif count_lore[i:i+2]==u'§c':
                    max_counti=i+2
                elif count_lore[i]=='/':
                    up_count=count_lore[up_counti:i-2]
                    up_count=int(up_count)
                elif count_lore[i]==']':
                    max_count=count_lore[max_counti:i-2]
                    max_count=int(max_count)
                    break
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §c##意外的序列错误，请汇报管理员")
            return False
        if target_lore_num==0:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] 请选择目标修正属性")
            player.closeGui()
            return False
        if colnum >= cost:
            col.setValue(colnum-cost)
            gui.getComponent(4).setText(u"§8" + u"重铸花费:--")
            gui.getComponent(5).setText(u"§8" + u"成功概率:--")
            gui.getComponent(6).setText(u"§8" + u"清空所有强化概率:--")
            gui.getComponent(7).setText(u"§8" + u"防具损毁概率:--")
            random_product=random.randint(0,100)
            if random_product < success_rate:
                lore[0]=u"§6强化次数§7:[§a"+str(up_count-1)+u"§7/§c"+str(max_count)+u"§7]"
                if readUpInfo(lore[target_lore_num])[0]==u'DEF':
                    global DEF
                    DEF=DEF-readUpInfo(lore[target_lore_num])[1]
                    lore[6]=u"§7⩺§l DEF :§c "+str(DEF)
                    item.setAttribute("minecraft:generic.armor",DEF,typeint)
                elif readUpInfo(lore[target_lore_num])[0]==u'MHP':
                    global MHP
                    MHP=MHP-readUpInfo(lore[target_lore_num])[1]
                    lore[7]=u"§7⩺§l MHP :§d "+str(MHP)
                    item.setAttribute("minecraft:generic.max_health",MHP,typeint)
                elif readUpInfo(lore[target_lore_num])[0]==u'END':
                    global END
                    END=int(END-readUpInfo(lore[target_lore_num])[1])
                    lore[8]=u"§7⩺§l END :§e "+str(END)
                    item.addEnchantment("minecraft:unbreaking",END)
                del lore[target_lore_num]
                item.setLore(lore)
                lore=item.getLore()
                global cycle
                cycle=readUpCount(lore)
                global Info
                Info=[]
                for i in range(cycle):
                    global Info
                    Info.append(readUpInfo(lore[-i-1]))
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] 成功重铸目标属性！")
                player.playSound(SUCCESS, 1, 1)
            elif random_product >= success_rate and random_product < success_rate+clear_all_rate:
                lore[0]=u"§6强化次数§7:[§a0§7/§c"+str(max_count)+u"§7]"
                for i in range(cycle):
                    if readUpInfo(lore[-i-1])[0]==u'DEF':
                        global DEF
                        DEF=DEF-readUpInfo(lore[-i-1])[1]
                        lore[6]=u"§7⩺§l DEF :§c "+str(DEF)
                    elif readUpInfo(lore[-i-1])[0]==u'MHP':
                        global MHP
                        MHP=MHP-readUpInfo(lore[-i-1])[1]
                        lore[7]=u"§7⩺§l MHP :§3 "+str(MHP)
                    elif readUpInfo(lore[-i-1])[0]==u'END':
                        global END
                        END=int(END-readUpInfo(lore[-i-1])[1])
                        lore[8]=u"§7⩺§l END :§e "+str(END)
                item.setAttribute("minecraft:generic.attack_damage",DEF-1,0)
                item.setAttribute("epicfight:armor_negation",MHP,0)
                item.addEnchantment("minecraft:unbreaking",END)
                del lore[-cycle:]
                item.setLore(lore)
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §6所有强化词条已清空")
                player.playSound(CLEAR, 1, 1)
            elif random_product >= success_rate+clear_all_rate and random_product < success_rate+clear_all_rate+destroy_rate:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] §c防具在重铸中损坏了")
                API.executeCommand(player.world, "/replaceitem entity {} weapon.mainhand air".format(player.name))
                player.playSound(BREAK, 1, 1)
            
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3重铸系统§7] 存款不足"+str(cost)+u"col,不可重铸")
            player.closeGui()
            player.playSound(NE, 1, 1)
            return False
        player.closeGui()
def customGuiSlotClicked(c):
    c.setCanceled(1)