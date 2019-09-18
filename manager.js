const COLORS = require("colors");
const UTIL = require("./utilities");
const DB = UTIL.database;
const QUESTIONS = UTIL.questions;
const UTILITIES = UTIL.util;

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
        UTILITIES.displayTable(res);
    },
    viewLowInv: async function(){
        let sql = "SELECT * FROM products WHERE stock < 15";
        let res = await DB.connect(sql, []);

        //display products
        UTILITIES.displayTable(res);
    },
    addInv: async function(){
        //connect to db
        let res = await DB.selectAll();

        //ask for product id
        let id = await QUESTIONS.askID(res, "What is the ID of the product you would like to update?");
        let obj = UTILITIES.getObjByID(res, id);

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
        let name = await this.askName(res);
        let dept = await this.askDept(res);
        let message = "What is the product's initial stock?";
        let stock = await QUESTIONS.askInt(message);
        let price = await this.askPrice();

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
    askName: async function(res){
        let namePrompt = new QUESTIONS.Prompt("input", "What is the product's name?", "name");
        let allNames = res.map(x => x.name);
        let name;

        do {
            let response = await QUESTIONS.ask({...namePrompt});
            let regex = /([^\w\s:,'])/gi;
            let regexTest = regex.test(response.name);
            let isSame = allNames.indexOf(response.name) > -1;

            if ( !regexTest && !isSame ){
                name = response;
            } else if ( isSame ){
                console.log(`The product '${response.name}' already exists. Please enter a different product.` .red);
            } else if ( regexTest ){
                console.log('Please only use letters, numbers, and spaces.' .red);
            }

        } while ( name === undefined );

        return name.name;
    },
    askDept: async function(res){
        let allDepts = res.map(x => x.department);
        let deptPrompt = new QUESTIONS.Prompt("list", "What department is this product in?", "dept");
            deptPrompt.choices = [...new Set(allDepts)];

        let ans = await QUESTIONS.ask({...deptPrompt});

        return ans.dept;
    },
    askPrice: async function(){
        let message = "What is the product's price?";
        let bool = (ans) => ans > 0;
        let err = 'Please enter a positive number greater than 0.';

        let price = await QUESTIONS.askNumberUntilCondition(message, bool, err);

        return price;
    }
}

MANAGER.selectAction();
