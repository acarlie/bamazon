const COLORS = require("colors");
const UTIL = require("./utilities");
const DB = UTIL.database;
const QUESTIONS = UTIL.questions;
const UTILITIES = UTIL.util;

const CUST = {
    viewAndPurchase: async function(){
        //connect to db
        let res = await DB.selectAll();

        //display products
        UTILITIES.displayTable(res);

        //ask for product id
        let id = await QUESTIONS.askID(res, "Enter the ID of the product to purchase:");

        //ask for quantity
        let obj = UTILITIES.getObjByID(res, id);
        let quant = await this.askQuant(res, obj.stock);

        //confirm order
        let total = obj.price * quant;
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
