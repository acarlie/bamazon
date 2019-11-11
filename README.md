# About Bamazon

'Bamazon' is a CLI inventory management app created with Node.js, MySQL, and the npm package 'Inquirer'. 'Bamazon' features customer, manager, and supervisor views. The customer view allows 'customers' to view available products and 'order' them. The manager view allows 'managers' to view products for sale, view low inventory, add inventory, and create products. The supervisor view allows 'supervisors' to view product sales by department and create departments.

- [About Bamazon](#about-bamazon)
- [Installation](#installation)
- Views
    - [Customer View](#customer-view)
    - [Manager View](#manager-view)
    - [Supervisor View](#supervisor-view)
  
---
### Installation
* First, clone this repository to your computer using git.*
* Then, navigate to the folder in terminal/git bash.**

*If Git is not installed, see this link on how to install: https://help.github.com/en/github/getting-started-with-github/set-up-git
**If Node.js is not installed, see this link on how to install: https://nodejs.org/en/download/

---
### Customer View
The customer view allows 'customers' to view available products and 'order' them. Simply enter the command 'node customer' into the console and follow the prompts to place a product order.

![Screen capture gif of customer options.](/gifs/customer.gif)

*Command Format*
```
node customer
```
---
### Manager View
The manager view allows 'managers' to view products for sale, view low inventory, add inventory, and create products. Enter the command 'node manager' and choose which action you would like to take.
![Screen capture gif of manager options.](/gifs/manager.gif)

*Command Format*
```
node manager
```

*Options*
* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product

---
### Supervisor View
 The supervisor view allows 'supervisors' to view product sales by department and create departments. To enter the 'supervisor' view use the command 'node supervisor' and select which action you would like to take.
![Screen capture gif of manager options.](/gifs/supervisor.gif)

*Command Format*
```
node supervisor
```

*Options*
* View Product Sales by Department
* Create Department

