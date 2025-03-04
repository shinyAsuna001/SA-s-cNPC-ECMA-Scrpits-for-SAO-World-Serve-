/*
----------------------------------[SAO-World Serve抽卡脚本]------------------------------------------
作者:shiny_Asuna

未经允许请勿转载使用，发现必究
仅供服务器：SAO-World Serve使用
*/

// =====================
// |       配置区      |
// =====================
//奖池信息
var skillboxtitle="绯红色的杀意-第一期剑技奖池"//技能奖池标题
var skillrequiredalcona=20//技能一抽需要多少阿尔克纳宝石
var skinboxtitle="多元的交融-第一期时装奖池"//时装奖池标题
var skinrequiredalcona=20//时装一抽需要多少阿尔克纳宝石
var skill保底=60//技能池保底多少抽
var skin保底=60//时装池保底多少抽
var skill开始时间="2024.8.22"//技能池开始日期
var skill结束时间="2024.9.22"//技能池结束日期
var skin开始时间="2024.8.22"//时装池开始日期
var skin结束时间="2024.9.22"//时装池结束日期
var prefix="§7[§6SAO-World§7]§8[§a+§8]§7[§3抽奖系统§7]"
var skillrewardLocation=[9947,63,9961]//技能池奖品地点
var skinrewardLocation=[9947,63,9959]//时装池奖品地点
//音效
var menu="saoui:message"//打开抽奖界面音效
var menu_top="minecraft:ui.loom.select_pattern"//界面切换音效
var confirmsound="saoui:confirm"
var cancelsound="saoui:dialog_close"
var congratulatesound1="minecraft:entity.player.levelup"//抽卡成功提示音1
var congratulatesound2="minecraft:entity.firework_rocket.twinkle"//抽卡成功提示音2
var UP_sound="minecraft:ui.toast.challenge_complete"//抽卡UP提示音
//具体介绍
var skillbox_Introduction=["当期UP：","剑技：绯扇：","太刀可用，稀有度：§4★★★★","卡池其余物品：","A奖：撼地重击(★★★)，加速圆舞(★★★)","B奖：侵袭狂暴(★★★)，绯红四方(★★★)","并行毒针(★★★)","C奖：垂直V型斩(★★)，快速盾反(★★)，","水平二连击(★★)"]
var skinbox_Introduction=["当期UP：","通用武器时装：阐释者：","支持在时装栏直接安装","卡池其余物品：","A奖：东方琪露诺套装，原神胡桃套装","B奖：阿米娅套装，莫斯提马翅膀基础款","骑士大剑绑定用时装","C奖：暗刀绑定用时装，千鸟刀绑定用时装，","芙兰朵露翅膀基础款"]



//脚本主体
var reward=[]
var resultLevel=[]
var offset=0
var reward_offset_x=4//奖品显示 的 UI偏移x
var reward_offset_y=0//奖品显示 的 UI偏移y
var page//每一个池子的分页，主是main，信息是info，结果是result
var resultLevel
function keyPressed(e){//按键监听
    if (e.key==85 && e.isCtrlPressed==true && e.isShiftPressed==true){
        var player=e.player
        player.playSound(menu, 1, 1)
        player.playSound(menu_top, 5, 2)
        skillMainGUI(e,false)
    }
    
}

