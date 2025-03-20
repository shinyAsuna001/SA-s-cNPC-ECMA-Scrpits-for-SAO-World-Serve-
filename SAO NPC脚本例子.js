/*
史诗战斗npc AI系统
@atuhor Praise_suffering
2024/2/26
beta 0.1.0
Deprecated
需保留作者信息
其他随便改
*/
var NameMap=Java.type("yesman.epicfight.main.EpicFightMod").getInstance().animationManager.getNameMap()
var StunType=Java.type("yesman.epicfight.api.utils.ExtendedDamageSource").StunType
var Effect=Java.type("net.minecraft.potion.Effect")
var EffectInstance=Java.type("net.minecraft.potion.EffectInstance")
var ResourceLocation=Java.type("net.minecraft.util.ResourceLocation")
var Animations=Java.type("yesman.epicfight.gameasset.Animations")
var API=Java.type("noppes.npcs.api.NpcAPI").Instance()
var ExtendedDamageSource=Java.type("yesman.epicfight.api.utils.ExtendedDamageSource")
var GuardEvent=Java.type("tkk.epic.skill.SkillManager.GuardEvent")
var EpicFightCapabilities=Java.type("yesman.epicfight.world.capabilities.EpicFightCapabilities")
var ForgeRegistries=Java.type("net.minecraftforge.registries.ForgeRegistries")
var LongHitAnimation=Java.type("yesman.epicfight.api.animation.types.LongHitAnimation")
var DodgeAnimation=Java.type("yesman.epicfight.api.animation.types.DodgeAnimation")
var GuardAnimation=Java.type("yesman.epicfight.api.animation.types.GuardAnimation")
var PlayerEntity=Java.type("net.minecraft.entity.player.PlayerEntity")
var UseAction=Java.type("net.minecraft.item.UseAction")
var SPSpawnParticle=Java.type("tkk.epic.network.SPSpawnParticle")
var TkkEpicNetworkManager=Java.type("tkk.epic.network.TkkEpicNetworkManager")
var AirSlashAnimation=Java.type("yesman.epicfight.api.animation.types.AirSlashAnimation")
var SPPlaySound=Java.type("tkk.epic.network.SPPlaySound")
var Double=Java.type("java.lang.Double")
var ITextComponent=Java.type("net.minecraft.util.text.ITextComponent")
var EntityState=Java.type("yesman.epicfight.api.animation.types.EntityState")
var DeathMessage=false//是否启用死亡提示
var DetailedStatus=false//是否启用详细信息（占用称号栏，显示血量、耐力）
var 耐力值上限=10;
var 恢复耐力间隔=50;//距离多久没攻击回体
//耐力小于等于跑马耐力时开始跑马
var 跑马耐力=2;
var 每次恢复耐力=function(){return 1.0+Math.pow((耐力 / (耐力值上限 - 耐力 * 0.5)),2);}

var 新手=new 状态模板()



//肩扛主状态设置
新手.id="新手"

新手.攻击速度=1.35;
新手.追击速度=1.5;
新手.被打重置连段=false

var 前摇修正=0.1

//三个参数：动作模板，持续时间，攻击距离
var temp;
temp=new 自定义动作(NameMap.get(new ResourceLocation("epicfight:biped/combat/longsword_auto1")),0.0+前摇修正)
新手.addAttackAnimation(temp,0.6,3.4)

temp=new 自定义动作(Animations.LONGSWORD_AUTO2,0.0+前摇修正)
//temp.addTaril("Main",0.2,1.15,255,0,0,60,3,1)
//temp.addParticleTrail(true,"dust"," 1 0 0 1",0.2,1.15,0.33,1,0.15,1)
//temp.canBlock=false;
新手.addAttackAnimation(temp,0.6,3.4)

temp=new 自定义动作(Animations.LONGSWORD_AUTO3,0.2+前摇修正)
新手.addAttackAnimation(temp,0.6,3.6)

temp=new 自定义动作(Animations.LONGSWORD_DASH,-0.18+前摇修正)
temp.addTaril("Main",0.2,1.15,0,191,255,120,3,1)
temp.addParticleTrail(true,"dust"," 0 0 1 0.5",0.2,1.15,0.33,1,0.15,1)
temp.canDodge=false;
新手.setDashAttackAnimation(temp,0.8,3.7)

temp=new 自定义动作(Animations.LONGSWORD_AIR_SLASH,-0.1+前摇修正)
temp.addTaril("Main",0.2,1.15,255,59,59,120,3,1)
temp.addParticleTrail(true,"dust"," 1 0 0 0.5",0.2,1.15,0.33,1,0.15,1)
temp.canBlock=false;
temp.技能动作伤害倍率=0.65
新手.setAirSlashAnimation(temp,0.6,3.6)

//在外面制作动作模板，不要在节点内，那样吃性能

var 肘击动作=new 自定义动作(Animations.VANILLA_LETHAL_SLICING_START1,0.0)
肘击动作.击晕类型=StunType.LONG
肘击动作.技能动作冲击替换=0.1
肘击动作.技能动作伤害替换=1
var 肘击距离=3.5;
var 肘击持续时间=0.6
var 肘击消耗=200;
var 肘击冷却=60;
新手.set体术Animation(肘击动作,肘击持续时间,肘击距离,肘击消耗,肘击冷却)

新手.setDodgeAnimation(1.0,
	new 自定义动作(Animations.BIPED_STEP_FORWARD,0.0),
	new 自定义动作(Animations.BIPED_STEP_BACKWARD,0.0),
	new 自定义动作(Animations.BIPED_STEP_LEFT,0.0),
	new 自定义动作(Animations.BIPED_STEP_RIGHT,0.0)
)










function 切换状态(状态实例,npc){
	当前ai状态=状态实例
	当前ai状态.init(npc)
}
function 播放动作模板(patch,动作持续时间,动作模板){
	动作模板.playAnimation(patch)
	当前动作模板=动作模板
	动作剩余时间=动作模板.getTime(patch)*动作持续时间
}

//npc一开始的主状态
var 默认状态=新手;

//代码区，不用管！
var 当前ai状态;

var 模型动作状态=null;
var 攻击速度状态=null;
var 物品状态=null
var 属性状态=null

var 耐力=耐力值上限;
var 距离上一次动作=0;

var 当前动作模板=null;
var 动作剩余时间=0;



