const UserController = require('../controller/userController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.get('/api/users/getAll',UserController.getAll);
    app.get('/api/users/getById/:id_usuario',passport.authenticate('jwt', {session: false}),UserController.getById);

    app.post('/api/users/create',upload.array('image', 1), UserController.register);
    app.post('/api/users/login', UserController.login);
    app.post('/api/users/logout', UserController.logout);
    app.post('/api/users/forgot-password', UserController.forgotPassword);
    // Ruta para restablecer la contraseña
    app.post('/api/users/valida-token', UserController.validToken);
    app.post('/api/users/reset-password', UserController.resetPassword);
    app.post('/api/users/createsermedico',upload.fields([{ name: 'file'}, {name:'file2'}]), UserController.createserMedico);

    app.put('/api/users/update',passport.authenticate('jwt', {session: false}), upload.array('image', 1), UserController.update);
    app.put('/api/users/updateNotificacionToken', UserController.updateNotificacionToken);

    app.post('/api/users/forgot-registro', UserController.forgotPasswordRegistro);
    app.post('/api/users/validarTokenRegistro', UserController.validarTokenRegistro);

}