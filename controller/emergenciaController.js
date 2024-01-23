const Emergencia = require('../model/emergencia');

module.exports = {

    async crearEmergencia(req, res) {
        try {
          const emergencia = req.body;
          emergencia.status = 'PROCESO';
          const data = await Emergencia.create(emergencia);
            
            return res.status(201).json({
              success: true,
              message: 'La emergencia se creó correctamente',
              data: data.id_emergencia
            });
        } catch (error) {
          console.error('Error al crear una emergencia:', error);
          return res.status(501).json({
            success: false,
            message: 'Hubo un error al crear una emergencia',
            error: error
          });
        }
      },
      async getFechaCreadaEmergencia(req, res) {
        try {
          const id_emergencia = req.params.id_emergencia;
          const data = await Emergencia.getHoraEmergencia(id_emergencia);
          return res.status(201).json(data);
        } catch (error) {
          return res.status(501).json({
            message: `Error al listar`,
            success: false,
            error: error
        });
        }
      },
      async updateCancelada(req, res) {
        try {
          const emergencia = req.body;
          emergencia.status = 'CANCELADO';
          const data = await Emergencia.updateCancelado(emergencia);
            
            return res.status(201).json({
              success: true,
              message: 'La emergencia se cancelo correctamente',
              data: data.id_emergencia
            });
        } catch (error) {
          console.error('Error al cancelar una emergencia:', error);
          return res.status(501).json({
            success: false,
            message: 'Hubo un error al cancelar una emergencia',
            error: error
          });
        }
      },
    async updateActivo(req, res){
      try {
          const emergencia = req.body;
          emergencia.status = 'ACTIVO';
          await Emergencia.updateActivo(emergencia);
          return res.status(201).json({
              success: true,
              message: 'La emergencia ya esta activo'
          })
      } catch (error) {
          console.error('Error al modificar a ACTIVO');
          return res.status(501).json({
              success: false,
              message: 'Hubo un error al modificar ACTIVO',
              error: error
          });
      }
  },
  async updateCulminado(req, res){
    try {
        const emergencia = req.body;
        emergencia.status = 'CULMINADO';
        await Emergencia.updateCulminado(emergencia);
        return res.status(201).json({
            success: true,
            message: 'La emergencia ya esta activo'
        })
    } catch (error) {
        console.error('Error al modificar a ACTIVO');
        return res.status(501).json({
            success: false,
            message: 'Hubo un error al modificar ACTIVO',
            error: error
        });
    }
},
async updateNoAceptado(req, res){
  try {
      const emergencia = req.body;
      emergencia.status = 'NO ACEPTADO';
      await Emergencia.updateNoAceptado(emergencia);
      return res.status(201).json({
          success: true,
          message: 'La emergencia no se acepto, ni se cancelo'
      })
  } catch (error) {
      console.error('Error al modificar a NO ACEPTADO');
      return res.status(501).json({
          success: false,
          message: 'Hubo un error al modificar NO ACEPTADO',
          error: error
      });
  }
},
    async getEmergencia(req, res) {
        try {
          const id_medico = req.params.id_medico;
          const status = req.params.status;
          const data = await Emergencia.getEmergencia(id_medico,status);
          res.status(201).json(data);
        } catch (error) {
          return res.status(501).json({
            message: `Error al listar`,
            success: false,
            error: error
        });
        }
    },
    async crearCalificacion(req, res){
        try {
          const calificacion = req.body;
          await Emergencia.createCalificacion(calificacion)
          return res.status(201).json({
            success: true,
            message: 'Gracias, de esta manera mejoraremos la comunidad',
          });
        } catch (error) {
          console.error('Error al crear una calificacion:', error);
          return res.status(501).json({
            success: false,
            message: 'Hubo un error al crear una calificacion',
            error: error
          });
        }
    },
    async getPromedioCalificacion(req, res){
      try {
        const id_user = req.params.id_user;
        const data = await Emergencia.promedioCalificacion(id_user);
        return res.status(201).json(data);
      } catch (error) {
        return res.status(501).json({
          message: `Error al listar`,
          success: false,
          error: error
      });
      }  
    }

}