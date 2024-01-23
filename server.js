const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const users = require('./routes/usersRoutes');
const geo = require('./routes/geoRoutes');
const emergencia = require('./routes/emergenciaRouter');
const usersMedico = require('./routes/users_medicoRoutes');
const io = require('socket.io')(server);
const passport = require('passport');
const session = require('express-session');
const actualizacionListadoSocket = require('./sockets/actualizacion_listado_socket');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const upload = multer({
    storage: multer.memoryStorage()
})



const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(session({
    secret: 'keyboard cat', // Reemplaza esto con una cadena secreta segura
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
require('./config/passport')(passport);
app.disable('x-powered-by');
app.set('port',port);


actualizacionListadoSocket(io);

users(app,upload);
usersMedico(app, upload);
geo(app);
emergencia(app);
//
server.listen(port,() =>
    console.log('Aplicacion de NodeJS ' + port + 'Iniciada..')
);

app.get('/',(req,res) => {
    res.send('Ruta Principal del backend medico');
});
app.use((err,req,res,next)=> {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}