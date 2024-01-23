const GeoController = require('../controller/geoController');

module.exports = (app) =>{
    app.post('/api/geo/crear', GeoController.crear);
    app.post('/api/geo/delete', GeoController.delete);
    app.put('/api/geo/updategeo', GeoController.update);
    app.put('/api/geo/updatestatus', GeoController.updateStatus);
    app.get('/api/geo/getCoordenadas/:id_user', GeoController.getCoordenadas);
}