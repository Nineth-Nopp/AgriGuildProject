const express = require("express");
const path = require("path");
const mysql = require("mysql");
const config = require('./dbConfig.js');
const bcrypt = require("bcrypt");
 
const app = express();
const con = mysql.createConnection(config);
 
app.use(express.static(path.join(__dirname, "public")));
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