function init(e){
	e.npc.timers.forceStart(1,0,true);
	切换状态(默认状态,e.npc)
}
function timer(event){
	if(!event.npc.isAlive()){return}
	//若计时器触发号为1
	if(event.id == 1){
		var patch=获取patch(event.npc.getMCEntity())
		当前ai状态.tick(event.npc,patch)
	}
}
function tick(event){
	if(DetailedStatus){
		event.npc.getDisplay().setTitle(Math.ceil(event.npc.getHealth())+":生命值  该提示每秒更新一次  耐力:"+耐力.toFixed(2))
	}
}
function died(e){
	当前ai状态.died(e.npc,e.source,e)
	
}
function kill(e){
	if(!e.npc.isAlive()){return}
	当前ai状态.kill(e.npc,e.entity,e)
}
function attack(e){
	if(!e.getSource().func_76346_g().func_70089_S()){return}
	当前ai状态.attack(API.getIEntity(e.getSource().func_76346_g()),API.getIEntity(e.getEntityLiving()),e)
}
function damaged(e){
	if(!e.npc.isAlive()){
		return
	}else{
		if(e.npc.getPotionEffect(11)==-1){
			e.damage=e.damage*2.1
		}
		addPotionEffect(e.npc.getMCEntity(),"minecraft:resistance",18,0,true)}
	当前ai状态.hurt(e.npc,e.source,e)
}
function attackGuard(e){
	if(!e.damageSource.func_76346_g().func_70089_S()){return}
	var event=new GuardEvent(e)
	当前ai状态.attackGuard(API.getIEntity(e.damageSource.func_76346_g()),API.getIEntity(e.entity),event)
	e.impact=event.getImpact(e.impact);
	e.knockback=event.getKnockback(e.knockback);
	e.consumeAdd=event.consumeAdd;
	e.consumeScale=event.consumeScale;
	e.consumeAddScale=event.consumeAddScale;
}
function guard(e){
	if(!e.entity.func_70089_S()){return}
	var event=new GuardEvent(e)
	当前ai状态.guard(API.getIEntity(e.entity),API.getIEntity(e.damageSource.func_76346_g()),event)
	e.impact=event.getImpact(e.impact);
	e.knockback=event.getKnockback(e.knockback);
	e.consumeAdd=event.consumeAdd;
	e.consumeScale=event.consumeScale;
	e.consumeAddScale=event.consumeAddScale;
}
function tryHurt(e){
	//更高优先级的受到攻击,问就是史诗战斗给截胡了只能这样搞
	if(!e.patch.getOriginal().func_70089_S()){return}
	当前ai状态.tryHurt(API.getIEntity(e.patch.getOriginal()),e.patch,e)
}
//函数
function clamp(value,min,max) {
	if (value < min) {
		return min;
	} else {
		return value > max ? max : value;
	}
}
function 获取patch(entity){
	var patch=entity.getCapability(EpicFightCapabilities.CAPABILITY_ENTITY).orElse(null)
	return patch;
}
function 随机数(下限,上限){
	var Random=Java.type("java.util.Random")
	var rand=new Random()
	var numberA=上限-下限+1
	var 随机值=rand.nextInt(numberA)+下限
	return 随机值
}
function dotForYP(r, yawAngle, pitchAngle) {
  var JavaMath = Java.type("java.lang.Math");
  var coordinate = [0, 0, r]
  function rotateAroundAxisX(v, angle) {
    angle = JavaMath.toRadians(angle);
    var cos = JavaMath.cos(angle);
    var sin = JavaMath.sin(angle);
    var y = v[1] * cos - v[2] * sin;
    var z = v[1] * sin + v[2] * cos;
    return [y, z];
  }//让向量绕X轴转angle度
  function rotateAroundAxisY(v, angle) {
    angle = -angle;
    var angle = JavaMath.toRadians(angle);
    var cos = JavaMath.cos(angle);
    var sin = JavaMath.sin(angle);
    var x = v[0] * cos + v[2] * sin;
    var z = v[0] * -sin + v[2] * cos;
    return [x, z];
  }//让向量绕Y轴转angle度
  var temp = rotateAroundAxisX(coordinate, pitchAngle)
  coordinate[1] = temp[0];
  coordinate[2] = temp[1];
  temp = rotateAroundAxisY(coordinate, yawAngle)
  coordinate[0] = temp[0];
  coordinate[2] = temp[1];
  return coordinate;
  //因为原本算法并不太适应神奇的MC
  //星星进行了部分修改，现在可以完美的应用在游戏中了
  //参考开源代码:https://github.com/Slikey/EffectLib/blob/master/src/main/java/de/slikey/effectlib/util/VectorUtils.java
	/*
	*根据yaw、pitch求球上一点
	*double r:半径
	*double yawAngle:yaw角度
	*double pitchAngle:pitch角度
	*double rollAngle:roll角度
	*/
}
function 获取距离(ientityA,ientityB){
    var d0 = (ientityA.getX() - ientityB.getX());
    var d1 = (ientityA.getY() - ientityB.getY());
    var d2 = (ientityA.getZ() - ientityB.getZ());
    return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2);
}
function 获取角度(posA,posB){
	var d0=posA.getX()-posB.getX()
	var d2=posA.getZ()-posB.getZ()
	
	return wrapDegrees(Math.atan2(d2,d0) * (180 / (Math.PI)) - 90.0)
}
function wrapDegrees(a){
	var f = a % 360.0;
	if (f >= 180.0) {
		f -= 360.0;
	}
	if (f < -180.0) {
		f += 360.0;
	}
	return f;
}
function 看向目标(entity,x,y,z){
	var EntityAnchorArgument=Java.type("net.minecraft.command.arguments.EntityAnchorArgument").Type.FEET
	var Vector3d=Java.type("net.minecraft.util.math.vector.Vector3d")
	entity.func_200602_a(EntityAnchorArgument,new Vector3d(x,y,z))
	
	var yp=inverseDotYP(x-entity.func_226277_ct_(),y-entity.func_226278_cu_(),z-entity.func_226281_cx_())
	entity.field_70177_z=yp[0]
	entity.field_70125_A=yp[1]
}
function 移动坐标(entity,x,y,z){
	var MoverType=Java.type("net.minecraft.entity.MoverType")
	var Vector3d=Java.type("net.minecraft.util.math.vector.Vector3d")
	entity.func_213352_e(new Vector3d(x,y,z))
}
function 移动方向(entity,x,y,z){
	var MoverType=Java.type("net.minecraft.entity.MoverType")
	var Vector3d=Java.type("net.minecraft.util.math.vector.Vector3d")
	entity.field_70702_br=x
	entity.field_70701_bs=y;
	entity.field_191988_bg=z;
}
function 导航指定坐标(entity,speed,arg1,arg2,arg3){
	if(arg2==null){
		//向着实体移动
		entity.func_70661_as().func_75497_a(arg1,speed)
	}else{
		entity.func_70661_as().func_75492_a(arg1,arg2,arg3,speed)
	}
	
}
function 走位微调(entity,Forwards,Right){
	entity.func_70605_aq().func_188488_a(Forwards,Right)
}
function 清空导航(entity){
	entity.func_70661_as().func_75499_g()
}
function getSign(num) {
	if(num < 0){
		return -1;
	}else{
		return 1;
	}
}
function 添加攻击列表(entity,target){
	//向entity当前攻击的已攻击目标添加target
	var patch=获取patch(entity)
	if(patch==null){return}
	patch.currentlyAttackedEntity.add(target)
}
function addPotionEffect(mcEntity,id,tick,level,show){
	var p = ForgeRegistries.POTIONS.getValue(new ResourceLocation(id));
	if(p==null){return}
	mcEntity.func_195064_c(new EffectInstance(p,tick,level,show,show))
}
function hasPotionEffect(mcEntity,id){
	var p = ForgeRegistries.POTIONS.getValue(new ResourceLocation(id));
	if(p==null){return false}
	return mcEntity.func_70644_a(p)
}
function 尝试格挡(npc,e,是否为主动格挡,击退){
	var GuardIsBlockableEvent=Java.type("tkk.epic.event.GuardIsBlockableEvent")
	var MinecraftForge=Java.type("net.minecraftforge.common.MinecraftForge")
	var event=new GuardIsBlockableEvent(null,null,e.damageSource.getMCDamageSource(),e.damage,npc.getMCEntity(),击退,e.damageSource.getMCDamageSource().getImpact(),是否为主动格挡,true,是否为主动格挡)
	MinecraftForge.EVENT_BUS.post(event);
	return event
}
function dotYP(r,yaw,ptich){
	//优化
	var coordinate = [0, 0, r]
	var yawCos = Math.cos((Math.PI / 180)*(-yaw));
	var yawSin = Math.sin((Math.PI / 180)*(-yaw));
	var pitchCos = Math.cos((Math.PI / 180)*(ptich));
	var pitchSin = Math.sin((Math.PI / 180)*(ptich));
	var y= -r * pitchSin//1
	var z= r * pitchCos//2
	var x= z * yawSin//0
	z= z * yawCos//2
	return[x,y,z]
}
function inverseDotYP(x, y, z) {
    var r = Math.sqrt(x*x + y*y + z*z);
    
    // 计算yaw
    var yaw = Math.atan2(-x,z) * (180 / Math.PI);
    if (yaw < 0) {
        yaw += 360;
    }
    
    // 计算pitch
    var pitch = Math.asin(-y / r) * (180 / Math.PI);
    
    return [yaw, pitch];
}
function 是否格挡(entity){
	if(entity instanceof PlayerEntity){
		var patch=获取patch(entity)
		var hand=entity.func_184600_cs()
		var itemCap=patch.getHoldingItemCapability(hand)
		if(itemCap.getUseAnimation(patch) == UseAction.BLOCK){return true}
	}
	return false;
}
function 死亡提示(死亡npc,击杀者,mc物品){
	var 物品聊天组件=ITextComponent.Serializer.func_150696_a(mc物品.func_151000_E())
	var 组件列表=[]
	组件列表.push("\"§7[§6SAO-World§7]§f"+死亡npc.getName()+"被"+击杀者.getName()+"使用\"")
	组件列表.push(物品聊天组件)
	组件列表.push("\"§f杀死了\"")
	var a="["
	for(var x in 组件列表){
		a+=组件列表[x]
		a+=","
	}
	a+="\"\"]"
	
	API.executeCommand(死亡npc.getWorld(),"tellraw @a "+a)
	
}
function 获取当前动作前摇剩余时间(patch){
	var animationPlayer=patch.getAnimator().animationPlayer
	if(animationPlayer.getAnimation()==null){return null}
	var 反转=animationPlayer.isReversed() && animationPlayer.getAnimation().canBePlayedReverse()
	var 步进=animationPlayer.getAnimation().getPlaySpeed(patch) * 0.05
	var 长度;
	if(反转){
		长度=animationPlayer.getElapsedTime()
	}else{
		长度=animationPlayer.getAnimation().getTotalTime()-animationPlayer.getElapsedTime()
	}
	var 目标帧=获取动作帧起点(patch.getAnimator().animationPlayer.getAnimation(),EntityState.PHASE_LEVEL,2)
	if(目标帧==null && patch.getEntityState().getLevel()==1){目标帧=获取动作帧起点(patch.getAnimator().animationPlayer.getAnimation(),EntityState.PHASE_LEVEL,3)}
	if(目标帧==null){return null}
	var 剩余时间=目标帧/步进
	
	
	return Math.ceil(剩余时间)
}
function 获取动作帧起点(animation,targetKey,targetValue){
	//var targetKey=EntityState.PHASE_LEVEL
	//var targetValue=2;
	var stateSpectrum=animation.stateSpectrum
	if(stateSpectrum==null){return null}
	var iterator=stateSpectrum.timePairs.iterator()
	while(iterator.hasNext()){
		var state=iterator.next()
		var iteratorB=state.states.iterator()
		while(iteratorB.hasNext()){
			var pair=iteratorB.next()
			if(pair.getFirst()==targetKey && pair.getSecond()==targetValue){
				return state.start
			}
		}
	}
}

