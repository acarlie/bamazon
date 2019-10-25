require('colors');

const UTILITIES = require('./utilities');
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const MANAGER = {
  selectAction: async function () {
    const choices = [
      { name: 'View Products for Sale', value: '0' },
      { name: 'View Low Inventory', value: '1' },
      { name: 'Add to Inventory', value: '2' },
      { name: 'Add New Product', value: '3' }
    ];
    const action = await QUESTIONS.askList(choices);

    switch (action) {
      case '0':
        this.viewProducts();
        break;
      case '1':
        this.viewLowInv();
        break;
      case '2':
        this.addInv();
        break;
      case '3':
        this.createProduct();
        break;
    }
  },
  viewProducts: async function () {
    const res = await DB.selectAll();

    // display products
    UTIL.displayTable(UTIL.productsHeader, res);
  },
  viewLowInv: async function () {
    const sql = 'SELECT * FROM products WHERE stock < 15';
    const res = await DB.connect(sql, []);

    // display products
    UTIL.displayTable(UTIL.productsHeader, res);
  },
  addInv: async function () {
    // connect to db
    const res = await DB.selectAll();

    // ask for product id
    const id = await QUESTIONS.askID(res, 'What is the ID of the product you would like to update?');
    const obj = UTIL.filterByID(res, id);

    // ask for quantity to add
    const message = `How many units of '${obj.name}' would you like to add to stock?`;
    const toAdd = await QUESTIONS.askInt(message);

    // confirm
    const confirmMessage = `Please confirm stock update: ${toAdd} units of ${obj.name} will be stocked, for a total of ${obj.stock + toAdd}.`;
    const confirm = await QUESTIONS.askConfirm(confirmMessage);

    // set stock or cancel
    if (confirm) {
      const stock = obj.stock + toAdd;
      console.log(`\n Update Confirmation: ${toAdd} unit(s) of '${obj.name}' were added to stock for a total of ${stock}. \n`.bgGreen.black);
      DB.setItems([{ stock: stock }, { id: id }]);
    } else {
      console.log('\n Stock Update Cancelled \n'.bgRed.black);
    }
  },
  createProduct: async function () {
    // check current products and depts
    const res = await DB.selectAll();

    // ask for product details
    const name = await QUESTIONS.askName(res, "What is the product's name?", /([^\w\s:,'])/gi, 'Please only use letters, numbers, spaces, and these characters: \',: ', 'name');
    const dept = await this.askDept();
    const message = "What is the product's initial stock?";
    const stock = await QUESTIONS.askInt(message);
    const price = await QUESTIONS.askPrice("What is the product's price?");

    // confirm
    const confirmMessage = `Please confirm product: '${name}' will be added to the ${dept} dept with an initial stock of ${stock} and price of ${price}.`;
    const confirm = await QUESTIONS.askConfirm(confirmMessage);

    // if confirm update products table
    if (confirm) {
      const sql = 'INSERT INTO products (name, department, price, stock) VALUES (?, ?, ?, ?);';
      const args = [name, dept, price, stock];
      DB.connect(sql, args);
      console.log(`\n Product Created! '${name}' was added to the ${dept} department. \n`.bgGreen.black);
    } else {
      console.log(`Product creation cancelled`.red);
    }
  },
  askDept: async function () {
    const res = await DB.selectAllDepts();
    const allDepts = res.map(x => x.dept_name);
    const deptPrompt = new QUESTIONS.Prompt('list', 'What department is this product in?', 'dept');
    deptPrompt.choices = [...new Set(allDepts)];

    const ans = await QUESTIONS.ask({ ...deptPrompt });

    return ans.dept;
  }
};

MANAGER.selectAction();
