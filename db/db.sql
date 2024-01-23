DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL, 
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);
create table emergencia(
id_emergencia BIGSERIAL NOT NULL PRIMARY KEY,
id_user BIGSERIAL NOT NULL, 
id_medico BIGSERIAL NOT NULL,
id_coordenadas BIGSERIAL NOT NULL,
direccion VARCHAR(255) NULL
status VARCHAR(255),
timestamp VARCHAR(255) NULL
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL,
FOREIGN KEY(id_user) REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(id_medico) REFERENCES medico(id_medico) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(id_coordenadas) REFERENCES coordenadas(id_coordenadas) ON DELETE CASCADE ON UPDATE CASCADE
)
CREATE TABLE coordenadas(
	id_coordenadas BIGSERIAL NOT NULL,
	id_user BIGSERIAL NOT NULL,
	id_medico BIGSERIAL NOT NULL,
	latitud numeric(9,6) NULL,
	longitud numeric(9,6) NULL,
	status VARCHAR(255),
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_medico) REFERENCES medico(id_medico) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_user) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_coordenadas)
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);
CREATE TABLE usuario(
	id_usuario BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	verificador_token VARCHAR(255) NULL,
	activo BOOLEAN NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
)

CREATE TABLE perfil_usuario(
	id_perfil_usuario BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	dni VARCHAR(8) NOT NULL UNIQUE,
	sexo VARCHAR(20) NOT NULL,
	fecha_nacimiento DATE,
	celular VARCHAR(9) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	direccion VARCHAR(255) NULL,
	usuario_id BIGSERIAL NOT NULL,
	FOREIGN KEY(usuario_id) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE
)
CREATE TABLE medico(
id_medico BIGSERIAL PRIMARY KEY,
colegiatura VARCHAR(255) NOT NULL UNIQUE,
certificado_professional VARCHAR(255) NULL,
otra_universidad VARCHAR(255) NULL,
otra_especialidad VARCHAR(255) NULL,
experiencia VARCHAR(50) NOT NULL,
certificado_especialidad VARCHAR(255) NULL,
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL,
especialidad_id BIGSERIAL NOT NULL,
universidad_id BIGSERIAL NOT NULL,
perfil_id BIGSERIAL NOT NULL,
FOREIGN KEY(especialidad_id) REFERENCES especialidad(id_especialidad) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(universidad_id) REFERENCES universidad(id_universidad) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(perfil_id) REFERENCES perfil_usuario(id_perfil_usuario) ON DELETE CASCADE ON UPDATE CASCADE
)
CREATE TABLE tokens_recuperacion (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  expiracion TIMESTAMP NOT NULL
);

CREATE TABLE universidad(
id_universidad BIGSERIAL PRIMARY KEY,
universidad VARCHAR(255) NOT NULL,
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL
)
ALTER TABLE especialidad ADD detalle VARCHAR(255)
CREATE TABLE especialidad(
id_especialidad BIGSERIAL PRIMARY KEY,
especialidad VARCHAR(255) NOT NULL,
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL
)
INSERT INTO especialidad(especialidad,detalle,created_at,updated_at) VALUES('Oncología',
'Diagnóstico y tratamiento de cáncer y tumores malignos.',
CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) 

CREATE TABLE medico(
id_medico BIGSERIAL PRIMARY KEY,
colegiatura VARCHAR(255) NOT NULL UNIQUE,
certificado_professional VARCHAR(255) NULL,
otra_universidad VARCHAR(255) NULL,
otra_especialidad VARCHAR(255) NULL,
año_experiencia VARCHAR(50) NOT NULL,
certificado_especialidad VARCHAR(255) NULL,
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL,
especialidad_id BIGSERIAL NOT NULL,
universidad_id BIGSERIAL NOT NULL,
perfil_id BIGSERIAL NOT NULL,
FOREIGN KEY(especialidad_id) REFERENCES especialidad(id_especialidad) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(universidad_id) REFERENCES universidad(id_universidad) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(perfil_id) REFERENCES perfil_usuario(id_perfil_usuario) ON DELETE CASCADE ON UPDATE CASCADE
)

DROP TABLE IF EXISTS emergencia CASCADE;

create table emergencia(
id_emergencia BIGSERIAL NOT NULL PRIMARY KEY,
id_user BIGSERIAL NOT NULL, 
id_medico BIGSERIAL NOT NULL,
direccion VARCHAR(255) NULL,
status VARCHAR(255),
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP(0) NOT NULL,
FOREIGN KEY(id_user) REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(id_medico) REFERENCES medico(id_medico) ON DELETE CASCADE ON UPDATE CASCADE
	)
