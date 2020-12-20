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

app.post("/login",function(req,res){
    const {username,password} = req.body;
    const sql = `SELECT username, role FROM user WHERE username ='${username}'`;
    con.query(sql, function(err,result){
        if(err){
            console.log(err);
        res.status(500).send("Database server error");
        }
        else{
            if(result.length != 1 ){
                bcrypt.compare(password,result.password,function(err,total){
                     if(total == false){
                        res.status(400).send("Wrong password");
                     }else{
                        if(result[0].role == 1){
                            res.send("admin")
                        }else if (result[0].role == 2){
                            res.send("user")
                        }else{
                            res.status(500).send("server data failed")
                        }
                     }
                })
            }
            else{
                res.status(500).send("Server error")
            }
        }
        
    });
});



//--root service--

app.get("/", function(req, res) {

    res.sendFile(path.join(__dirname,"view/index.html"))
    
})
app.get("/admin", function(req, res) {

    res.sendFile(path.join(__dirname,"view/admin.html"))
    
})
app.get("/user", function(req, res) {

    res.sendFile(path.join(__dirname,"view/user.html"))
    
})