function 状态模板(){
	//获取状态id
	this.id="状态示例"
	//patch缓存，不用反复获取了就
	this.patch;
	
	this.被打重置连段=true;
	this.攻击速度=1.2;
	this.追击速度=2;
	this.获取移速=function(npc){
		var 速度=this.追击速度
		if(this.patch!=null){
			if(this.正在格挡(this.patch)){
				速度*=0.3
			}
			
		}
		return 速度
	}
	//行为树根节点
	//选择节点 按顺序循环run拥有的节点,节点返回true时打断循环 并且返回true,所有节点返回false时则返回false
	this.根节点=new 行为树选择节点()
	
	
	//格挡
	this.根节点.add(new 行为树条件节点(function(npc){
		if((当前ai状态.格挡时间>0 || 当前ai状态.格挡时间==-1) && (当前ai状态.格挡次数>0 || 当前ai状态.格挡次数==-1)){
			当前ai状态.patch.isGuard=true;
		}else{
			当前ai状态.patch.isGuard=false;
		}
		//npc.say(当前ai状态.patch.isGuard +" time"+当前ai状态.格挡时间+" count"+当前ai状态.格挡次数)
		if(当前ai状态.patch.isGuard){
			//在格挡
			if(模型动作状态!=当前ai状态.id+"格挡"){
				模型动作状态=当前ai状态.id+"格挡"
				当前ai状态.模型初始化(当前ai状态.patch)
				当前ai状态.格挡动作切换(当前ai状态.patch)
				//当前ai状态.patch.syncAnimator()
				当前ai状态.patch.modifyLivingMotionByCurrentItem()
				当前ai状态.patch.tkkNpcUpdata()
			}
		}else{
			//不在格挡
			if(模型动作状态!=当前ai状态.id){
				模型动作状态=当前ai状态.id
				当前ai状态.模型初始化(当前ai状态.patch)
				当前ai状态.动作初始化(当前ai状态.patch)
				//当前ai状态.patch.syncAnimator()
				当前ai状态.patch.modifyLivingMotionByCurrentItem()
				当前ai状态.patch.tkkNpcUpdata()
			}
		}
		return false;
	}))
	
	
	//序列节点 按顺序循环run拥有的节点,节点返回false时打断循环 并且返回false,如果都为true则返回true
	var 有目标时=new 行为树序列节点()
	//添加节点
	this.根节点.add(有目标时);
	
	
	
	//条件节点 直接运行，如果然后返回true或false
	//这里是如果有攻击目标 返回true 否则false
	有目标时.add(new 行为树条件节点(function(npc){return npc.getAttackTarget()!=null;}))
	//再添加是只有前面的条件节点成功了才会运行，因为false会直接break
	
	//是否启用跑马
	有目标时.add(new 行为树条件节点(function(npc){
		if(当前ai状态.跑马状态){
			if(耐力>=耐力值上限){当前ai状态.跑马状态=false}
		}else{
			if(耐力<=跑马耐力){
				当前ai状态.跑马状态=true
			}
		}
		return true;
	}))
	
	
	//移动
	有目标时.add(new 行为树条件节点(
		function(npc){
			//已经自动获取patch了
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			if(!state.turningLocked()){
				看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
			}
			if(state.movementLocked()){
				//移动锁了
				清空导航(npc.getMCEntity())
				走位微调(npc.getMCEntity(),0,0)
			}else{
				if(!当前ai状态.跑马状态){
					//开冲，打进攻
					导航指定坐标(npc.getMCEntity(),当前ai状态.获取移速(npc),target.getMCEntity())
				}else{
					//清空导航(npc.getMCEntity())
					走位微调(npc.getMCEntity(),-当前ai状态.获取移速(npc)*0.34,0)
				}
			}
			//这个为true的时候 相当于玩家按住s 一些攻击动作不会向前移动 
			//patch.blockMoving=false
			
			return true
		}
	))
	
	//因为这个节点是直接加进去的，如果返回false会打断，所以全部返回true，除非你触发了闪避不执行后续
	//闪避判断 在对方已抬手 自身处于后摇 闲置 状态时闪避   如果距离较远则前闪，否则随机 如果对方进行突刺 则不闪避
	有目标时.add(new 行为树条件节点(
		function(npc){
			//仁慈越大失误越多
			var 蓝刀仁慈=8//遇上蓝刀切格挡
			var 红刀仁慈=8//格挡时对方跳劈
			var 取消前摇仁慈=8//自己比对面慢，取消自己前摇
			var 跳劈仁慈=8//在跳劈时
			var 闪避仁慈=8//总的
			//已经自动获取patch了
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			var targetPatch=获取patch(target.getMCEntity())
			
			var 自身在闪避=(patch.getAnimator().animationPlayer.getAnimation() instanceof DodgeAnimation || patch.getAnimator().nextPlaying instanceof DodgeAnimation)
			if(自身在闪避){
				return false
			}
			if(patch.isJump && 随机数(0,跳劈仁慈)!=0){
				return false
			}
			var dsc=targetPatch.tkkCustomADS.getDSC()
			var 目标破闪避=(dsc!=null)?!dsc.canDodge:false
			if(目标破闪避 && (targetPatch.getEntityState().getLevel()==1 || targetPatch.getEntityState().getLevel()==2)){
				//当前ai状态.开始格挡(patch,1,8)
				if(随机数(0,蓝刀仁慈)==0){
					var 格挡次数=随机数(1,3)
					当前ai状态.开始格挡(patch,格挡次数,格挡次数*5+随机数(1,4))
				}
				return false
			}
			if(当前ai状态.正在格挡(patch)){
				var 对方在跳劈=(targetPatch.getAnimator().nextPlaying instanceof AirSlashAnimation) || (targetPatch.getAnimator().animationPlayer.getAnimation() instanceof AirSlashAnimation)
				if(对方在跳劈&&随机数(0,红刀仁慈)!=0){
					对方在跳劈=false
					当前ai状态.格挡时间+=1;
				}
				if(!对方在跳劈){
					return false
				}
			}
			if(耐力<当前ai状态.闪避消耗){return true}
			if(targetPatch.getEntityState().getLevel()==1 || targetPatch.getEntityState().getLevel()==2){
				//目标在抬手动作
				var 取消前摇=false;
				if(state.getLevel()==1 || state.getLevel()==2){
					var 自身前摇=获取当前动作前摇剩余时间(patch)
					var 目标前摇=获取当前动作前摇剩余时间(targetPatch)
					if((自身前摇==null || 目标前摇==null) || (自身前摇>目标前摇)){
						取消前摇=true;
					}
				}
				if(取消前摇 && 随机数(0,取消前摇仁慈)!=0){取消前摇=false}
				if((state.getLevel()==0 || state.getLevel()==3 || 取消前摇) && !state.hurt()){
					//自身在闲置或后摇 且不是受伤状态
					var 目标距离=获取距离(npc,target)
					//太远了，多半打不到，不闪
					if(目标距离>7){return true;}
					//除非踏步拉近距离，否则概率闪
					if(目标距离<5 && 随机数(0,闪避仁慈)!=0){return true}
					//符合条件时替换格挡
					if(state.getLevel()==0){
						var 对方在跳劈=(targetPatch.getAnimator().nextPlaying instanceof AirSlashAnimation) || (targetPatch.getAnimator().animationPlayer.getAnimation() instanceof AirSlashAnimation)
						if(!对方在跳劈 && 随机数(0,2)==0){
							var 格挡次数=随机数(1,2)
							当前ai状态.开始格挡(patch,格挡次数,格挡次数*5+随机数(1,3))
							return false
						}
					}
					
					
					var 闪避动作=随机数(1,4);
					if(目标距离>5){
						//远了，前闪拉近距离
						闪避动作=1
					}
					if(当前ai状态.跑马状态){
						//如果是跑马则无脑后闪
						闪避动作=2
					}
					if(取消前摇){
						闪避动作=1
					}
					看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
					var 修正=function(value){
						var a=Math.round(value/90)
						return a
					}
					var 可用方向=[1,2,3,4]
					for(var i=0;i<可用方向.length;i++){
						switch(可用方向[i]){
							case 1:
								var yaw=patch.getOriginal().field_70177_z
								var yp=dotYP(1,Math.round(yaw/90)*90,0)
								if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
									可用方向.splice(i,1)
									i-=1;
									continue
								}
								break
							case 2:
								var yaw=patch.getOriginal().field_70177_z
								var yp=dotYP(1,Math.round(yaw/90)*90,0)
								if(!npc.getWorld().getBlock(npc.getPos().add(-yp[0],0,-yp[2])).isAir()){
									可用方向.splice(i,1)
									i-=1;
									continue
								}
								break
							case 3:
								var yaw=patch.getOriginal().field_70177_z-90
								if(yaw>360){yaw-=360}
								if(yaw<0){yaw+=360}
								var yp=dotYP(1,Math.round(yaw/90)*90,0)
								if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
									可用方向.splice(i,1)
									i-=1;
									continue
								}
								break
							case 4:
								var yaw=patch.getOriginal().field_70177_z+90
								if(yaw>360){yaw-=360}
								if(yaw<0){yaw+=360}
								var yp=dotYP(1,Math.round(yaw/90)*90,0)
								if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
									可用方向.splice(i,1)
									i-=1;
									continue
								}
								break
						}
					}
					
					if(可用方向.length>0 && 可用方向.indexOf(闪避动作)==-1){
						闪避动作=可用方向[随机数(0,可用方向.length-1)]
					}
					
					
					
					switch(闪避动作){
						case 1:
							闪避动作=当前ai状态.前闪
							break
						case 2:
							闪避动作=当前ai状态.后闪
							break
						case 3:
							闪避动作=当前ai状态.左闪
							break
						case 4:
							闪避动作=当前ai状态.右闪
							break
					}
					当前ai状态.娴熟可用=当前ai状态.启用娴熟
					播放动作模板(当前ai状态.patch,闪避动作[1],闪避动作[0])
					当前ai状态.攻击段数=0;
					耐力-=当前ai状态.闪避消耗
					当前ai状态.patch.isJump=false;
					if(随机数(0,1)==0){当前ai状态.开始格挡(0,0)}
					//进行闪避，取消其他判断
					return false;
				}
				
			}
			
			return true
		}
	))
	
	//加个检测，如果在格挡状态，则不执行后续 如果不能格挡则取消格挡
	//在格挡动作不执行后续 ef的格挡动作持续时间短的离谱和玩家不一样 只能先这样修
	有目标时.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			if(当前ai状态.正在格挡(patch)){
				/*
				if(patch.getEntityState().getLevel()!=0){
					patch.isGuard=false
					当前ai状态.开始格挡(patch,0,0)
					return true
				}
				*/
				return false
			}
			//var 自身在格挡=(patch.getAnimator().nextPlaying instanceof GuardAnimation) || (patch.getAnimator().animationPlayer.getAnimation() instanceof GuardAnimation)
			if(当前ai状态.格挡动作时间修复>0){return false}
			return true
		}
	))
	
	
	//特殊攻击
	var 特殊攻击节点=new 行为树随机节点(true)
	有目标时.add(特殊攻击节点);
	//肘击 用于反撞 我也不知道这怎么写成的屎山
	特殊攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			
			if(耐力<当前ai状态.体术消耗){return false}
			if(当前ai状态.体术冷却>0){
				当前ai状态.目标因霸体而无法反撞=false;
				return false
			}
			var 目标距离=获取距离(npc,target)
			var 攻击距离=当前ai状态.体术距离
			if(当前ai状态.目标因霸体而无法反撞){
				if(hasPotionEffect(target.getMCEntity(),"epicfight:stun_immunity")){
					return false
				}
				当前ai状态.目标因霸体而无法反撞=false;
				播放动作模板(当前ai状态.patch,当前ai状态.体术持续时间,当前ai状态.体术动作)
				看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
				当前ai状态.攻击段数=0;
				当前ai状态.体术冷却=当前ai状态.体术冷却上限
				耐力-=当前ai状态.体术消耗
				return true
			}
			if(目标距离>攻击距离){return false}
			//反撞执行,其他的不执行
			if(!state.hurt()){return false}
			var 僵直时间=0
			if(patch.getAnimator().nextPlaying!=null){
				僵直时间=patch.getAnimator().nextPlaying.getTotalTime()
			}
			if(僵直时间<0.5){return false}
			if(随机数(1,3)==1){return false;}
			if(hasPotionEffect(target.getMCEntity(),"epicfight:stun_immunity")){
				当前ai状态.目标因霸体而无法反撞=true;
				return false
			}
			播放动作模板(当前ai状态.patch,当前ai状态.体术持续时间,当前ai状态.体术动作)
			if(!state.turningLocked()){看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())}
			当前ai状态.攻击段数=0;
			当前ai状态.体术冷却=当前ai状态.体术冷却上限
			耐力-=当前ai状态.体术消耗
			
			return true
		}
	))
	//跳劈 用于破格挡 随机破节奏
	特殊攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			var 随机=随机数(0,8)
			if(当前ai状态.跳劈冷却>0){return false;}
			if(耐力<当前ai状态.跳劈消耗){return false}
			if(!state.canBasicAttack()){return false}
			//这个canAirSlash是npc专用的，和jump方法 isJump绑定的
			if(patch.canAirSlash()){
				播放动作模板(当前ai状态.patch,当前ai状态.跳劈持续时间,当前ai状态.跳劈动作)
				看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
				耐力-=当前ai状态.跳劈消耗
				当前ai状态.跳劈冷却=当前ai状态.跳劈冷却上限
			}
			if(patch.isJump){
				return false;
			}
			if(state.movementLocked()){
				当前ai状态.准备跳劈=30
				return false
			}
			if(!npc.getMCEntity().func_233570_aj_()){return false}
			var 目标距离=获取距离(npc,target)
			var 攻击距离=当前ai状态.跳劈距离
			if(目标距离>攻击距离){return false}
			var 目标格挡=是否格挡(target.getMCEntity())
			if(!目标格挡 && 随机!=8){return false}
			if(目标格挡 && 随机<=6){return false}
			patch.jump(0.42)
			return true
		}
	))
	
	
	
	//加个检测，如果在跳跃中则不执行基础攻击，用于跳劈
	有目标时.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			if(patch.isJump){
				return false
			}
			if(patch.准备跳劈>0){
				return false;
			}
			return true
		}
	))
	
	//基础攻击
	var 基础攻击节点=new 行为树随机节点(true)
	有目标时.add(基础攻击节点);
	
	//如果返回false则代表攻击不超过，尝试其他的攻击
	//普通攻击
	基础攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			
			if(!state.canBasicAttack()){return false}
			var 目标距离=获取距离(npc,target)
			if(当前ai状态.攻击段数>=当前ai状态.攻击动作.length){当前ai状态.攻击段数=0}
			var 攻击距离=当前ai状态.攻击距离[当前ai状态.攻击段数]
			var 目标在闪避=(获取patch(target.getMCEntity()).getAnimator().nextPlaying instanceof DodgeAnimation) || (获取patch(target.getMCEntity()).getAnimator().animationPlayer.getAnimation() instanceof DodgeAnimation)
			if(目标在闪避 && 当前ai状态.移动锁定后突刺){return false}
			if(目标在闪避 && 随机数(1,3)==1){return false}
			//如果空闲下次攻击变跑a
			if(距离上一次动作>=2 && 随机数(1,3)<3){return false}
			if(目标距离>攻击距离){return false}
			//停止前踏攻击 保持距离
			if(目标距离<攻击距离*0.4 || 当前ai状态.跑马状态){
				patch.blockMoving=true
			}else{
				patch.blockMoving=false
			}
			播放动作模板(当前ai状态.patch,当前ai状态.动作持续时间[当前ai状态.攻击段数],当前ai状态.攻击动作[当前ai状态.攻击段数])
			看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
			当前ai状态.攻击段数+=1;
			当前ai状态.移动锁定后突刺=false;
			if(当前ai状态.攻击段数!=0 && 随机数(0,4)==0){
				var 格挡次数=随机数(1,2)
				当前ai状态.开始格挡(patch,格挡次数,格挡次数*3+随机数(1,4))
			}
			return true
		}
	))
	//突刺攻击 距离过远或破闪避
	基础攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			
			if(!state.canBasicAttack()){return false}
			var 目标距离=获取距离(npc,target)
			//别看这一坨，其实就是获取攻击距离 里面的三目运算符(条件)?真:假就是获取下次攻击用的哪一段
			var 普攻距离=当前ai状态.攻击距离[(当前ai状态.攻击段数>=当前ai状态.攻击动作.length)?0:当前ai状态.攻击段数]
			var 距离修正=1.4
			var 攻击距离=当前ai状态.突刺距离
			if(攻击距离*距离修正>=目标距离 && !state.movementLocked() && 当前ai状态.移动锁定后突刺){
				播放动作模板(当前ai状态.patch,当前ai状态.突刺持续时间,当前ai状态.突刺动作)
				看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
				当前ai状态.攻击段数=0;
				当前ai状态.移动锁定后突刺=false;
				return true
			}
			if(距离上一次动作>=2){攻击距离=攻击距离*距离修正}
			var 目标在闪避=(获取patch(target.getMCEntity()).getAnimator().nextPlaying instanceof DodgeAnimation) || (获取patch(target.getMCEntity()).getAnimator().animationPlayer.getAnimation() instanceof DodgeAnimation)
			if(攻击距离<目标距离 || (普攻距离>=目标距离 && !目标在闪避)){return false}
			if(state.movementLocked()){
				当前ai状态.移动锁定后突刺=true
				return false
			}
			播放动作模板(当前ai状态.patch,当前ai状态.突刺持续时间,当前ai状态.突刺动作)
			看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
			当前ai状态.攻击段数=0;
			当前ai状态.移动锁定后突刺=false;
			return true
		}
	))
	//肘击取消后摇
	基础攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			//这不是反撞用的
			if(state.hurt()){return false}
			//只取消后摇
			if(state.getLevel()!=3){return false}
			if(耐力<当前ai状态.体术消耗){return false}
			if(当前ai状态.体术冷却>0){return false}
			var 目标距离=获取距离(npc,target)
			var 攻击距离=当前ai状态.体术距离
			if(目标距离>攻击距离){return false}
			if(随机数(0,3)!=0){return false}
			播放动作模板(当前ai状态.patch,当前ai状态.体术持续时间,当前ai状态.体术动作)
			看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
			当前ai状态.攻击段数=0;
			当前ai状态.体术冷却=当前ai状态.体术冷却上限
			耐力-=当前ai状态.体术消耗
			return true
		}
	))
	//闪避取消后摇
	基础攻击节点.add(new 行为树条件节点(
		function(npc){
			var patch=当前ai状态.patch
			var target=npc.getAttackTarget()
			var state=patch.getEntityState()
			//这不是反撞用的
			if(state.hurt()){return false}
			//只取消后摇
			if(state.getLevel()!=3){return false}
			if(耐力<当前ai状态.闪避消耗){return false}
			if(当前ai状态.平a接闪cd>0){return false}
			if(随机数(0,3)!=0){return false}
			var 可用方向=[1,2,3,4]
			var 闪避动作=随机数(1,4)
			for(var i=0;i<可用方向.length;i++){
				switch(可用方向[i]){
					case 1:
						var yaw=patch.getOriginal().field_70177_z
						var yp=dotYP(1,Math.round(yaw/90)*90,0)
						if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
							可用方向.splice(i,1)
							i-=1;
							continue
						}
						break
					case 2:
						var yaw=patch.getOriginal().field_70177_z
						var yp=dotYP(1,Math.round(yaw/90)*90,0)
						if(!npc.getWorld().getBlock(npc.getPos().add(-yp[0],0,-yp[2])).isAir()){
							可用方向.splice(i,1)
							i-=1;
							continue
						}
						break
					case 3:
						var yaw=patch.getOriginal().field_70177_z-90
						if(yaw>360){yaw-=360}
						if(yaw<0){yaw+=360}
						var yp=dotYP(1,Math.round(yaw/90)*90,0)
						if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
							可用方向.splice(i,1)
							i-=1;
							continue
						}
						break
					case 4:
						var yaw=patch.getOriginal().field_70177_z+90
						if(yaw>360){yaw-=360}
						if(yaw<0){yaw+=360}
						var yp=dotYP(1,Math.round(yaw/90)*90,0)
						if(!npc.getWorld().getBlock(npc.getPos().add(yp[0],0,yp[2])).isAir()){
							可用方向.splice(i,1)
							i-=1;
							continue
						}
						break
				}
			}
			
			if(可用方向.length>0 && 可用方向.indexOf(闪避动作)==-1){
				闪避动作=可用方向[随机数(0,可用方向.length-1)]
			}
			switch(闪避动作){
				case 1:
					闪避动作=当前ai状态.前闪
					break
				case 2:
					闪避动作=当前ai状态.后闪
					break
				case 3:
					闪避动作=当前ai状态.左闪
					break
				case 4:
					闪避动作=当前ai状态.右闪
					break
			}
			播放动作模板(当前ai状态.patch,闪避动作[1],闪避动作[0])
			看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
			当前ai状态.攻击段数=0;
			当前ai状态.平a接闪cd=当前ai状态.平a接闪冷却
			耐力-=当前ai状态.闪避消耗
			return true
		}
	))
	
	this.格挡动作切换=function(patch){
		this.动作初始化(patch)
		patch.putAnimatorIdList("IDLE",Animations.LONGSWORD_GUARD)
		patch.putAnimatorIdList("WALK",Animations.LONGSWORD_GUARD)
	}
	
	
	this.动作格挡成功=[new 基础动作(Animations.LONGSWORD_GUARD_ACTIVE_HIT1,0),new 基础动作(Animations.LONGSWORD_GUARD_ACTIVE_HIT2,0)]
	this.动作格挡破防=new 基础动作(Animations.COMMON_GUARD_BREAK,0)
	this.格挡段数=0;
	this.格挡成功动作=function(){
		if(this.格挡段数>=this.动作格挡成功.length){
			this.格挡段数=0
		}
		var 动作=this.动作格挡成功[this.格挡段数]
		this.格挡段数+=1;
		return 动作
	}
	this.格挡破防动作=function(){return this.动作格挡破防}
	this.格挡消耗体力=0.1;
	this.主动格挡=false;//如果true 则不会因耐力耗尽而破防
	this.格挡次数=0;
	this.格挡时间=0;
	this.格挡动作时长=3;//格挡动作的时间长度
	this.格挡动作时间修复=0;//cd 用于修复格挡动作时长不对
	this.正在格挡=function(patch){
		if(patch.isGuard){return true}
		return false
	}
	this.开始格挡=function(patch,次数,时间){
		//-1代表无限
		this.格挡次数=次数
		this.格挡时间=时间
	}
	
	
	
	this.攻击动作=[]
	this.动作持续时间=[]
	this.攻击距离=[]
	//添加普攻动作
	this.addAttackAnimation=function(动作模板,动作持续时间,攻击距离){
		this.攻击动作[this.攻击动作.length]=动作模板
		this.动作持续时间[this.动作持续时间.length]=动作持续时间
		this.攻击距离[this.攻击距离.length]=攻击距离
	}
	//默认ai 突刺只会在普攻摸不到的情况下使用
	this.突刺动作=null;
	this.突刺持续时间=null;
	this.突刺距离=null;
	this.移动锁定后突刺=false;
	this.setDashAttackAnimation=function(动作模板,动作持续时间,攻击距离){
		this.突刺动作=动作模板
		this.突刺持续时间=动作持续时间
		this.突刺距离=攻击距离
	}
	//默认ai 跳劈会对方格挡或者随机使用
	this.跳劈动作=null;
	this.跳劈持续时间=null;
	this.跳劈距离=null;
	this.跳劈消耗=1;
	this.跳劈冷却=0;//cd
	this.跳劈冷却上限=25;
	this.准备跳劈=0;//准备跳劈时不会进行普通攻击
	this.setAirSlashAnimation=function(动作模板,动作持续时间,攻击距离){
		this.跳劈动作=动作模板
		this.跳劈持续时间=动作持续时间
		this.跳劈距离=攻击距离
	}
	this.体术动作=null;
	this.体术持续时间=null;
	this.体术距离=null;
	this.体术消耗=1;
	this.体术冷却上限=25;
	this.体术冷却=0;//cd
	this.目标因霸体而无法反撞=false;
	this.set体术Animation=function(动作模板,动作持续时间,攻击距离,消耗,冷却){
		this.体术动作=动作模板
		this.体术持续时间=动作持续时间
		this.体术距离=攻击距离
		this.体术消耗=消耗;
		this.体术冷却上限=冷却;
	}
	
	this.前闪=null;
	this.后闪=null;
	this.左闪=null;
	this.右闪=null;
	this.闪避消耗=3;
	this.启用娴熟=true;
	this.娴熟可用=false;
	this.平a接闪cd=0;//cd
	this.平a接闪冷却=70;
	this.setDodgeAnimation=function(动作持续时间,前闪动作,后闪动作,左闪动作,右闪动作){
		this.前闪=[前闪动作,动作持续时间]
		this.后闪=[后闪动作,动作持续时间]
		this.左闪=[左闪动作,动作持续时间]
		this.右闪=[右闪动作,动作持续时间]
	}
	
	this.跑马状态=false;
	
	this.攻击段数=0;
	
	//获取id
	this.getName=function(){return this.id}
	
	//主状态的事件由行为状态调用！可能不会调用，看你行为状态咋写的
	//init除外
	
	//npc死亡
	this.died=function(npc,target,e){
		if(target==null){return}
		if(DeathMessage){死亡提示(npc,target,target.getMainhandItem().getMCItemStack())}
	}
	//npc击杀实体
	this.kill=function(npc,target,e){
		
	}
	//npc造成伤害
	this.attack=function(npc,target,e){
		if(e.getSource() instanceof ExtendedDamageSource){
			if(动作剩余时间>0){
				当前动作模板.hitTarget(npc.getMCEntity(),target.getMCEntity())
			}
			//狂热回体
			耐力=Math.min(耐力+1,耐力值上限)
		}
	}
	//npc受到伤害
	this.hurt=function(npc,target,e){
		if(this.被打重置连段 && e.damageSource.getMCDamageSource() instanceof ExtendedDamageSource){
			this.攻击段数=0
		}
		this.准备跳劈=0;
		if(this.patch==null){return}
		this.patch.isJump=false;
		if(e.damageSource.getMCDamageSource() instanceof ExtendedDamageSource && (this.patch.isGuard) && this.patch.getEntityState().getLevel()==0){
			//正在格挡
			var blockEvent=尝试格挡(npc,e,true,0.25+Math.min(e.damageSource.getMCDamageSource().getImpact(),1.0))
			if(blockEvent.canBlock){
				//这次攻击可以被格挡
				e.setCanceled(true)
				var 消耗=blockEvent.getConsume(this.格挡消耗体力*blockEvent.impact)
				if(耐力<消耗 && !this.主动格挡){
					//格挡破防
					耐力=耐力值上限
					npc.getWorld().playSoundAt(npc.getPos(),"epicfight:entity.hit.clash",1,1)
					this.patch.knockBackEntity(e.damageSource.getMCDamageSource().func_76364_f().func_213303_ch(),blockEvent.knockback)
					播放动作模板(this.patch,1.0,this.格挡破防动作())
					npc.getWorld().spawnParticle("epicfight:hit_blunt",npc.getX()+getSign(target.getX()-npc.getX())*0.6,npc.getY()+getSign(target.getY()-npc.getY())*0.6,npc.getZ()+getSign(target.getZ()-npc.getZ())*0.6,0.3,0.3,0.3,0.04,8);
					看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
					添加攻击列表(target.getMCEntity(),npc.getMCEntity())
					//如果被破格挡了就取消
					this.格挡次数=0
					this.格挡时间=0
				}else{
					//格挡成功
					npc.getWorld().playSoundAt(npc.getPos(),"epicfight:entity.hit.clash",1,1)
					this.patch.knockBackEntity(e.damageSource.getMCDamageSource().func_76364_f().func_213303_ch(),blockEvent.knockback*0.4)
					播放动作模板(this.patch,1.0,this.格挡成功动作())
					this.格挡动作时间修复=this.格挡动作时长;
					npc.getWorld().spawnParticle("epicfight:hit_blunt",npc.getX()+getSign(target.getX()-npc.getX())*0.6,npc.getY()+getSign(target.getY()-npc.getY())*0.6,npc.getZ()+getSign(target.getZ()-npc.getZ())*0.6,0.3,0.3,0.3,0.04,8);
					看向目标(npc.getMCEntity(),target.getX(),target.getY(),target.getZ())
					添加攻击列表(target.getMCEntity(),npc.getMCEntity())
					if(this.格挡次数>0 && this.格挡次数!=-1){this.格挡次数-=1;}
				}
				
			}else{
				//如果被破格挡了就取消
				this.格挡次数=0
				this.格挡时间=0
			}
			
		}
	}
	//尝试伤害事件 修复史诗战斗截胡事件的问题 主要是做娴熟闪避特效
	this.tryHurt=function(npc,patch,e){
		if(!this.娴熟可用){return}
		var 自身在闪避=patch.getAnimator().animationPlayer.getAnimation() instanceof DodgeAnimation
		if(自身在闪避){
			var 目标=e.damageSource.func_76346_g()
			if(目标!=null){
				var targetPatch=获取patch(目标)
				var dsc=targetPatch.tkkCustomADS.getDSC()
				var 目标破闪避=(dsc!=null)?!dsc.canDodge:false
				if(目标破闪避){return}
			}
			this.娴熟可用=false;
			var w = e.patch.getOriginal().field_70170_p;
			var packet = new SPSpawnParticle();
			packet.addParticle("epicfight:after_image", e.patch.getOriginal().func_226277_ct_(), e.patch.getOriginal().func_226278_cu_(), e.patch.getOriginal().func_226281_cx_(), Double.longBitsToDouble(e.patch.getOriginal().func_145782_y()), 0.0, 0.0);
			TkkEpicNetworkManager.sendNearby(e.patch.getOriginal().field_70170_p, e.patch.getOriginal().func_233580_cy_(), 16, packet);
			var packet2 = new SPPlaySound("epicfight:skill.technician", e.patch.getOriginal().func_233580_cy_(), 10.0, 1.0);
			TkkEpicNetworkManager.sendNearby(e.patch.getOriginal().field_70170_p, e.patch.getOriginal().func_233580_cy_(), 16, packet2);
			耐力=Math.min(耐力+this.闪避消耗,耐力值上限)
		}
	}
	//攻击被格挡事件
	this.attackGuard=function(npc,target,e){
		if(动作剩余时间>0){
			当前动作模板.hitGuard(e)
		}
	}
	//格挡事件(你得先自己触发格挡才会有这个事件！)
	this.guard=function(npc,target,e){
		e.sourceEvent.knockback=0
	}
	//tick
	this.tick=function(npc,patch){
		this.patch=patch;
		var state=patch.getEntityState()
		if(this.跳劈冷却>0){this.跳劈冷却-=1;}
		if(this.体术冷却>0){this.体术冷却-=1;}
		if(this.平a接闪cd>0){this.平a接闪cd-=1;}
		if(this.格挡时间>0 && this.格挡时间!=-1 && state.getLevel()==0){this.格挡时间-=1;}
		if(this.格挡动作时间修复>0){this.格挡动作时间修复-=1;}
		if(this.准备跳劈>0){this.准备跳劈-=1;}
		if(state.inaction()){
			距离上一次动作=0;
		}else{
			//无行动，在这搞事
			距离上一次动作+=1;
			if(距离上一次动作>=恢复耐力间隔 && 耐力<耐力值上限){
				耐力=Math.min(耐力+每次恢复耐力(),耐力值上限)
			}
		}
		this.根节点.run(npc)
	}
	//初始化
	this.init=function(npc){
		var patch=获取patch(npc.getMCEntity())
		this.patch=patch;
		if(攻击速度状态!=this.id){
			攻击速度状态=this.id
			patch.setTkkCustomSpeed(this.攻击速度)
			patch.setTkkEnableCustom(true)
			patch.tkkUpdata()
		}
		if(模型动作状态!=this.id){
			模型动作状态=this.id
			this.模型初始化(patch)
			this.动作初始化(patch)
			//patch.syncAnimator()
			patch.modifyLivingMotionByCurrentItem()
			patch.tkkNpcUpdata()
		}
		if(物品状态!=this.id){
			//物品状态=this.id;
		}
		if(属性状态!=this.id){
			//属性状态=this.id;
		}
		this.根节点.run(npc)
		
	}
	this.模型初始化=function(patch){
		patch.model=new ResourceLocation("epicfight", "entity/biped_old_texture");
	}
	this.动作初始化=function(patch){
		patch.animationIdList.clear()
		patch.putAnimatorIdList("IDLE",Animations.BIPED_IDLE)
		patch.putAnimatorIdList("WALK",Animations.BIPED_WALK)
		patch.putAnimatorIdList("DEATH",Animations.BIPED_DEATH)
		patch.putAnimatorIdList("JUMP",Animations.BIPED_JUMP)
	}
	


}



