const colors = require("colors");
const util = require("./utilities");

const manager = {
    selectAction: async function(){
        let action = await this.askAction();

        switch(action.action){
            case "0":
                this.viewProducts();
                break;
            case "1":
                this.viewLowInv();
                break;
            case "2":
                this.addInv();
                break;
            case "3":
                //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
                break;
        }
    },
    askAction: async function(){

        let actionPrompt = new util.Prompt("list", "What would you like to do?", "action");
        actionPrompt.choices = [
            { name: "View Products for Sale", value: "0" },
            { name: "View Low Inventory", value: "1" },
            { name: "Add to Inventory", value: "2" },
            { name: "Add New Product", value: "3" }
        ];

        let res = await util.ask({...actionPrompt});
        return res;
    },
    viewProducts: async function(){
        let res = await util.selectAll();

        //display products
        util.displayTable(res);
    },
    viewLowInv: async function(){
        let sql = "SELECT * FROM products WHERE stock < 15";
        let res = await util.connect(sql, []);

        //display products
        util.displayTable(res);
    },
    addInv: async function(){
        //connect to db
        let res = await util.selectAll();

        //ask for product id
        let id = await util.askID(res, "What is the ID of the product you would like to update?");
        let obj = util.getObjByID(res, id);

        //ask for quantity to add
        let toAdd = await this.askUpdateQuant(obj);

        //confirm
        let confirm = await this.askConfirmUpdate(obj, toAdd);

        //set stock or cancel
        if (confirm.update) {
            let stock = obj.stock + toAdd;
            console.log(`\n Update Confirmation: ${toAdd} unit(s) of '${obj.name}' were added to stock for a total of ${stock}. \n` .bgGreen.black);
            util.setItems([{stock: stock}, {id: id}]);
        } else {
            console.log('\n Stock Update Cancelled \n'.bgRed.black);
        }

    },
    askUpdateQuant: async function(obj){
        let updateQuantPrompt = new util.Prompt("number", `How many units of '${obj.name}' would you like to add to stock?`, "stock");

        let quant;
        do {
            let ans = await util.ask({...updateQuantPrompt});
            let isInt = Number.isInteger(ans.stock);

            if (ans.stock >= 0 && isInt) {
                quant = ans.stock;
            } else {
                console.log('Please enter an integer 0 or greater.' .red)
            }

        } while ( quant === undefined );

        return quant;
    },
    askConfirmUpdate: async function(obj, quant){
        let updatePrompt = new util.Prompt("confirm", `Please confirm stock update: ${quant} units of ${obj.name} will be stocked, for a total of ${obj.stock + quant}.`, "update");
        let res = await util.ask({...updatePrompt});
        return res;
    }
}

manager.selectAction();
