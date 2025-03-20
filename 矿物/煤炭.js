/*
----------------------------------[SAO-World Serve自定义挖矿脚本]------------------------------------------
作者:shiny_Asuna

未经允许请勿转载使用，发现必究
仅供服务器：SAO-World Serve使用

服务器管理员只需要更改配置区来对本脚本进行配置
另外，记得使用自定义物品管理器（可以去控制台用）把挖掘得到的矿石物品先存起来（右键）
（改名字！！！这里的名字就是gain_item要填的名字）
关于自定义镐子的获取：需要去控制台稿子获取器获取
或者输入以下指令获取：
/give @s minecraft:iron_pickaxe{iron_ore:1,level:1}
iron_ore和picknbt对应，没有就不填，level是镐子优先级
*/
// =====================
// |       配置区      |
// =====================
// 方块材质名
var NAME = "minecraft:coal_ore"//NAME为矿石刷新后的方块材质
var NAME2 = "minecraft:stone"//NAME2为矿石未刷新时的方块材质
// 发光值(0-15)--仅可发光方块可以使用>0的LIGHT值
var LIGHT = 0
// 声音
var Success ="minecraft:entity.arrow.hit_player"//挖矿成功音效
var Fail ="minecraft:entity.item.break"//挖矿失败音效
var Digging="minecraft:block.stone.break"//挖掘中音效
// 矿物名称
var ore_Name="煤矿"
// 强制优先级要求,即为镐子优先级必须要达到多少才能开采（最低1）
var picklevelrequire=1
// picknbt是挖掘需要nbt，即，能够挖掘该矿石的镐带有的自定义NBT标签(该选项是用来做特殊矿石的，
// 比如说同样是优先级为3的镐子，但是你想指定只有特定的某一把能够挖掘，需要填picknbt，要
// 和镐子的nbt对应,若不需要该选项引号里不填)
var picknbt=""
// 挖矿获得物品（填写在itemstack里面注册的名称）
var gain_item="sao_coal"
// 矿石刷新cd（单位：秒）
var cd=30
// 采集模式"pick"为右键直接开采(目前可用)，"breakblock"为左键挖掘开采(摆了，不想做了)
var pickmode="pick"
// 随机开采成功概率（单位:%）
var randomsuccess=100
// 开采数量(需要和注册时的数量一致)
var amount=1
// 开采时间（单位:0.5秒）
var picktime=4
// 进度显示模式选择，"message"为聊天栏,"actionbar"为title的actionbar(就是屏幕中下部分的)
var displaymode="actionbar"



//以下为脚本主体，看不懂请不要改动
var picklevel;
var tempPlayer;
function init(c){
    var block = c.block
    var storeddata = block.storeddata
    block.setLight(LIGHT)
    block.setModel(NAME2)
    block.timers.forceStart(0,20,true)
    storeddata.put("cooldown", 0)
}
function interact(c){
    if (pickmode=="pick"){
    var player = c.player
    var block = c.block
    var storeddata = block.storeddata
    var cooldown = parseInt(storeddata.get("cooldown"))
    var item=player.getMainhandItem()
    picklevel=item.getNbt().getInteger("level")
    var canpickup=item.getNbt().has(picknbt)
    if (block.timers.has(0)!=true){
        block.timers.start(0,20,true)
	}
    if (picknbt==""){
        var canpickup=true    
    }
    if (canpickup!=true){
        player.message("§7[§aSAO-矿物系统§7] §8[开采失败] >>>该矿石无法使用该工具挖掘")
        player.playSound(Fail, 1, 0.6)
        return false
    }
    if (picklevelrequire>picklevel){
        player.message("§7[§aSAO-矿物系统§7] §8[开采失败] >>>开采工具品质不足")
        player.playSound(Fail, 1, 0.6)
        return false
    }
    if (canpickup && cooldown >= cd){
        storeddata.put("cooldown", 0)
        storeddata.put("digging",0)
        block.timers.forceStart(1,10,true)
        tempPlayer=player

	}
    if (canpickup && cooldown < cd){
        player.message("§7[§aSAO-矿物系统§7]  §8[矿石冷却中] §8>>>目标：§7[§a"+ore_Name+"§7]§8,剩余"+(30-cooldown)+"秒")
        player.playSound(Fail, 1, 1)
	}
    }
}
    
function timer(event){
    if (event.id==0){
        cool(event)
    }
    if (event.id==1){
        playhint(event)
    
	}
}
function cool(c){
    var block=c.block
    var storeddata = block.storeddata
    var cooldown = parseInt(storeddata.get("cooldown"))
    if (cooldown <= cd){
        cooldown +=1
        storeddata.put("cooldown", cooldown)
	}else{
        block.setModel(NAME)
	}
}
        
function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
  }

function playhint(c){
    var block=c.block
    var API=c.API
    var storeddata=block.storeddata
    var secondsupdate=parseInt(storeddata.get("digging"))
    var secondsupdate = secondsupdate+1
    storeddata.put("digging",secondsupdate)
    var priority=picktime-((picklevel-1)*0.75)
    if (priority<=0){
        var priority=1
    }
    var n=parseFloat((100/priority)*secondsupdate).toFixed(2)//保留两位小数
    if (n>100){
        var n=100
    }
    if (displaymode=="message"){
        tempPlayer.message("§8>>>开采进度："+String(n)+"%")
    }
    if (displaymode=="actionbar"){
        var hint="§a||||||||||||||||||||"
        var index=parseInt(20*n/100)+1
        var hint=insertStr(hint,index,"§f")
        API.executeCommand(tempPlayer.getWorld(),"/title "+tempPlayer.getName()+" actionbar \"开采进度："+hint+String(n)+"%"+"\"")
    }
    tempPlayer.playSound(Digging,2,1)
    if (n>=100){
        if (getRandomInt(0,101)>=(100-randomsuccess)){
		    var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE
		    var 自定义物品管理器=JSPluginManager.getPluginMain("自定义物品管理器")
    	    var rt=自定义物品管理器.run("getItem",gain_item)
    	    tempPlayer.giveItem(c.API.getIItemStack(rt))
            var drop_Name=c.API.getIItemStack(rt).getDisplayName()
            tempPlayer.message("§7[§aSAO-矿物系统§7]  §8[开采成功] §8>>>获得： §7[§a"+drop_Name+"§7] §8*"+String(amount))
            tempPlayer.playSound(Success, 1, 1)
            block.setModel(NAME2)
        }else{
            tempPlayer.message("§7[§aSAO-矿物系统§7]  §8[开采失败] §8>>>挖掘失误，矿石损坏")
            tempPlayer.playSound(Fail, 1, 1)
            block.setModel(NAME2)
        }
        storeddata.put("digging",0)
        block.timers.stop(1)
    }
}
function insertStr (str, index, insertStr) {
    return str.substring(0, index) + insertStr + str.substring(index)
}




