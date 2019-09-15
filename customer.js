const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const util = require("./utilities");

const cust = {
    viewAll: function(){
        let sql = "SELECT * FROM products";
        let format = (obj) => console.log(obj);
        util.connect(sql, [], format);
    },
    askProduct(){
        
    }
    
}

// confirm example
// var newPrompt = new util.Prompt("confirm", "Hello?", "hello");
// util.ask({...newPrompt}); //spread gets around issue of using new instance constructor directly

// list example
// var newPrompt2 = new util.Prompt("list", "Which do you prefer?", "list-name");
// newPrompt2.choices = ["opt1", "opt2"];
// util.ask({...newPrompt2});


// * The first should ask them the ID of the product they would like to buy.
// * The second message should ask how many units of the product they would like to buy.

cust.viewAll();

// async function top(){
//     let res = await getArtist();
//     let sql = 'SELECT albums.year, albums.position, albums.album, songs.artist, songs.title';
//         sql += ' FROM songs';
//         sql += ' INNER JOIN albums ON (songs.artist = ? and albums.artist = ?)';
//         sql += ' ORDER BY albums.year';

//     let format = (obj) => console.log(`Year: ${obj.year}, Position: ${obj.position}, Album: ${obj.album}, Artist: ${obj.artist}, Title: ${obj.title}`);
//     connect(sql, [res.artist_name, res.artist_name], format);
// }

