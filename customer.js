const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const util = require("./utilities");

const cust = {
    viewAndPurchase: async function(){
        //connect to db
        let sql = "SELECT * FROM products";
        let res = await util.connect(sql, []);

        //display products
        let productTable = util.tableFromJSON(util.productsHeader, res);
        console.log("\n" + productTable);

        //ask for product id
        let id = await this.askID(res);

        //ask for quantity
        let obj = util.getObjByID(res, id);
        let quant = await this.askQuant(res, obj.stock);

        //confirm order
        let total = obj.price * quant;
        let askConfirm = await this.askConfirm(obj, quant, total);

        //update db if order is confirmed
        if (askConfirm.purchase){
            console.log(`\n Order Confirmation: ${quant} unit(s) of '${obj.name}' were purchased for $${total}. \n` .bgGreen.black);
            this.updateProduct(obj, id, quant, total);
        } else {
            console.log('\n Order Cancelled \n'.bgRed.black)
        }

    },
    askID: async function(res){
        let id;
        let productPrompt = new util.Prompt("number", "Enter the ID of the product to purchase:", "id");

        do {
            let idAnswer = await util.ask({...productPrompt});
            if (util.validateID(res, idAnswer.id)){
                id = idAnswer.id;
            } else {
                console.log("Your ID was not valid, please try again." .red);
            }
        } while ( id === undefined );

        return id;
    },
    askQuant: async function(res, stock){
        let quant;
        let quantPrompt = new util.Prompt("number", `How many unit(s) would you like to purchase? (Current stock is ${stock})`, "quant");

        do {
            let quantAnswer = await util.ask({...quantPrompt});
            if (stock - quantAnswer.quant > 0 && quantAnswer.quant > 0){
                quant = quantAnswer.quant;
            } else if (quantAnswer.quant <= 0) {
                console.log(`Please enter a quantity greater than 0`);
            } else {
                console.log(`Insufficient stock, please enter a quantity less than ${stock}` .red);
            }
        } while ( quant === undefined );

        return quant;
    },
    askConfirm: async function(obj, quant, total){
        let confirmPrompt = new util.Prompt("confirm", `Please confirm your purchase of ${quant} unit(s) of '${obj.name}' for $${total} ($${obj.price}/ea):`, "purchase");
        let response = await util.ask({...confirmPrompt});
        return response;
    },
    updateProduct: async function(obj, id, quant, total){
        let sqlUpdate = "UPDATE products SET ? WHERE ?"
        let remaining = obj.stock - quant;
        let sales = obj.product_sales + total;
        util.connect(sqlUpdate, [{stock: remaining, product_sales: sales}, {id: id}]);
    },
}

cust.viewAndPurchase();