function 行为状态示例(){
	//获取状态id
	this.id="行为状态示例"
	//patch缓存，不用反复获取了就
	this.patch;
	
	
	//获取id
	this.getName=function(){return this.id}
	//npc死亡
	this.died=function(npc,target,e){
		当前主状态.died(npc,target,e)
	}
	//npc击杀实体
	this.kill=function(npc,target,e){
		当前主状态.kill(npc,target,e)
	}
	//npc造成伤害
	this.attack=function(npc,target,e){
		当前主状态.attack(npc,target,e)
	}
	//npc受到伤害
	this.hurt=function(npc,target,e){
		当前主状态.hurt(npc,target,e)
	}
	//攻击被格挡事件
	this.attackGuard=function(npc,target,e){
		当前主状态.attackGuard(npc,target,e)
	}
	//格挡事件(你得先自己触发格挡才会有这个事件！)
	this.guard=function(npc,target,e){
		当前主状态.guard(npc,target,e)
	}
	//tick
	this.tick=function(npc,patch){
		this.patch=patch;
		当前主状态.tick(npc,patch)
		
		var state=patch.getEntityState()
		if(state.inaction()){
			//有行动，一般无反应
			距离上一次动作=0;
			清空导航(npc.getMCEntity())
		}else{
			//无行动，在这搞事
			距离上一次动作+=1;
			if(距离上一次动作>=恢复耐力间隔){耐力=Math.min(耐力+每次恢复耐力(),耐力值上限)}
		}
	}
	//初始化
	this.init=function(npc){
		var patch=获取patch(npc.getMCEntity())
		this.patch=patch;
		if(攻击速度状态!=this.id){
			攻击速度状态=this.id
			patch.setTkkCustomSpeed(1.6)
			patch.setTkkEnableCustom(true)
			patch.tkkUpdata()
		}
		if(模型动作状态!=this.id){
			模型动作状态=this.id
			patch.model=new ResourceLocation("epicfight", "entity/biped_old_texture");
			
			patch.animatorIdList.clear()
			patch.animatorIdList.put("IDLE", "yesman.epicfight.gameasset.Animations.BIPED_HOLD_LONGSWORD");
			patch.animatorIdList.put("WALK", "yesman.epicfight.gameasset.Animations.BIPED_RUN_SPEAR");
			patch.animatorIdList.put("DEATH", "yesman.epicfight.gameasset.Animations.BIPED_DEATH");
			
			patch.tkkNpcUpdata()
		}
		if(物品状态!=this.id){
			//物品状态=this.id;
		}
		if(属性状态!=this.id){
			//属性状态=this.id;
		}
	}
}