function skillMainGUI(e,ifExisist){//技能池主界面
    page="main"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    if(storeddata.get("skillhaslotter")==null){
        storeddata.put("skillhaslotter",0)
    }
    if(storeddata.get("skillguaranteejude")==null){
        storeddata.put("skillguaranteejude",0)
    }
    var skillguaranteejude=parseInt(storeddata.get("skillguaranteejude"))
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(1, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skillbox/main.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skillboxtitle,offset+390, 191, 40, 12)
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§f"+skillrequiredalcona+"阿尔克纳宝石/抽",offset+557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+573 , 218 , 41, 17,"minecraft:textures/gui/randombox/skillbox/once.png")
    gui.addTexturedButton(6, "", offset+573 , 235 , 41, 17,"minecraft:textures/gui/randombox/skillbox/tenth.png")
    gui.addTexturedButton(7, "", offset+580 , 280 , 41, 14,"minecraft:textures/gui/randombox/skillbox/infobutton.png")
    gui.addTexturedButton(8, "", offset+655 , 240 , 18, 17,"minecraft:textures/gui/randombox/skillbox/right_button.png")
    gui.addTexturedButton(9, "", offset+330 , 240 , 18, 17,"minecraft:textures/gui/randombox/skillbox/left_button.png")
    if(ifExisist==false){
        e.player.showCustomGui(gui)
    }else{
        gui.update(player)
    }
}
function skinMainGUI(e,ifExisist){//时装池主界面
    page="main"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    if(storeddata.get("skinhaslotter")==null){
        storeddata.put("skinhaslotter",0)
    }
    if(storeddata.get("skinguaranteejude")==null){
        storeddata.put("skinguaranteejude",0)
    }
    var skinguaranteejude=parseInt(storeddata.get("skinguaranteejude"))
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(2, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skinbox/main.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skinboxtitle,offset+390, 191, 40, 12)
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§f"+skinrequiredalcona+"阿尔克纳宝石/抽",557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+573 , 218 , 41, 17,"minecraft:textures/gui/randombox/skinbox/once.png")
    gui.addTexturedButton(6, "", offset+573 , 235 , 41, 17,"minecraft:textures/gui/randombox/skinbox/tenth.png")
    gui.addTexturedButton(7, "", offset+580 , 280 , 41, 14,"minecraft:textures/gui/randombox/skinbox/infobutton.png")
    gui.addTexturedButton(8, "", offset+655 , 240 , 18, 17,"minecraft:textures/gui/randombox/skillbox/right_button.png")
    gui.addTexturedButton(9, "", offset+330 , 240 , 18, 17,"minecraft:textures/gui/randombox/skillbox/left_button.png")
    if(ifExisist==false){
        e.player.showCustomGui(gui)
    }else{
        gui.update(player)
    }
}
function skillinfo(e){//技能池信息UI
    page="info"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))
    var skillguaranteejude= parseInt(storeddata.get("skillguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(1, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skillbox/info.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§7"+skillboxtitle,offset+390, 191, 40, 12)
    gui.addTexturedButton(3, "", offset+573 , 255 , 41, 17,"minecraft:textures/gui/randombox/skillbox/back.png")
    gui.addLabel(4,"§8"+skillhaslotter,offset+590, 195, 40, 12)
    gui.addLabel(5,"§8"+(skill保底-skillguaranteejude),offset+590, 209, 40, 12)
    gui.addLabel(6,"§8"+skill开始时间,(offset+513)*10/7, 252*10/7, 40, 12).setScale(0.7)
    gui.addLabel(7,"§8"+skill结束时间,(offset+513)*10/7, 262*10/7, 40, 12).setScale(0.7)
    for(var i=0;i<skillbox_Introduction.length;i++){
        gui.addLabel(i+8, "§8"+skillbox_Introduction[i] , offset+390, 205+i*10, 80, 12)
    }
    gui.update(player)
}
function skininfo(e){//时装池信息UI
    page="info"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))
    var skinguaranteejude= parseInt(storeddata.get("skinguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(2, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skinbox/info.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§7"+skinboxtitle,offset+390, 191, 40, 12)
    gui.addTexturedButton(3, "", offset+573 , 255 , 41, 17,"minecraft:textures/gui/randombox/skinbox/back.png")
    gui.addLabel(4,"§8"+skinhaslotter,offset+590, 195, 40, 12)
    gui.addLabel(5,"§8"+(skin保底-skinguaranteejude),offset+590, 209, 40, 12)
    gui.addLabel(6,"§8"+skin开始时间,(offset+513)*10/7, 252*10/7, 40, 12).setScale(0.7)
    gui.addLabel(7,"§8"+skin结束时间,(offset+513)*10/7, 262*10/7, 40, 12).setScale(0.7)
    for(var i=0;i<skinbox_Introduction.length;i++){
        gui.addLabel(i+8, "§8"+skinbox_Introduction[i] , offset+390, 205+i*10, 80, 12)
    }
    gui.update(player)
}

