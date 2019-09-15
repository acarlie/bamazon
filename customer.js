const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const util = require("./utilities");



const cust = {

}

// async function top(){
//     let res = await getArtist();
//     let sql = 'SELECT albums.year, albums.position, albums.album, songs.artist, songs.title';
//         sql += ' FROM songs';
//         sql += ' INNER JOIN albums ON (songs.artist = ? and albums.artist = ?)';
//         sql += ' ORDER BY albums.year';

//     let format = (obj) => console.log(`Year: ${obj.year}, Position: ${obj.position}, Album: ${obj.album}, Artist: ${obj.artist}, Title: ${obj.title}`);
//     connect(sql, [res.artist_name, res.artist_name], format);
// }

