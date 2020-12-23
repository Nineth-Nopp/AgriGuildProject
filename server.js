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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/index.html'));
});

app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/Login.html'));
});

app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/Register.html'));
});

app.get('/featrue', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/user_featrue.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/EditAccount.html'));
});

app.get('/adminpage_manage', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/adminpageManage.html'));
});

app.get('/admin_manage_user', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/adminManageUser.html'));
});

app.get('/admin_manage_plant', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/adminManagePlant.html'));
});

app.get('/admin_manage_livestock', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/adminManageLivestock.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/user.html'));
});

app.get('/guilding', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/Guilding.html'));
});

app.get('/user_featrue', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/user_featrue.html'));
});

app.get('/Land_Analyse', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/LandAnalyse.html'));
});

app.get('/Schedule_confirm', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/Scheduleconfirm.html'));
});

app.get('/MoreInformation', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/MoreInformation.html'));
});

app.get('/ScheduleList', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/ScheduleList.html'));
});

app.get('/Guilding', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/Guilding.html'));
});






app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;


    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server error");
            return;
        }
        const sql = "INSERT INTO user(username, password,name,lastname,email,phone,role) VALUES(?,?,?,?,?,?,2)";
        con.query(sql, [username, hash], function (err, result) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Database server error");
                return;
            }
            const numrows = result.affectedRows;
            if (numrows != 1) {
                console.error("Insert to DB failed");
                res.status(500).send("Database server error");
            }
            else {
                res.send("Sign up Complete!");
            }
        });
    });
});

app.post("/login", function (req, res) {
    const { username, password } = req.body;
    const sql = `SELECT username, role FROM user WHERE username ='${username}'`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        }
        else {
            if (result.length != 1) {
                bcrypt.compare(password, result[0].password, function (err, total) {
                    if (err) {
                        res.status(500).send("Database server error");
                    } else {
                        if (total == false) {
                            res.status(400).send("Wrong password");
                        } else {
                            if (result[0].role == 1) {
                                res.send("admin")
                            } else if (result[0].role == 2) {
                                res.send("user")
                            } else {
                                res.status(500).send("server data failed")
                            }
                        }
                    }
                })
            }
            else {
                res.status(500).send("Server error")
            }
        }

    });
});

app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const sql = `SELECT user_id, password, role from user WHERE username = ?`;
    con.query(sql, [username], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");
        } else {
            if (result.length != 1) {
                res.status(400).send("Wrong username");
            } else {
                if (result[0].password != password) {
                    res.status(400).send("Username or Password error");
                } else {
                    if (result[0].role == 1) {
                        res.json({ url: "/adminpage_manage", user_id: result[0].user_id });
                    } else {
                        res.json({ url: "/user", user_id: result[0].user_id });
                    }
                }
            }
        }
    });
});

app.get("/api/get_all_users", (req, res) => {

    const sql = `SELECT user_id, name, lastname, username, email, phone FROM user`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");

        } else {
            res.json(result);
        }
    });
});

app.get("/api/get_all_livestocks", (req, res) => {

    const sql = `SELECT livestock_id, livestock_name, gender, purchasePrice, sellingPrice, livestock_time, livestock_area FROM livestock`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");

        } else {
            res.json(result);
        }
    });
});

app.get("/api/get_all_plants", (req, res) => {

    const sql = `SELECT plant_id, plant_name, purchasePrice, sellingPrice, plant_time, plant_area FROM plant`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");

        } else {
            res.json(result);
        }
    });
});

app.get("/api/get_crop_by/:budget/:acre", (req, res) => {
    let budget = req.params.budget;
    let acre = req.params.acre;

    budget = parseInt(budget);
    console.log(budget, acre);

    const sql2 = `SELECT * FROM plant WHERE purchasePrice < ${mysql.escape(budget)}`;

    con.query(sql2, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");
        } else {
            console.log(result);
            res.json(result);
            
        }
    });
});

app.get("/api/get_livestock_by/:budget/:acre", (req, res) => {
    let budget = req.params.budget;
    let acre = req.params.acre;

    budget = parseInt(budget);
    console.log(budget, acre);

    const sql2 = `SELECT * FROM livestock WHERE purchasePrice < ${mysql.escape(budget)}`;

    con.query(sql2, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("DB Server Error");
        } else {
            console.log(result);
            res.json(result);
            
        }
    });
});




//-------------user account function ---------------


