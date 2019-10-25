require('colors');

const UTILITIES = require('./utilities');
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const CUST = {
  viewAndPurchase: async function () {
    // connect to db
    const sql = 'SELECT id, name, department, price FROM products';
    const res = await DB.connect(sql, []);

    // display products
    UTIL.displayTable(['ID', 'NAME', 'DEPT', 'PRICE'], res);

    // ask for product id
    const id = await QUESTIONS.askID(res, 'Enter the ID of the product to purchase:');

    // get full obj
    const obj = await DB.getByID(id);

    // ask for quantity
    const quant = await this.askQuant(res, obj.stock);

    // confirm order
    const total = parseFloat((obj.price * quant).toFixed(2));
    const confirmMessage = `Please confirm your purchase of ${quant} unit(s) of '${obj.name}' for $${total} ($${obj.price}/ea):`;
    const confirm = await QUESTIONS.askConfirm(confirmMessage);

    // update db if order is confirmed
    if (confirm) {
      console.log(`\n Order Confirmation: ${quant} unit(s) of '${obj.name}' were purchased for $${total}. \n`.bgGreen.black);
      this.updateProduct(obj, id, quant, total);
    } else {
      console.log('\n Order Cancelled \n'.bgRed.black);
    }
  },
  askQuant: async function (res, stock) {
    let quant;
    const quantPrompt = new QUESTIONS.Prompt('number', `How many unit(s) would you like to purchase? (Current stock is ${stock})`, 'quant');

    do {
      const ans = await QUESTIONS.ask({ ...quantPrompt });
      const isInt = Number.isInteger(ans.quant);
      if (stock - ans.quant > 0 && ans.quant > 0 && isInt) {
        quant = ans.quant;
      } else if (ans.quant <= 0 || !isInt) {
        console.log(`Please enter an integer greater than 0`.red);
      } else {
        console.log(`Insufficient stock, please enter a quantity less than ${stock}`.red);
      }
    } while (quant === undefined);

    return quant;
  },
  updateProduct: async function (obj, id, quant, total) {
    const remaining = obj.stock - quant;
    const sales = obj.product_sales + total;
    DB.setItems([{ stock: remaining, product_sales: sales }, { id: id }]);
  }
};

CUST.viewAndPurchase();
