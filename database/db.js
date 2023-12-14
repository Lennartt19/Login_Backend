const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((error) =>{
    if(error){
        console.log('El error de conexión es: '+error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
})

//Exportamos el modulo para poder usarlo en cualquier otro archivo del proyecto
module.exports = connection;