app.put("/user/update", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;
    const id = req.body.id;

    const sql = "UPDATE user SET username = ?, password = ?,name = ?,lastname = ?,email = ?,phone = ?,a WHERE id = ?";

    database.query(sql, [username, password, name, lastname, email, phone, id], function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).send("Database server error.");
        } else {
            if (result.affectedRows == 1) {
                res.send("User has been updated.");
            } else {
                res.status(501).send("Error while updating user.");
            }
        }
    });
});

app.delete("/user/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM user WHERE id=?";
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        }
        else {
            if (result.affectedRows == 1) {
                res.send("Delete done");
            }
            else {
                res.status(500).send("Delete error");
            }
        }
    });
});

//========livestock function==========

app.put("/livestock/update", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const buy = req.body.buy;
    const sell = req.body.sell;
    const fase1 = req.body.fase1;
    const fase2 = req.body.fase2;
    const fase3 = req.body.fase3;
    const sql = "UPDATE livestock SET name = ?, buy = ?,sell = ?,fase1 = ?,fase1 = ?,fase1 = ?  WHERE id = ?";

    database.query(sql, [name, buy, sell, fase1, fase2, fase3, id], function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).send("Database server error.");
        } else {
            if (result.affectedRows == 1) {
                res.send("Livestock has been updated.");
            } else {
                res.status(501).send("Error while updating livestock.");
            }
        }
    });
});

app.delete("/livestock/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM livestock WHERE id=?";
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        }
        else {
            if (result.affectedRows == 1) {
                res.send("Delete done");
            }
            else {
                res.status(500).send("Delete error");
            }
        }
    });
});

app.post("/livestock/add", function (req, res) {
    const name = req.body.name
    const buy = req.body.buy
    const sell = req.body.sell
    const fase1 = req.body.fase1
    const fase2 = req.body.fase2
    const fase3 = req.body.fase3

    const sql = "INSERT INTO livestocks(name buy sell fase1 fase2 fase3) VALUE(?,?,?,?,?,?)";
    con.query(sql[name, buy, sell, fase1, fase2, fase3], function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Database server error");
            return
        }
        const numrows = result.affectedRows;
        if (numrows != 1) {
            console.error("Insert to DB failed");
            res.status(500).send("Database server error");
        }
        else {
            res.send("Insert Complete!")
        }


    });
});

//------------plant function-------------

app.put("/plant/update", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const buy = req.body.buy;
    const sell = req.body.sell;
    const product = req.body.product;
    const fase1 = req.body.fase1;
    const fase2 = req.body.fase2;
    const fase3 = req.body.fase3;
    const sql = "UPDATE plant SET name = ?, buy = ?,sell = ?,product = ?,fase1 = ?,fase1 = ?,fase1 = ?  WHERE id = ?";

    database.query(sql, [name, buy, sell, product, fase1, fase2, fase3, id], function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).send("Database server error.");
        } else {
            if (result.affectedRows == 1) {
                res.send("Livestock has been updated.");
            } else {
                res.status(501).send("Error while updating livestock.");
            }
        }
    });
});

app.delete("/plant/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM plant WHERE id=?";
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        }
        else {
            if (result.affectedRows == 1) {
                res.send("Delete done");
            }
            else {
                res.status(500).send("Delete error");
            }
        }
    });
});

app.post("/plant/add", function (req, res) {
    const name = req.body.name
    const buy = req.body.buy
    const sell = req.body.sell
    const product = req.body.product;
    const fase1 = req.body.fase1
    const fase2 = req.body.fase2
    const fase3 = req.body.fase3

    const sql = "INSERT INTO plant(name buy sell product fase1 fase2 fase3) VALUE(?,?,?,?,?,?)";
    con.query(sql[name, buy, sell, product, fase1, fase2, fase3], function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Database server error");
            return
        }
        const numrows = result.affectedRows;
        if (numrows != 1) {
            console.error("Insert to DB failed");
            res.status(500).send("Database server error");
        }
        else {
            res.send("Insert Complete!")
        }


    });
});



//------------------- json call for datatable ---------------------

app.get("/users", function (req, res) {
    const sql = "SELECT id, username, role FROM user";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }

        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});

app.get("/plants", function (req, res) {
    const sql = "SELECT id, username, role FROM plant";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }

        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});

app.get("/livestocks", function (req, res) {
    const sql = "SELECT id, username, role FROM livestock";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }

        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});



//--root service--

app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "view/index.html"))

});
app.get("/admin", function (req, res) {

    res.sendFile(path.join(__dirname, "view/admin.html"))

});


app.listen(3000, (req, res) => {
    console.log("Running on port", 3000);
});

