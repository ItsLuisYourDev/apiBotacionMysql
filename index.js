const express = require('express'),
    socket = require('socket.io'),
    mysql = require('mysql'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    request = require("request");

//App setup
var app = express();
var server = app.listen(3015, function () {
    console.log("listening to port http://127.0.0.1:3015.");
});
app.use(express.urlencoded({extended:false}))
app.use("/api/persona",require("./routers/rutasApi"))


app.get("/p",(req,res)=>{
    request("http://127.0.0.1:3015/api/persona",(err,response,body)=>{
        if (!err){
            const users = JSON.parse(body);
            console.log(users)
            res.json(users)

        }
    })
})



var io = socket(server);

var sessionMiddleware = session({
    secret: "keyboard cat"
});

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
app.use(cookieParser());

const config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "base": "userlogin"
};

var db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.base
});

db.connect(function (error) {
    if (!!error)
        throw error;

    console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
});

app.use(express.static('./public'));
const lUsers = [];

io.on('connection', function (socket) {

    //!global
    var req = socket.request;

    console.log(req.rawHeaders[19])


    console.log(req.session.userID + "=========")
    if (req.session.userID != null) {
        console.log("recargago n veses")
        db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function (err, rows, fields) {
            console.log(rows)
            socket.emit("logged_in", rows[0].Username, rows[0].boto, rows[0].boto);
        });
    }


    socket.on("login_register", function (data) {
        const user = data.user,
            pass = data.pass;
        console.log(user)
        db.query("SELECT * FROM users WHERE Username=?", [user], function (err, rows, fields) {
            if (rows.length == 0) {
                console.log("nothing here");
                socket.emit("usuario_no_existe");
                db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass], function (err, result) {
                    if (!!err)
                        throw err;

                    console.log(result);
                    socket.emit("logged_in", { user: user });
                });
            } else {
                console.log("here");
                const dataUser = rows[0].Username,
                    dataPass = rows[0].Password, dataBoto = rows[0].boto;
                if (dataPass == null || dataUser == null) {
                    socket.emit("error");
                }
                if (user == dataUser && pass == dataPass) {
                    socket.emit("logged_in", user, 1, dataBoto);
                    //socket.emit("logged_in", { user: user });
                    req.session.userID = rows[0].id;
                    req.session.save();
                } else {
                    socket.emit("invalid");
                }
            }
        });
    });

    socket.on("salir", () => {
        console.log("entroooooooooooooooooooooooooooo............")
        req.session.userID = null;
        req.session.save();
        console.log(req.session.userID)

    })



    socket.on("register", function (data) {
        console.log("estoy dentro")

        const user = data.user, pass = data.pass;

        db.query("SELECT * FROM users WHERE Username=?", [user], function (err, rows, fields) {
            if (rows.length == 0) {
                console.log("nothing here");
                db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass], function (err, result) {
                    if (!!err)
                        throw err;
                    console.log(result);

                    socket.emit("usuario_creado");
                });
            } else {
                console.log("el usuario esta duplicado");
                socket.emit("usuario_existe")
            }
        });

    });








    socket.on("botacion", function (boto) {
        db.query("SELECT boto FROM users WHERE id=?", [req.session.userID], function (err, result) {
            if (!!err)
                throw err;

            //console.log(result);
            //  socket.emit("logged_in", user, cont,boto);
            if (result[0].boto == 0) {
                // console.log(boto)
                db.query("UPDATE users SET boto =? where id =?", [boto.boto, req.session.userID], function (err, result) {
                    if (!!err)
                        throw err;

                    console.log(result);
                    //  socket.emit("logged_in", user, cont,boto);
                });

                db.query("SELECT boto FROM users", function (err, rows) {
                    const countBotos = []
                    for (let i = 0; i < rows.length; i++) {
                        const element = rows[i].boto;
                        countBotos.push(element)

                    }
                    console.log("entro a emitir ")
                    io.emit("datosGrafica", countBotos);
                })

            } else {
                console.log("ya botaste mmvg")
            }
        });

    });


    //! prueba

    socket.on("login_admin", function (data) {
        console.log(req.session.userID + "lllllllllllllllllllll")

        const user = data.user,
            pass = data.pass;
        db.query("SELECT * FROM admin WHERE Username=?", [user], function (err, rows, fields) {
            if (rows.length == 1) {
                console.log("entro admin");
                const dataUser = rows[0].Username,
                    dataPass = rows[0].Password;
                console.log("here");

                if (dataPass == null || dataUser == null) {
                    socket.emit("error");
                }
                if (user == dataUser && pass == dataPass) {
                    let cont = 1
                    cont = cont + 1

                    socket.emit("login_in_admin", user, cont, lUsers);
                    console.log(user)

                    db.query("SELECT boto FROM users", function (err, rows) {
                        const countBotos = []
                        for (let i = 0; i < rows.length; i++) {
                            const element = rows[i].boto;
                            countBotos.push(element)

                        }
                        console.log("entro a emitir--------------------- ")
                        io.emit("datosGrafica", countBotos);
                    })
                } else {
                    socket.emit("invalid");
                }
            }

        });

    });








});



