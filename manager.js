const COLORS = require("colors");
const UTIL = require("./utilities");

const MANAGER = {
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
                this.createProduct();
                break;
        }
    },
    askAction: async function(){
        let actionPrompt = new UTIL.Prompt("list", "What would you like to do?", "action");
        actionPrompt.choices = [
            { name: "View Products for Sale", value: "0" },
            { name: "View Low Inventory", value: "1" },
            { name: "Add to Inventory", value: "2" },
            { name: "Add New Product", value: "3" }
        ];

        let res = await UTIL.ask({...actionPrompt});
        return res;
    },
    viewProducts: async function(){
        let res = await UTIL.selectAll();

        //display products
        UTIL.displayTable(res);
    },
    viewLowInv: async function(){
        let sql = "SELECT * FROM products WHERE stock < 15";
        let res = await UTIL.connect(sql, []);

        //display products
        UTIL.displayTable(res);
    },
    addInv: async function(){
        //connect to db
        let res = await UTIL.selectAll();

        //ask for product id
        let id = await UTIL.askID(res, "What is the ID of the product you would like to update?");
        let obj = UTIL.getObjByID(res, id);

        //ask for quantity to add
        let toAdd = await this.askUpdateQuant(obj);

        //confirm
        let confirmMessage = `Please confirm stock update: ${toAdd} units of ${obj.name} will be stocked, for a total of ${obj.stock + toAdd}.`;
        let confirm = await UTIL.askConfirm(confirmMessage);

        //set stock or cancel
        if (confirm) {
            let stock = obj.stock + toAdd;
            console.log(`\n Update Confirmation: ${toAdd} unit(s) of '${obj.name}' were added to stock for a total of ${stock}. \n` .bgGreen.black);
            UTIL.setItems([{stock: stock}, {id: id}]);
        } else {
            console.log('\n Stock Update Cancelled \n'.bgRed.black);
        }

    },
    askUpdateQuant: async function(obj){
        let updateQuantPrompt = new UTIL.Prompt("number", `How many units of '${obj.name}' would you like to add to stock?`, "stock");

        let quant;
        do {

            let ans = await UTIL.ask({...updateQuantPrompt});
            let isInt = Number.isInteger(ans.stock);

            if (ans.stock >= 0 && isInt) {
                quant = ans.stock;
            } else {
                console.log('Please enter an integer 0 or greater.' .red)
            }

        } while ( quant === undefined );

        return quant;
    },
    createProduct: async function(){
        // check current products and depts
        let res = await UTIL.selectAll();

        // ask for product details
        let name = await this.askName(res);
        let dept = await this.askDept(res);
        let stock = await this.askStock();
        let price = await this.askPrice();

        // confirm
        let confirmMessage = `Please confirm product: '${name}' will be added to the ${dept} dept with an initial stock of ${stock} and price of ${price}.`;
        let confirm = await UTIL.askConfirm(confirmMessage);

        //if confirm update products table
        if (confirm){
            console.log(name, stock, dept, price);
            let sql = 'INSERT INTO products (name, department, price, stock)';
                sql += ' VALUES (?, ?, ?, ?);';
            let args = [name, dept, price, stock];
            let update = await UTIL.connect(sql, args);
        } else {
            console.log(`Product creation cancelled` .red);
        }
 
    },
    askName: async function(res){
        let namePrompt = new UTIL.Prompt("input", "What is the product's name?", "name");
        let allNames = res.map(x => x.name);
        let name;

        do {
            let response = await UTIL.ask({...namePrompt});
            let regex = /([^A-Z\s])/gi;
            let regexTest = regex.test(response.name);
            let isSame = allNames.indexOf(response.name) > -1;

            if ( !regexTest && !isSame ){
                name = response;
            } else if ( isSame ){
                console.log(`The product '${response.name}' already exists. Please enter a different product.` .red);
            } else if ( regexTest ){
                console.log('Please only use letters and spaces.' .red);
            }

        } while ( name === undefined );

        return name.name;
    },
    askDept: async function(res){
        let allDepts = res.map(x => x.department);
        let deptPrompt = new UTIL.Prompt("list", "What department is this product in?", "dept");
            deptPrompt.choices = [...new Set(allDepts)];

        let ans = await UTIL.ask({...deptPrompt});

        return ans.dept;
    },
    askStock: async function(){
        let stockPrompt = new UTIL.Prompt("number", "What is the product's initial stock?", "stock");
        let stock;

        do {
            let ans = await UTIL.ask({...stockPrompt});
            let isInt = Number.isInteger(ans.stock);

            if (ans.stock >= 0 && isInt){
                stock = ans.stock;
            } else {
                console.log(`Please enter an integer greater than or equal to 0` .red);
            } 

        } while ( stock === undefined );

        return stock;

    },
    askPrice: async function(){
        let pricePrompt = new UTIL.Prompt("number", "What is the product's price?", "price");
        let price;

        do {
            let ans = await UTIL.ask({...pricePrompt});
            if (ans.price > 0){
                price = ans.price.toFixed(2);
            } else {
                console.log("Please enter a positive number above 0." .red);
            }
        } while ( price === undefined );

        return price;
    }
}

MANAGER.selectAction();
