const mysql = require("mysql");
const inquirer = require("inquirer");

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
    connect: function(sql, args, cb){
        const connectObj = { host: "localhost", port: 3306, user: "root", password: "wp8177", database: "bamazon_DB" };
        const connection = mysql.createConnection(connectObj);
        
        connection.connect(function(err) {
        if (err) throw err;
    
            connection.query(sql, args, function(err, res) {
                if (err) throw err;
                let parsed = JSON.parse(JSON.stringify(res));
                for (let x of parsed){
                    cb(x);
                }
                connection.end();
            });
        
        });
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