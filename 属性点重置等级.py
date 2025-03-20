# =====================
# |       配置区      |
# =====================
# 方块材质名
NAME = "saobyqingchu:shui_jing_qiu"
# 重置音效
SE = "minecraft:ui.toast.challenge_complete"
NE = "minecraft:ui.stonecutter.take_result"
# 重置消息
M = u"洗点成功！"
# 发光值(0-15)
LIGHT = 15
#设置洗点所需金额
need=1000
# 基值
MS = 0.1  # 移动速度 minecraft:generic.movement_speed
AS = 4.0  # 主手攻速 minecraft:generic.attack_speed
OS = 4.0  # 副手攻速 epicfight:offhand_attack_speed
AD = 1.0  # 主手攻击伤害 minecraft:generic.attack_damage
OD = 1.0  # 副手攻击伤害 epicfight:offhand_attack_damage
MH = 20.0 # 最大生命值  minecraft:generic.max_health
A = 0.0  # 防御 minecraft:generic.armor
S = 15.0  # 体力 epicfight:staminar
SA = 0.0  # 晕抗 epicfight:stun_armor

def init(c):
    block = c.block
    block.setLight(LIGHT)
    block.setModel(NAME)

def interact(c):
    player = c.player
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=col.getValue()
    if colnum >= need:
        col.setValue(colnum-need)
    else:
        player.message(u"存款不足"+str(need)+u"col 不可洗点")
        player.playSound(NE, 1, 1)
        return False
    
    player.playSound(SE, 1, 1)
    player.message(M)
    
    strength = 0
    defence = 0
    health = 0
    agile = 0
    stamina = 0
    W = 0

    API = c.API
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "minecraft:generic.movement_speed", 
        MS))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "minecraft:generic.attack_speed", 
        AS))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "epicfight:offhand_attack_speed", 
        OS))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "minecraft:generic.attack_damage", 
        AD))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "epicfight:offhand_attack_damage", 
        OD))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "minecraft:generic.max_health", 
        MH))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "minecraft:generic.armor_toughness", 
        A))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "epicfight:staminar", 
        S))
    API.executeCommand(player.world, "/attribute {} {} base set {}".format(
        player.name, 
        "epicfight:stun_armor", 
        SA))
    storeddata = player.storeddata
    storeddata.put("strength", strength)
    storeddata.put("defence", defence)
    storeddata.put("health", health)
    storeddata.put("agile", agile)
    storeddata.put("stamina", stamina)