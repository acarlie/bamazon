const COLORS = require("colors");
const UTILITIES = require("./utilities");
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const CUST = {
    viewAndPurchase: async function(){
        //connect to db
        let sql = "SELECT id, name, department, price FROM products";
        let res = await DB.connect(sql, []);

        //display products
        UTIL.displayTable(["ID", "NAME", "DEPT", "PRICE"], res);

        //ask for product id
        let id = await QUESTIONS.askID(res, "Enter the ID of the product to purchase:");

        //get full obj
        let obj = await DB.getByID(id);

        //ask for quantity
        let quant = await this.askQuant(res, obj.stock);

        //confirm order
        let total = parseFloat((obj.price * quant).toFixed(2));
        let confirmMessage = `Please confirm your purchase of ${quant} unit(s) of '${obj.name}' for $${total} ($${obj.price}/ea):`;
        let confirm = await QUESTIONS.askConfirm(confirmMessage);

        //update db if order is confirmed
        if (confirm){
            console.log(`\n Order Confirmation: ${quant} unit(s) of '${obj.name}' were purchased for $${total}. \n` .bgGreen.black);
            this.updateProduct(obj, id, quant, total);
        } else {
            console.log('\n Order Cancelled \n'.bgRed.black)
        }
    },
    askQuant: async function(res, stock){
        let quant;
        let quantPrompt = new QUESTIONS.Prompt("number", `How many unit(s) would you like to purchase? (Current stock is ${stock})`, "quant");

        do {
            let ans = await QUESTIONS.ask({...quantPrompt});
            let isInt = Number.isInteger(ans.quant);
            if (stock - ans.quant > 0 && ans.quant > 0 && isInt){
                quant = ans.quant;
            } else if (ans.quant <= 0 || !isInt) {
                console.log(`Please enter an integer greater than 0`);
            } else {
                console.log(`Insufficient stock, please enter a quantity less than ${stock}` .red);
            }
        } while ( quant === undefined );

        return quant;
    },
    updateProduct: async function(obj, id, quant, total){
        let remaining = obj.stock - quant;
        let sales = obj.product_sales + total;
        DB.setItems([{stock: remaining, product_sales: sales}, {id: id}]);
    },
}

CUST.viewAndPurchase();