function 行为树选择节点(){
	//按顺序循环run拥有的节点,节点返回true时打断循环 并且返回true
	//如果所有节点返回false 返回false
	//根据添加的顺序
	this.节点=[]
	this.run=function(npc){
		for(var x in this.节点){
			if(this.节点[x].run(npc)){
				return true;
			}
		}
		return false;
	}
	this.add=function(节点){this.节点.push(节点)}
	this.set=function(新节点组){this.节点=新节点组}
}
function 行为树序列节点(){
	//按顺序循环run拥有的节点,节点返回false时打断循环 并且返回false
	//如果所有节点返回true 返回true
	//根据添加的顺序
	this.节点=[]
	this.run=function(npc){
		for(var x in this.节点){
			if(!this.节点[x].run(npc)){
				return false;
			}
		}
		return true;
	}
	this.add=function(节点){this.节点.push(节点)}
	this.set=function(新节点组){this.节点=新节点组}
}
function 行为树随机节点(返回值){
	//随机run拥有的节点,节点返回true时打断循环 并且返回true
	//如果所有节点返回false 返回false
	this.总是返回=返回值
	this.节点=[]
	this.打乱=function(){return 0.5-Math.random()}
	this.run=function(npc){
		this.节点.sort(this.打乱)
		for(var x in this.节点){
			if(this.节点[x].run(npc)){
				return (this.总是返回==null)?true:this.总是返回;
			}
		}
		return (this.总是返回==null)?false:this.总是返回;
	}
	this.add=function(节点){this.节点.push(节点)}
	this.set=function(新节点组){this.节点=新节点组}
}
function 行为树条件节点(fn){
	//自行修改条件函数
	//this.run=function(npc){return false;}
	this.run=fn
	this.set=function(fn){this.run=fn}
}


