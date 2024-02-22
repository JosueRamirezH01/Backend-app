const User = require('../model/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Rol = require('../model/rol');
require('dotenv').config();

function generateRandomCode() {
    const min = 1000; // Valor mínimo (inclusive)
    const max = 9999; // Valor máximo (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateUniqueToken() {
    // Generar un token aleatorio utilizando la biblioteca crypto
    const token = crypto.randomBytes(20).toString('hex');
    return token;
  }
module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await User.getAll();
            console.log(`Usuarios:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
            
        }
    },
    
    async getById(req, res, next) {
        try {
            const id_usuario = req.params.id_usuario
            const data = await User.findByUserId(id_usuario);
            console.log(`Usuario:${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el usuaro'
            });
            
        }
    },

    async register(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                    console.log('URL de la imagen:', url);
                }
            }

            const data = await User.create(user);

            await Rol.create(data.usuario_id, 1);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: data.usuario_id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },
    async createserMedico(req, res){
        try {
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);
    
            const files = req.files;

            // ... manejo de imágenes y archivos PDF ...
            if (files.file && files.file2  ) {
                const pathPdf = `file_${Date.now()}`;
                const pathPdfM =`file2_${Date.now()}`;
    
                const urlPdf = await storage(files.file[0], null, null, pathPdf, user.certificado_especialidad);
                const urlPdfM = await storage(files.file2[0], null, null, pathPdfM, user.certificado_professional);

                
                if (urlPdf != undefined && urlPdf != null) {
                    user.certificado_especialidad = urlPdf;
                }
                if (urlPdfM != undefined && urlPdfM != null) {
                    user.certificado_professional = urlPdfM;
                }
            }

           const data =  await User.serMedico(user);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data.id_medico
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con el registro del usuario usuario',
    
            });
        }
    },
    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            
            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El usuario no fue encontrado'
                });
            }
            if(myUser.activo === false) {
                    return res.status(401).json({
                        success: false,
                        message: 'El usuario aun está en evaluación por los documentos registrados previamente.'
                    });
            }
    
            
            if(User.isPasswordMatched(password, myUser.password)){
                const token = jwt.sign({id_usuario: myUser.id_usuario, email: myUser.email}, keys.secretOrKey,{
                    //expiresIn: (60*60*24)  //1 hora
                    //expiresIn:(60*2) // 2 minutos
                });
                const data = {
                    id_usuario: myUser.id_usuario,
                    email: myUser.email,
                    nombre:myUser.nombre,
                    apellido:myUser.apellido,
                    dni:myUser.dni,
                    image:myUser.image,
                    celular:myUser.celular,
                    direccion: myUser.direccion,
                    fecha_nacimiento: myUser.fecha_nacimiento,
                    sexo: myUser.sexo,
                    verificador_token: `JWT ${token}` ,
                    notificacion_token: myUser.notificacion_token,
                    usuario_id: myUser.usuario_id,
                    roles: myUser.roles,
                    privilegio:myUser.privilegio,
                    activo: myUser.activo,
                    medico: myUser.medico,
                    id_perfil_usuario: myUser.id_perfil_usuario
                }

                await User.updateToken(myUser.id_usuario,`JWT ${token}` );
                return res.status(201).json({
                    success: true,
                    data: data,
                    message:'El usuario ha sido autenticado'
                });
            }else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer login',
                error: error
            });
        }
    },

    async logout(req,res, next){
        try {
            const idUsuario = req.body.id_usuario;
            await User.updateToken(idUsuario,null);
            return res.status(201).json({
                success: true,
                message: 'La session del usuario se ha cerrado correctamente'
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de cerrar session',
                error: error
            });
        }
    },
    
    async update(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${JSON.stringify(user)}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se actualizaron correctamente'
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualizacion de datos del usuario',
                error: error.message
            });
        }
    },
    async updateToken(req,res,next){
        try {
            const body = req.body;
            console.log('Informacion del usuario', body);
            await User.updateToken(body.id_usuario,body.verificador_token);
            return res.status(201).json({
                success: true,
                message: 'El token de session se ha creado correctamente',
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un problema en la actualizacion del token',
                error: error
            });
        }
    },
    async updateNotificacionToken(req,res,next){
        try {
            const body = req.body;
            console.log('Informacion del usuario', body);
            await User.updateNotificacionToken(body.id_usuario,body.notificacion_token);
            return res.status(201).json({
                success: true,
                message: 'El token de notifacacion se ha creado correctamente',
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un problema en la actualizacion del token',
                error: error
            });
        }
    },


    async forgotPassword(req, res) {
        // Lógica para solicitar la recuperación de contraseña
        try {
          const { email } = req.body; // El correo electrónico proporcionado por el usuario
          // Buscar al usuario en la base de datos por su dirección de correo electrónico
          const user = await User.findByEmail(email);
          const token = generateRandomCode();
                 
    
          if (!user) {
            return res.status(404).json({ success: false, message: 'Correo electrónico no encontrado' });
          }
         
          // Generar un token de recuperación y guardarlo en la base de datos
          //const token = generateUniqueToken(); // Asume que ya tienes una función para generar tokens únicos
          console.log('Token generado:', token);
          const expiracion = Date.now() + 3600000; // El token expirará en 1 hora
          await User.clearResetToken(user.usuario_id);
          await User.save(token, user.id_usuario, new Date(expiracion));

          // Envía el correo de recuperación con el enlace que contiene el token
          sendRecoveryEmail(email,token);     // Asume que tienes una función para enviar correos electrónicos
         
          return res.status(200).json({ 
            success: true,
            message: 'Se ha enviado un correo de recuperación a tu dirección de correo electrónico' 
        });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al solicitar la recuperación de contraseña' });
        }
      },

      async validToken(req,res){
        
        const {token} = req.body;
        const user = await User.findByResetToken(token);
        if (!user || user.expiracion < Date.now()) {
            return res.status(400).json({ success:false, message: 'Token inválido o expirado' });
          }
          return res.status(200).json({ success:true, message: 'Token Valido' });
        } ,  
      async resetPassword(req, res) {
        // Lógica para restablecer la contraseña
        try {
          const {token,password} = req.body;
          
    
          // Buscar al usuario en la base de datos por el token de recuperación
          const user = await User.findByResetToken(token);
    
          if (!user || user.expiracion < Date.now()) {
            return res.status(400).json({ success:false, message: 'token expirado' });
          }
    
          // Restablecer la contraseña del usuario
          
          const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        await User.updatePassword(user.usuario_id, hashedPassword);

        // Limpiar el token y la expiración de recuperación del usuario en la base de datos
        await User.clearResetToken(user.usuario_id);

        
          return res.status(200).json({ success:true, message: 'Contraseña restablecida correctamente' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success:false,message: 'Error al restablecer la contraseña' });
        }
      },

      async forgotPasswordRegistro(req, res) {
        try {
            const { email } = req.body; // El correo electrónico proporcionado por el usuario
            const token = generateRandomCode();

            const expiracion = Date.now() + 3600000;
            await User.clearResetCodigo(email);
            // Guardar la solicitud de recuperación en una tabla temporal
            await User.saveResetRequest(email, token, new Date(expiracion));
    
            // Envía el correo de recuperación con el enlace que contiene el token
            sendRecoveryEmail(email, token); // Asume que tienes una función para enviar correos electrónicos
           
            return res.status(200).json({ 
                success: true,
                message: 'Se ha enviado un codigo de confirmacion a tu correo electrónico' 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al solicitar la recuperación de contraseña' });
        }
    },
    async validarTokenRegistro(req,res){
        
        const {token} = req.body;
        const user = await User.validar_registro(token);
        if (!user || user.expiracion < Date.now()) {
            return res.status(400).json({ success:false, message: 'Token inválido o expirado' });
          }
          return res.status(200).json({ success:true, message: 'Token Valido' });
        } , 
}



async function sendRecoveryEmail(email, token) {
    try {
      // Configurar el contenido del correo electrónico
      const mailOptions = {
        from: 'josueramirezherrera01@gmail.com', // Coloca tu dirección de correo electrónico
        to: email, // La dirección de correo electrónico del usuario
        subject: 'Recuperación de contraseña', // El asunto del correo electrónico
        text: `Ingrese ese codigo para actualizar su contraseña:${token}`, // El contenido del correo electrónico
    
      };
  
      // Enviar el correo electrónico
      const info = await transporter.sendMail(mailOptions);
  
      console.log(`Correo de recuperación enviado a ${email}: ${info.messageId}`);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
    }
  }
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // O el servicio de correo que prefieras (p. ej., 'Outlook')
    auth: {
      user: process.env.EMAIL, // Coloca tu dirección de correo electrónico
      pass: process.env.EMAIL_PASSWORD, // Coloca tu contraseña de correo electrónico
    },
  });
