CREATE DATABASE delilah_db; 
USE delilah_db;

CREATE TABLE usuarios (
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    usuario VARCHAR (60) NOT NULL UNIQUE,
    email VARCHAR (120) NOT NULL UNIQUE,
    contrasena VARCHAR (60) NOT NULL,
    nombre VARCHAR (120) NOT NULL,
    apellido VARCHAR (120) NOT NULL,
    telefono VARCHAR (60),
    direccion_envio VARCHAR (300) NOT NULL,
    es_admin BIT
);

CREATE TABLE productos (
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(140) NOT NULL,
    precio DECIMAL (9,2) NOT NULL,
    stock BIT(1) NOT NULL,
    url_imagen VARCHAR (300)
);

CREATE TABLE formas_pago (
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR (60)
);

CREATE TABLE estados_pedido (
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR (60) NOT NULL
);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL, 
  id_estado INT NOT NULL,
  hora DATETIME NOT NULL,
  descripcion VARCHAR (600),
  importe_final DECIMAL(7,2),
  id_forma_pago INT NOT NULL
  );

CREATE TABLE detalle_pedido (
id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
id_pedido INT NOT NULL,
id_producto INT NOT NULL,
descripcion VARCHAR (60) NOT NULL,
q_unidades INT NOT NULL,
subtotal DECIMAL(7,2) NOT NULL
);

ALTER TABLE detalle_pedido
ADD CONSTRAINT FK_DETALLE_PRODUCTOS
FOREIGN KEY (id_producto) REFERENCES productos(id);

ALTER TABLE detalle_pedido
ADD CONSTRAINT FK_DETALLE_PEDIDOS
FOREIGN KEY (id_pedido) REFERENCES pedidos(id);

ALTER TABLE pedidos
ADD CONSTRAINT FK_ESTADOS_PEDIDOS
FOREIGN KEY (id_estado) REFERENCES estados_pedido(id);

ALTER TABLE pedidos
ADD CONSTRAINT FK_PAGO_PEDIDOS
FOREIGN KEY (id_forma_pago) REFERENCES formas_pago(id);

ALTER TABLE pedidos
ADD CONSTRAINT FK_USUARIO_PEDIDOS
FOREIGN KEY (id_usuario) REFERENCES usuarios(id);

INSERT INTO formas_pago (descripcion) VALUE ('efectivo');
INSERT INTO formas_pago (descripcion) VALUE ('debito');
INSERT INTO formas_pago (descripcion) VALUE ('credito');

INSERT INTO estados_pedido (descripcion) VALUE ('Nuevo');
INSERT INTO estados_pedido (descripcion) VALUE ('Confirmado');
INSERT INTO estados_pedido (descripcion) VALUE ('Preparando');
INSERT INTO estados_pedido (descripcion) VALUE ('Enviando');
INSERT INTO estados_pedido (descripcion) VALUE ('Cancelado');
INSERT INTO estados_pedido (descripcion) VALUE ('Entregado');

INSERT INTO usuarios (usuario, email, contrasena, nombre, apellido, telefono, direccion_envio, es_admin) VALUES ('admin', 'admin@mail.com', 'admin', 'John', 'Doe', '3512001020', 'Av. Secreta 2020', 1);
INSERT INTO usuarios (usuario, email, contrasena, nombre, apellido, telefono, direccion_envio, es_admin) VALUES ('csagan', 'csagan@mail.com', 'csagan', 'Carl', 'Sagan', '3512001021', 'Av. Milky Way 1996', 0);

INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza de alcachofas', 320.00, 1, '../img/pizza_alcachofas.jpg');
INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza Margherita', 290.00, 1, '../img/pizza_margherita.jpg');
INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza Marinara', 280.00, 1, '../img/pizza_marinara.jpg');
INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza Prosciutto', 320.00, 1, '../img/pizza_prosciutto.jpg');
INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza Quattro Formagi', 330.00, 1, '../img/pizza_quattro_formaggi.jpg');
INSERT INTO productos (descripcion, precio, stock, url_imagen) VALUES ('Pizza de queso de cabra', 350.00, 1, '../img/pizza_queso_cabra.jpg');
