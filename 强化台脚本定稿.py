
#----------------------------------[SAO-World Serve自定义强化台脚本]------------------------------------------
#作者:shiny_Asuna

#未经允许请勿转载使用，发现必究
#仅供服务器：SAO-World Serve使用

# =====================
# |       配置区      |
# =====================

# 强化台自身数值决定变量
SuccessRate=50 #强化成功率
min_ATK_level=0.1 #强化ATK的最低添加值
max_ATK_level=2 #强化ATK的最高添加值
min_ANG_level=1 #强化ANG的最低添加值
max_ANG_level=5 #强化ANG的最高添加值
min_END_level=1 #强化END的最低添加值
max_END_level=2 #强化END的最高添加值
basecost=10 #该强化台单次强化最基本的扣费col数（花费会随着强化次数升高而升高）
prio_quality=[0,1] #强化台可以强化的品质列表
#品质对应优先级：{"初始":0,"粗糙":1,"常见":2,"普通":3,"优秀":4,"稀有":5,"精良":6,"史诗":7,"传说":8,"神话":9,"稀世":10,"特殊":-1,"活动":-2,"遗物":-3,"专属":-4}
# 强化台声音、材质、发光
SE1 = "customnpcs:songs.decision3"
SE2 = "customnpcs:songs.powerup"
SE3 = "customnpcs:songs.cancel2"
SE4 = "customnpcs:songs.buzzer1"
NE = "minecraft:ui.stonecutter.take_result"
NAME="minecraft:anvil"
LIGHT=0


# --------脚本主体---------
qualities={u"初始":0,u"粗糙":1,u"常见":2,u"普通":3,u"优秀":4,u"稀有":5,u"精良":6,u"史诗":7,u"传说":8,u"神话":9,u"稀世":10,u"特殊":-1,u"活动":-2,u"遗物":-3,u"专属":-4}
ATK='ATK'
ANG='ANG'
END='END'
is_lored=False
from encodings import utf_8
import random
numbers=["0","1","2","3","4","5","6","7","8","9","."]

def init(c):
    block = c.block
    block.setModel(NAME)
    block.setLight(LIGHT)
    
def interact(c):
    player = c.player
    item=player.getMainhandItem()
    nbt=str(item.getNbt())
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    global is_lored
    is_lored=False
    if len(item.getDisplayName())>=3:
        if item.getDisplayName()[0:2] in qualities:
            weapon_quality=qualities[item.getDisplayName()[0:2]]
            if weapon_quality not in prio_quality:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §e该强化台无法强化该品质武器")
                return False
        else:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c该物品不支持强化")
            return False
    else:
        player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c§n物品名称字符串序列错误")
        return False
    if item.getNbt().has('newitem') and item.isEmpty()==False:
        lore=str(item.getLore())
        ilore=item.getLore()
        colnum=col.getValue()
        new_lore=item.getLore()
        count_lore=new_lore[0]
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
            for i in range(343,len(count_lore)):
                if count_lore[i:i+5]=='green':
                    up_counti=i+15
                elif count_lore[i:i+3]=='red':
                    max_counti=i+13
                elif count_lore[i]=='/':
                    up_count=count_lore[up_counti:i-115]
                    up_count=int(up_count)
                elif count_lore[i]==']':
                    max_count=count_lore[max_counti:i-115]
                    max_count=int(max_count)
                    break
        cost=basecost+(int(float(up_count)/float(max_count) * 100))
        global ATK
        ATK=searchlore("ATK",ilore[6],player)
        global ANG
        ANG=searchlore("ANG",ilore[7],player)
        global END
        END=searchlore("END",ilore[8],player)
        gui = c.API.createCustomGui(1, 1000, 500, False)
        gui.addTexturedRect(1, "minecraft:textures/gui/upgrade_ui2.png", 350, 170, 256, 180, 0, 0)
        gui.addLabel(2, u"§8" + u"强化台", 360, 180 + 9 +11, 29, 29, 16755200)
        gui.addLabel(3, u"§8攻击方向", 470, 130 + 65+22, 100, 100, 16755200)
        gui.addButton(4, u"强化", 490 + 30, 175 + 15 +22, 50, 20).setHoverText(u"§7追加：§a"+str(min_ATK_level)+u"§7—§a"+str(max_ATK_level))
        gui.addLabel(5, u"§8穿透方向", 470, 150 + 65+22, 100, 100, 16755200)
        gui.addButton(6, u"强化", 490 + 30, 195 + 15+22, 50, 20).setHoverText(u"§7追加：§a"+str(min_ANG_level)+u"§7—§a"+str(max_ANG_level))
        gui.addLabel(7, u"§8耐久方向", 470, 170 + 65+22, 100, 100, 16755200)
        gui.addButton(8, u"强化", 490 + 30, 215 + 15+22, 50, 20).setHoverText(u"§7追加：§a"+str(min_END_level)+u"§7—§a"+str(max_END_level))
        gui.addLabel(9, u"§8存款:"+str(colnum), 380, 235+22, 29, 29, 16755200)
        gui.addLabel(10, u"§8强化花费:"+str(cost), 380, 245+22 , 29, 29, 16755200)
        gui.addLabel(11, u"§8强化成功率:"+str(SuccessRate)+"%", 380, 255+22, 29, 29, 16755200)
        gui.addLabel(12, u"§8剩余可强化次数："+str(max_count-up_count), 380, 265+22, 29, 29, 16755200)
        gui.addItemSlot(-17,40+22,item)
        c.player.showCustomGui(gui)
    else:
        player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] 该手持物品不支持强化")
        return False
    