function 自定义动作(StaticAnimation,前摇){
	//StaticAnimation
	this.动作=StaticAnimation
	//float
	this.动作前摇=前摇
	//Ambient:0b,Amplifier:1b,ShowIcon:0b,ShowParticles:0b,Duration:600,Id:23b
	//[[id,tick,level]]
	this.自身药水=[]
	this.目标药水=[]
	this.击中自身药水=[]
	//float 替换k为null时不替换
	this.技能动作伤害替换=null
	this.技能动作伤害增加=0
	this.技能动作伤害倍率=1

	this.技能动作冲击替换=null
	this.技能动作冲击增加=0
	this.技能动作冲击倍率=1

	this.技能动作穿甲替换=null
	this.技能动作穿甲增加=0
	this.技能动作穿甲倍率=1
	//StunType.xxx
	//NONE SHORT LONG HOLD KNOCKDOWN FALL
	//this.击晕类型=null
	//null时为不替换
	this.击晕类型=null
	
	this.main刀光=null
	this.off刀光=null
	this.粒子刀光=[]
	
	this.击中声音=undefined;
	this.击中粒子=undefined;
	
	this.canBlock=true;
	this.canDodge=true;
	
	//播放动作后突刺 参数[横向力度,纵向力度]
	this.dash=undefined;
	//修改dash的方向 参数[横向偏移,纵向偏移] 如果dash==undefined 无效
	this.dash偏移=undefined;
	
	//自定义攻速
	this.enableCustomSpeed=false;
	
    this.preDelaySet=null;
    this.preDelayAdd=null;
    this.preDelayScale=null;
	
    this.contactSet=null;
    this.contactAdd=null;
    this.contactScale=null;
	
    this.recoverySet=null;
    this.recoveryAdd=null;
    this.recoveryScale=null;
	
	
	this.ServerAnimator=Java.type("yesman.epicfight.api.animation.ServerAnimator")
	
	this.patchAnimationEqual=function(patch){
		if(patch.getAnimator() instanceof this.ServerAnimator){
			var id=patch.getAnimator().animationPlayer.getAnimation().getId()
			if(id == this.动作.getId()){
				return true;
			}else if(patch.getAnimator().nextPlaying!=null){
				if(patch.getAnimator().nextPlaying.getId()==this.动作.getId()){
					return true
				}
			}
		}
		return false;
	}
	this.getTime=function(patch){
		var 运行时长=(this.动作.getTotalTime()) / (0.05 * this.动作.getPlaySpeed(patch))
		运行时长+=(this.动作.getConvertTime()+this.动作前摇) / 0.05
		return Math.floor(运行时长)
	}
	this.playAnimation=function(patch){
		for(var x in this.自身药水){
			var potion=this.自身药水[x]
			this.addPotionEffect(patch.getOriginal(),potion[0],potion[1],potion[2],potion[3])
		}
		if(this.技能刀光!=null){
			自定义刀光(patch.getOriginal(),this.技能刀光)
		}
		if(this.main刀光!=null){
			patch.setTrail(this.main刀光[0],this.main刀光[1],this.main刀光[2],this.main刀光[3],this.main刀光[4],this.main刀光[5],this.main刀光[6],this.main刀光[7],this.main刀光[8])
		}
		if(this.off刀光!=null){
			patch.setTrail(this.off刀光[0],this.off刀光[1],this.off刀光[2],this.off刀光[3],this.off刀光[4],this.off刀光[5],this.off刀光[6],this.off刀光[7],this.off刀光[8])
		}
		for(var x in this.粒子刀光){
			var trail=this.粒子刀光[x]
			patch.addParticleTrail(trail[0],trail[1],trail[2],trail[3],trail[4],trail[5],trail[6],trail[7],trail[8])
		}
		
		
		var ads=patch.tkkCustomADS.getReady();
		
		if(this.技能动作冲击替换!=null){ads.impact=this.技能动作冲击替换}
		ads.impactAdd=this.技能动作冲击增加
		ads.impactScale=this.技能动作冲击倍率
		
		if(this.技能动作穿甲替换!=null){ads.armorNegation=this.技能动作穿甲替换}
		ads.armorNegationAdd=this.技能动作穿甲增加
		ads.armorNegationScale=this.技能动作穿甲倍率
		
		if(this.技能动作伤害替换!=null){ads.damage=this.技能动作伤害替换}
		ads.damageAdd=this.技能动作伤害增加
		ads.damageScale=this.技能动作伤害倍率
		
		if(this.击晕类型!=null){ads.stunType=this.击晕类型}
		
		if(this.击中粒子!==undefined){
			if(this.击中粒子==null){
				ads.doHitParticle=false;
			}else{
				ads.hitParticleType=this.击中粒子;
			}
		}
		if(this.击中声音!==undefined){
			if(this.击中声音==null){
				ads.doHitSound=false;
			}else{
				ads.hitSound=this.击中声音;
			}
		}
		ads.canDodge=this.canDodge;
		this.onPlay(patch.getOriginal(),patch)
		if(this.enableCustomSpeed){
			patch.setTkkModifiersAttackSpeed(this.preDelaySet,this.preDelayAdd,this.preDelayScale,this.contactSet,this.contactAdd,this.contactScale,this.recoverySet,this.recoveryAdd,this.recoveryScale)
		}
		patch.playAnimationSynchronized(this.动作,this.动作前摇)
		this.playedAnimation(patch)
	}
	this.playedAnimation=function(patch){
		if(this.dash!=undefined){
			var pitch=patch.getOriginal().field_70125_A
			var yaw=patch.getOriginal().field_70177_z
			if(this.dash偏移!=undefined){
				yaw+=this.dash偏移[0]
				pitch+=thiss.dash偏移[1]
				if(yaw<-360){yaw+=360}
				if(yaw>0){yaw-=360}
				if(pitch<-90){pitch=-90}
				if(pitch>90){pitch=90}
			}
			var yp=this.dotYP(1,yaw,pitch)
			var y力度=this.dash[1]
			if(this.dash偏移!=undefined && this.dash偏移[1]!=0){y力度=yp[1]*this.dash[1]}
			patch.getOriginal().func_213293_j(yp[0]*this.dash[0],y力度,yp[2]*this.dash[0])
			patch.getOriginal().field_70133_I=true
		}
		this.played(patch.getOriginal(),patch)
	}
	
	this.hitTarget=function(self,target){
		for(var x in this.目标药水){
			var potion=this.目标药水[x]
			this.addPotionEffect(target,potion[0],potion[1],potion[2],potion[3])
		}
		for(var x in this.击中自身药水){
			var potion=this.击中自身药水[x]
			this.addPotionEffect(self,potion[0],potion[1],potion[2],potion[3])
		}
		this.onHit(self,target)
	}
	
	this.hitGuard=function(event){
		this.onHitGuard(event)
		if(!this.canBlock){
			event.sourceEvent.canBlock=false
			event.setCanBlock(false)
		}
	}
	this.onHitGuard=function(event){
		
	}
	this.onHit=function(self,target){
		
	}
	this.onPlay=function(self,patch){
		
	}
	this.played=function(self,patch){
		
	}
	
	this.Effect=Java.type("net.minecraft.potion.Effect")
	this.EffectInstance=Java.type("net.minecraft.potion.EffectInstance")
	this.addPotionEffect=function(mcEntity,id,tick,level,show){
		var p = ForgeRegistries.POTIONS.getValue(new ResourceLocation(id));
		if(p==null){return}
		mcEntity.func_195064_c(new EffectInstance(p,tick,level,show,show))
	}
	this.dotYP=function(r,yaw,ptich){
		//优化
		var coordinate = [0, 0, r]
		var yawCos = Math.cos((Math.PI / 180)*(-yaw));
		var yawSin = Math.sin((Math.PI / 180)*(-yaw));
		var pitchCos = Math.cos((Math.PI / 180)*(ptich));
		var pitchSin = Math.sin((Math.PI / 180)*(ptich));
		var y= -r * pitchSin//1
		var z= r * pitchCos//2
		var x= z * yawSin//0
		z= z * yawCos//2
		return[x,y,z]
	}
	
	this.addEffectPlay=function(id,tick,level,show){
		this.自身药水[this.自身药水.length]=[id,tick,level,show]
	}
	this.addEffectHitTarget=function(id,tick,level,show){
		this.目标药水[this.目标药水.length]=[id,tick,level,show]
	}
	this.addEffectHitSelf=function(id,tick,level,show){
		this.击中自身药水[this.击中自身药水.length]=[id,tick,leve,showl]
	}
	this.addTaril=function(hand,z,ez,r,g,b,a,lifetime,type){
		if(hand=="Main"){
			this.main刀光=[true,z,ez,r,g,b,a,lifetime,type]
		}else if(hand=="Off"){
			this.off刀光=[false,z,ez,r,g,b,a,lifetime,type]
		}else{
			this.main刀光=[true,z,ez,r,g,b,a,lifetime,type]
			this.off刀光=[false,z,ez,r,g,b,a,lifetime,type]
		}
	}
	this.addParticleTrail=function(boolean_isMainHand,String_particle,String_arg,float_z, float_ez,float_spaceBetween,float_speed,float_dist,int_count){
		this.粒子刀光[this.粒子刀光.length]=[boolean_isMainHand,String_particle,String_arg,float_z, float_ez,float_spaceBetween,float_speed,float_dist,int_count]
	}
	this.setHitParticleAndSound=function(type){
		var EpicFightParticles=Java.type("yesman.epicfight.particle.EpicFightParticles")
		var EpicFightSounds=Java.type("yesman.epicfight.gameasset.EpicFightSounds")
		switch(type){
			case "blunt":
				this.击中粒子=EpicFightParticles.HIT_BLUNT.get()
				this.击中声音=EpicFightSounds.BLUNT_HIT
				break;
			case "blade":
				this.击中粒子=EpicFightParticles.HIT_BLADE.get()
				this.击中声音=EpicFightSounds.BLADE_HIT
				break;
			case "null":
				this.击中粒子=null
				this.击中声音=null
				break;
			case "default":
			default:
				this.击中粒子=undefined
				this.击中声音=undefined
				break;
		}
		
	}

	//设置 前摇 速度
	this.setPreDelaySpeed=function(set,add,scale){
		this.enableCustomSpeed=true;
		this.preDelaySet=set;
		this.preDelayAdd=add;
		this.preDelayScale=scale;
	}
	//设置 连接 速度（就造成伤害的那几帧）
	this.setContactSpeed=function(set,add,scale){
		this.enableCustomSpeed=true;
		this.contactSet=set;
		this.contactAdd=add;
		this.contactScale=scale;
	}
	//设置 后摇 速度
	this.setRecoverySpeed=function(set,add,scale){
		this.enableCustomSpeed=true;
		this.recoverySet=set;
		this.recoveryAdd=add;
		this.recoveryScale=scale;
	}

}
function 基础动作(StaticAnimation,前摇){
	//StaticAnimation
	this.动作=StaticAnimation
	//float
	this.动作前摇=前摇
	this.ServerAnimator=Java.type("yesman.epicfight.api.animation.ServerAnimator")
	this.patchAnimationEqual=function(patch){
		if(patch.getAnimator() instanceof this.ServerAnimator){
			var id=patch.getAnimator().animationPlayer.getAnimation().getId()
			if(id == this.动作.getId()){
				return true;
			}else if(patch.getAnimator().nextPlaying!=null){
				if(patch.getAnimator().nextPlaying.getId()==this.动作.getId()){
					return true
				}
			}
		}
		return false;
	}
	this.playedAnimation=function(patch){
		this.played(patch.getOriginal(),patch)
	}	
	this.getTime=function(patch){
		var 运行时长=(this.动作.getTotalTime()) / (0.05 * this.动作.getPlaySpeed(patch))
		运行时长+=(this.动作.getConvertTime()+this.动作前摇) / 0.05
		return Math.floor(运行时长)
	}
	this.playAnimation=function(patch){
		this.onPlay(patch.getOriginal(),patch)
		patch.playAnimationSynchronized(this.动作,this.动作前摇)
		this.playedAnimation(patch)
	}	
	this.hitTarget=function(self,target){
		this.onHit(self,target)
	}
	this.hitGuard=function(event){
		this.onHitGuard(event)
	}
	this.onHitGuard=function(event){
		
	}
	this.onHit=function(self,target){
		
	}
	this.onPlay=function(self,patch){
		
	}
	this.played=function(self,patch){
		
	}
	
}


