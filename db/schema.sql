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

create table departments(
    dept_id int auto_increment not null,
    dept_name varchar(70),
    dept_overhead decimal(10, 2) default 0;
    primary key(dept_id)
)

