//自定义物品管理器
/*
//自定义物品注册器
var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE
//----------------------------------------------只需要更改这个------------------------------------
var Item_Name="test"//只需要更改这个
//----------------------------------------------只需要更改这个------------------------------------

function interact(e){
    var 自定义物品管理器=JSPluginManager.getPluginMain("自定义物品管理器")
    var item=e.player.getMainhandItem().getMCItemStack()
    自定义物品管理器.run("saveItem",Item_Name,item)
    var rt=自定义物品管理器.run("getItem",Item_Name)
    e.player.giveItem(e.API.getIItemStack(rt))
    e.player.message("注册成功!")
}

//查找自定义物品
var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE
//----------------------------------------------只需要更改这个------------------------------------
var Item_Name="test"//只需要更改这个
//----------------------------------------------只需要更改这个------------------------------------
function interact(e){
    var 自定义物品管理器=JSPluginManager.getPluginMain("自定义物品管理器")
    var rt=自定义物品管理器.run("getItem",Item_Name)
    e.player.giveItem(e.API.getIItemStack(rt))
    e.player.message("如果您获得了道具则已经存在该物品")
}

*/



//使用方法，丢TkkGameLib/plugin里面，第一次启动游戏会自动创建

//想和其他脚本插件互动啥的用这个，具体看源码
var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE;
//js容器
var JsContainer=Java.type("tkk.epic.js.JsContainer")
//注册事件用这个+js容器
var regTool=Java.type("tkk.tkklib.regTool")
var TkkGameLib=Java.type("tkk.tkklib.TkkGameLib")
var CompoundNBT=Java.type("net.minecraft.nbt.CompoundNBT")
var NBTJsonUtil=Java.type("noppes.npcs.util.NBTJsonUtil")
var ItemStack=Java.type("net.minecraft.item.ItemStack")
var IO=new IONPC()

function getID(){
	return "自定义物品管理器"
}
//加载规则，基本没用,用于控制js插件加载顺序
function getLoadingRule(){
	return null;
}
//默认事件，想要其他事件需要自行注册
function FMLCommonSetupEvent(e){
	//逻辑端和客户端都需要的丢这
}
function FMLDedicatedServerSetupEvent(e){
	//仅服务端
}
function FMLClientSetupEvent(e){
	//仅客户端
	
	

}
function FMLLoadCompleteEvent(e){
	//mod加载完毕
	
}
function FMLServerStartingEvent(e){
	//服务器启动
	
	
}
function unload(){
	//卸载,把你注册的事件都注销！
}
function load(){
	//载入，注册事件
}
function 获取js容器(函数){
	
	var start="function "+函数.name+"(){"
	var over="}"
	var code=函数.toString().substr(start.length,函数.toString().length - over.length - start.length)
	return new JsContainer(code)
	
	
}
function test(){
	//这里面就是个单独的空间来写东西
	var TkkGameLib=Java.type("tkk.tkklib.TkkGameLib")
	var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE;
	TkkGameLib.print("测试事件 初始化！")
	function runEvent(e){
	}
	
	
}

function saveItem(id,mcitem){
	var nbt=mcitem.func_77955_b(new CompoundNBT())
	IO.set(id,{"item":NBTJsonUtil.Convert(nbt)})
}
function getItem(id){
	var nbt=NBTJsonUtil.Convert(IO.get(id)["item"])
	return ItemStack.func_199557_a(nbt)
}








function IONPC(){
	//author mchhui
	//初始化部分
	var customPath="/JsPluginData/CustomItem/";//你要存取的仓库路径（默认路径）
	var File = Java.type("java.io.File");
	var FileOutputStream = Java.type("java.io.FileOutputStream");
	var BufferedReader = Java.type("java.io.BufferedReader");
	var InputStreamReader = Java.type("java.io.InputStreamReader");
	var FileInputStream = Java.type("java.io.FileInputStream");
	var StringBuilder=Java.type("java.lang.StringBuilder");
	var RootDirectory = Java.type("tkk.tkklib.TkkGameLib").MOD_DIR
	var folder = new File(RootDirectory.getCanonicalPath()+customPath);
	if(!folder.exists()){
		folder.mkdirs();
	}
	//获取部分
	//file:文件名
	this.setPath = function(String){
		customPath=String;
	};
	
	
	this.get = function(file){
		var files = new File(RootDirectory.getCanonicalPath()+customPath+file+".sw");
		var text = null;
		if(files.exists()){
			var fileInputStream = new FileInputStream(files);
			var inputStreamReader = new InputStreamReader(fileInputStream);
			var bufferedReader = new BufferedReader(inputStreamReader);
			var sb = new StringBuilder();
			while((text = bufferedReader.readLine()) != null){
            	sb.append(text);
            }
		}
		try{
			return eval("("+sb.toString()+")");
		}catch(e){
			return {};
		}
	}
	//设置部分
	//file:文件名
	//object:对象
	this.set = function(file,object){
		if(!(object instanceof Object)){
			print("请输入对象");
			return;
		}
		var files = new File(RootDirectory.getCanonicalPath()+customPath+file+".sw");
		if(files.exists()){
			files.createNewFile();
		}
		var fileOutputStream = new FileOutputStream(files);
		fileOutputStream.write(JSON.stringify(object).getBytes());
		fileOutputStream.flush();
		fileOutputStream.close();
	}
	//删除部分
	//file:文件名
	this.remove = function(file){
		var files = new File(RootDirectory.getCanonicalPath()+customPath+file+".sw");
		if(files.exists()){
			files.delete();
		}
	}
}






