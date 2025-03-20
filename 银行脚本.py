NAME="minecraft:gold_block"
LIGHT=0

def init(c):
    block = c.block
    block.setLight(LIGHT)
    block.setModel(NAME)
    
def interact(c):
    player = c.player
    storeddata = player.storeddata
    if storeddata.get("choice") == None:
        storeddata.put("choice", 0)
    choice = int(storeddata.get("choice"))
    Scoreboard=player.getWorld().getScoreboard()
    colnum=Scoreboard.getObjective("col").getScore(player.getName())
    colnum=colnum.getValue()
          
    gui = c.API.createCustomGui(1, 1000, 500, False)
    gui.addTexturedRect(1, "minecraft:textures/gui/book.png", 410, 150, 256, 180, 0, 0)
    gui.addLabel(2, u"§8" + u"银行", 435, 152 + 9, 29, 29, 16755200)
    gui.addLabel(21, u"§8存款：", 465, 152 + 9, 29, 29, 16755200)
    gui.addLabel(22, u"§8" + str(colnum), 485, 152 + 9, 29, 29, 16755200)
    gui.addLabel(3, u"§8万", 450, 130 + 65, 100, 100, 16755200)
    gui.addButton(4, u"+", 490 + 30, 177 + 15, 10, 10)
    gui.addButton(5, u"-", 490 + 50, 177 + 15, 10, 10)
    gui.addLabel(6, u"§8千", 450, 150 + 65, 100, 100, 16755200)
    gui.addButton(7, u"+", 490 + 30, 195 + 15, 10, 10)
    gui.addButton(8, u"-", 490 + 50, 195 + 15, 10, 10)
    gui.addLabel(9, u"§8百", 450, 170 + 65, 100, 100, 16755200)
    gui.addButton(10, u"+", 490 + 30, 215 + 15, 10, 10)
    gui.addButton(11, u"-", 490 + 50, 215 + 15, 10, 10)
    gui.addLabel(12, u"§8十", 450, 190 + 65, 100, 100, 16755200)
    gui.addButton(13, u"+", 490 + 30, 235 + 15, 10, 10)
    gui.addButton(14, u"-", 490 + 50, 235 + 15, 10, 10)
    gui.addLabel(15, u"§8个", 450, 210 + 65, 100, 100, 16755200)
    gui.addButton(16, u"+", 490 + 30, 255 + 15, 10, 10)
    gui.addButton(17, u"-", 490 + 50, 255 + 15, 10, 10)
    gui.addLabel(18, u"§8输入:", 450, 230 + 60, 100, 100, 16755200)
    gui.addLabel(19, u"§8" + str(choice), 470, 230 + 60, 100, 100, 16755200)
    gui.addButton(20, u"清零", 495 + 10, 275 + 10, 50, 20)
    gui.addButton(23, u"取款", 450, 295 + 10, 50, 20)
    gui.addButton(24, u"存款", 495 + 10, 295 + 10, 50, 20)
    c.player.showCustomGui(gui)

    

def customGuiButton(c):
    gui = c.gui
    player = c.player
    storeddata = player.storeddata
    choice = int(storeddata.get("choice"))
    Scoreboard=player.getWorld().getScoreboard()
    col=Scoreboard.getObjective("col").getScore(player.getName())
    pickcol=Scoreboard.getObjective("pickcol").getScore(player.getName())
    savecol=Scoreboard.getObjective("savecol").getScore(player.getName())
    colnum=col.getValue()
    API = c.API
    if pickcol.getValue()!=0:
        player.message(u"§8[§aSAO银行§8]§e您有一笔正在进行的订单，请稍后再试")
        return
    if savecol.getValue()!=0:
        player.message(u"§8[§aSAO银行§8]§e您有一笔正在进行的订单，请稍后再试")
        return
    if c.buttonId == 4:
        choice+=10000
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 5:
        choice-=10000
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 7:
        choice+=1000
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 8:
        choice-=1000
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 10:
        choice+=100
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 11:
        choice-=100
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 13:
        choice+=10
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 14:
        choice-=10
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 16:
        choice+=1
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 17:
        choice-=1
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 20:
        choice=0
        label = gui.getComponent(19)
        label.setText(u"§8" + str(choice))
        storeddata.put("choice", choice)
        gui.updateComponent(label)
        gui.update(player)
    if c.buttonId == 23:
        if colnum >= choice:
            if choice>0:
                col.setValue(colnum-choice)
                pickcol.setValue(choice)
                player.message(u"§8[§aSAO银行§8]§8提现成功，提现了"+str(choice)+u"§8柯尔")
                choice=0
                label = gui.getComponent(19)
                label.setText(u"§8" + str(choice))
                deposit = gui.getComponent(22)
                deposit.setText(u"§8" + str(col.getValue()))
                storeddata.put("choice", choice)
                gui.updateComponent(label)
                gui.updateComponent(deposit)
                gui.update(player)
            elif choice<=0:
                    player.message(u"§8[§aSAO银行§8]§c请输入大于0的数字")
        else:
            player.message(u"§8[§aSAO银行§8]§8存款不足，不能提现")
            choice=0
            c.player.closeGui()
    if c.buttonId == 24:
        item=player.getMainhandItem()
        itemIsCoin=item.getNbt().has("IsCoin")
        if itemIsCoin:
            colcount=player.inventoryItemCount(item)
            if colcount>=choice:
                if choice>0:
                    savecol.setValue(choice)
                    #player.removeItem(item,choice)
                    player.message(u"§8[§aSAO银行§8]§8存款成功，存入了"+str(choice)+u"§8柯尔")
                    col.setValue(colnum+choice)
                    choice=0
                    label = gui.getComponent(19)
                    label.setText(u"§8" + str(choice))
                    deposit = gui.getComponent(22)
                    deposit.setText(u"§8" + str(col.getValue()))
                    storeddata.put("choice", choice)
                    gui.updateComponent(label)
                    gui.updateComponent(deposit)
                    gui.update(player)
                elif choice<=0:
                    player.message(u"§8[§aSAO银行§8]§c请输入大于0的数字")
            else:
                player.message(u"§8[§aSAO银行§8]§c没有足够的现金！")
                choice=0
                c.player.closeGui()
        else:
            c.player.closeGui()
            player.message(u"§8[§aSAO银行§8]§e存款时需要手持col硬币！")
            return False
