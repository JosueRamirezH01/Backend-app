const UserMedicoController = require('../controller/medicoController');
module.exports = (app, upload) => {
    app.get('/api/users/getAllUni',UserMedicoController.getAllUni);
    app.get('/api/users/getAllEsp',UserMedicoController.getAllEsp);
    
   
    app.post('/api/users/lookEmail', UserMedicoController.validarEmail);
    app.post('/api/users/lookCelular', UserMedicoController.validarCelular);
    app.post('/api/users/lookColegiatura', UserMedicoController.validarColegiatura);
    app.post('/api/users/getMedico', UserMedicoController.getMedico);
    app.post('/api/users/createmedico',upload.fields([{name: 'image'},{ name: 'file'}, {name:'file2'}]), UserMedicoController.createmedico);
}