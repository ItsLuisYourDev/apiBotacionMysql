const persona = {}

const mysql = require('mysql')

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


persona.consultar_todo = async (req, res) => {
    db.query("SELECT * FROM users", function (err, rows, fields) {
        console.log(rows)
        //socket.emit("logged_in", rows[0].Username, rows[0].boto, rows[0].boto);
        res.json(rows)
    });
}

// persona.guardar_nuevo = async (req, res) => {
//     const nuevoregistro = new modelopersona({
//         nombre: req.body.nombre,
//         apellidos: req.body.apellidos,
//         email: req.body.email,
//         telefono: req.body.telefono
//     });
//     await nuevoregistro.save();
//     res.json({ status: "Equipo creado satisfactoriamente" })
// }

// persona.actualiza_datos = async (req, res) => {
//     const miide = req.body.id
//     await modelopersona.findByIdAndUpdate(miide, req.body);
//     res.json({ status: "Datos actualizados satisfactoriamente" })
// }

// persona.consultar1 = async (req, res) => {
//     const miide = req.params.id
//     resultado = await modelopersona.findById(miide)
//     res.json(resultado)

// }

// persona.elimina1 = async (req, res) => {
//     const miide = req.params.id
//     await modelopersona.findByIdAndDelete(miide)
//     res.json({ status: "Registro eliminado" })
// }
module.exports = persona;