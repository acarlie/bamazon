//   * List a set of menu options:
//     * View Products for Sale
//     * View Low Inventory
//     * Add to Inventory
//     * Add New Product
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

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
                //Add New Product
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
        let productTable = util.tableFromJSON(util.productsHeader, res);
        console.log("\n" + productTable);
    },
    viewLowInv: async function(){
        let sql = "SELECT * FROM products WHERE stock < 15";
        let res = await util.connect(sql, []);

        //display products
        let productTable = util.tableFromJSON(util.productsHeader, res);
        console.log("\n" + productTable);
    },
    addInv: async function(){
        let res = await util.selectAll();

        let id = await util.askID(res, "What is the ID of the product you would like to update?");
        let obj = util.getObjByID(res, id);
        console.log(obj);

        // let sqlUpdate = "UPDATE products SET ? WHERE ?"
        // let stockUpdate;
        // util.connect(sqlUpdate, [{stock: stockUpdate}, {id: id}]);

    },
    askUpdateQuant: async function(obj){
        let updateQuantPrompt = new util.Prompt("number", "How many units of ")
    }
}

manager.selectAction();

// let quantPrompt = new util.Prompt("number", `How many unit(s) would you like to purchase? (Current stock is ${stock})`, "quant");

// do {
//     let quantAnswer = await util.ask({...quantPrompt});
//     if (stock - quantAnswer.quant > 0 && quantAnswer.quant > 0){
//         quant = quantAnswer.quant;
//     } else if (quantAnswer.quant <= 0) {
//         console.log(`Please enter a quantity greater than 0`);
//     } else {
//         console.log(`Insufficient stock, please enter a quantity less than ${stock}` .red);
//     }
// } while ( quant === undefined );

// return quant;