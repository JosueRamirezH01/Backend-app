const db = require('../config/config');
const Emergencia = {};

Emergencia.create = (emergencia) => {
    const sql = `
    INSERT INTO emergencia(id_user, id_medico, direccion, status, timestamp, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_emergencia
    `;
    return db.one(sql, [
        emergencia.id_user,
        emergencia.id_medico,
        emergencia.direccion,
        emergencia.status,
        Date.now,
        new Date(),
        new Date()
    ]);
}
Emergencia.getHoraEmergencia = (id_emergencia) =>{
    const sql = `SELECT created_at FROM emergencia WHERE id_emergencia = $1`;
    return db.one(sql,[id_emergencia]);
}
Emergencia.getEmergencia = (id_medico,status) =>{
    const sql =`
    SELECT 
    e.id_emergencia,
    e.direccion,
    e.status,
    e.timestamp,
    JSON_BUILD_OBJECT(
        'nombre', pu.nombre,
        'apellido', pu.apellido,
        'celular', pu.celular,
        'sexo', pu.sexo,
        'fecha_nacimiento', pu.fecha_nacimiento
    ) AS client,
    JSON_BUILD_OBJECT(
        'notificacion_token', u.notificacion_token
    ) AS client_token
FROM 
    emergencia AS e
INNER JOIN perfil_usuario AS pu ON e.id_user = pu.usuario_id
INNER JOIN usuario AS u ON e.id_user = u.id_usuario
WHERE
    e.id_medico = $1 AND e.status = $2
    `; 
    return db.manyOrNone(sql,[id_medico,status]);
}

Emergencia.updateCancelado = (emergencia) =>{
    const sql = `
    UPDATE 
        emergencia 
    SET
        status = $2,
        updated_at = $3
    WHERE 
        id_emergencia = $1
    `;
    return db.none(sql, [
        emergencia.id_emergencia,
        emergencia.status,
        new Date()
    ]);
}
Emergencia.updateActivo = (emergencia) =>{
    const sql = `
    UPDATE 
        emergencia 
    SET
        status = $2,
        updated_at = $3
    WHERE 
        id_emergencia = $1
    `;
    return db.none(sql, [
        emergencia.id_emergencia,
        emergencia.status,
        new Date()
    ]);
}
Emergencia.updateCulminado = (emergencia) =>{
    const sql = `
    UPDATE 
        emergencia 
    SET
        status = $2,
        updated_at = $3
    WHERE 
        id_emergencia = $1
    `;
    return db.none(sql, [
        emergencia.id_emergencia,
        emergencia.status,
        new Date()
    ]);
}
Emergencia.updateNoAceptado = (emergencia) =>{
    const sql = `
    UPDATE 
        emergencia 
    SET
        status = $2,
        updated_at = $3
    WHERE 
        id_emergencia = $1
    `;
    return db.none(sql, [
        emergencia.id_emergencia,
        emergencia.status,
        new Date()
    ]);
}
Emergencia.createCalificacion = (calificacion) =>{
    const sql = `INSERT INTO calificacion(id_user, puntuacion, created_at) VALUES ($1, $2, $3)`;
    return db.manyOrNone(sql,[
        calificacion.id_user,
        calificacion.puntuacion,
        new Date()
    ]);
}

Emergencia.promedioCalificacion = (id_user) => {
    const sql = `SELECT ROUND(AVG(puntuacion), 1) AS promedio FROM calificacion WHERE id_user = $1`;
    return db.manyOrNone(sql,[id_user]);
}

module.exports = Emergencia;
