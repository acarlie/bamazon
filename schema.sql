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
VALUES ("Fizzing Whizzbees", "Grocery", 5.50, 20);

INSERT INTO products (name, department, price, stock)
VALUES ("Cauldron", "Home", 50, 50);

INSERT INTO products (name, department, price, stock)
VALUES ("Chocolate Frogs", "Grocery", 3.33, 150);

INSERT INTO products (name, department, price, stock)
VALUES ("Cockroach Clusters", "Grocery", 1.50, 15);

INSERT INTO products (name, department, price, stock)
VALUES ("Firebolt", "Sports & Outdoors", 150.99, 34);

INSERT INTO products (name, department, price, stock)
VALUES ("Dress Robes", "Clothing", 59.99, 200);

INSERT INTO products (name, department, price, stock)
VALUES ("Witch's Hat", "Clothing", 99.99, 15);

INSERT INTO products (name, department, price, stock)
VALUES ("Butterbeer", "Grocery", 4.50, 75);

INSERT INTO products (name, department, price, stock)
VALUES ("Invisibility Cloak", "Clothing", 250, 27);

INSERT INTO products (name, department, price, stock)
VALUES ("Standard Book of Spells: Grade 1", "Books", 10.50, 22);

INSERT INTO products (name, department, price, stock)
VALUES ("The Monster Book of Monsters", "Books", 22.50, 40);

create table departments(
    dept_id int auto_increment not null,
    dept_name varchar(70),
    dept_overhead decimal(10, 2) default 0;
    primary key(dept_id)
)

INSERT INTO departments (dept_name, dept_overhead)
VALUES ("Clothing", 5000);

INSERT INTO departments (dept_name, dept_overhead)
VALUES ("Books", 2000);

INSERT INTO departments (dept_name, dept_overhead)
VALUES ("Sports & Outdoors", 1000);

INSERT INTO departments (dept_name, dept_overhead)
VALUES ("Grocery", 1500);

INSERT INTO departments (dept_name, dept_overhead)
VALUES ("Home", 900);
