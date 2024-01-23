const EmergenciaController = require('../controller/emergenciaController');
//const passport = require('passport');

module.exports = (app) => {
    app.post('/api/emergencia/crearEmergencia', EmergenciaController.crearEmergencia);
    app.post('/api/emergencia/crearCalificacion',EmergenciaController.crearCalificacion);

    app.put('/api/emergencia/updateActivo', EmergenciaController.updateActivo);
    app.put('/api/emergencia/updateCulminado', EmergenciaController.updateCulminado);
    app.put('/api/emergencia/updateCancelado', EmergenciaController.updateCancelada);
    app.put('/api/emergencia/updateNoAceptado', EmergenciaController.updateNoAceptado);


    app.get('/api/emergencia/getEmergencia/:id_medico/:status', EmergenciaController.getEmergencia);
    app.get('/api/emergencia/getPromedioCalificacion/:id_user', EmergenciaController.getPromedioCalificacion);
    app.get('/api/emergencia/getHoraCreadaEmergencia/:id_emergencia', EmergenciaController.getFechaCreadaEmergencia);

}