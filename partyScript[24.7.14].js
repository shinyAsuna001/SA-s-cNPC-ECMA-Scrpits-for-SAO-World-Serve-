/*
----------------------------------[SAO-World Serve自定义组队脚本]------------------------------------------
作者:shiny_Asuna

未经允许请勿转载使用，发现必究
仅供服务器：SAO-World Serve，击剑服-马车整合包服务器 使用
*/

// =====================
// |       配置区      |
// =====================
//音效
var menu="saoui:orb_dropdown"//菜单呼出音效
var menu_top="minecraft:ui.loom.select_pattern"//菜单页面切换音效
var confirmsound="saoui:confirm"//确认音效
var failsound="saoui:dialog_close"//拒绝音效
var messagesound="saoui:message"//消息提示音
var quitsound="minecraft:item.armor.equip_elytra"//退出队伍音效
var cicksound="minecraft:entity.shulker.hurt_closed"//踢出队伍音效
//组队规则设置
var waittime=60//申请作废前等待(单位：秒)
var cd=10//申请、邀请冷却cd(单位：秒)
var friendlyFire=0//默认队伍友伤设置，0为关，1为开
var collisionRule=0//默认队伍碰撞设置，0为保持碰撞箱开启，1为队伍内部无碰撞
var member_max=6//组队队伍人数上限，为保证脚本处理顺利不要超过10，如果想超过10把脚本主体部分最上面两个变量扩写一下，但是不保证不会出错
//另外，组队队伍人数上限若要超过6需要对GUI和CustomButton进行修改，总之是比较麻烦，如果你要再给你出一版= =
var systemPrefix="§7[§6SAO-World§7]§8[§a+§8]§7[§3小队系统§7]"//系统提示前缀

//脚本主体
//以下部分不用修改，除非要调整GUI
var PartyUIlist=["--","--","--","--","--","--","--","--","--","--"]
var PartyLevellist=["Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0"]
var cooldowntime=0
var cooldowntime2=0
var countdown=0
var countdown2=0
var guiId
var CanApply=true
var CanInvite=true
var applyPartyLeaderName=""
var InvitePlayer=""
var player
var playerName
var ApplySender
var InviteSender
var friendlyFires=["关","开"]
var collisionRules=["保持开启","本队无碰撞"]
var PartyDisplay="Party"
var Textmessage=""
var friendlyFirebol="false"
var collisionRulebol="always"
var warning=false

function keyPressed(c){
  var player=c.player
  playerName=player.getDisplayName()
  if (c.key==80 && c.isCtrlPressed==true && c.isShiftPressed==true){
    if(c.player.hasTag('BeApplied')==true){
      c.player.message(systemPrefix+"§7您有新的申请，请及时处理")
      c.player.playSound(messagesound, 1, 1)
      ApplyMessageGUI(c)
    }else if(c.player.hasTag('BeInvited')==true){
      c.player.message(systemPrefix+"§7您有新的邀请，请及时处理")
      player.playSound(messagesound, 1, 1)
      InviteMessageGUI(c)
    }else if(player.getWorld().getScoreboard().getPlayerTeam(playerName)==null){
      player.playSound(menu, 1, 1)
      player.playSound(menu_top, 5, 2)
      NoPartyGUI(c)
    }else{
      player.playSound(menu, 1, 1)
      player.playSound(menu_top, 5, 2)
      UpdatePartyUI(c)
      MainPartyGUI(c)}
}
}

