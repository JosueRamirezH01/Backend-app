const Geo = require('../model/geo');

module.exports = {

    async crear(req, res){
        try {
            const geo = req.body;
            await Geo.crear(geo);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
            })
        } catch (error) {
            console.error('Error al actualizar coordenadas:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro de coordenadas',
                error:error
            });
        }
    },

    async delete(req, res){
        try {
            const geo = req.body;
            await Geo.delete(geo.id_user);
            return res.status(201).json({
                success: true,
                message: 'Se elimino las coordenadas',
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un problema para eliminar las coordenadas',
                error:error
            });
        }
    },
    async update(req, res){
        try {
            const geo  = req.body;
            await Geo.update(geo);
            return res.status(201).json({
                success: true,
                message: 'Se actualizo las coordenadas',
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo problemas en la actualizacion de coordenadas',
                error: error.message
            });
        }
    },
    async updateStatus(req, res) {
        try {
            const geo = req.body;
    
            // Verifica que 'cons' sea un valor booleano
            if (typeof geo.cons !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'El valor de "cons" debe ser un booleano (true o false).'
                });
            }
    
            // Establece 'status' en función del valor de 'cons'
            geo.status = geo.cons ? 'HABILITADO' : 'DESHABILITADO';
    
            // Luego, realiza la actualización de estado
            await Geo.updateStatus(geo.id_user, geo.status);
    
            // Construye el mensaje basado en el valor de 'cons'
            const message = geo.cons ? 'Se habilitó tu posición.' : 'Se deshabilitó tu posición.';
    
            return res.status(201).json({
                success: true,
                message: message
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo problemas en la actualización.'
            });
        }
    },

    async getCoordenadas(req, res){
        try {
            const id_user = req.params.id_user
            const data = await Geo.getDireccion(id_user);
            console.log(`Usuario:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el usuaro'
            });
            
        }
    }
    
}