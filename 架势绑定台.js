//架势绑定台
/*
作者：shiny_Asuna
本脚本仅供SAO-Wrold Serve使用
他人禁止盗用
*/
//架势绑定台
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
var prefix="§7[§6SAO-World§7]§8[§a+§8]§7[§3架势系统§7]§7"//系统前缀
var 翻译={"sword":"直剑","longsword":"长剑","greatsword":"大剑","dagger":"匕首","spear":"长柄","tachi":"太刀","katana":"居合刀","swordthorn":"细剑","axe":"单手斧","all":"任意架势","guard":"防守架势","attack":"进攻架势","true":"默认"}
var weapontype_base=""
var transferd_type="true"
var 默认模板={"sword":"直剑普攻","longsword":"长剑普攻","greatsword":"大剑普攻","dagger":"匕首普攻","spear":"长枪普攻","tachi":"太刀普攻","katana":"居合刀普攻","swordthorn":"细剑普攻","axe":"单手斧普攻"}
//主体部分
function init(e){
	e.block.setModel("saomod:jia_shi_tai")
}
function interact(e){
	var player=e.player
	var item=player.getMainhandItem()
	var roll=player.getOffhandItem()
	var nbt=item.getNbt()
	var rollnbt=roll.getNbt()
	if(nbt.has('newitem')==true && nbt.has("sword")==true){
		weapontype_base="sword"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("longsword")==true){
		weapontype_base="longsword"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("greatsword")==true){
		weapontype_base="greatsword"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("spear")==true){
		weapontype_base="spear"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("swordthorn")==true){
		weapontype_base="swordthorn"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("tachi")==true){
		weapontype_base="tachi"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("dagger")==true){
		weapontype_base="dagger"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("katana")==true){
		weapontype_base="katana"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else if(nbt.has('newitem')==true && nbt.has("axe")==true){
		weapontype_base="axe"
		if(nbt.getString(weapontype_base)!="true"){
			transferd_type=nbt.getString(weapontype_base)
		}
	}
	else{
		player.message(prefix+"请主手手持需要改绑架势的武器点击架势台")
		return
	}
	BINDUI(e)

}
function BINDUI(e){
	var player=e.player
	var item=player.getMainhandItem()
	var roll=player.getOffhandItem()
	var nbt=item.getNbt()
	var rollnbt=roll.getNbt()
	var targetpose=rollnbt.getString("posename")
	var targetposedisplay=翻译[targetpose]
	var targetweapontype=rollnbt.getString("canapply")
	var gui = e.API.createCustomGui(1, 1000, 500, false)
	gui.addTexturedRect(1, "minecraft:textures/gui/posetableui.png", 380, 180, 256, 180, 0, 0)
    gui.addTexturedButton(2, "", 570 , 272 , 35, 15,"minecraft:textures/misc/enchanted_item_glint.png").setHoverText("绑定")
    gui.addTexturedButton(3, "", 515 , 272 , 35, 15,"minecraft:textures/misc/enchanted_item_glint.png").setHoverText("解绑")
	gui.addItemSlot(-3,94,item)
	gui.addItemSlot(-3,42,roll)
	gui.addLabel(4,targetposedisplay,540, 195, 40, 12)
	gui.addLabel(5,"§8当前架势："+翻译[transferd_type],495, 215, 40, 12)
	gui.addLabel(6,"§8改绑适用武器大类："+翻译[targetweapontype],495, 225, 40, 12)
	gui.addLabel(7,"§8当前武器大类："+翻译[weapontype_base],495, 235, 40, 12)
	if(targetweapontype==weapontype_base){
		gui.addLabel(8,"§8改绑验证："+"§a可以改绑",495, 245, 40, 12)
	}else{
		gui.addLabel(8,"§8改绑验证："+"§c无法改绑",495, 245, 40, 12)
	}
	e.player.showCustomGui(gui)
}

function customGuiButton(e){
	var gui = e.gui
    var API = e.API
    var player=e.player
	var item=player.getMainhandItem()
	var roll=player.getOffhandItem()
	var nbt=item.getNbt()
	var rollnbt=roll.getNbt()
	var targetpose=rollnbt.getString("posename")
	var targetposedisplay=翻译[targetpose]
	var targetweapontype=rollnbt.getString("canapply")
	var targetskillname=rollnbt.getString("skillname")
	if(e.buttonId==2){
		if(rollnbt.has("posename")==false){
			player.message(prefix+"请在副手手持架势卷轴，主手手持需要绑定的武器点击架势台")
			player.playSound("minecraft:ui.loom.take_result",1,1)
			player.closeGui()
			return
		}
		if(targetweapontype==weapontype_base){
			item.getNbt().putString(weapontype_base,targetpose)
			item.getNbt().putString("被动0",targetskillname)
			player.message(prefix+"绑定成功")
			player.playSound("minecraft:ui.cartography_table.take_result",1,1)
			player.closeGui()
		}else{
			player.message(prefix+"绑定失败")
			player.playSound("minecraft:block.lily_pad.place",1,1)
			player.closeGui()
		}
	}
	else if(e.buttonId==3){
		item.getNbt().putString(weapontype_base,"true")
		item.getNbt().putString("被动0",默认模板[weapontype_base])
		player.message(prefix+"解绑成功")
		player.playSound("minecraft:ui.cartography_table.take_result",1,1)
		player.closeGui()
	}
}
function customGuiSlotClicked(e){
	e.setCanceled(1)
}