function customGuiButton(c){
  var gui = c.gui
  var player = c.player
  var API=c.API
  playerName=c.player.getDisplayName()
  if(guiId==0){
    if(c.buttonId==10){
      ApplyTeamGUI(c)
    }else if(c.buttonId==12){
      createTeam(c)
    }else if(c.buttonId==4){
      player.playSound(menu_top,1,1)
      player.playSound(failsound,1,1)
      player.closeGui()
    }else if(c.buttonId==11){
      player.playSound(menu_top,1,1)
      SelfCheck(c)
      player.closeGui()
    }
    
  }else if(guiId==1){
    if(c.buttonId==10){
      PartySettings(c)
    }else if(c.buttonId==11){
      InviteSendGUI(c)
    }else if(c.buttonId==12){
      if(c.player.hasTag("Partyleader")==true){
        DisbandParty(c)
      }else{
        QuitParty(c)
      }
    }else if(c.buttonId==19){
      player.playSound(failsound,1,1)
      player.closeGui()
    }else if(c.buttonId>=21 && c.buttonId<=25){
      if(c.player.hasTag("Partyleader")==true){
        var targetkick=gui.getComponent(c.buttonId-16).getText().slice("2")
        if(targetkick!="--"){
          API.executeCommand(player.world,"/tellraw "+targetkick+" \{\"text\"\:\""+systemPrefix+"§c您已经被小队长踢出\"\}")
          player.message(systemPrefix+"§7成功踢出"+targetkick)
          API.executeCommand(player.world,"/team leave "+targetkick)
          player.playSound(cicksound,1,1)
          player.playSound(failsound,1,1)
          UpdatePartyUI(c)
          MainPartyGUI(c)
        }
      }else{
        player.message(systemPrefix+"§7只有队长才能踢出玩家")
      }
    }else if(c.buttonId==20){
      PartyMessageGUI(c)
    }
  }else if(guiId==2){
    if(c.buttonId==5){
      applyPartyLeaderName=gui.getComponent(4).getText()
      var targetPlayer=c.player.getWorld().getPlayer(applyPartyLeaderName)
      if (targetPlayer!=null){
        var PlayerOnline=true
        if(targetPlayer.hasTag("Partyleader")==true){
          var targetPlayerisLeader=true
        }else{
          var targetPlayerisLeader=false
        }
      }else{
        var PlayerOnline=false
        var targetPlayerisLeader=false
      }
      if(CanApply && applyPartyLeaderName!="" && PlayerOnline==true && targetPlayerisLeader==true ){
        API.executeCommand(player.world,"/tellraw "+applyPartyLeaderName+" \{\"text\"\:\""+systemPrefix+"§7您收到一封新的队伍申请信息，来自§a"+playerName+"§7,按下Ctrl键,Shift键和P键打开组队面板以回复\"\}")
        API.executeCommand(player.world,"/playsound "+messagesound+" player "+applyPartyLeaderName+" ~ ~ ~ 4 1.0 1.0")
        API.executeCommand(player.world,"/tag "+applyPartyLeaderName+" add partyApplyer_"+playerName)
        API.executeCommand(player.world,"/tag "+applyPartyLeaderName+" add BeApplied")
        c.player.message(systemPrefix+"§7成功向"+applyPartyLeaderName+"发送组队申请")
        CanApply=false
        cooldowntime=0
        player.timers.forceStart(0,20,true)
        countdown=0
        player.timers.forceStart(2,20,true)
        NoPartyGUI(c)
        player.playSound(confirmsound, 1, 1)
      }else if(CanApply==false){
        player.playSound(failsound, 1, 1)
        NoPartyGUI(c)
        c.player.message(systemPrefix+"§c您刚刚已经发出过一个申请，请稍等"+String(cd-cooldowntime)+"秒")
      }else if(applyPartyLeaderName==""){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c申请玩家不可为空")
        NoPartyGUI(c)
      }else if(PlayerOnline==true && targetPlayerisLeader==false){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§e目标玩家不是领队")
        NoPartyGUI(c)
      }else if(PlayerOnline==false && targetPlayerisLeader==false){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c目标玩家不在线")
        NoPartyGUI(c)
      }
    }else if(c.buttonId==6){
      NoPartyGUI(c)
      player.playSound(failsound, 1, 1)
      player.playSound(menu_top, 1, 1)
    }
  }else if(guiId==3){
    if(c.buttonId==4){
      player.removeTag("BeApplied")
      var tags=player.getTags()
      for(var i=0;i<tags.length;i++){
        if(tags[i].length>13){
          if(tags[i].slice(0,13)=='partyApplyer_'){
            var tagname=tags[i]
            break
          }
        }
      }
      player.removeTag(tagname)
      var Scoreboard=player.getWorld().getScoreboard()
      var team=Scoreboard.getTeam(playerName)
      if(team==null){return}
      var players=team.getPlayers()
      if(players.length<member_max){
        API.executeCommand(player.world,"/team join "+playerName+" "+ApplySender)
        player.message(systemPrefix+"§7玩家§a"+ApplySender+"§7成功加入了您的小队")
        player.playSound(confirmsound, 1, 1)
        API.executeCommand(player.world,"/tellraw "+ApplySender+" \{\"text\"\:\""+systemPrefix+"§7加入小队成功\"\}")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }else{
        player.message(systemPrefix+"§§c您的队伍已满员，无法使该玩家加入")
        API.executeCommand(player.world,"/tellraw "+ApplySender+" \{\"text\"\:\""+systemPrefix+"§c该队伍满员了\"\}")
        UpdatePartyUI(c)
        MainPartyGUI(c)
        player.playSound(failsound, 1, 1)
      }
    }else if(c.buttonId==5){
      player.removeTag("BeApplied")
        var tags=player.getTags()
        for(var i=0;i<tags.length;i++){
          if(tags[i].length>13){
            if(tags[i].slice(0,13)=='partyApplyer_'){
              var tagname=tags[i]
              break
            }
          }
        }
        player.removeTag(tagname)
        player.message(systemPrefix+"§7已拒绝该申请")
        API.executeCommand(player.world,"/tellraw "+ApplySender+" \{\"text\"\:\""+systemPrefix+"§c申请被拒绝了\"\}")
        player.playSound(failsound, 1, 1)
        UpdatePartyUI(c)
        MainPartyGUI(c)
    }
  }else if(guiId==4){
    if(c.buttonId==5){
      InvitePlayer=gui.getComponent(4).getText()
      if(CanInvite && InvitePlayer!="" && player.hasTag('Partyleader')==true && (player.getWorld().getScoreboard().getPlayerTeam(InvitePlayer)==null) && c.player.getWorld().getPlayer(InvitePlayer)!=null){
        API.executeCommand(player.world,"/tellraw "+InvitePlayer+" \{\"text\"\:\""+systemPrefix+"§7您收到一封新的队伍邀请信息，来自§a"+playerName+"§7,按下Ctrl键,Shift键和P键打开组队面板以回复\"\}")
        API.executeCommand(player.world,"/playsound "+messagesound+" player "+InvitePlayer+" ~ ~ ~ 4 1.0 1.0")
        API.executeCommand(player.world,"/tag "+InvitePlayer+" add partyInviter_"+playerName)
        API.executeCommand(player.world,"/tag "+InvitePlayer+" add BeInvited")
        c.player.message(systemPrefix+"§7成功向"+InvitePlayer+"发送组队邀请")
        CanInvite=false
        cooldowntime2=0
        player.timers.forceStart(1,20,true)
        countdown2=0
        player.timers.forceStart(3,20,true)
        UpdatePartyUI(c)
        MainPartyGUI(c)
        player.playSound(confirmsound, 1, 1)
      }else if(CanInvite==false){
        player.playSound(failsound, 1, 1)
        UpdatePartyUI(c)
        MainPartyGUI(c)
        c.player.message(systemPrefix+"§c您刚刚已经发出过一个邀请，请稍等"+String(cd-cooldowntime2)+"秒")
      }else if(InvitePlayer==""){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c邀请玩家不可为空")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }else if(player.hasTag('Partyleader')==false){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c小队队长才可邀请")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }else if((player.getWorld().getScoreboard().getPlayerTeam(InvitePlayer)!=null)){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c该玩家已经有队伍了")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }else if(c.player.getWorld().getPlayer(InvitePlayer)==null){
        player.playSound(failsound, 1, 1)
        c.player.message(systemPrefix+"§c该玩家不在线")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }
    }else if(c.buttonId==6){
      UpdatePartyUI(c)
      MainPartyGUI(c)
      player.playSound(failsound, 1, 1)
      player.playSound(menu_top, 1, 1)
    }
  }else if(guiId==5){
    if(c.buttonId==4){
      player.removeTag("BeInvited")
      var tags=player.getTags()
      player.removeTag(tagname)
      var Scoreboard=player.getWorld().getScoreboard()
      var team=Scoreboard.getTeam(InviteSender)
      if(team==null){return}
      var players=team.getPlayers()
      if(players.length<member_max){
        API.executeCommand(player.world,"/team join "+InviteSender+" "+playerName)
        player.message(systemPrefix+"§7玩家§a"+playerName+"§7加入小队成功")
        player.playSound(confirmsound, 1, 1)
        API.executeCommand(player.world,"/tellraw "+InviteSender+" \{\"text\"\:\""+systemPrefix+"§7"+playerName+"成功加入了您的小队\"\}")
        UpdatePartyUI(c)
        MainPartyGUI(c)
      }else{
        player.message(systemPrefix+"§c队伍已满员，无法使该玩家加入")
        API.executeCommand(player.world,"/tellraw "+InviteSender+" \{\"text\"\:\""+systemPrefix+"§c该队伍满员了\"\}")
        UpdatePartyUI(c)
        MainPartyGUI(c)
        player.playSound(failsound, 1, 1)
      }
    }else if(c.buttonId==5){
      player.removeTag("BeInvited")
        var tags=player.getTags()
        for(var i=0;i<tags.length;i++){
          if(tags[i].length>13){
            if(tags[i].slice(0,13)=='partyInviter_'){
              var tagname=tags[i]
              break
            }
          }
        }
        player.removeTag(tagname)
        player.message(systemPrefix+"§7已拒绝该邀请")
        API.executeCommand(player.world,"/tellraw "+InviteSender+" \{\"text\"\:\""+systemPrefix+"§c邀请被拒绝了\"\}")
        player.playSound(failsound, 1, 1)
        UpdatePartyUI(c)
        MainPartyGUI(c)
    }
  }else if(guiId==6){
    if(c.buttonId==5){
      Textmessage=gui.getComponent(4).getText()
      API.executeCommand(player.world,"/execute as "+playerName+" at @s run teammsg "+Textmessage)
      Textmessage=""
      PartyMessageGUI(c)
      player.playSound(confirmsound,1,1)
    }else if(c.buttonId==6){
      player.playSound(menu_top,1,1)
      UpdatePartyUI(c)
      MainPartyGUI(c)
    }
  }else if(guiId==7){
    if(c.buttonId==6){
      if(friendlyFire==0){
        friendlyFire=1
        friendlyFirebol=true
        PartySettings(c)
      }else if(friendlyFire==1){
        friendlyFire=0
        friendlyFirebol=false
        PartySettings(c)
      }
      player.playSound(confirmsound,1,1)
    }else if(c.buttonId==8){
      if(collisionRule==0){
        collisionRule=1
        collisionRulebol="pushOtherTeams"
        PartySettings(c)
      }else if(collisionRule==1){
        collisionRule=0
        collisionRulebol="always"
        PartySettings(c)
      }
      player.playSound(confirmsound,1,1)
    }else if(c.buttonId==9){
      PartyDisplay=gui.getComponent(4).getText()
      API.executeCommand(player.world,"/team modify "+playerName+" friendlyFire "+friendlyFirebol)
      API.executeCommand(player.world,"/team modify "+playerName+" collisionRule "+collisionRulebol)
      API.executeCommand(player.world,"/team modify "+playerName+" displayName \""+PartyDisplay+"\"")
      player.playSound(cicksound,1,1)
      player.playSound(menu_top,1,1)
      player.message(systemPrefix+"设置修改成功")
      UpdatePartyUI(c)
      MainPartyGUI(c)
    }else if(c.buttonId==10){
      player.playSound(failsound,1,1)
      player.playSound(menu_top,1,1)
      UpdatePartyUI(c)
      MainPartyGUI(c)
    }
  }
}

