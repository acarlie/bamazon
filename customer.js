const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const util = require("./utilities");

const cust = {
    viewAndPurchase: async function(){
        let sql = "SELECT * FROM products";
        let res = await util.connect(sql, []);

        let productTable = util.tableFromJSON(util.productsHeader, res);
        console.log("\n" + productTable);

        let id = await this.askID(res);
        let quant = await this.askQuant(res, id);
      
        console.log(`ID: ${id}, Quant: ${quant}`);

    },
    askID: async function(res){
        let id;
        let productPrompt = new util.Prompt("number", "Enter the ID of the product to purchase:", "id");

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
    askQuant: async function(res, id){
        let quant;
        let stock = util.getStock(res, id);
        let quantPrompt = new util.Prompt("number", `How many units would you like to purchase? (Current stock is ${stock})`, "quant");

        do {
            let quantAnswer = await util.ask({...quantPrompt});
            if (stock - quantAnswer.quant > 0){
                quant = quantAnswer.quant;
            } else {
                console.log("Not Enough Stock :(" .red);
            }
        } while ( quant === undefined );

        return quant;
    }
}

cust.viewAndPurchase();


// async function top(){
//     let res = await getArtist();
//     let sql = 'SELECT albums.year, albums.position, albums.album, songs.artist, songs.title';
//         sql += ' FROM songs';
//         sql += ' INNER JOIN albums ON (songs.artist = ? and albums.artist = ?)';
//         sql += ' ORDER BY albums.year';

//     let format = (obj) => console.log(`Year: ${obj.year}, Position: ${obj.position}, Album: ${obj.album}, Artist: ${obj.artist}, Title: ${obj.title}`);
//     connect(sql, [res.artist_name, res.artist_name], format);
// }