function skillboxonceUI(e){//技能池单抽UI
    page="OnceResult"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))
    var skillguaranteejude= parseInt(storeddata.get("skillguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(1, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skillbox/mainconfirm.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skillboxtitle,offset+390, 191, 40, 12)
    gui.addTexturedButton(3, "", offset+573 , 255 , 41, 17,"minecraft:textures/gui/randombox/skillbox/back.png")
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§7"+skillrequiredalcona+"阿尔克纳宝石/抽",offset+557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+477 , 272 , 41, 17,"minecraft:textures/gui/randombox/skinbox/confirm.png")
    gui.update(player)
    //奖品显示
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+60,reward[0])
    gui.addLabel(6,"§8"+resultLevel[0],reward_offset_x+486, reward_offset_y+245, 40, 12)
    player.showCustomGui(gui)
    if(resultLevel[0]=='S'){
        player.playSound(UP_sound,1,1)
    }
}
function skillboxtenthUI(e){//技能池十连抽提示界面
    page="TenthResult"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))
    var skillguaranteejude= parseInt(storeddata.get("skillguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(1, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skillbox/mainconfirm.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skillboxtitle,offset+390, 191, 40, 12)
    gui.addTexturedButton(3, "", offset+573 , 255 , 41, 17,"minecraft:textures/gui/randombox/skillbox/back.png")
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§7"+skillrequiredalcona+"阿尔克纳宝石/抽",offset+557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+477 , 272 , 41, 17,"minecraft:textures/gui/randombox/skinbox/confirm.png")
    gui.update(player)
    //添加奖品显示
    gui.addItemSlot(reward_offset_x+8,reward_offset_y+45,reward[0])
    gui.addLabel(6,"§8"+resultLevel[0],reward_offset_x+426, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+38,reward_offset_y+45,reward[1])
    gui.addLabel(7,"§8"+resultLevel[1],reward_offset_x+456, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+45,reward[2])
    gui.addLabel(8,"§8"+resultLevel[2],reward_offset_x+486, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+98,reward_offset_y+45,reward[3])
    gui.addLabel(9,"§8"+resultLevel[3],reward_offset_x+516, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+128,reward_offset_y+45,reward[4])
    gui.addLabel(10,"§8"+resultLevel[4],reward_offset_x+546, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+8,reward_offset_y+75,reward[5])
    gui.addLabel(11,"§8"+resultLevel[5],reward_offset_x+426, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+38,reward_offset_y+75,reward[6])
    gui.addLabel(12,"§8"+resultLevel[6],reward_offset_x+456, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+75,reward[7])
    gui.addLabel(13,"§8"+resultLevel[7],reward_offset_x+486, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+98,reward_offset_y+75,reward[8])
    gui.addLabel(14,"§8"+resultLevel[8],reward_offset_x+516, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+128,reward_offset_y+75,reward[9])
    gui.addLabel(15,"§8"+resultLevel[9],reward_offset_x+546, reward_offset_y+260, 40, 12)
    player.showCustomGui(gui)
    for(var i=0;i<10;i++){
        if(resultLevel[i]=='S'){
            player.playSound(UP_sound,1,1)
        }
    }
}

function skinboxonceUI(e){//时装池单抽UI
    page="OnceResult"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))
    var skinguaranteejude= parseInt(storeddata.get("skinguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(2, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skinbox/mainconfirm.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skinboxtitle,offset+390, 191, 40, 12)
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§7"+skinrequiredalcona+"阿尔克纳宝石/抽",offset+557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+477 , 272 , 41, 17,"minecraft:textures/gui/randombox/skinbox/confirm.png")
    gui.update(player)
    //奖品显示
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+60,reward[0])
    gui.addLabel(6,"§8"+resultLevel[0],reward_offset_x+486, reward_offset_y+245, 40, 12)
    player.showCustomGui(gui)
    if(resultLevel[0]=='S'){
        player.playSound(UP_sound,1,1)
    }
}
function skinboxtenthUI(e){//时装池十连抽提示界面
    page="TenthResult"
    var API=e.API
    var player=e.player
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    var storeddata = player.storeddata
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))
    var skinguaranteejude= parseInt(storeddata.get("skinguaranteejude"))
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var gui = e.API.createCustomGui(2, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/randombox/skinbox/mainconfirm.png", offset+370, 180, 256, 180, 0, 0)
    gui.addLabel(2,"§f"+skinboxtitle,offset+390, 191, 40, 12)
    gui.addTexturedButton(3, "", offset+573 , 255 , 41, 17,"minecraft:textures/gui/randombox/skinbox/back.png")
    gui.addLabel(3,"§8"+alconanum,offset+577, 192, 40, 12)
    gui.addLabel(4,"§7"+skinrequiredalcona+"阿尔克纳宝石/抽",offset+557, 295, 40, 12)
    gui.addTexturedButton(5, "", offset+477 , 272 , 41, 17,"minecraft:textures/gui/randombox/skinbox/confirm.png")
    gui.update(player)
    //添加奖品显示
    gui.addItemSlot(reward_offset_x+8,reward_offset_y+45,reward[0])
    gui.addLabel(6,"§8"+resultLevel[0],reward_offset_x+426, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+38,reward_offset_y+45,reward[1])
    gui.addLabel(7,"§8"+resultLevel[1],reward_offset_x+456, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+45,reward[2])
    gui.addLabel(8,"§8"+resultLevel[2],reward_offset_x+486, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+98,reward_offset_y+45,reward[3])
    gui.addLabel(9,"§8"+resultLevel[3],reward_offset_x+516, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+128,reward_offset_y+45,reward[4])
    gui.addLabel(10,"§8"+resultLevel[4],reward_offset_x+546, reward_offset_y+230, 40, 12)
    gui.addItemSlot(reward_offset_x+8,reward_offset_y+75,reward[5])
    gui.addLabel(11,"§8"+resultLevel[5],reward_offset_x+426, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+38,reward_offset_y+75,reward[6])
    gui.addLabel(12,"§8"+resultLevel[6],reward_offset_x+456, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+68,reward_offset_y+75,reward[7])
    gui.addLabel(13,"§8"+resultLevel[7],reward_offset_x+486, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+98,reward_offset_y+75,reward[8])
    gui.addLabel(14,"§8"+resultLevel[8],reward_offset_x+516, reward_offset_y+260, 40, 12)
    gui.addItemSlot(reward_offset_x+128,reward_offset_y+75,reward[9])
    gui.addLabel(15,"§8"+resultLevel[9],reward_offset_x+546, reward_offset_y+260, 40, 12)
    player.showCustomGui(gui)
    for(var i=0;i<10;i++){
        if(resultLevel[i]=='S'){
            player.playSound(UP_sound,1,1)
        }
    }
}

