//===============================[SAO World Serve 套装效果脚本]=============================
//作者：shiny_Asuna

//未经授权禁止转载

var API=Java.type("noppes.npcs.api.NpcAPI").Instance()
var ResourceLocation=Java.type("net.minecraft.util.ResourceLocation");
var NameMap=Java.type("yesman.epicfight.main.EpicFightMod").getInstance().animationManager.getNameMap()
var TranslationTextComponent=Java.type("net.minecraft.util.text.TranslationTextComponent")
var UUID=Java.type("java.util.UUID")
var EpicFightCapabilities=Java.type("yesman.epicfight.world.capabilities.EpicFightCapabilities")
var StunType=Java.type("yesman.epicfight.api.utils.ExtendedDamageSource").StunType
var Animations=Java.type("yesman.epicfight.gameasset.Animations")
var BasicAttack=Java.type("yesman.epicfight.skill.BasicAttack")
var Integer=Java.type("java.lMHP.Integer")
var Effect=Java.type("net.minecraft.potion.Effect")
var EffectInstance=Java.type("net.minecraft.potion.EffectInstance")
var ForgeRegistries=Java.type("net.minecraftforge.registries.ForgeRegistries")
var AttributeModifier=Java.type("net.minecraft.entity.ai.attributes.AttributeModifier")

var timer=0
var nowwith
var storedwith
var neednbt=["koboldsuit","coyotesuit"]
var suitsprecount={"koboldsuit":0,"coyotesuit":0}
var 属性效果={
	"koboldsuit":[2,["",'25b55c5f-8a33-4457-997b-c51a18a8f3ba',0],["minecraft:generic.max_health",'25b55c5f-8a33-4457-997b-c51a18a8f3bb',5],["",'25b55c5f-8a33-4457-997b-c51a18a8f3bc',],["minecraft:generic.max_health",'25b55c5f-8a33-4457-997b-c51a18a8f3bd',10]],
	"coyotesuit":[2,["",'25b55c5f-8a33-4457-997c-c51a18a8f3ba',0],["epicfight:staminar",'25b55c5f-8a33-4457-997c-c51a18a8f3bb',2],["",'25b55c5f-8a33-4457-997c-c51a18a8f3bc',0],["epicfight:staminar",'25b55c5f-8a33-4457-997c-c51a18a8f3bd',4]]
}

function init(e){//如果在服务器更新了脚本，那把之前的值删除，避免属性叠加
	nowwith=[]
	storedwith=e.player.tempdata.get("suiteffect")
	for(var i in storedwith){
		removeAttributes(e.player,e.player.getMCEntity(),storedwith[i][0],storedwith[i][1])
		}
	}

function 统计盔甲(player){//统计每一种已经写了的盔甲，计分，用来统计身上每一种盔甲的数量
	var helmet=player.getArmor(3)
	suitsprecount[helmet.getNbt().getString("suit")]+=1
	var chestplate=player.getArmor(2)
	suitsprecount[chestplate.getNbt().getString("suit")]+=1
	var leggings=player.getArmor(1)
	suitsprecount[leggings.getNbt().getString("suit")]+=1
	var boots=player.getArmor(0)
	suitsprecount[boots.getNbt().getString("suit")]+=1
}

function tick(e){//每次盔甲更新进行一次判定
	timer+=1
	if(timer<=5){
		return
	}
	else{
		timer=0
	}
	suitsprecount={"koboldsuit":0,"coyotesuit":0}
	统计盔甲(e.player)
	nowwith=[]//重置目前的nowwith
	storedwith=e.player.tempdata.get("suiteffect")//读取上一次的suiteffect
	for(var x in neednbt){//遍历已经写了的套装效果
		if(属性效果[neednbt[x]][0]>suitsprecount[neednbt[x]]){
			continue}//拥有的该种盔甲数小于最低要求盔甲数，跳过
		else{
			for(var v=1;v<suitsprecount[neednbt[x]]+1;v++){//去看数量对应的列表index，如果该值的[0]有属性，就添加
				if(属性效果[neednbt[x]][v][0]!=""){
					nowwith.push(属性效果[neednbt[x]][v])//将该属性添加到当前的nowwith
					
				}
			}
		//e.player.message("当前nowwith值"+nowwith)
		e.player.tempdata.put("suiteffect",nowwith)//将当前的nowwith添加到suiteffect，为下一次遍历备用
		}
	}
	if(nowwith!=storedwith){//如果盔甲更新之后发现当前和上一次不一样
		for(var v=0;v<4;v++){
			if(storedwith==null){
				return
			}
			if(storedwith[v]!=null){//如果上次的属性不为空，清除上次属性
				//e.player.message("storedwith判定，移除"+storedwith[v][0]+"和"+storedwith[v][1])
				removeAttributes(e.player,e.player.getMCEntity(),storedwith[v][0],storedwith[v][1])
			}
			if(nowwith[v]!=null){//如果该次属性不为空，添加该次属性
				//e.player.message("nowwith判定，添加"+nowwith[v][0]+"和"+nowwith[v][2])
				addAttributes(e.player,e.player.getMCEntity(),nowwith[v][0],nowwith[v][1],nowwith[v][2],AttributeModifier.Operation.ADDITION)
				//e.player.message("实际添加:"+nowwith[v][0]+" uuid:"+nowwith[v][1]+" 等级"+nowwith[v][2])
			}
		}
	}
	else{
		return
		}
	}

function getAttribute(regName){return ForgeRegistries.ATTRIBUTES.getValue(regName)}
function addAttributes(player,mcEntity,regName,uuid,value,type){
	var attribute=getAttribute(regName)
	//player.message(attribute)
	API.executeCommand(player.getWorld(),"/attribute "+player.getDisplayName()+" "+regName+" modifier add "+uuid+" \"Sao_Suit_Effect\" "+value+" add")
	//mcEntity.func_110148_a(attribute).func_188479_b(uuid)
	//mcEntity.func_110148_a(attribute).func_233767_b_(new AttributeModifier(uuid, "Sao_Suit_Effect", value, type))
}
function removeAttributes(player,mcEntity,regName,uuid){
	var attribute=getAttribute(regName)
	API.executeCommand(player.getWorld(),"/attribute "+player.getDisplayName()+" "+regName+" modifier remove "+uuid)
	//mcEntity.func_110148_a(attribute).func_188479_b(uuid)
}