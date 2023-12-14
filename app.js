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
app.set('view engine', 'ejs');

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

//10.Estableciendo las rutas
app.get('/', (req,res) => {
    //res.render('index', {msg:'Esto es un mensaje desde Node'});
    res.render('login');
})

app.get('/register', (req,res) => {
    res.render('register');
});

//Registrar el usuario en la base de datos
//Hacemos uso de brcryptjs así que haremos uso de async
app.post('/register', async (req,res) =>{
    //Capturamos los valores del formulario
    const email = req.body.email;
    const contrasena = req.body.password;
    const nombre = req.body.name;
    const apellido = req.body.lastname;

    //Encriptar la contraseña
    let passwordHaash = await brcryptjs.hash(contrasena, 8);
    //Establemos la conexión y hacemos la consulta
    //Tener en cuenta que (email <- base de datos y email <- segundo la constante)
    connection.query('INSERT INTO users SET ?',{email:email, contrasena:passwordHaash, nombre:nombre, apellido:apellido}, async (error, results) =>{
        if(error){
            console.log(error)
        } else{
            //res.send('usuario registrado')
            //Vamos a retornar la misma página pero con suite alert 2
            res.render('register', {
                alert: true, //Confirmamos que todo este ok
                alertTitle: "Registration", //Titulo de la alerta
                alertMessage: "Successful Registration", //Mensaje a mostrar
                alertIcon: 'success', //Icono
                showConfirmButton: false, //Botón de confirmar
                timer: 1500,
                ruta: ''
            });
        };
    });
}); 

//11.-Autenticación del usuario
app.post('/auth', async (req,res) =>{
    //capturamos el usuario registrado y la contraseña
    const email = req.body.email;
    const contrasena = req.body.password;

    //sabemos que la contraseña está encripatada
    let passwordHaash = await brcryptjs.hash(contrasena, 8);
    //Verificamos que de que sí exista el usuario y la contraseña

    if(email && contrasena){
        //Hacemos la consulta a la base de datos
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            //Cuando devuelve los resultados y es igual a cero, es decir, que no se encontro nada
            //Luego comparamos de que la contraseña sea igual a la contraseña encriptada
            if(results.length == 0 || !(await brcryptjs.compare(contrasena, results[0].contrasena))){
                //res.send('Usuario o la contraseña son incorrectas');
                //Vamos a usar sweetalert2
                res.render('login',{
                    alert: true, //Confirmamos que todo este ok
                    alertTitle: "Error", //Titulo de la alerta
                    alertMessage: "Usuario y/o contraseña incorrectas", //Mensaje a mostrar
                    alertIcon: "error", //Icono
                    showConfirmButton: true, //Botón de confirmar
                    timer: 10000, //Tiempo para que se muestre la alerta
                    ruta: '' //Redireccionamos a la página de login
                })
            } else {
                //res.send('Bienvenido');
                //res.session.name = results[0].nombre;
                res.render('login',{
                    alert: true, //Confirmamos que todo este ok
                    alertTitle: "Conexion Exitosa", //Titulo de la alerta
                    alertMessage: "!Login Correcto!", //Mensaje a mostrar
                    alertIcon: "success", //Icono
                    showConfirmButton: false, //Botón de confirmar
                    timer: 1500, //Tiempo para que se muestre la alerta
                    ruta: 'index' //Redireccionamos a la página principal
                });
            }
        });
    } else {
        res.send('Por favor ingrese un usuario y/o contraseña');
    }
});

app.get('/index', (req,res) => {
    res.render('index');
})

app.listen(3000, (req,res) => {
    console.log('El Servidor se ha iniciado en http://localhost:3000');
});

//nodemon app.js



