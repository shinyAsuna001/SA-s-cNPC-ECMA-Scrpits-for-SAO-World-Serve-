/*
----------------------------------[SAO-World Serve技能GUI脚本]------------------------------------------
作者:shiny_Asuna

未经允许请勿转载使用，发现必究
仅供服务器：SAO-World Serve使用
*/

// =====================
// |       配置区      |
// =====================
//技能列表
var menu="saoui:message"//Y键按下音效
var menu_top="minecraft:ui.loom.select_pattern"
var confirmsound="saoui:confirm"
var failsound="saoui:dialog_close"
var skill_list=["斜斩","回身斩","锐爪","快速盾反","治愈祷告","长剑速反","垂直V形斩","水平二连击","愤怒冲刺","绯红四方","并行毒针","音速冲击","绝前释空","侵袭狂暴","加速圆舞","撼地重击","归于宁静","绯扇"]
//具体介绍
var xiezhan=[["稀有度：★"],["§8单体攻击剑技"],["§8直剑，长剑，太刀可用"],["§8将剑举过肩向左下方砍下"],["若命中目标则恢复4点体力"],["§8无视闪避"],["§8CD：4s"],["§8消耗体力：1"],["§8伤害倍率:1.7"],["§8需要充能：0"],["§8提供充能：0"]]
var huishenzhan=[["稀有度：★"],["§8闪避，小范围"],["§8直剑，长剑，太刀，大剑,长柄可用"],["§8需要架势：默认"],["§8向后踏步后反击"],["§8不可被打断"],["§8CD：4s"],["§8消耗体力：4"],["§8伤害倍率:1.6"],["§8需要充能：0"],["§8提供充能：0"]]
var fennuchongci=[["稀有度：★★★"],["§8前方，位移，线性"],["§8直剑，细剑，匕首可用"],["§8提剑向前冲刺一段距离"],["§8CD：8s"],["§8消耗体力：8"],["§8伤害倍率:2.0"],["§8需要充能：0"],["§8提供充能：0"]]
var feihongsifang=[["稀有度：★★★"],["§8前方，中范围"],["§8直剑，长剑可用"],["§8挥刀四次重创敌人"],["§8最后一击无法格挡，对目标造成长距离击退"],["§8CD：10s"],["§8消耗体力：5"],["§8需要充能：8"],["§8提供充能：1"]]
var ruizhua=[["稀有度：★"],["§8前方，小范围"],["§8匕首"],["§8挥出横斩，回身刺，斜劈三刀"],["§8连续控制并在最后一击造成击退"],["§8CD：10s"],["§8消耗体力：5"],["§8需要充能：4"],["§8提供充能：1"]]
var bingxingduzhen=[["稀有度：★★★"],["§8前方，单体"],["§8细剑可用"],["§8快速向前刺击2次"],["§8造成每击1.4倍伤害"],["若第二击命中则造成中毒II 10秒"],["§8不可被打断"],["§8CD：20s"],["§8消耗体力：4"],["§8需要充能：0"],["§8提供充能：0"]]
var shuipingerlianji=[["稀有度：★★"],["§8前方，小范围"],["§8单手斧可用"],["§8连续挥刀2次"],["§8造成第一击1.6倍，第二击2.2倍伤害"],["第二击造成眩晕5秒"],["§8不可被打断"],["§8CD：10s"],["§8消耗体力：4"],["§8需要充能：3"],["§8提供充能：0"]]
var kuaisudunfan=[["稀有度：★★"],["§8特殊技能"],["§8单手武器携带盾牌可以使用"],["§8释放此技能后如果和对方攻击相撞"],["§8则强制使其进入破防状态"],["§8若盾反命中成功，则进入10秒冷却"],["§8不可被打断"],["§8CD：1.5s"],["§8消耗体力：1.5"],["§8需要充能：0"],["§8不提供充能"]]
var chuizhivxingzhan=[["稀有度：★★"],["§8前方，中范围"],["§8长剑，直剑可用"],["§8释放此技能后如果第一击命中，造成1.2倍伤害"],["§8且回身并击出第二击，造成1.8倍伤害"],["§8若第一击未命中，则释放长距离后踏"],["§8CD：10s"],["§8消耗体力：6"],["§8需要充能：4"],["§8提供充能：1"]]
var yinsuchongji=[["稀有度：★★★"],["§8前方，位移，线性"],["§8直剑，匕首，细剑可用"],["§8释放此技能后向前冲刺"],["§8并且期间挥出两刀"],["§8每击造成主手武器1.5倍伤害"],["§8CD：12s"],["§8消耗体力：8"],["§8提供充能：1"]]
var qinxikuangbao=[["稀有度：★★★"],["§8前方，小范围；自身，强化"],["§8直剑-默认架势可用"],["§8释放此技能打出两段攻击"],["§8第一击造成1.7倍主手武器伤害"],["§8第二击造成4点伤害"],["§8若第二击命中，则进入狂暴模式，修改普攻模板"],["§8狂暴模式持续10秒"],["§8CD：30s"],["§8消耗体力：4"],["§8不提供充能"]]
var feishan=[["稀有度：★★★★"],["§8前方，中范围"],["§8太刀可用"],["§8释放此技能后进行四连击"],["§8第一击若命中则击飞敌人，并起跳"],["§8第一击与最后一击造成1.7倍主手武器伤害"],["§8其余连段造成1.2倍主手武器伤害"],["§8CD：20s"],["§8消耗体力：6"],["§8需要充能：10"],["§8提供充能：1"]]
var jiasuyuanwu=[["稀有度：★★★"],["§8前方，位移，中范围"],["§8匕首可用"],["§8释放此技能后进行位移五连击"],["§8前四击每次击中造成1.6倍主手武器伤害"],["§8最后一击造成1.8倍主手武器伤害"],["§8并且造成长距离击退"],["§8CD：12s"],["§8消耗体力：6"],["§8提供充能：1"]]
var handizhongji=[["稀有度：★★★"],["§8前方，小范围"],["§8大剑可用"],["§8释放此技能后起跳,下落时进行重劈"],["§6造成主手武器2.4倍穿甲伤害"],["§8使命中目标倒地"],["§8不可被打断, 不可被格挡"],["§8CD：15s"],["§8需要充能：3"],["§8消耗体力：6"],["§8提供充能：1"]]
var guiyuningjing=[["稀有度：★★★"],["§8前方，小范围"],["§8直剑可用"],["§8基础的双剑剑技"],["§6造成五连击，每击对应武器1.5倍伤害"],["§8不可被打断"],["§8CD：12s"],["§8需要充能：0"],["§8消耗体力：6"],["§8提供充能：1"]]
var zhiyudaogao=[["稀有度：★★"],["§8周身，中范围，群体治愈"],["§8直剑，细剑，匕首，单手斧可用"],["§8释放此技能后吟唱1.2秒"],["§8随后对周围所有队伍内玩家施加"],["§8生命恢复II 10秒"],["§8若受到攻击会中断"],["§8CD：30s"],["§8消耗体力：4"],["§8提供充能：0"]]
var changjiansufan=[["稀有度：★★"],["§8自身，前方，小范围"],["§8特殊技能"],["§8长剑可用"],["§8若在技能释放时被攻击"],["§8则迅速造成反击攻击"],["§8对目标造成长僵直和高冲击"],["§8CD：5s"],["§8消耗体力：3"],["§8提供充能：1"]]
var jueqianshikong=[["稀有度：★★★"],["§8前方，位移，大范围"],["§8长柄可用"],["§8第一击挑起敌人，造成少量伤害"],["§8迅速起跳，挥出横扫，造成1.1倍伤害"],["§8随后向前旋转突进，造成1.2倍伤害"],["§8CD：6s"],["§8需要充能：4"],["§8消耗体力：4"],["§8提供充能：1"]]
var wangxue=[["稀有度：★★★★"],["§8前方，控制，大范围"],["§8居合刀可用"],["§8对前方敌人造成多连段持续攻击"],["§8浮空，并控制造成大量伤害"],["§8CD：2min"],["§8需要充能：10"],["§8消耗体力：15"],["§8提供充能：1"]]
//技能介绍
var skill_introduction={"斜斩":xiezhan,"回身斩":huishenzhan,"愤怒冲刺":fennuchongci,"绯红四方":feihongsifang,"锐爪":ruizhua,"并行毒针":bingxingduzhen,
    "水平二连击":shuipingerlianji,"快速盾反":kuaisudunfan,"垂直V形斩":chuizhivxingzhan,"音速冲击":yinsuchongji,"侵袭狂暴":qinxikuangbao,"绯扇":feishan,
    "加速圆舞":jiasuyuanwu,"撼地重击":handizhongji,"归于宁静":guiyuningjing,"治愈祷告":zhiyudaogao,"长剑速反":changjiansufan,"绝前释空":jueqianshikong,
    "忘雪":wangxue}
