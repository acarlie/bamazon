const COLORS = require("colors");
const UTILITIES = require("./utilities");
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const MANAGER = {
    selectAction: async function(){
        let choices = [
            { name: "View Products for Sale", value: "0" },
            { name: "View Low Inventory", value: "1" },
            { name: "Add to Inventory", value: "2" },
            { name: "Add New Product", value: "3" }
        ];
        let action = await QUESTIONS.askList(choices);

        switch(action){
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
                this.createProduct();
                break;
        }
    },
    viewProducts: async function(){
        let res = await DB.selectAll();

        //display products
        UTIL.displayTable(res);
    },
    viewLowInv: async function(){
        let sql = "SELECT * FROM products WHERE stock < 15";
        let res = await DB.connect(sql, []);

        //display products
        UTIL.displayTable(res);
    },
    addInv: async function(){
        //connect to db
        let res = await DB.selectAll();

        //ask for product id
        let id = await QUESTIONS.askID(res, "What is the ID of the product you would like to update?");
        let obj = UTIL.getObjByID(res, id);

        //ask for quantity to add
        let message = `How many units of '${obj.name}' would you like to add to stock?`;
        let toAdd = await QUESTIONS.askInt(message);

        //confirm
        let confirmMessage = `Please confirm stock update: ${toAdd} units of ${obj.name} will be stocked, for a total of ${obj.stock + toAdd}.`;
        let confirm = await QUESTIONS.askConfirm(confirmMessage);

        //set stock or cancel
        if (confirm) {
            let stock = obj.stock + toAdd;
            console.log(`\n Update Confirmation: ${toAdd} unit(s) of '${obj.name}' were added to stock for a total of ${stock}. \n` .bgGreen.black);
            DB.setItems([{stock: stock}, {id: id}]);
        } else {
            console.log('\n Stock Update Cancelled \n'.bgRed.black);
        }

    },
    createProduct: async function(){
        // check current products and depts
        let res = await DB.selectAll();

        // ask for product details
        let name = await QUESTIONS.askName(res, "What is the product's name?", /([^\w\s:,'])/gi, 'Please only use letters, numbers, spaces, and these characters: \',: ', "name");
        let dept = await this.askDept();
        let message = "What is the product's initial stock?";
        let stock = await QUESTIONS.askInt(message);
        let price = await QUESTIONS.askPrice("What is the product's price?");

        // confirm
        let confirmMessage = `Please confirm product: '${name}' will be added to the ${dept} dept with an initial stock of ${stock} and price of ${price}.`;
        let confirm = await QUESTIONS.askConfirm(confirmMessage);

        //if confirm update products table
        if (confirm){
            let sql = 'INSERT INTO products (name, department, price, stock)';
                sql += ' VALUES (?, ?, ?, ?);';
            let args = [name, dept, price, stock];
            let update = await DB.connect(sql, args);
            console.log(`\n Product Created! '${name}' was added to the ${dept} department. \n` .bgGreen.black);
        } else {
            console.log(`Product creation cancelled` .red);
        }
 
    },
    askDept: async function(){
        let res = await DB.selectAllDepts();
        let allDepts = res.map(x => x.dept_name);
        let deptPrompt = new QUESTIONS.Prompt("list", "What department is this product in?", "dept");
            deptPrompt.choices = [...new Set(allDepts)];

        let ans = await QUESTIONS.ask({...deptPrompt});

        return ans.dept;
    }
}

MANAGER.selectAction();
