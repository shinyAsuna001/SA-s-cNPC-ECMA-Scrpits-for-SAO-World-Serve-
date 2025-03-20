var level="1"

function interact(e){
var item=e.player.getMainhandItem()
item.getNbt().putString("level",level)
e.player.message("当前采掘等级："+String(item.getNbt().getInteger("level")))
}