var skill_regid={"斜斩":"xiezhan","回身斩":"huishenzhan","愤怒冲刺":"fennuchongci","绯红四方":"feihongsifang","锐爪":"ruizhua","并行毒针":"bingxingduzhen",
    "水平二连击":"shuipingerlianji","快速盾反":"kuaisudunfan","垂直V形斩":"chuizhivxingzhan","音速冲击":"yinsuchongji","侵袭狂暴":"qinxikuangbao","绯扇":"feishan",
    "加速圆舞":"jiasuyuanwu","撼地重击":"handizhongji","归于宁静":"guiyuningjing","治愈祷告":"zhiyudaogao","长剑速反":"changjiansufan","绝前释空":"jueqianshikong",
    "忘雪":"wangxue"}



//脚本主体
var page=1
var pageCounts=Math.ceil(skill_list.length/6)
var skillname=''
var skill_id=0
var JSPluginManager=Java.type("tkk.tkklib.JSPluginManager").INSTANCE
var Item_Name="Emptyskill"//只需要更改这个
var storeddata
var skill_haved//已经拥有的技能
var EXPlevel = 0
function obtain_skill_book(c){
    var 自定义物品管理器=JSPluginManager.getPluginMain("自定义物品管理器")
    var rt=自定义物品管理器.run("getItem",Item_Name)
    var skill_book=(c.API.getIItemStack(rt))
    return skill_book
}
function keyPressed(c){
    if (c.key==75 && c.isCtrlPressed==true && c.isShiftPressed==true){
        var player=c.player
        player.playSound(menu, 1, 1)
        player.playSound(menu_top, 5, 2)
        storeddata = player.storeddata
        if(storeddata.get("skill")==null){
            storeddata.put("skill",JSON.stringify(["Empty_skill"]))
            skill_haved=JSON.parse(storeddata.get("skill"))
        }else{
            skill_haved=JSON.parse(storeddata.get("skill"))
        }
        skillname=''
        page=1
        GUI1(c)
    }
}
function GUI1(c){
    var player=c.player
    EXPlevel = player.getExpLevel()
    var gui = c.API.createCustomGui(page, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/book.png", 410, 140, 256, 180, 0, 0)
    gui.addTexturedButton(2, "打开", 510 , 295 , 20, 20,"minecraft:textures/misc/enchanted_item_glint.png")
    gui.addTexturedButton(3, "清空技能槽", 475 , 295 , 20, 20,"minecraft:textures/misc/enchanted_item_glint.png")
    gui.addLabel(10,"§7" +"技能菜单", 435, 152, 29, 29, 16755200)
    gui.addTexturedButton(11, "", 549, 290, 23, 32, "minecraft:textures/gui/resource_packs.png",2,0)
    gui.addTexturedButton(12, "", 419, 290, 24, 32, "minecraft:textures/gui/resource_packs.png", 25, 0)
    gui.addLabel(13, skill_list[0+(page-1)*6], 450, 130+46 , 100, 100, 16755200)
    //gui.addTexturedRect(14,"minecraft:textures/swordart/xiezhan.png",430,130,50,50,0,0)
    gui.addButton(15, "选择", 510 , 175 , 8, 8)
    gui.addLabel(16, skill_list[1+(page-1)*6] , 450, 150+46 , 100, 100, 16755200)
    //gui.addTexturedRect(17,"minecraft:textures/swordart/xiezhan.png",430,150,50,50,0,0)
    gui.addButton(18, "选择", 510 , 195 , 8, 8)
    gui.addLabel(19, skill_list[2+(page-1)*6] , 450, 170+46 , 100, 100, 16755200)
    //gui.addTexturedRect(20,"minecraft:textures/swordart/xiezhan.png",430,170,50,50,0,0)
    gui.addButton(21, "选择", 510 , 215 , 8, 8)
    gui.addLabel(22, skill_list[3+(page-1)*6] , 450, 190+46 , 100, 100, 16755200)
    //gui.addTexturedRect(23,"minecraft:textures/swordart/xiezhan.png",430,190,50,50,0,0)
    gui.addButton(24, "选择", 510 , 235 , 8, 8)
    gui.addLabel(25, skill_list[4+(page-1)*6] , 450, 210+46 , 100, 100, 16755200)
    //gui.addTexturedRect(26,"minecraft:textures/swordart/xiezhan.png",430,210,50,50,0,0)
    gui.addButton(27, "选择", 510 , 255 , 8, 8)
    gui.addLabel(28, skill_list[5+(page-1)*6] , 450, 230+46 , 100, 100, 16755200)
    //gui.addTexturedRect(29,"minecraft:textures/swordart/xiezhan.png",430,210,50,50,0,0)
    gui.addButton(30, "选择", 510 , 275 , 8, 8)
    gui.addLabel(31, "§6"+page+"/"+pageCounts, 570, 135, 120, 20)
    c.player.showCustomGui(gui)
}
function GUI0(c){
    var player=c.player
    var gui = c.API.createCustomGui(page, 1000, 500, false)
    gui.addTexturedRect(1, "minecraft:textures/gui/book.png", 410, 140, 256, 180, 0, 0)
    gui.addButton(2,"§7" +"1", 470, 300, 8, 8).setHoverText("§7需要等级:1")
    gui.addButton(3,"§7" +"2", 480, 300, 8, 8).setHoverText("§7需要等级:1")
    gui.addButton(4,"§7" +"3", 490, 300, 8, 8).setHoverText("§7需要等级:10")
    gui.addButton(5,"§7" +"4", 500, 300, 8, 8).setHoverText("§7需要等级:30")
    gui.addButton(6,"§7" +"5", 510, 300, 8, 8).setHoverText("§7需要等级:60")
    gui.addButton(7,"§7" +"6", 520, 300, 8, 8).setHoverText("§7需要等级:100")
    gui.addButton(8,"§7" +"7", 530, 300, 8, 8).setHoverText("§7需要等级:130")
    gui.addButton(9,"§7" +"8", 540, 300, 8, 8).setHoverText("§7需要等级:160")
    gui.addLabel(10, skill_list[skill_id] , 490, 152, 29, 29, 16755200)
    gui.addLabel(11, "§7" +"装备槽位" , 430, 300, 29, 29, 16755200)
    gui.addTexturedButton(12, "学习", 510 , 275 , 20, 20,"minecraft:textures/misc/enchanted_item_glint.png")
    gui.addTexturedButton(13, "卸下", 450 , 275 , 20, 20,"minecraft:textures/misc/enchanted_item_glint.png")
    gui.addTexturedButton(14, "", 420, 140, 24, 32, "minecraft:textures/gui/resource_packs.png", 25, 0)
    for(var i=0;i<skill_introduction[skill_list[skill_id]].length;i++){
        gui.addLabel(i+15, skill_introduction[skill_list[skill_id]][i] , 430, 182+i*8, 29, 29, 16755200)
    }
    c.player.showCustomGui(gui)
}
function customGuiButton(c){
    var gui = c.gui
    var player = c.player
    EXPlevel = player.getExpLevel()
    var SkillManager=Java.type("tkk.epic.skill.SkillManager")
    var Skills=Java.type("tkk.epic.skill.Skills")
    var JsContainer=Java.type("tkk.epic.js.JsContainer")
    var API=c.api
    storeddata = player.storeddata
    if(storeddata.get("skill")==null){
        storeddata.put("skill",JSON.stringify(["Empty_skill"]))
        skill_haved=JSON.parse(storeddata.get("skill"))
    }else{
        skill_haved=JSON.parse(storeddata.get("skill"))
    }
    if(page>0 && c.buttonId==11 && page<pageCounts){
        page=page+1
        player.playSound(menu_top, 3, 1)
    }
    else if(page>0 && c.buttonId==12 && page>1){
        page=page-1
        player.playSound(menu_top, 3, 1)
    }
    if (page>0){
        GUI1(c)
    }
    if (page==0){
        if (c.buttonId>=2 && c.buttonId<=9 && skillname!=''){
            if(skill_haved.indexOf(skillname)!=-1){
                var isEquiped=false
                for(var i=0;i<8;i++){
                    if (SkillManager.getSkillData(player.getMCEntity()).getSkillContainer(i).skill.getSkillId()!=null){
                        var skill=SkillManager.getSkillData(player.getMCEntity()).getSkillContainer(i).skill.getSkillId()
                    }else{
                        player.message("技能面板脚本出现未知的null错误，请及时回报管理员")
                        return false
                    }
                    if(skill==skillname){
                        player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7您已经装备过这个技能了")
                        player.playSound(failsound, 3, 1)
                        isEquiped=true
                        break
                    }
                }
                if(isEquiped==false){
                    var levelenough=false
                    if (c.buttonId-1==3){
                        if(EXPlevel>=10){
                            levelenough=true
                        }
                    }else if(c.buttonId-1==1 || c.buttonId-1==2){
                        levelenough=true
                    }else if(c.buttonId-1==4){
                        if(EXPlevel>=30){
                            levelenough=true
                        }
                    }else if(c.buttonId-1==5){
                        if(EXPlevel>=60){
                            levelenough=true
                        }
                    }else if(c.buttonId-1==6){
                        if(EXPlevel>=100){
                            levelenough=true
                        }
                    }else if(c.buttonId-1==7){
                        if(EXPlevel>=130){
                            levelenough=true
                        }
                    }else if(c.buttonId-1==8){
                        if(EXPlevel>=160){
                            levelenough=true
                        }
                    }
                    if(levelenough==true){
                        SkillManager.setSkillToSkillContainer(c.player.getMCEntity(),c.buttonId-2,"EmptySkill")
                        SkillManager.setSkillToSkillContainer(c.player.getMCEntity(),c.buttonId-2,skillname)
                        player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7成功装备§a"+skillname+"§7在槽位§b"+String(c.buttonId-1)+"§7上")
                        player.playSound(confirmsound, 3, 1)
                    }else{
                        player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§c等级不足,该槽位还没有开放")
                    }
                }
            }else{
                player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§c您还没有学习这个技能")
                player.playSound(failsound, 3, 1)
            }
        }//学习技能
        else if (c.buttonId==12 && skillname!=''){
            Item_Name="§f"+skillname+"技能书"
            Item_Name=skillname+"技能书"
            var skill_book=obtain_skill_book(c)
           //if(player.getInventory().count(skill_book,false,false)>=1){
            if(c.player.inventoryItemCount("saomod:"+skill_regid[skillname])>=1){
                c.player.removeItem("saomod:"+skill_regid[skillname],1)
                skill_haved.push(skillname)
                storeddata.put("skill",JSON.stringify(skill_haved))
                c.player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7成功学习技能§a"+skillname+"§7!")
            }else{
                c.player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§c缺少相应技能书")
            }
            
        }
        else if (c.buttonId==13 && skillname!=''){
            for(var i=0;i<8;i++){
                if (SkillManager.getSkillData(player.getMCEntity()).getSkillContainer(i).skill.getSkillId()!=null){
                    var skill=SkillManager.getSkillData(player.getMCEntity()).getSkillContainer(i).skill.getSkillId()
                }
                if(skill==skillname){
                    SkillManager.setSkillToSkillContainer(c.player.getMCEntity(),i,"EmptySkill")
                    player.playSound(failsound, 3, 1)
                    break
                }
                if(i==7 && skill!=skillname){
                    player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7您没有装备该技能")
                    player.playSound(menu_top, 3, 1)
                }
            }
        }
        else if (c.buttonId==14 && skillname!=''){
            skillname=''
            page=1
            GUI1(c)
            player.playSound(menu_top, 3, 0.8)
        }
    }
    else if (page>=1){
        if (c.buttonId<31 && c.buttonId>14){
            skill_id=(c.buttonId-15)/3+((page-1)*6)
            skillname=skill_list[skill_id]
            player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7选中:"+skillname)
            player.playSound(confirmsound, 3, 1)
        }
        if (c.buttonId==3){
            for(var i=0;i<8;i++){
                SkillManager.setSkillToSkillContainer(c.player.getMCEntity(),i,"EmptySkill")
                }
        }
        if (c.buttonId==2 && skillname!=''){
            page=0
            GUI0(c)
            player.playSound(menu_top, 3, 0.8)
        }
        else if (c.buttonId==2 && skillname==''){
            player.message("§7[§6SAO-World§7]§8[§a+§8]§7[§3技能面板§7]§7请先选择一个技能再点击打开")
        }
    }
}