def customGuiButton(c):
    gui = c.gui
    API = c.API
    player = c.player
    item=player.getMainhandItem()
    ilore=item.getLore()
    global ATK
    ATK=searchlore("ATK",ilore[6],player)
    global ANG
    ANG=searchlore("ANG",ilore[7],player)
    global END
    END=searchlore("END",ilore[8],player)
    if c.buttonId == 4:
        randomnum=0
        randomnum=random.randint(0,100)
        new_lore=item.getLore()
        count_lore=new_lore[0]
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
            for i in range(343,len(count_lore)):
                if count_lore[i:i+5]=='green':
                    up_counti=i+15
                elif count_lore[i:i+3]=='red':
                    max_counti=i+13
                elif count_lore[i]=='/':
                    up_count=count_lore[up_counti:i-115]
                    up_count=int(up_count)
                elif count_lore[i]==']':
                    max_count=count_lore[max_counti:i-115]
                    max_count=int(max_count)
                    break
        if up_count>=max_count:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c该武器强化已到上限")
            player.closeGui()
            return False
        else:
            cost=basecost+(int(float(up_count)/float(max_count) * 100))
            Scoreboard=player.getWorld().getScoreboard()
            col=Scoreboard.getObjective("col").getScore(player.getName())
            colnum=col.getValue()
            if colnum >= cost:
                col.setValue(colnum-cost)
                new_lore[0]=u"§6强化次数§7:[§a"+str(up_count+1)+u"§7/§c"+str(max_count)+u"§7]"
                label = gui.getComponent(9)
                label.setText(u"§8存款:"+str(colnum-cost))
                label2 = gui.getComponent(10)
                label2.setText(u"§8强化花费:"+str(basecost+(int(float(up_count+1)/float(max_count) * 100))))
                label3 = gui.getComponent(12)
                label3.setText(u"§8剩余可强化次数："+str(max_count-up_count-1))
                gui.update(player)
            else:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] 存款不足"+str(cost)+u"col,不可进行强化")
                player.playSound(NE, 1, 1)
                return False
        if randomnum <= SuccessRate:
            randomlevel=round(random.uniform(min_ATK_level,max_ATK_level),1)
            new_ATK=ATK+float(randomlevel)
            new_lore[6]=u"§7⩺§l ATK :§c "+str(new_ATK)
            if not(is_lored):
                new_lore.append(u"§f=============§7[§6强化信息§7]§f=============")
            new_lore.append(u"§7[§a+§7] ATK -> §a+"+str(randomlevel))
            item.setLore(new_lore)
            item.setAttribute("minecraft:generic.attack_damage",new_ATK-1,0)
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §7强化成功！属性提升"+str(randomlevel))
            gui.update(player)
            player.playSound(SE1, 1, 1)
        else:
            item.setLore(new_lore)
            player.closeGui()
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c强化失败！")
            player.playSound(SE4, 1, 1)
            
    if c.buttonId == 6:
        randomnum=0
        randomnum=random.randint(0,100)
        new_lore=item.getLore()
        count_lore=new_lore[0]
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
            for i in range(343,len(count_lore)):
                if count_lore[i:i+5]=='green':
                    up_counti=i+15
                elif count_lore[i:i+3]=='red':
                    max_counti=i+13
                elif count_lore[i]=='/':
                    up_count=count_lore[up_counti:i-115]
                    up_count=int(up_count)
                elif count_lore[i]==']':
                    max_count=count_lore[max_counti:i-115]
                    max_count=int(max_count)
                    break
        if up_count>=max_count:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c该武器强化已到上限")
            player.closeGui()
            return False
        else:
            cost=basecost+(int(float(up_count)/float(max_count) * 100))
            Scoreboard=player.getWorld().getScoreboard()
            col=Scoreboard.getObjective("col").getScore(player.getName())
            colnum=col.getValue()
            if colnum >= cost:
                col.setValue(colnum-cost)
                new_lore[0]=u"§6强化次数§7:[§a"+str(up_count+1)+u"§7/§c"+str(max_count)+u"§7]"
                label = gui.getComponent(9)
                label.setText(u"§8存款:"+str(colnum-cost))
                label2 = gui.getComponent(10)
                label2.setText(u"§8强化花费:"+str(basecost+(int(float(up_count+1)/float(max_count) * 100))))
                label3 = gui.getComponent(12)
                label3.setText(u"§8剩余可强化次数："+str(max_count-up_count-1))
                gui.update(player)
            else:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] 存款不足"+str(cost)+u"col,不可进行强化")
                player.playSound(NE, 1, 1)
                return False
        if randomnum <= SuccessRate:
            randomlevel=round(random.uniform(min_ANG_level,max_ANG_level),2)
            new_ANG=ANG+float(randomlevel)
            new_lore[7]=u"§7⩺§l ANG :§3 "+str(new_ANG)
            if not(is_lored):
                new_lore.append(u"§f=============§7[§6强化信息§7]§f=============")
            new_lore.append(u"§7[§a+§7] ANG -> §a+"+str(randomlevel))
            item.setLore(new_lore)
            item.setAttribute("epicfight:armor_negation",new_ANG,0)
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §7强化成功！属性提升"+str(randomlevel))
            player.playSound(SE1, 1, 1)
        else:
            item.setLore(new_lore)
            player.closeGui()
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c强化失败！")
            player.playSound(SE4, 1, 1)
            
    if c.buttonId == 8:
        randomnum=0
        randomnum=random.randint(0,100)
        new_lore=item.getLore()
        count_lore=new_lore[0]
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
            for i in range(343,len(count_lore)):
                if count_lore[i:i+5]=='green':
                    up_counti=i+15
                elif count_lore[i:i+3]=='red':
                    max_counti=i+13
                elif count_lore[i]=='/':
                    up_count=count_lore[up_counti:i-115]
                    up_count=int(up_count)
                elif count_lore[i]==']':
                    max_count=count_lore[max_counti:i-115]
                    max_count=int(max_count)
                    break
        if up_count>=max_count:
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c该武器强化已到上限")
            player.closeGui()
            return False
        else:
            cost=basecost+(int(float(up_count)/float(max_count) * 100))
            Scoreboard=player.getWorld().getScoreboard()
            col=Scoreboard.getObjective("col").getScore(player.getName())
            colnum=col.getValue()
            if colnum >= cost:
                col.setValue(colnum-cost)
                new_lore[0]=u"§6强化次数§7:[§a"+str(up_count+1)+u"§7/§c"+str(max_count)+u"§7]"
                label = gui.getComponent(9)
                label.setText(u"§8存款:"+str(colnum-cost))
                label2 = gui.getComponent(10)
                label2.setText(u"§8强化花费:"+str(basecost+(int(float(up_count+1)/float(max_count) * 100))))
                label3 = gui.getComponent(12)
                label3.setText(u"§8剩余可强化次数："+str(max_count-up_count-1))
                gui.update(player)
            else:
                player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] 存款不足"+str(cost)+u"col,不可进行强化")
                player.playSound(NE, 1, 1)
                return False
        if randomnum <= SuccessRate:
            randomlevel=random.randint(min_END_level,max_END_level)
            new_END=int(END)+randomlevel
            new_lore[8]=u"§7⩺§l END :§e "+str(new_END)
            if not(is_lored):
                new_lore.append(u"§f=============§7[§6强化信息§7]§f=============")
            new_lore.append(u"§7[§a+§7] END -> §a+"+str(randomlevel))
            item.setLore(new_lore)
            item.addEnchantment("minecraft:unbreaking",new_END)
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §7强化成功！属性提升"+str(randomlevel))
            gui.update(player)
            player.playSound(SE1, 1, 1)
        else:
            item.setLore(new_lore)
            player.closeGui()
            player.message(u"§7[§6SAO-World§7]§8[§a+§8]§7[§3强化系统§7] §c强化失败！")
            player.playSound(SE4, 1, 1)
    
def searchfornum(ATK,lore,player):    
    for i in range(0,len(lore)):
        if lore[i:i+3] == ATK:
            ATK=lore[i:i+300]
            break
    for v in range(0,300):
        if ATK[v:v+4] == 'text':
            ATK=ATK[v+8:v+15]
            break
    atk=''
    for j in range(0,6):
        if str(ATK[j]) in numbers:
            atk += ATK[j]
    if atk[len(atk)-1] not in numbers:
        atk=atk[:len(ATK)-1]
    atk=float(atk)
    return atk

def searchlore(c,lore,player):
    if u"§" not in lore:            #强化前的用法
        lore_num=lore[350:-14]
        atk=lore_num[-1]
        for i in range(2,100):
            if lore_num[-i] in numbers:
                atk = lore_num[-i]+atk
            else:
                break
        lore_num=float(atk)
        return lore_num
    else:                           #强化后的用法
        lore_num=lore[0:-2]
        atk=lore_num[-1]
        for i in range(2,100):
            if lore_num[-i] in numbers:
                atk = lore_num[-i]+atk
            else:
                break
        lore_num=float(atk)
        global is_lored
        is_lored=True
        return lore_num
def customGuiSlotClicked(c):
    c.setCanceled(1)
