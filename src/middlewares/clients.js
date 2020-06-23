require('dotenv/config');
const database = require('../dbConnection');
const jwt = require('jsonwebtoken');
// const { parse } = require('dotenv/lib/main');
// const { compareSync } = require('bcrypt');

function dataEnteredToLogin(req, res, next) {
	const user = req.body;
	if ((user.usuario || user.email) && user.contrasena) {
		next();
	} else {
		res.status(400).send('Todos los campos son obligatorios.');
	}
}

//SIGN UP VALIDATIONS
function dataValidation(req, res, next) {
	let newUser = req.body;
	try {
		validationsForUserCreation(newUser);
		next();
	} catch (error) {
		res.status(500).send(`${error}`);
	}
}

function validationsForUserCreation(user) {
	const { usuario, email, contrasena, nombre, apellido, telefono, direccion_envio } = user;
	validateUsername(usuario);
	validateEmail(email);
	validatePassword(contrasena);
	validateName(nombre);
	validateSurname(apellido);
	validatePhone(telefono);
	validateDirection(direccion_envio);
}

function validateUsername(username) {
	const regex = /^[a-z0-9]+$/i;
	if (!regex.test(username)) {
		throw new Error('El nombre de usuario solo puede contener letras y números.');
	}
}

function validateEmail(email) {
	const regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
	if (!regex.test(email)) {
		throw new Error('Formato de correo no válido.');
	}
}

function validatePassword(password) {
	const regex = /^[a-z0-9]+$/i;
	if (!regex.test(password)) {
		throw new Error('La contraseña solo puede contener letras y números.');
	}
}

function validateName(name) {
	const regex = /^[a-z]+$/i;
	if (!regex.test(name)) {
		throw new Error('El nombre solo puede contener letras.');
	}
}

function validateSurname(surname) {
	const regex = /^[a-z]+$/i;
	if (!regex.test(surname)) {
		throw new Error('El apellido solo puede contener letras.');
	}
}

function validatePhone(phone) {
	regex = /^[0-9]+$/i;
	if (!regex.test(phone)) {
		throw new Error('El campo teléfono solo puede tener números.');
	}
}

function validateDirection(direction) {
	if (direction.length < 0 || direction === ' ') {
		throw new Error('El campo dirección no puede estar vacío.');
	}
}

//EXISTENCE
async function userExistence(req, res, next) {
	let newUser = req.body;
	const userFound = await userExistenceByUsername(newUser.usuario);
	const emailFound = await userExistenceByEmail(newUser.email);
	if (userFound.length > 0) {
		res.status(400).send('El nombre de usuario ya existe. Intente con otro distinto.');
	} else {
		if (emailFound.length > 0) {
			res.status(400).send('El email ya existe. Intente con otro distinto.');
		} else {
			next();
		}
	}
}

async function userExistenceByUsername(username) {
	const statement = process.env.GET_USER_BY_USERNAME;
	let us;
	try {
		us = await database.query(statement, { replacements: [username] });
		us = us[0];
		us = us[0];
		if (us !== undefined) {
			us = JSON.parse(JSON.stringify(us));
			us = us.usuario;
		} else {
			us = '';
		}
	} catch (error) {
		console.log(error);
	}
	return us;
}

async function userExistenceByEmail(email) {
	const statement = process.env.GET_USER_BY_EMAIL;
	let e;
	try {
		e = await database.query(statement, { replacements: [email] });
		e = e[0];
		e = e[0];
		if (e !== undefined) {
			e = JSON.parse(JSON.stringify(e));
			e = e.email;
		} else {
			e = '';
		}
	} catch (error) {
		console.log(error);
	}
	return e;
}

function isLogged(req, res, next) {
	const key = process.env.SECRET_KEY;
	const token = req.headers.authorization.split(' ')[1];
	const logged = jwt.verify(token, key);
	if (logged) {
		req.es_admin = logged.es_admin.data[0];
        req.id = logged.id;
		next();
	} else {
		res.status(401).send('No tiene los permisos para realizar esta operación.');
	}
}

//ORDER FUNCTIONS
async function oderUserMatch (req, res, next) {
	const statement = process.env.GET_ORDER;
	const idOrder = req.params.id;
	const idUser = req.id;
	try{
		let order = await database.query(statement, {replacements: [idOrder]});
		order = order [0];
		let id = order[0].id_usuario;
		if (id === idUser) {
			next();
		} else {
			res.status(401).send('No tiene los permisos para realizar esta operación.');
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
    dataEnteredToLogin,
    dataValidation,
    userExistence,
    isLogged,
    oderUserMatch
}