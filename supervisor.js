const COLORS = require("colors");
const UTIL = require("./utilities");
const DB = UTIL.database;
const QUESTIONS = UTIL.questions;
const UTILITIES = UTIL.util;

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
        console.log('View product sales by department');
    },
    createDepartment: async function(){
        console.log('Create Department');

    }
}

SUPER.selectAction();
// 1. Create a new MySQL table called `departments`. Your table should include the following columns:

//    * department_id

//    * department_name

//    * over_head_costs (A dummy number you set for each department)

// 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

//    * Make sure your app still updates the inventory listed in the `products` column.

// 3. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

//    * View Product Sales by Department
   
//    * Create New Department

// 4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

//    * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)