const db = require('../config/config');
const crypto = require('crypto');
const User = {};

User.getAll = () => {
    const sql = 
    `SELECT * FROM  usuario`;
    return db.manyOrNone(sql)
}

User.create = (user) =>{
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;
   const sql = `
   WITH usuario_insert AS (
    INSERT INTO usuario (email, password, activo, created_at, updated_at)
    VALUES ($1, $2, 'true', $3, $4)
    RETURNING id_usuario
  )
  INSERT INTO perfil_usuario (nombre, apellido, dni, sexo, fecha_nacimiento, celular, image, direccion, update_at, created_at , usuario_id)
  SELECT $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, id_usuario
  FROM usuario_insert   RETURNING usuario_id 
  `;
      return db.oneOrNone(sql,[
        user.email,
        user.password,
        new Date(),
        new Date(),
        user.nombre,
        user.apellido,
        user.dni,
        user.sexo,
        user.fecha_nacimiento,
        user.celular,
        user.image,
        user.direccion,
        new Date(),
        new Date()
      ]);


}
User.update = (user) => {
  const sql = `
  UPDATE perfil_usuario
  SET 
  nombre = $2,
  apellido = $3,
  dni = $4,
  celular = $5,
  image = $6,
  direccion = $7,
  update_at = $8
  WHERE 
  usuario_id = $1`;

  return db.none(sql,[
      user.usuario_id,
      user.nombre,
      user.apellido,
      user.dni,
      user.celular,
      user.image,
      user.direccion,
      new Date()
  ]);
}


User.findById = async (id_usuario,callback) => {
    const sql = `
    SELECT
    u.id_usuario, u.email, u.password, u.verificador_token, u.notificacion_token,u.activo, u.created_at, u.updated_at,
    p.id_perfil_usuario, p.nombre, p.apellido, p.dni, p.sexo, p.fecha_nacimiento, p.celular, p.image, p.direccion, p.usuario_id,
    (
        SELECT json_agg(
            json_build_object(
                'id', r.id,
                'name', r.name,
                'image', r.image,
                'route', r.route
            )
        )
        FROM user_has_roles uhr
        JOIN roles r ON uhr.id_rol = r.id
        WHERE uhr.id_user = u.id_usuario
    ) AS roles
FROM usuario u
JOIN perfil_usuario p ON u.id_usuario = p.usuario_id
WHERE u.id_usuario = $1;
    `;
  return db.oneOrNone(sql, id_usuario).then(user => {callback(null,user);})  ;
}

