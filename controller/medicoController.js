const fs = require('fs');
const User = require('../model/user_medico');
const storage = require('../utils/cloud_storage');

module.exports = {
    
    async getAllUni(req,res, next){
        try {
            const data = await User.getAllUni();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },
    async getAllEsp(req,res, next){
        try {
            const data = await User.getAllEsp();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async validarEmail(req, res){
        try {
            const email = req.body.email;
            const myUser = await User.findEmail(email);

            if(myUser){
                return res.status(401).json({
                    success: true,
                    message:'El email ya existe'
                });
            }
        
            return res.status(201).json({
                success: false,
                message: 'El email no esta registrado'
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de encontrar el email',
                error: error
            });
        }
    },

    async validarCelular(req, res){
        try {
            const celular = req.body.celular;
            const myUser = await User.findCelular(celular);

            if(myUser){
                return res.status(401).json({
                    success: true,
                    message:'El celular ya esta registrado'
                });
            }
        
            return res.status(201).json({
                success: false,
                message: 'El celular no esta registrado'
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de encontrar el celular',
                error: error
            });
        }
    },

    async validarColegiatura(req, res){
        try {
            const colegiatura = req.body.colegiatura;
            const myUser = await User.findCMP(colegiatura);

            if(myUser){
                return res.status(401).json({
                    success: true,
                    message:'Su colegiatura ya esta registrado'
                });
            }
        
            return res.status(201).json({
                success: false,
                message: 'Su colegiatura no esta registrado'
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de encontrar el colegiatura',
                error: error
            });
        }
    },

    async getMedico(req, res, next){
        try {
            const id_medico = req.body.id_medico;
            const data = await User.getMedico(id_medico);
            console.log(`Usuario:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el medico'
            });  
        }
    },
    
    async createmedico(req, res, next) {
        try {
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);
    
            const files = req.files;

            // ... manejo de imágenes y archivos PDF ...
            if (files.image && files.file && files.file2  ) {
                const pathImage = `image_${Date.now()}`;
                const pathPdf = `file_${Date.now()}`;
                const pathPdfM =`file2_${Date.now()}`;
    
                const urlImage = await storage(files.image[0], pathImage, user.image, null, null);
                const urlPdf = await storage(files.file[0], null, null, pathPdf, user.certificado_especialidad);
                const urlPdfM = await storage(files.file2[0], null, null, pathPdfM, user.certificado_professional);
                
                if (urlImage != undefined && urlImage != null) {
                    user.image = urlImage;
                }
                if (urlPdf != undefined && urlPdf != null) {
                    user.certificado_especialidad = urlPdf;
                }
                if (urlPdfM != undefined && urlPdfM != null) {
                    user.certificado_professional = urlPdfM;
                }
            }

           const data =  await User.register(user);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con el registro del usuario usuario',
    
            });
        }
    },



    

}