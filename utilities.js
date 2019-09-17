const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require('table');
const colors = require("colors");

const util = {
    Prompt: function(type, message, name){
        this.type = type;
        this.message = message;
        this.name = name;
    },
    parse: (res) => JSON.parse(JSON.stringify(res)),
    ask: function(promptObj){
        return inquirer
            .prompt(promptObj)
            .then(res => { return res });
    },
    askID: async function(res, message){
        let id;
        let productPrompt = new util.Prompt("number", message, "id");

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
    connect: async function(sql, args){
        const connectObj = { host: "localhost", port: 3306, user: "root", password: "wp8177", database: "bamazon_DB" };
        const connection = mysql.createConnection(connectObj);

        let query = await this.query(connection, sql, args);
        return query;
    },
    selectAll: async function(){
        let sql = "SELECT * FROM products";
        let res = await util.connect(sql, []);
        return res;
    },
    setItems: async function(args){
        let sqlUpdate = "UPDATE products SET ? WHERE ?";
        let update = await util.connect(sqlUpdate, args);
    },
    displayTable: function(res){
        let productTable = this.tableFromJSON(this.productsHeader, res);
        console.log("\n" + productTable);
    },
    query: function(connection, sql, args){
        let me = this;
        return new Promise((resolve, reject) =>{
            connection.query(sql, args, function(err, res) {
                if (err) throw err;
                resolve(me.parse(res));
                connection.end();
            });
        }).then(res => { return res });
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

module.exports = util;