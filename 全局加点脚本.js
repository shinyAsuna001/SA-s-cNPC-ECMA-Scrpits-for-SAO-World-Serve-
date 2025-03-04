
// =====================================
// |               配置区               |
// =====================================
// 等级系数，例如1敏捷对影响各项数据的加成：原速度变成 (1 + W * 属性值) 倍
var W = 0.1
// 加减点音效
var SE1 = "customnpcs:songs.decision3"
// 确定音效
var SE2 = "customnpcs:songs.powerup"
// 打开面板音效
var SE3 = "customnpcs:songs.cancel2"
// 错误音效
var SE4 = "customnpcs:songs.buzzer1"
// 基值
var MS = 0.1  // 移动速度 minecraft:generic.movement_speed
var AS = 4.0  // 主手攻速 minecraft:generic.attack_speed
var OS = 4.0  // 副手攻速 epicfight:offhand_attack_speed
var AD = 1.0  // 主手攻击伤害 minecraft:generic.attack_damage
var OD = 1.0  // 副手攻击伤害 epicfight:offhand_attack_damage
var MH = 20.0 // 最大生命值  minecraft:generic.max_health
var A = 0  // 防御 minecraft:generic.armor
var S = 15.0  // 体力 epicfight:staminar
var WE = 20.0  // 重量 epicfight:weight
var SA = 0.0  // 晕抗 epicfight:stun_armor