function MainPartyGUI(c){
  if(warning==true){
    c.player.message(systemPrefix+"§c组队脚本自我排错运行确认")
    warning=false
    return false
  }
  guiId=1
  var gui = c.API.createCustomGui(1, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/partyui.png", 370, 120, 200, 250, 0, 0)
  gui.addLabel(2, "§8"+PartyDisplay , 490, 167, 29, 29, 10)
  gui.addLabel(3, "§8"+PartyUIlist[0] , 484, 188, 29, 29, 10)
  gui.addLabel(13, "§8"+PartyLevellist[0] , 463, 188, 29, 29, 10)
  gui.addLabel(4, "§8队长" , 540, 195, 29, 29, 10)
  gui.addLabel(5, "§8"+PartyUIlist[1] , 500, 209, 29, 29, 10)
  gui.addLabel(14, "§8"+PartyLevellist[1] , 477, 209, 29, 29, 10)
  gui.addLabel(6, "§8"+PartyUIlist[2] , 500, 231, 29, 29, 10)
  gui.addLabel(15, "§8"+PartyLevellist[2] , 477, 231, 29, 29, 10)
  gui.addLabel(7, "§8"+PartyUIlist[3] , 500, 253, 29, 29, 10)
  gui.addLabel(16, "§8"+PartyLevellist[3] , 477, 253, 29, 29, 10)
  gui.addLabel(8, "§8"+PartyUIlist[4] , 500, 276, 29, 29, 10)
  gui.addLabel(17, "§8"+PartyLevellist[4] , 477, 276, 29, 29, 10)
  gui.addLabel(9, "§8"+PartyUIlist[5] , 500, 298, 29, 29, 10)
  gui.addLabel(18, "§8"+PartyLevellist[5] , 477, 298, 29, 29, 10)
  gui.addTexturedButton(10, "", 531 , 133 , 15, 15,"minecraft:textures/gui/touming.png").setHoverText("§7队长点击此按钮更改队伍设置")
  gui.addTexturedButton(19, "", 550 , 133 , 15, 15,"minecraft:textures/gui/touming.png").setHoverText("§7关闭面板")
  gui.addTexturedButton(11, "邀请", 454 , 336 , 20, 10,"minecraft:textures/gui/touming.png").setHoverText("§7队长点击此按钮可以邀请其他玩家入队")
  gui.addTexturedButton(12, "离队", 526 , 336 , 20, 10,"minecraft:textures/gui/touming.png").setHoverText("§7队员点击后退队,§7队长点击后解散队伍")
  gui.addTexturedButton(20, "", 492 , 336 , 10, 8,"minecraft:textures/gui/touming.png").setHoverText("§7小队聊天")
  gui.addTexturedButton(21, "", 445 , 212 , 8, 8,"minecraft:textures/gui/touming.png").setHoverText("§7踢出该玩家")
  gui.addTexturedButton(22, "", 445 , 235 , 8, 8,"minecraft:textures/gui/touming.png").setHoverText("§7踢出该玩家")
  gui.addTexturedButton(23, "", 445 , 258 , 8, 8,"minecraft:textures/gui/touming.png").setHoverText("§7踢出该玩家")
  gui.addTexturedButton(24, "", 445 , 279 , 8, 8,"minecraft:textures/gui/touming.png").setHoverText("§7踢出该玩家")
  gui.addTexturedButton(25, "", 445 , 302 , 8, 8,"minecraft:textures/gui/touming.png").setHoverText("§7踢出该玩家")
  c.player.showCustomGui(gui)
}

function NoPartyGUI(c){
  guiId=0
  var gui = c.API.createCustomGui(1, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_start.png", 367, 120, 280, 250, 0, 0)
  gui.addLabel(2, "§8Party" , 490, 189, 29, 29, 10)
  gui.addLabel(3, "§8暂时没有消息" , 475, 239, 29, 29, 10)
  gui.addTexturedButton(4, "", 560 , 185 , 15, 15,"minecraft:textures/gui/touming.png").setHoverText("§7关闭面板")
  gui.addTexturedButton(10, "申请", 425 , 277 , 30, 20,"minecraft:textures/gui/touming.png").setHoverText("§7点击申请加入其他队伍")
  gui.addTexturedButton(11, "自检", 484 , 277 , 30, 20,"minecraft:textures/gui/touming.png").setHoverText("§7强制退出队伍，自检bug，§c无bug请勿使用")
  gui.addTexturedButton(12, "创建", 535 , 277 , 30, 20,"minecraft:textures/gui/touming.png").setHoverText("§7创建队伍")
  c.player.showCustomGui(gui)
}

function ApplyTeamGUI(c){
  guiId=2
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_invite.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§f申请" , 490, 203, 29, 29, 10)
  gui.addLabel(3, "§8请输入队伍领队玩家名" , 462, 222, 29, 29, 10)
  gui.addTextField(4, 435, 240, 130, 10).setText(applyPartyLeaderName)
  gui.addTexturedButton(5, "", 443 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(6, "", 525 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  c.player.showCustomGui(gui)
}

function ApplyMessageGUI(c){
  guiId=3
  var player=c.player
  var tags=player.getTags()
  for(var i=0;i<tags.length;i++){
    if(tags[i].length>13){
      if(tags[i].slice(0,13)=='partyApplyer_'){
        ApplySender=tags[i].slice(13)
        break
      }
    }
  }
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_invite.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§f队伍申请" , 490, 203, 29, 29, 10)
  gui.addLabel(3, "§8申请人:"+ApplySender , 462, 222, 29, 29, 10)
  gui.addTexturedButton(4, "", 443 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(5, "", 525 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  c.player.showCustomGui(gui)
}

function InviteSendGUI(c){
  guiId=4
  var player=c.player
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_invite.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§f邀请" , 490, 203, 29, 29, 10)
  gui.addLabel(3, "§8请输要邀请的玩家名" , 462, 222, 29, 29, 10)
  gui.addTextField(4, 435, 240, 130, 10).setText(InvitePlayer)
  gui.addTexturedButton(5, "", 443 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(6, "", 525 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  c.player.showCustomGui(gui)
}

function InviteMessageGUI(c){
  guiId=5
  var player=c.player
  var tags=player.getTags()
  for(var i=0;i<tags.length;i++){
    if(tags[i].length>13){
      if(tags[i].slice(0,13)=='partyInviter_'){
        InviteSender=tags[i].slice(13)
        break
      }
    }
  }
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_invite.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§f队伍邀请" , 490, 203, 29, 29, 10)
  gui.addLabel(3, "§8来自:"+InviteSender , 462, 222, 29, 29, 10)
  gui.addTexturedButton(4, "", 443 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(5, "", 525 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  c.player.showCustomGui(gui)
}

function createTeam(c){
  var player=c.player
  playerName=c.player.getDisplayName()
  var tags=player.getTags()
  var API=c.API
  player.addTag("Partyleader")
  API.executeCommand(player.world,"/team add "+playerName)
  API.executeCommand(player.world,"/team join "+playerName+" "+playerName)
  API.executeCommand(player.world,"/team modify "+playerName+" friendlyFire false")
  API.executeCommand(player.world,"/team modify "+playerName+" collisionRule always")
  player.message(systemPrefix+"队伍已创建")
  player.playSound(menu_top, 1, 1)
  UpdatePartyUI(c)
  MainPartyGUI(c)
}

function DisbandParty(c){
  var player=c.player
  playerName=player.getDisplayName()
  var API=c.API
  var Scoreboard=player.getWorld().getScoreboard()
  var team=Scoreboard.getTeam(playerName)
  if(team==null){return}
  var players=team.getPlayers()
  player.message(systemPrefix+"§c解散小队成功")
  for(var i=0;i<players.length;i++){
    API.executeCommand(player.world,"/tellraw "+players[i]+" \{\"text\"\:\""+systemPrefix+"§7小队被队长解散\"\}")
  }
  player.removeTag("Partyleader")
  API.executeCommand(player.world,"/team empty "+playerName)
  API.executeCommand(player.world,"/team remove "+playerName)
  player.playSound(quitsound, 1, 1)
  player.closeGui()
}

function QuitParty(c){
  var player=c.player
  playerName=player.getDisplayName()
  var API=c.API
  var team=player.getWorld().getScoreboard().getPlayerTeam(playerName)
  if(team==null){return}
  var players=team.getPlayers()
  for(var i=0;i<players.length;i++){
    API.executeCommand(player.world,"/tellraw "+players[i]+" \{\"text\"\:\""+systemPrefix+"§7"+playerName+"退出了小队\"\}")
  }
  var teamName=player.getWorld().getScoreboard().getPlayerTeam(playerName)
  API.executeCommand(player.world,"/team leave "+playerName)
  player.playSound(quitsound, 1, 1)
  player.closeGui()
}

function SelfCheck(c){
  var player=c.player
  var tags=player.getTags()
  var API=c.API
  API.executeCommand(player.world,"/team leave "+playerName)
  API.executeCommand(player.world,"/team empty "+playerName)
  API.executeCommand(player.world,"/team remove "+playerName)
  player.removeTag("BeApplied")
  player.removeTag("BeInvited")
  for(var i=0;i<tags.length;i++){
    if(tags[i].length>13){
      if(tags[i].slice(0,13)=='partyInviter_'){
        var tagname=tags[i]
        break
      }
    }
  }
  for(var i=0;i<tags.length;i++){
    if(tags[i].length>13){
      if(tags[i].slice(0,13)=='partyApplyer_'){
        var tagname=tags[i]
        break
      }
    }
  }
  cooldowntime=0
  cooldowntime2=0
  guiId=0
  player.timers.forceStart(0,20,true)
  player.timers.forceStart(1,20,true)
  countdown=0
  countdown2=0
  player.timers.forceStart(2,20,true)
  player.timers.forceStart(3,20,true)
  player.message(systemPrefix+"§e小队系统已完成自检，若仍有问题请联系GM")
}

function UpdatePartyUI(c){
  var player=c.player
  var PlayerTeamName=player.getWorld().getScoreboard().getPlayerTeam(playerName)
  PartyUIlist=["--","--","--","--","--","--","--","--","--","--"]
  PartyLevellist=["Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0","Lv.0"]
  PartyUIlist.splice(0,1,player.getWorld().getScoreboard().getPlayerTeam(playerName).getName())
  if(c.player.getWorld().getPlayer(PartyUIlist[0])!=null){
    PartyLevellist.splice(0,1,"Lv."+c.player.getWorld().getPlayer(PartyUIlist[0]).getExpLevel())
  }else{
    player.message(systemPrefix+"§c组队脚本出现未知错误，请汇报作者shiny_Asuna查看处理；")
    player.message("§4本条提示消息后，脚本会进行自我排错测试，请等待大约3秒再打开GUI，若仍有问题请联系管理员，使其联系作者")
    SelfCheck(c)
    warning=true
    return false
  }
  for(var i=0;i<PlayerTeamName.getPlayers().length;i++){
    if(PlayerTeamName.getPlayers()[PlayerTeamName.getPlayers().length-i-1]!=player.getWorld().getScoreboard().getPlayerTeam(playerName).getName()){
      PartyUIlist.splice(PlayerTeamName.getPlayers().length-1,1,PlayerTeamName.getPlayers()[PlayerTeamName.getPlayers().length-i-1])
      if(c.player.getWorld().getPlayer(PartyUIlist[i+1])!=null){
        PartyLevellist.splice(i+1,1,"Lv."+c.player.getWorld().getPlayer(PartyUIlist[i+1]).getExpLevel())
      }
    }
  }
}

function PartySettings(c){
  guiId=7
  var player=c.player
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_settings.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§8队伍设置" , 490, 208, 29, 29, 10)
  gui.addLabel(3, "§8修改队伍显示名" , 422, 230, 29, 29, 10)
  gui.addTextField(4, 490, 228, 95, 14).setText(PartyDisplay)
  gui.addLabel(5, "§8友军伤害：" , 422, 252, 29, 29, 10)
  gui.addTexturedButton(6, friendlyFires[friendlyFire], 530 , 248 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addLabel(7, "§8碰撞模式：" , 422, 279, 29, 29, 10)
  gui.addTexturedButton(8, collisionRules[collisionRule], 532 , 273 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(9, "保存", 532 , 297 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(10, "", 570 , 185 , 20, 20,"minecraft:textures/gui/touming.png",2,0).setHoverText("返回")
  c.player.showCustomGui(gui)
}

function PartyMessageGUI(c){
  guiId=6
  var player=c.player
  var gui = c.API.createCustomGui(2, 1000, 500, false)
  gui.addTexturedRect(1, "minecraft:textures/gui/party_invite.png", 370, 140, 270, 200, 0, 0)
  gui.addLabel(2, "§f小队信息" , 490, 203, 29, 29, 10)
  gui.addLabel(3, "§8请输入要说的话" , 475, 222, 29, 29, 10)
  gui.addTextField(4, 435, 240, 130, 10).setText(Textmessage)
  gui.addTexturedButton(5, "", 443 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  gui.addTexturedButton(6, "", 525 , 295 , 30, 20,"minecraft:textures/gui/touming.png",2,0)
  c.player.showCustomGui(gui)
}

function timer(event){
  if (event.id==0){
      cooldown(event)
  }else if(event.id==1){
    cooldown2(event)
  }else if(event.id==2){
    waitcountdown(event)
  }else if(event.id==3){
    waitcountdown2(event)
  }
  
}
function cooldown(c){
  var player=c.player
  if (cooldowntime <= cd){
    cooldowntime +=1
  }
  else if (cooldowntime > cd){
    CanApply=true
  }
}
function cooldown2(c){
  var player=c.player
  if (cooldowntime2 <= cd){
    cooldowntime2 +=1
  }
  else if (cooldowntime2 > cd){
    CanInvite=true
  }
}
function waitcountdown(c){
  var player=c.player
  playerName=player.getDisplayName()
  var API=c.API
  if (countdown <= waittime){
    countdown +=1
  }
  else if (countdown == waittime+1){
    countdown +=2
    if(applyPartyLeaderName!=""){
      c.player.message(systemPrefix+"§7向"+applyPartyLeaderName+"发送的组队申请过期了，若未被接受则自动作废")
      API.executeCommand(player.world,"/tellraw "+applyPartyLeaderName+" \{\"text\"\:\""+systemPrefix+"§7来自§a"+playerName+"§7的组队信息已过期\"\}")
    }
    API.executeCommand(player.world,"/tag "+applyPartyLeaderName+" remove partyApplyer_"+playerName)
    API.executeCommand(player.world,"/tag "+applyPartyLeaderName+" remove BeApplied")
    applyPartyLeaderName=""
  }
}
function waitcountdown2(c){
  var player=c.player
  playerName=player.getDisplayName()
  var API=c.API
  if (countdown2 <= waittime){
    countdown2 +=1
  }
  else if (countdown2 == waittime+1){
    countdown2 +=2
    if(InvitePlayer!=""){
      c.player.message(systemPrefix+"§7向"+InvitePlayer+"发送的组队邀请过期了，若未被接受则自动作废")
      API.executeCommand(player.world,"/tellraw "+InvitePlayer+" \{\"text\"\:\""+systemPrefix+"§7来自§a"+playerName+"§7的组队信息已过期\"\}")
    }
    API.executeCommand(player.world,"/tag "+InvitePlayer+" remove partyInviter_"+playerName)
    API.executeCommand(player.world,"/tag "+InvitePlayer+" remove BeInvited")
    InvitePlayer=""
  }
}

