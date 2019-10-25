const MYSQL = require('mysql');
const INQUIRER = require('inquirer');
const { table } = require('table');

require('colors');

const QUESTIONS = {
  Prompt: function (type, message, name) {
    this.type = type;
    this.message = message;
    this.name = name;
  },
  ask: function (promptObj) {
    return INQUIRER
      .prompt(promptObj)
      .then(res => { return res; });
  },
  askConfirm: async function (message) {
    const confirmPrompt = new this.Prompt('confirm', message, 'confirm');
    const res = await this.ask({ ...confirmPrompt });
    return res.confirm;
  },
  askNumUntil: async function (message, condition, err) {
    const numPrompt = new this.Prompt('number', message, 'num');
    let number;

    do {
      const ans = await this.ask({ ...numPrompt });
      const bool = condition(ans.num);

      if (bool) {
        number = ans.num;
      } else {
        console.log(err.red);
      }
    } while (number === undefined);

    return number;
  },
  askInt: async function (message) {
    const bool = (ans) => ans >= 0 && Number.isInteger(ans);
    const err = 'Please enter an integer 0 or greater.';
    const quant = await this.askNumUntil(message, bool, err);
    return quant;
  },
  askPrice: async function (message) {
    const bool = (ans) => ans > 0;
    const err = 'Please enter a positive number greater than 0.';
    const price = await this.askNumUntil(message, bool, err);
    return price.toFixed(2);
  },
  askID: async function (res, message) {
    const condition = UTIL.validateID(res);
    const id = await QUESTIONS.askNumUntil(message, condition, 'Your ID was not valid, please try again.');
    return id;
  },
  askList: async function (arr) {
    const actionPrompt = new this.Prompt('list', 'What would you like to do?', 'action');
    actionPrompt.choices = [...arr];
    const res = await this.ask({ ...actionPrompt });
    return res.action;
  },
  askName: async function (res, message, regex, regexErr, prop) {
    const namePrompt = new QUESTIONS.Prompt('input', message, 'name');
    const allNames = res.map(x => x[prop]);
    let name;

    do {
      const ans = await QUESTIONS.ask({ ...namePrompt });
      const regexTest = regex.test(ans.name);
      const isSame = allNames.indexOf(ans.name) > -1;
      const resLength = ans.name.length;

      if (!regexTest && !isSame && resLength <= 70) {
        name = ans;
      } else {
        let error = '';

        if (isSame) { error += `The product '${ans.name}' already exists. Please enter a different name. `; }
        if (regexTest) { error += regexErr; }
        if (resLength > 70) { error += 'Names can only be 70 characters long, please enter a shorter name. '; }

        console.log(error.red);
      }
    } while (name === undefined);

    return name.name;
  }

};

const DB = {
  connect: async function (sql, args) {
    const connectObj = { host: 'localhost', port: 3306, user: 'root', password: 'wp8177', database: 'bamazon_DB' };
    const connection = MYSQL.createConnection(connectObj);

    const query = await this.query(connection, sql, args);
    return query;
  },
  selectAll: async function () {
    const sql = 'SELECT * FROM products';
    const res = await this.connect(sql, []);
    return res;
  },
  selectAllDepts: async function () {
    const sql = 'SELECT * FROM departments';
    const res = await this.connect(sql, []);
    return res;
  },
  getByID: async function (id) {
    const objSql = 'SELECT * FROM products WHERE ?';
    const objGet = await this.connect(objSql, [{ id: id }]);
    return objGet[0];
  },
  setItems: async function (args) {
    const sqlUpdate = 'UPDATE products SET ? WHERE ?';
    this.connect(sqlUpdate, args);
  },
  query: function (connection, sql, args) {
    return new Promise((resolve, reject) => {
      connection.query(sql, args, function (err, res) {
        if (err) throw err;
        resolve(UTIL.parse(res));
        connection.end();
      });
    }).then(res => { return res; });
  }
};

const UTIL = {
  parse: (res) => JSON.parse(JSON.stringify(res)),
  displayTable: function (arr, res) {
    const productTable = this.tableFromJSON(arr, res);
    console.log('\n' + productTable);
  },
  validateID: function (res) {
    return function (val) {
      const arr = res.map(x => x.id);
      return arr.indexOf(val) > -1;
    };
  },
  filterByID: function (res, val) {
    const arr = res.filter(x => x.id === val);
    return arr[0];
  },
  tableFromJSON: function (headerArr, json) {
    const header = headerArr.map(x => x.cyan);
    const arr = json.map(x => {
      let data = [];
      for (const prop in x) {
        if (x.hasOwnProperty(prop)) {
          data = data.concat(x[prop]);
        }
      }
      return data;
    });

    const final = [header].concat(arr);
    return table(final, this.tableConfig);
  },
  productsHeader: ['ID', 'Product Name', 'Dept', 'Price', 'Stock', 'Total Sales'],
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
};

module.exports = {
  util: UTIL,
  questions: QUESTIONS,
  database: DB
};
