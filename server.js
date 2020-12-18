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


app.post("/signUp", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
 
    const saltRounds = 10;
 
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err) {
            console.error(err.message);
            res.status(500).send("Server error");
            return;
        }
        const sql = "INSERT INTO user(username, password, role) VALUES(?,?,2)";
        con.query(sql, [username, hash], function (err, result, fields) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Database server error");
                return;
            }           
            const numrows = result.affectedRows;
            if(numrows != 1) {
                console.error("Insert to DB failed");                
                res.status(500).send("Database server error");
            }
            else {
                res.send("Sign up Complete!");
            }
        });
    });
});
