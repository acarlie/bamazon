const MYSQL = require("mysql");
const INQUIRER = require("inquirer");
const {table} = require('table');
const COLORS = require("colors");

const QUESTIONS = {
    Prompt: function(type, message, name){
        this.type = type;
        this.message = message;
        this.name = name;
    },
    ask: function(promptObj){
        return INQUIRER
            .prompt(promptObj)
            .then(res => { return res });
    },
    askConfirm: async function(message){
        let confirmPrompt = new this.Prompt("confirm", message, "confirm");
        let res = await this.ask({...confirmPrompt});
        return res.confirm;
    },
    askNumberUntilCondition: async function(message, condition, err){
        let numPrompt = new this.Prompt("number", message, "num");
        let number;

        do {
            let ans = await this.ask({...numPrompt});
            let bool = condition(ans.num);

            if (bool){
                number = ans.num;
            } else {
                console.log(err .red);
            } 

        } while ( number === undefined );

        return number;
    },
    askInt: async function(message){
        let bool = (ans) => ans >= 0 && Number.isInteger(ans);
        let err = 'Please enter an integer 0 or greater.';

        let quant = await this.askNumberUntilCondition(message, bool, err);

        return quant;
    },
    askPrice: async function(message){
        let bool = (ans) => ans > 0;
        let err = 'Please enter a positive number greater than 0.';

        let price = await this.askNumberUntilCondition(message, bool, err);

        return price.toFixed(2);
    },
    askList: async function(arr){
        let actionPrompt = new this.Prompt("list", "What would you like to do?", "action");
        actionPrompt.choices = [...arr];
        let res = await this.ask({...actionPrompt});
        return res.action;
    },
    askID: async function(res, message){
        let id;
        let productPrompt = new this.Prompt("number", message, "id");

        do {
            let idAnswer = await this.ask({...productPrompt});
            if (UTIL.validateID(res, idAnswer.id)){
                id = idAnswer.id;
            } else {
                console.log("Your ID was not valid, please try again." .red);
            }
        } while ( id === undefined );

        return id;
    },
    askName: async function(res, message, regex, regexErr, prop){
        let namePrompt = new QUESTIONS.Prompt("input", message, "name");
        let allNames = res.map(x => x[prop]);
        let name;

        do {
            let ans = await QUESTIONS.ask({...namePrompt});
            let regexTest = regex.test(ans.name);
            let isSame = allNames.indexOf(ans.name) > -1;
            let resLength = ans.name.length;

            if ( !regexTest && !isSame && resLength <= 70 ){
                name = ans;
            } else {
                let error = "";

                if ( isSame ){ error += `The product '${ans.name}' already exists. Please enter a different name. `; } 
                if ( regexTest ){ error += regexErr; } 
                if ( resLength > 70 ){ error += 'Names can only be 70 characters long, please enter a shorter name. '; }

                console.log(error .red);
            }

        } while ( name === undefined );

        return name.name;
    }

};

const DB = {
    connect: async function(sql, args){
        const connectObj = { host: "localhost", port: 3306, user: "root", password: "wp8177", database: "bamazon_DB" };
        const connection = MYSQL.createConnection(connectObj);

        let query = await this.query(connection, sql, args);
        return query;
    },
    selectAll: async function(){
        let sql = "SELECT * FROM products";
        let res = await this.connect(sql, []);
        return res;
    },
    selectAllDepts: async function(){
        let sql = "SELECT * FROM departments";
        let res = await this.connect(sql, []);
        return res;
    },
    setItems: async function(args){
        let sqlUpdate = "UPDATE products SET ? WHERE ?";
        let update = await this.connect(sqlUpdate, args);
    },
    query: function(connection, sql, args){
        return new Promise((resolve, reject) =>{
            connection.query(sql, args, function(err, res) {
                if (err) throw err;
                resolve(UTIL.parse(res));
                connection.end();
            });
        }).then(res => { return res });
    }
}

const UTIL = {
    parse: (res) => JSON.parse(JSON.stringify(res)),
    displayTable: function(res){
        let productTable = this.tableFromJSON(this.productsHeader, res);
        console.log("\n" + productTable);
    },
    validateID: function(res, val){
        let arr = res.map(x => x.id);
        return arr.indexOf(val) > -1 ? true : false ;
    },
    getObjByID: function(res, val){
        let arr = res.filter(x => x.id === val);
        return arr[0];
    },
    tableFromJSON: function(headerArr, json){
        let header = headerArr.map(x => x.cyan);
        let arr = json.map(x => {
            let data = [];
            for (let prop in x){
                if (x.hasOwnProperty(prop)){
                    data = data.concat(x[prop]);
                } 
            }
            return data;
        });

        let final = [header].concat(arr);
        return table(final, this.tableConfig);
    },
    productsHeader: ["ID", "Product Name", "Dept", "Price", "Stock", "Total Sales"],
    tableConfig: {
        border: {
            topBody: `─`.grey,
            topJoin: `┬`.grey,
            topLeft: `┌`.grey,
            topRight: `┐`.grey,
        
            bottomBody: `─`.grey,
            bottomJoin: `┴`.grey,
            bottomLeft: `└`.grey,
            bottomRight: `┘`.grey,
        
            bodyLeft: `│`.grey,
            bodyRight: `│`.grey,
            bodyJoin: `│`.grey,
        
            joinBody: `─`.grey,
            joinLeft: `├`.grey,
            joinRight: `┤`.grey,
            joinJoin: `┼`.grey
        }
    }
}

module.exports = {
    util: UTIL,
    questions: QUESTIONS,
    database: DB
};