function keyPressed(c){
   var player= c.player
   if(c.key==73 && c.isCtrlPressed==true && c.isShiftPressed==true){
    var player = c.player
    var storeddata = player.storeddata
    var maxLevel = parseInt(storeddata.get("maxLevel"))
    var agile = parseInt(storeddata.get("agile"))
    var strength = parseInt(storeddata.get("strength"))
    var health = parseInt(storeddata.get("health"))
    var defence = parseInt(storeddata.get("defence"))
    var stamina = parseInt(storeddata.get("stamina"))
    var l = maxLevel - (agile + strength + health + defence + stamina)
    var gui = c.API.createCustomGui(1, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/book.png", 410, 150, 256, 180, 0, 0)
    var offset = 9
    gui.addLabel(3, "§f" + l.toString(), 435, 152 + offset, 29, 29, 16755200)
    gui.addLabel(24, "§f剩余点数", 426, 143 + offset, 29, 29, 16755200)
    var offset = 65
    gui.addLabel(4, "§8力量：" + (strength).toString(), 450, 130 + offset, 100, 100, 16755200)
    gui.addLabel(5, "§8防御：" + (defence).toString(), 450, 150 + offset, 100, 100, 16755200)
    gui.addLabel(6, "§8生命：" + (health).toString(), 450, 170 + offset, 100, 100, 16755200)
    gui.addLabel(7, "§8敏捷：" + (agile).toString(), 450, 190 + offset, 100, 100, 16755200)
    gui.addLabel(8, "§8耐力：" + (stamina).toString(), 450, 210 + offset, 100, 100, 16755200)
    gui.addLabel(23, "等级：" + (maxLevel).toString(), 450, 250 + offset, 100, 100, 16755200)
    var offset_x = 50
    var offset_y = 20
    gui.addButton(10, "+", 490 + offset_x, 175 + offset_y, 8, 8)
    gui.addButton(11, "-", 500 + offset_x, 175 + offset_y, 8, 8)
    gui.addButton(12, "+", 490 + offset_x, 195 + offset_y, 8, 8)
    gui.addButton(13, "-", 500 + offset_x, 195 + offset_y, 8, 8)
    gui.addButton(14, "+", 490 + offset_x, 215 + offset_y, 8, 8)
    gui.addButton(15, "-", 500 + offset_x, 215 + offset_y, 8, 8)
    gui.addButton(16, "+", 490 + offset_x, 235 + offset_y, 8, 8)
    gui.addButton(17, "-", 500 + offset_x, 235 + offset_y, 8, 8)
    gui.addButton(18, "+", 490 + offset_x, 255 + offset_y, 8, 8)
    gui.addButton(19, "-", 500 + offset_x, 255 + offset_y, 8, 8)
    gui.addButton(22, "确定", 500, 295, 50, 20)
    var attack = gui.addTexturedRect(2, "minecraft:textures/gui/advancements/widgets.png", 425, 145, 29, 29, 25, 125)
    attack.setHoverText("可分配点数")
    c.player.showCustomGui(gui)
    c.player.playSound(SE3, 1, 1)
    var testlabel=gui.getComponent(3).getText()
   }
}
function customGuiButton(c){
    var gui = c.gui
    var player = c.player
    var storeddata = player.storeddata
    var maxLevel = parseInt(storeddata.get("maxLevel"))
    var agile = parseInt(storeddata.get("agile"))
    var strength = parseInt(storeddata.get("strength"))
    var health = parseInt(storeddata.get("health"))
    var defence = parseInt(storeddata.get("defence"))
    var stamina = parseInt(storeddata.get("stamina"))

        var tl = parseInt(gui.getComponent(3).getText().split("f")[1])

        if(c.buttonId == 10){
            if(tl > 0){
                var tl = tl - 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(4)
                var f= label.getText().split("：")[0]
                var strength = label.getText().split("：")[1]
                var strength = parseInt(strength) + 1
                label.setText(f + "：" + strength.toString())
                gui.updateComponent(label)
    
                gui.update(player)
                player.playSound(SE1, 1, 1)
            }
            else{
                player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 11){
            var label = gui.getComponent(4)
            var tstrength = label.getText().split("：")[1]
            tstrength = parseInt(tstrength)
            if (tstrength != strength){
                tl = tl + 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
                var label = gui.getComponent(4)
                var f= label.getText().split("：")[0]
                var strength= label.getText().split("：")[1]
                var strength = parseInt(strength) - 1
                label.setText(f + "：" + strength.toString())
                gui.updateComponent(label)
    
                gui.update(player)
                player.playSound(SE1, 1, 1)
            }
            else{
                player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 12){
            if (tl > 0){
                var tl = tl - 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(5)
                var f = label.getText().split("：")[0]
                var defence = label.getText().split("：")[1]
                var defence = parseInt(defence) + 1
                label.setText(f + "：" + defence.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 13){
            var label = gui.getComponent(5)
            var tdefence = label.getText().split("：")[1]
            var tdefence = parseInt(tdefence)
            if (tdefence != defence){
                var tl = tl + 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(5)
                var f = label.getText().split("：")[0]
                var defence = label.getText().split("：")[1]
                var defence = parseInt(defence) - 1
                label.setText(f + "：" + defence.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 14){
            if (tl > 0){
                var tl = tl - 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(6)
                var f = label.getText().split("：")[0]
                var health= label.getText().split("：")[1]
                var health = parseInt(health) + 1
                label.setText(f + "：" + health.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 15){
            var label = gui.getComponent(6)
            var thealth = label.getText().split("：")[1]
            var thealth = parseInt(thealth)
            if (thealth != health){
                var tl = tl + 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(6)
                var f = label.getText().split("：")[0]
                var health = label.getText().split("：")[1]
                var health = parseInt(health) - 1
                label.setText(f + "：" + health.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 16){
            if (tl > 0){
                var tl = tl - 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(7)
                var f = label.getText().split("：")[0]
                var agile= label.getText().split("：")[1]
                var agile = parseInt(agile) + 1
                label.setText(f + "：" + agile.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 17){
            var label = gui.getComponent(7)
            var tagile = label.getText().split("：")[1]
            var tagile = parseInt(tagile)
            if (tagile != agile){
                var tl = tl + 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(7)
                var f= label.getText().split("：")[0]
                var agile = label.getText().split("：")[1]
                var agile = parseInt(agile) - 1
                label.setText(f + "：" + agile.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 18){
            if (tl > 0){
                var tl = tl - 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
    
                var label = gui.getComponent(8)
                var f= label.getText().split("：")[0]
                var stamina = label.getText().split("：")[1]
                stamina = parseInt(stamina) + 1
                label.setText(f + "：" + stamina.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 19){
            var label = gui.getComponent(8)
            var tstamina = label.getText().split("：")[1]
            var tstamina = parseInt(tstamina)
            if (tstamina != stamina){
                var tl = tl + 1
                var label = gui.getComponent(3)
                label.setText("§f"+tl.toString())
                gui.updateComponent(label)
                
                var label = gui.getComponent(8)
                var f= label.getText().split("：")[0]
                var stamina= label.getText().split("：")[1]
                var stamina = parseInt(stamina) - 1
                label.setText(f + "：" + stamina.toString())
                gui.updateComponent(label)
    
                gui.update(c.player)
                c.player.playSound(SE1, 1, 1)
            }
            else{
                c.player.playSound(SE4, 1, 1)
            }
        }
        if (c.buttonId == 22){
            var strength = parseInt(gui.getComponent(4).getText().split("：")[1])
            var defence = parseInt(gui.getComponent(5).getText().split("：")[1])
            var health = parseInt(gui.getComponent(6).getText().split("：")[1])
            var agile = parseInt(gui.getComponent(7).getText().split("：")[1])
            var stamina = parseInt(gui.getComponent(8).getText().split("：")[1])
    
            var API = c.API
            
            format(API, player, "minecraft:generic.movement_speed", MS * (1 + agile * W * 0.07))
            format(API, player, "minecraft:generic.attack_speed", AS * (1 + agile * W * 0.02 ))
            format(API, player, "epicfight:offhand_attack_speed", OS * (1 + agile * W * 0.02 ))
            format(API, player, "minecraft:generic.attack_damage", AD * (1 + strength * W *2))
            format(API, player, "epicfight:offhand_attack_damage", OD * (1 + strength * W *2))
            format(API, player, "minecraft:generic.max_health", MH * (1 + health * W))
            format(API, player, "minecraft:generic.armor_toughness", A + (0 + defence * W * 2 ))
            format(API, player, "epicfight:staminar", S + (stamina * W * 5))
            format(API, player, "epicfight:stun_armor", SA + (Math.round(stamina * W * 5)) + defence * W)
            storeddata.put("strength", strength)
            storeddata.put("defence", defence)
            storeddata.put("health", health)
            storeddata.put("agile", agile)
            storeddata.put("stamina", stamina)
            c.player.playSound(SE2, 1, 1)
            c.player.closeGui()
        }
}
function format(API, player, a, f){
    API.executeCommand(player.world, "/attribute " + player.name + " " + a + " base set " + f.toString())
  }