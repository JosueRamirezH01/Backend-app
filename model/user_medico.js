const db = require('../config/config');
const crypto = require('crypto');
const User= {};



User.getAllUni =() => {
    const sql = `Select id_universidad,universidad FROM universidad ORDER BY CASE WHEN universidad = 'Otros' THEN 2 ELSE 1 END, universidad ASC;`;
    return db.manyOrNone(sql)
}

User.getAllEsp =() => {
    const sql = `Select id_especialidad,especialidad FROM especialidad ORDER BY CASE WHEN especialidad = 'Otros' THEN 2 ELSE 1 END, especialidad ASC;`;
    return db.manyOrNone(sql)
}

User.findEmail = (email) => {
    const sql = `SELECT email FROM usuario WHERE email = $1;
    `;
    return db.oneOrNone(sql, email);
}

User.findCelular = (celular) => {
    const sql = `SELECT celular FROM perfil_usuario WHERE celular = $1;
    `;
    return db.oneOrNone(sql, celular);
}

User.findCMP = (colegiatura) =>{
    const sql = `SELECT colegiatura FROM medico WHERE colegiatura = $1 ;
    `;
    return db.oneOrNone(sql, colegiatura);
}

User.register = async (user) => {
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    try {
        const result = await db.tx(async (t) => {
            const nuevoUsuario = await t.one(`
                INSERT INTO usuario (email, password, activo, created_at, updated_at)
                VALUES ($1, $2,'false', $3, $4)
                RETURNING id_usuario
            `, [user.email,user.password, new Date(), new Date()]);

            const nuevoPerfil = await t.one(`
                INSERT INTO perfil_usuario (nombre, apellido, dni, sexo, fecha_nacimiento, celular,image , direccion, usuario_id, created_at, update_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id_perfil_usuario
            `, [user.nombre, user.apellido, user.dni, user.sexo, user.fecha_nacimiento, user.celular, user.image, user.direccion, nuevoUsuario.id_usuario, new Date(), new Date()]);

            await t.none(`
                INSERT INTO medico (colegiatura, certificado_professional, certificado_especialidad , experiencia, especialidad_id, universidad_id, perfil_id, created_at, updated_at)
                VALUES ($1 ,$2 ,$3 ,$4, (SELECT id_especialidad FROM especialidad WHERE especialidad = $5), (SELECT id_universidad FROM universidad WHERE universidad = $6), $7, $8, $9)
                `, [user.colegiatura ,user.certificado_professional ,user.certificado_especialidad , user.experiencia, user.especialidad, user.universidad, nuevoPerfil.id_perfil_usuario, new Date(), new Date()]);

        });

        return result;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }

   
};
User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed === hash) {
        return true;
    }
    return false;
}
User.getMedico = (id_medico) => {
    const sql = `SELECT
    pu.id_perfil_usuario,
    pu.nombre,
    pu.apellido,
    pu.sexo,
    pu.celular,
    pu.image,
    m.id_medico,
    m.colegiatura,
    m.otra_universidad,
    m.otra_especialidad,
    e.especialidad AS especialidad 
  FROM
    perfil_usuario AS pu
    INNER JOIN medico AS m ON pu.id_perfil_usuario = m.perfil_id
    JOIN especialidad AS e ON m.especialidad_id = e.id_especialidad
  WHERE
    m.id_medico = $1`;
    return db.oneOrNone(sql, id_medico);
}

module.exports = User;