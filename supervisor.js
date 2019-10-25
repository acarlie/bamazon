require('colors');

const UTILITIES = require('./utilities');
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const SUPER = {
  selectAction: async function () {
    const choices = [
      { name: 'View Products Sales by Department', value: '0' },
      { name: 'Create Department', value: '1' }
    ];
    const action = await QUESTIONS.askList(choices);

    switch (action) {
      case '0':
        this.viewProductSales();
        break;
      case '1':
        this.createDepartment();
        break;
    }
  },
  viewProductSales: async function () {
    let sql = 'SELECT d.dept_id, d.dept_name, d.dept_overhead, SUM(p.product_sales) as sales';
    sql += ' FROM departments as d';
    sql += ' LEFT JOIN products as p';
    sql += ' ON d.dept_name = p.department';
    sql += ' GROUP BY d.dept_name';
    sql += ' ORDER BY d.dept_id';

    const res = await DB.connect(sql, []);
    const withNet = res.map(obj => ({ ...obj, net: obj.sales - obj.dept_overhead }));
    UTIL.displayTable(['ID', 'NAME', 'OVERHEAD', 'SALES', 'PROFIT'], withNet);
  },
  createDepartment: async function () {
    const depts = await DB.selectAllDepts();
    const name = await QUESTIONS.askName(depts, "What is the department's name?", /([^a-z\s&])/gi, 'Please only use letters, spaces, and ampersands.', 'dept_name');
    const overhead = await QUESTIONS.askPrice('What is the departments overhead?');

    // confirm
    const confirmMessage = `Please confirm department: the '${name}' department will be created with an overhead of ${overhead}`;
    const confirm = await QUESTIONS.askConfirm(confirmMessage);

    // if confirm update products table
    if (confirm) {
      const sql = 'INSERT INTO departments (dept_name, dept_overhead) VALUES (?, ?);';
      const args = [name, overhead];
      DB.connect(sql, args);
      console.log(`\n Department Created! '${name}' was added with an overhead of ${overhead} \n`.bgGreen.black);
    } else {
      console.log(`Department creation cancelled`.red);
    }
  }
};

SUPER.selectAction();