function customGuiButton(e){
    var player=e.player
    var gui=player.getCustomGui()
    var API=e.API
    var world=player.world
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))//技能池抽卡次数
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))//时装池抽卡次数
    if(gui.getID()==1 && page=="main"){//技能卡池主页面
        if(e.buttonId==7){//切换到信息页按钮
            skillinfo(e)
        }
        else if(e.buttonId==5){//点击单抽
            if(alconanum<skillrequiredalcona){//判断阿尔克纳宝石不足
                player.message(prefix+"阿尔克纳宝石不足，无法抽奖")
                player.playSound(cancelsound,1,1)
                player.closeGui()
                return
            }
            reward=[]
            resultLevel=[]
            skillonce(e)
            player.playSound(congratulatesound1,0.8,1)
            player.playSound(congratulatesound2,1,1)
            skillboxonceUI(e)
        }else if(e.buttonId==6){//点击十连抽
            if(alconanum<skillrequiredalcona*10){//判断阿尔克纳宝石不足
                player.message(prefix+"阿尔克纳宝石不足，无法进行十连抽")
                player.playSound(cancelsound,1,1)
                player.closeGui()
                return
            }
            reward=[]
            resultLevel=[]
            for(var i=0;i<10;i++){
                skillonce(e)
            }
            player.playSound(congratulatesound1,0.8,1)
            player.playSound(congratulatesound2,1,1)
            skillboxtenthUI(e)
        }else if(e.buttonId==8){//技能向右翻页
            player.playSound(menu_top,1,1)
            skinMainGUI(e,false)
        }else if(e.buttonId==9){//技能向左翻页
            player.playSound(menu_top,1,1)
            skinMainGUI(e,false)
        }
    }else if(gui.getID()==1 && page=="info"){
        if(e.buttonId==3){
            skillMainGUI(e,true)
        }
    }else if(gui.getID()==1 && page=="OnceResult"){
        if(e.buttonId==5){
            skillMainGUI(e,false)
        }
    }else if(gui.getID()==1 && page=="TenthResult"){
        if(e.buttonId==5){
            skillMainGUI(e,false)
        }
    }else if(gui.getID()==2 && page=="main"){//时装卡池主页面
        if(e.buttonId==7){//切换到信息页按钮
            skininfo(e)
        }
        else if(e.buttonId==5){//点击单抽
            if(alconanum<skillrequiredalcona){//判断阿尔克纳宝石不足
                player.message(prefix+"阿尔克纳宝石不足，无法抽奖")
                player.playSound(cancelsound,1,1)
                player.closeGui()
                return
            }
            reward=[]
            resultLevel=[]
            skinonce(e)
            player.playSound(congratulatesound1,0.8,1)
            player.playSound(congratulatesound2,1,1)
            skinboxonceUI(e)
        }else if(e.buttonId==6){//点击十连抽
            if(alconanum<skillrequiredalcona*10){//判断阿尔克纳宝石不足
                player.message(prefix+"阿尔克纳宝石不足，无法进行十连抽")
                player.playSound(cancelsound,1,1)
                player.closeGui()
                return
            }
            reward=[]
            resultLevel=[]
            for(var i=0;i<10;i++){
                skinonce(e)
            }
            player.playSound(congratulatesound1,0.8,1)
            player.playSound(congratulatesound2,1,1)
            skinboxtenthUI(e)
        }else if(e.buttonId==8){//时装向右翻页
            player.playSound(menu_top,1,1)
            skillMainGUI(e,false)
        }else if(e.buttonId==9){//时装向左翻页
            player.playSound(menu_top,1,1)
            skillMainGUI(e,false)
        }
    }else if(gui.getID()==2 && page=="info"){
        if(e.buttonId==3){
            skinMainGUI(e,true)
        }
    }else if(gui.getID()==2 && page=="OnceResult"){
        if(e.buttonId==5){
            skinMainGUI(e,false)
        }
    }else if(gui.getID()==2 && page=="TenthResult"){
        if(e.buttonId==5){
            skinMainGUI(e,false)
        }
    }
}
function randommize(min,max){//随机数函数
    var minCeiled=Math.ceil(min);
    var maxFloored=Math.floor(max);
    return Math.floor(Math.random()*(maxFloored-minCeiled)+minCeiled); //不包含最大值，包含最小值
}
function skillonce(e){//技能池抽奖一次
    var player=e.player
    var gui=player.getCustomGui()
    var API=e.API
    var world=player.world
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))//技能池抽卡次数
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))//时装池抽卡次数
    alcona.setValue(alconanum-skillrequiredalcona)
    storeddata.put("skillhaslotter",skillhaslotter+1)
    if(storeddata.get("skillguaranteejude")==null){
        storeddata.put("skillguaranteejude",0)
    }
    var skillguaranteejude=parseInt(storeddata.get("skillguaranteejude"))
    storeddata.put("skillguaranteejude",skillguaranteejude+1)
    var changenum=gui.getComponent(3)//获取，改变界面上的阿尔克纳宝石数量显示
    var alconanum=alcona.getValue()
    changenum.setText("§8"+alconanum)
    gui.updateComponent(changenum)
    gui.update(player)//已更改数量显示，刷新GUI
    if(skillguaranteejude+1==skill保底){//进行保底判断
        player.message(prefix+"触发保底机制,保底次数重置")
        resultLevel.push("S")
        reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(0))
        player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(0))//给予物品
        storeddata.put("skillguaranteejude",0)//重置保底次数
    }else{//不是保底，进行随机数
        var randomnum=randommize(0,100)
        if(randomnum<2){
            resultLevel.push("S")
            reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(0))
            player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(0))
            storeddata.put("skillguaranteejude",0)//重置保底次数
            player.message(prefix+"已获得当期UP,保底次数重置")
        }
        else if(randomnum<=12){
            resultLevel.push("A")
            var randomnum=randommize(1,3)
            if(randomnum==1){
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(1))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(1))
            }else{
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(2))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(2))
            }
        }
        else if(randomnum<=35){
            resultLevel.push("B")
            var randomnum=randommize(1,4)
            if(randomnum==1){
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(3))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(3))
            }else if(randomnum==2){
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(4))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(4))
            }else{
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(5))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(5))
            }
        }
        else{
            resultLevel.push("C")
            var randomnum=randommize(1,4)
            if(randomnum==1){
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(6))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(6))
            }else if(randomnum==2){
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(7))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(7))
            }else{
                reward.push(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(8))
                player.giveItem(world.getBlock(skillrewardLocation[0],skillrewardLocation[1],skillrewardLocation[2]).getContainer().getSlot(8))
            }
        }
    }
}
function skinonce(e){//时装池抽奖一次
    var player=e.player
    var gui=player.getCustomGui()
    var API=e.API
    var world=player.world
    var playerName=player.getDisplayName()
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())
    if(alcona==null){
        API.executeCommand(player.world,"/scoreboard players set "+playerName+" alcona 0")
    }
    var Scoreboard=player.getWorld().getScoreboard()
    var alcona=Scoreboard.getObjective("alcona").getScore(player.getName())//再次获取玩家计分板参数
    if(alcona==null){//再次判定
        return//若出现bug APIcommand运行失败则退出
    }
    var alconanum=alcona.getValue()//获取阿尔克纳宝石数量
    var storeddata = player.storeddata
    var skillhaslotter = parseInt(storeddata.get("skillhaslotter"))//技能池抽卡次数
    var skinhaslotter = parseInt(storeddata.get("skinhaslotter"))//时装池抽卡次数
    alcona.setValue(alconanum-skinrequiredalcona)
    storeddata.put("skinhaslotter",skinhaslotter+1)
    if(storeddata.get("skinguaranteejude")==null){
        storeddata.put("skinguaranteejude",0)
    }
    var skinguaranteejude=parseInt(storeddata.get("skinguaranteejude"))
    storeddata.put("skinguaranteejude",skinguaranteejude+1)
    var changenum=gui.getComponent(3)//获取，改变界面上的阿尔克纳宝石数量显示
    var alconanum=alcona.getValue()
    changenum.setText("§8"+alconanum)
    gui.updateComponent(changenum)
    gui.update(player)//已更改数量显示，刷新GUI
    if(skinguaranteejude+1==skin保底){//进行保底判断
        player.message(prefix+"触发保底机制,保底次数重置")
        resultLevel.push("S")
        reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(0))
        player.giveItem(world.getBlock(9947,63,9961).getContainer().getSlot(0))//给予物品
        storeddata.put("skinguaranteejude",0)//重置保底次数
    }else{//不是保底，进行随机数
        var randomnum=randommize(0,100)
        if(randomnum<2){
            resultLevel.push("S")
            reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(0))
            player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(0))
            storeddata.put("skinguaranteejude",0)//重置保底次数
            player.message(prefix+"已获得当期UP,保底次数重置")
        }
        else if(randomnum<=12){
            resultLevel.push("A")
            var randomnum=randommize(1,3)
            if(randomnum==1){
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(1))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(1))
            }else{
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(2))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(2))
            }
        }
        else if(randomnum<=35){
            resultLevel.push("B")
            var randomnum=randommize(1,4)
            if(randomnum==1){
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(3))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(3))
            }else if(randomnum==2){
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(4))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(4))
            }else{
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(5))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(5))
            }
        }
        else{
            resultLevel.push("C")
            var randomnum=randommize(1,4)
            if(randomnum==1){
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(6))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(6))
            }else if(randomnum==2){
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(7))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(7))
            }else{
                reward.push(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(8))
                player.giveItem(world.getBlock(skinrewardLocation[0],skinrewardLocation[1],skinrewardLocation[2]).getContainer().getSlot(8))
            }
        }
    }
}


function customGuiSlotClicked(e){
    e.setCanceled(1)
}
