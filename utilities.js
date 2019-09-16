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
    ask: function(promptObj){
        return inquirer
            .prompt(promptObj)
            .then(res => { return res });
    },
    connect: async function(sql, args){
        const connectObj = { host: "localhost", port: 3306, user: "root", password: "wp8177", database: "bamazon_DB" };
        const connection = mysql.createConnection(connectObj);

        let query = await this.query(connection, sql, args);
        return query;
    },
    query: function(connection, sql, args){
        return new Promise((resolve, reject) =>{
            connection.query(sql, args, function(err, res) {
                if (err) throw err;
                let parsed = JSON.parse(JSON.stringify(res));
                resolve(parsed);
                connection.end();
            });
        }).then(res => { return res });
    },
    validateID: function(res, val){
        let arr = res.map(x => x.id);
        return arr.indexOf(val) > -1 ? true : false ;
    },
    getStock: function(res, val){
        let obj = res.filter(x => x.id === val);
        return obj.stock;
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

// confirm example
// var newPrompt = new util.Prompt("confirm", "Hello?", "hello");
// util.ask({...newPrompt}); //spread gets around issue of using new instance constructor directly

// list example
// var newPrompt2 = new util.Prompt("list", "Which do you prefer?", "list-name");
// newPrompt2.choices = ["opt1", "opt2"];
// util.ask({...newPrompt2});

module.exports = util;