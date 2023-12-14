//1.-Modulo de express
const express = require('express');
//declaramos la variable app
const app = express();

//2.-Para capturar datos de los formularios
app.use(express.urlencoded({extended:false}));
//especificamos que vamos a usar json
app.use(express.json());

//3.-Invocamos a dotenv
const dotenv = require('dotenv');
//Aquí le decimos que lea el archivo .env
dotenv.config({path:'./env/.env'});

//4.-Directorio de public
app.use('/resources', express.static('public'));
//_dirname es una variable global que nos da la ruta de donde se encuentra el archivo
app.use('/resources', express.static(__dirname + '/public'));

//5.-Establecemos el motor de plantillas

//6.-Invocamos a brcryptjs
const brcryptjs = require('bcryptjs');

//7.-Var. de las session
const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//8.Importamos el módulo de morgan
const morgan = require('morgan');
// Sirve para mostrar el tipo de consulta estado y tiempo de respuesta
app.use(morgan('dev'))

//9.Importamos el módulo de conexión de la BD
const connection = require('./database/db');


app.get('/', (req,res) => {
    res.send('Hola mundo');
})

app.listen(3000, (req,res) => {
    console.log('El Servidor se ha iniciado en http://localhost:3000');
});

//nodemon app.js



