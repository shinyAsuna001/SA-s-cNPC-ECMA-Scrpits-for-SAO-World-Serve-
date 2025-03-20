//不需要就填 EmptySkill
function interact(e){
    var p=e.player
    var container=e.block.getWorld().getBlock(e.block.getX(),e.block.getY()+1,e.block.getZ()).getContainer()
    var item=container.getSlot(0)
    if(item.isEmpty()){
    p.message("§a说明§f:设置物品附带技能，需要带有技能id的物品")
    p.message("§a说明§f:第二行 1 2 格为主动技能")
    p.message("§a说明§f:第三行 1 2 3 格为被动技能")
    return
    }
    item.getNbt().putString("主动0",(container.getSlot(9).getNbt().has("skillName"))?container.getSlot(9).getNbt().getString("skillName"):"EmptySkill")
    item.getNbt().putString("主动1",(container.getSlot(10).getNbt().has("skillName"))?container.getSlot(10).getNbt().getString("skillName"):"EmptySkill")
    
    item.getNbt().putString("被动0",(container.getSlot(18).getNbt().has("skillName"))?container.getSlot(18).getNbt().getString("skillName"):"EmptySkill")
    item.getNbt().putString("被动1",(container.getSlot(19).getNbt().has("skillName"))?container.getSlot(19).getNbt().getString("skillName"):"EmptySkill")
    item.getNbt().putString("被动2",(container.getSlot(20).getNbt().has("skillName"))?container.getSlot(20).getNbt().getString("skillName"):"EmptySkill")
    
    
    
    
    
    }
    
    
    