User.findByEmail = (email) => {
    const sql = `
    SELECT
    u.id_usuario, u.email, u.password, u.verificador_token, u.notificacion_token,u.activo,
    p.id_perfil_usuario, p.nombre, p.apellido, p.dni, p.sexo, p.fecha_nacimiento, p.celular, p.image, p.direccion, p.usuario_id,
    (
        SELECT json_agg(json_build_object(
            'id', r.id,
            'name', r.name,
            'image', r.image,
            'route', r.route
        ))
        FROM user_has_roles uhr
        JOIN roles r ON uhr.id_rol = r.id
        WHERE uhr.id_user = u.id_usuario
    ) AS roles,
    (
        SELECT json_agg(json_build_object(
            'id_medico', m.id_medico,
            'privilegio', m.privilegio,
            'colegiatura', m.colegiatura,
            'experiencia', m.experiencia,       
            'otra_especialidad', m.otra_especialidad,
            'universidad', u.universidad, 
            'especialidad', e.especialidad
        ))
        FROM medico m
        JOIN universidad u ON m.universidad_id = u.id_universidad
        JOIN especialidad e ON m.especialidad_id = e.id_especialidad
        WHERE m.perfil_id = p.id_perfil_usuario 
    ) AS medico
FROM usuario u
JOIN perfil_usuario p ON u.id_usuario = p.usuario_id
WHERE u.email = $1;
    `;
  return db.oneOrNone(sql, email);
}
User.save = (token, usuario_id, expiracion) => {
  const sql = `
    INSERT INTO tokens_recuperacion (token, usuario_id, expiracion)
    VALUES ($1, $2, $3)
  `;

  return db.none(sql, [token, usuario_id, expiracion]);
};
User.findByResetToken = (token) => {
  const sql = `
  SELECT u.id_usuario, u.email, u.password, u.verificador_token, u.activo, u.created_at, u.updated_at,
     p.id_perfil_usuario, p.nombre, p.apellido, p.dni, p.sexo, p.fecha_nacimiento, p.celular, p.image, p.direccion, p.usuario_id
  FROM usuario u
  JOIN perfil_usuario p ON u.id_usuario = p.usuario_id
  WHERE u.id_usuario IN (
    SELECT usuario_id
    FROM tokens_recuperacion
    WHERE token = $1 AND expiracion > NOW()
  );
  `;
  return db.oneOrNone(sql, token);
};
User.saveResetRequest= (email, token, expiracion) => {
  try {
      const sql = `
      INSERT INTO validar_registro (email, token, expiracion)
      VALUES ($1, $2, $3)`;

      return db.none(sql, [email, token, expiracion]);
  } catch (error) {
      console.error('Error al guardar la solicitud de recuperación:', error);
      throw error;
  }
};
User.validar_registro = (token) =>{
  const sql = `
  Select * from validar_registro WHERE token = $1 AND expiracion > NOW()
  `;
  return db.oneOrNone(sql, token);
};
User.findByUserId = (id_usuario) => {
  const sql = `
  SELECT 
    u.id_usuario, u.email, u.password, u.verificador_token, u.notificacion_token, u.activo, u.created_at, u.updated_at, m.privilegio,
    p.id_perfil_usuario, p.nombre, p.apellido, p.dni, p.sexo, p.fecha_nacimiento, p.celular, p.image, p.direccion, p.usuario_id,
    json_agg(
        json_build_object(
            'id', R.id,
            'name', R.name,
            'image', R.image,
            'route', R.route
        )
    ) AS roles,
	(
        SELECT json_agg(json_build_object(
            'id_medico', m.id_medico,
            'privilegio', m.privilegio,
            'colegiatura', m.colegiatura,
            'experiencia', m.experiencia,       
            'otra_especialidad', m.otra_especialidad,
            'universidad', u.universidad, 
            'especialidad', e.especialidad
        ))
        FROM medico m
        JOIN universidad u ON m.universidad_id = u.id_universidad
        JOIN especialidad e ON m.especialidad_id = e.id_especialidad
        WHERE m.perfil_id = p.id_perfil_usuario 
    ) AS medico
FROM usuario u
INNER JOIN user_has_roles AS UHR ON UHR.id_user = u.id_usuario
INNER JOIN roles AS R ON R.id = UHR.id_rol
JOIN perfil_usuario p ON u.id_usuario = p.usuario_id
LEFT JOIN medico m ON p.id_perfil_usuario = m.perfil_id
WHERE u.id_usuario = $1
GROUP BY u.id_usuario, u.email, u.password, u.verificador_token, u.notificacion_token, u.activo, p.id_perfil_usuario, p.nombre, p.apellido, p.dni, p.sexo, p.fecha_nacimiento, p.celular, p.image, p.direccion, p.usuario_id, m.privilegio;
`;
return db.oneOrNone(sql, id_usuario);
}
User.updatePassword = (usuario_id, password) => {
  const sql = `
      UPDATE usuario
      SET password = $2
      WHERE id_usuario = $1
  `;
  return db.none(sql, [usuario_id, password]);
};

User.clearResetToken = (usuario_id) => {
  const sql = `
      DELETE FROM tokens_recuperacion
      WHERE usuario_id = $1
  `;
  return db.none(sql, [usuario_id]);
};

User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed === hash) {
        return true;
    }
    return false;
}

User.serMedico = (medico) => {
  const sql = `
  INSERT INTO medico (colegiatura, experiencia, otra_especialidad, otra_universidad, certificado_especialidad, certificado_professional,especialidad_id, universidad_id, perfil_id, created_at, updated_at, privilegio)
  VALUES ($1 , $2, $3, $4, $5, $6,
    (SELECT id_especialidad FROM especialidad WHERE especialidad = $7),  
    (SELECT id_universidad FROM universidad WHERE universidad = $8), 
    (SELECT id_perfil_usuario FROM perfil_usuario WHERE id_perfil_usuario = $9),
	  $10, $11, 'false' ) RETURNING id_medico;
  `;
  return db.oneOrNone(sql,[
    medico.colegiatura,
    medico.experiencia,
    medico.otra_especialidad,
    medico.otra_universidad,
    medico.certificado_professional,
    medico.certificado_especialidad,
    medico.especialidad,
    medico.universidad,
    medico.id_perfil_usuario,
    new Date(),
    new Date(),
    medico.privilegio
  ])

} ;
User.updateToken = (id_usuario , token) => {
  const sql = `
  UPDATE  usuario
  SET
    verificador_token = $2
    WHERE
    id_usuario = $1`;
    return db.none(sql, [
      id_usuario,
      token
    ]);
};
User.updateNotificacionToken = (id_usuario , token) => {
  const sql = `
  UPDATE  usuario
  SET
    notificacion_token = $2
    WHERE
    id_usuario = $1`;
    return db.none(sql, [
      id_usuario,
      token
    ]);
};
User.clearResetCodigo = (email) => {
  const sql = `
      DELETE FROM validar_registro
      WHERE email = $1
  `;
  return db.none(sql, [email]);
};



module.exports = User;