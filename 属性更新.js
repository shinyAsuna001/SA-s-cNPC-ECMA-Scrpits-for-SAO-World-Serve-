// 等级系数，例如1敏捷对影响各项数据的加成：原速度变成 (1 + W * 属性值) 倍
var W = 0.1
// 基值
var MS = 0.1  // 移动速度 minecraft:generic.movement_speed
var AS = 4.0  // 主手攻速 minecraft:generic.attack_speed
var OS = 4.0  // 副手攻速 epicfight:offhand_attack_speed
var AD = 1.0  // 主手攻击伤害 minecraft:generic.attack_damage
var OD = 1.0  // 副手攻击伤害 epicfight:offhand_attack_damage
var MH = 20.0 // 最大生命值  minecraft:generic.max_health
var A = 0.0  // 防御 minecraft:generic.armor
var S = 15.0  // 体力 epicfight:staminar
var WE = 40.0  // 重量 epicfight:weight
var SA = 0.0  //晕抗 epicfight:stun_armor

function init(c){
  var API=c.API
  var player = c.player;
  var storeddata = player.storeddata;
  if (!storeddata.has("maxLevel")){
    storeddata.put("maxLevel", player.getExpLevel());
    storeddata.put("agile", 0);
    storeddata.put("strength", 0);
    storeddata.put("health", 0);
    storeddata.put("defence", 0);
    storeddata.put("stamina", 0);
  }else{
    var maxLevel = storeddata.get("maxLevel");
    var level = player.getExpLevel();
    if (level > maxLevel){
      storeddata.put("maxLevel", level);
    }
    var agile = storeddata.get("agile");
    var strength = storeddata.get("strength");
    var health = storeddata.get("health");
    var defence = storeddata.get("defence");
    var stamina = storeddata.get("stamina");
    format(API, player, "minecraft:generic.movement_speed", MS * (1 + agile * W * 0.07))
    format(API, player, "minecraft:generic.attack_speed", AS * (1 + agile * W * 0.02 ))
    format(API, player, "epicfight:offhand_attack_speed", OS * (1 + agile * W * 0.02 ))
    format(API, player, "minecraft:generic.attack_damage", AD * (1 + strength * W *2))
    format(API, player, "epicfight:offhand_attack_damage", OD * (1 + strength * W *2))
    format(API, player, "minecraft:generic.max_health", MH * (1 + health * W))
    format(API, player, "minecraft:generic.armor_toughness", A + (0 + defence * W * 2 ))
    format(API, player, "epicfight:staminar", S + (stamina * W * 5))
    format(API, player, "epicfight:stun_armor", SA + (Math.round(stamina * W * 5)) + defence * W)
  }
  if(player.getWorld().getScoreboard()==null){
    return
  }
  if(player.getWorld().getScoreboard().getPlayerTeam(player.getDisplayName())!=null && player.getWorld().getScoreboard().getPlayerTeam(player.getDisplayName()).getName().length()>=5){
    if(player.getWorld().getScoreboard().getPlayerTeam(player.getDisplayName()).getName().slice(0,5)=="CMINP"){
      API.executeCommand(player.world,"/team leave "+player.getDisplayName())
    }
    
  }
  
}  

function levelUp(c){
  var player = c.player;
  var storeddata = player.storeddata;
  var maxLevel = storeddata.get("maxLevel");
  var agile = storeddata.get("agile");
  var strength = storeddata.get("strength");
  var health = storeddata.get("health");
  var defence = storeddata.get("defence");
  var stamina = storeddata.get("stamina");
  var level = player.getExpLevel();
  if (level > maxLevel){
    storeddata.put("maxLevel", level);
  }

  var gui = player.getCustomGui();
  if (gui){
    if (gui.getID() == 1){
      var label = gui.getComponent(3);
      var tl = parseInt(label.getText());
      label.setText((tl - c.change).toString());
      gui.updateComponent(label);

      label = gui.getComponent(23);
      var s = label.getText().split('：');
      var f = s[0];
      var level = s[1];
      label.setText(f + "：" + (parseInt(level) + 1)).toString();
      gui.updateComponent(label);

      gui.update(c.player);
    }
  }
}

function format(API, player, a, f){
  API.executeCommand(player.world, "/attribute " + player.name + " " + a + " base set " + f.toString())
}

function tick(e){
  var alconacount=e.player.inventoryItemCount("saomod:alcona_gemstone")
  var API=e.API
  var player=e.player
  var playerlevel=player.getExpLevel()
  var mainhanditem=player.getMainhandItem()
  var helmet=player.getArmor(3)
	var chestplate=player.getArmor(2)
	var leggings=player.getArmor(1)
	var boots=player.getArmor(0)
  var mainhandlevelrequire=mainhanditem.getNbt().getInteger("levelneed")
  var helmetlevelrequire=helmet.getNbt().getInteger("levelneed")
	var chestplatelevelrequire=chestplate.getNbt().getInteger("levelneed")
	var leggingslevelrequire=leggings.getNbt().getInteger("levelneed")
	var bootslevelrequire=boots.getNbt().getInteger("levelneed")
  if(alconacount>=1){
    if(e.player.getGamemode()==2){
      e.player.message("§8[§aSAO银行§8]§7已经将§b"+alconacount.toString()+"§7阿尔克纳宝石存储到您的账户")
      e.player.removeItem("saomod:alcona_gemstone",alconacount)
      API.executeCommand(e.player.world,"/scoreboard players add "+e.player.getDisplayName()+" alcona "+alconacount)
    }
  }
  if(mainhandlevelrequire>playerlevel){
    player.addPotionEffect(18,1,100,false)
    player.addPotionEffect(2,1,3,false)
  }
  if(helmetlevelrequire>playerlevel){
    player.addPotionEffect(18,1,100,false)
    player.addPotionEffect(2,1,3,false)
  }
  if(chestplatelevelrequire>playerlevel){
    player.addPotionEffect(18,1,100,false)
    player.addPotionEffect(2,1,3,false)
  }
  if(leggingslevelrequire>playerlevel){
    player.addPotionEffect(18,1,100,false)
    player.addPotionEffect(2,1,3,false)
  }
  if(bootslevelrequire>playerlevel){
    player.addPotionEffect(18,1,100,false)
    player.addPotionEffect(2,1,3,false)
  }
}