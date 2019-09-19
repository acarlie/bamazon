const COLORS = require("colors");
const UTILITIES = require("./utilities");
const DB = UTILITIES.database;
const QUESTIONS = UTILITIES.questions;
const UTIL = UTILITIES.util;

const SUPER = {
    selectAction: async function(){
        let choices = [
            { name: "View Products Sales by Department", value: "0" },
            { name: "Create Department", value: "1" },
        ];
        let action = await QUESTIONS.askList(choices);

        switch(action){
            case "0":
                this.viewProductSales();
                break;
            case "1":
                this.createDepartment();
                break;
        }
    },
    viewProductSales: async function(){
        let sql = "SELECT d.dept_id, d.dept_name, d.dept_overhead, SUM(p.product_sales) as sales";
            sql += " FROM departments as d";
            sql += " LEFT JOIN products as p";
            sql += " ON d.dept_name = p.department";
            sql += " GROUP BY d.dept_name";
            sql += " ORDER BY d.dept_id";

        let res = await DB.connect(sql, []);
        let withNet = res.map(obj => ({...obj, net: obj.sales - obj.dept_overhead}));
        console.log(UTIL.tableFromJSON(["ID", "NAME", "OVERHEAD", "SALES", "PROFIT"], withNet));
    },
    createDepartment: async function(){
        let depts = await DB.selectAllDepts();
        let name = await QUESTIONS.askName(depts, "What is the department's name?", /([^a-z\s&])/gi, 'Please only use letters, spaces, and ampersands.', "dept_name");
        let overhead = await QUESTIONS.askPrice("What is the departments overhead?");

        // confirm
        let confirmMessage = `Please confirm department: the '${name}' department will be created with an overhead of ${overhead}`;
        let confirm = await QUESTIONS.askConfirm(confirmMessage);

        //if confirm update products table
        if (confirm){
            let sql = 'INSERT INTO departments (dept_name, dept_overhead)';
                sql += ' VALUES (?, ?);';
            let args = [name, overhead];
            let update = await DB.connect(sql, args);
            console.log(`\n Department Created! '${name}' was added with an overhead of ${overhead} \n` .bgGreen.black);
        } else {
            console.log(`Department creation cancelled` .red);
        }

    }
}

SUPER.selectAction();
