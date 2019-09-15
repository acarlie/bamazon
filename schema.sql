drop database if exists bamazon_DB;

create database bamazon_DB;

use bamazon_DB;

create table products(
    id int auto_increment not null,
    name varchar(70),
    department varchar(70),
    price decimal(10, 2),
    stock int,
    product_sales decimal(10, 2) default 0,
    primary key(id)
)


INSERT INTO products (name, department, price, stock)
VALUES ("Boba Tea Mix", "Grocery", 5.50, 20);

INSERT INTO products (name, department, price, stock)
VALUES ("Metal Straws", "Home", 1.25, 50);

INSERT INTO products (name, department, price, stock)
VALUES ("Tapioca Pearls", "Grocery", 3.33, 150);

INSERT INTO products (name, department, price, stock)
VALUES ("Stand Mixer", "Home", 150.99, 15);

INSERT INTO products (name, department, price, stock)
VALUES ("Beach Mats", "Outdoor", 15.55, 34);

INSERT INTO products (name, department, price, stock)
VALUES ("Flip Flops", "Clothing", 10.99, 200);

INSERT INTO products (name, department, price, stock)
VALUES ("Fishing Pole", "Ourdoor", 99.99, 15);

INSERT INTO products (name, department, price, stock)
VALUES ("Thai Tea", "Grocery", 4.50, 75);

INSERT INTO products (name, department, price, stock)
VALUES ("Strawberry Pocky", "Grocery", 2.50, 27);

INSERT INTO products (name, department, price, stock)
VALUES ("Throw Blanket", "Home", 10.50, 22);