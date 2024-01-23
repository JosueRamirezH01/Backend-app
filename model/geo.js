const db = require('../config/config');

const Geo = {};

Geo.crear = (geo) => {
    const sql = `INSERT INTO coordenadas
    (latitud, longitud, id_user, id_medico,created_at, updated_at, status) 
    VALUES ($1, $2, $3, $4, $5, $6,'DESHABILITADO');`
    return db.none(sql,[
        geo.latitud,
        geo.longitud,
        geo.id_user,
        geo.id_medico,
        new Date(),
        new Date()
    ]);
}

Geo.delete = (id_user)=>{
    const sql = `DELETE FROM coordenadas WHERE id_user = $1 ; `
    return db.none(sql,[id_user]);
}

Geo.update = (geo) => {
    const sql = `UPDATE coordenadas SET 
    latitud = $2, 
    longitud = $3,
    updated_at = $4
    WHERE id_user = $1;`
    return db.none(sql, [
        geo.id_user, 
        geo.latitud,
        geo.longitud,
        new Date()
    ]);
}

Geo.updateStatus = (id_user,status) => {
    const sql = `UPDATE coordenadas SET status = $2 WHERE id_user = $1;`
    return db.none(sql,[id_user,status]);
}


Geo. getDireccion = (id_user) => {
    const sql = `SELECT
    c.id_coordenadas AS id_coordenadas,
    c.id_user AS id_user,
    c.latitud AS latitud,
    c.longitud AS longitud,
    pu.nombre AS nombre,
    pu.apellido AS apellido,
    pu.dni AS dni,
    pu.celular AS celular,
    pu.image AS imagen,
	us.verificador_token AS verificador_token,
	us.notificacion_token AS notificacion_token,
    m.id_medico AS id_medico,
    m.colegiatura AS colegiatura,
    m.otra_universidad AS otra_universidad,
    m.otra_especialidad AS otra_especialidad,
    m.experiencia AS experiencia,
    e.especialidad AS especialidad,
    u.universidad AS universidad
FROM coordenadas AS c
INNER JOIN perfil_usuario AS pu ON c.id_user = pu.usuario_id
LEFT JOIN usuario AS us ON c.id_user = us.id_usuario
LEFT JOIN medico AS m ON c.id_medico = m.id_medico
LEFT JOIN especialidad AS e ON m.especialidad_id = e.id_especialidad
LEFT JOIN universidad AS u ON m.universidad_id = u.id_universidad
WHERE c.id_user = $1`
    return db.oneOrNone(sql,id_user);
}
module.exports = Geo;