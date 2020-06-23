require('dotenv/config');
const database = require('../dbConnection');
const jwt = require('jsonwebtoken');
// const { parse } = require('dotenv/lib/main');
// const { compareSync } = require('bcrypt');

//VALIDACIONES
function isAdmin(req, res, next) {
	const key = process.env.SECRET_KEY;
	const token = req.headers.authorization.split(' ')[1];
	try {
		const admin = jwt.verify(token, key);
		if (admin.es_admin.data[0] === 1) {
			req.es_admin = admin.es_admin;
			req.id = admin.id;
			next();
		} else {
			res.status(401).send('No tiene los permisos para realizar esta operación.');
		}
	} catch (error) {
		res.status(401).send('No tiene los permisos para realizar esta operación.');
	}
}

function dataEnteredToLogin(req, res, next) {
	const user = req.body;
	if ((user.usuario || user.email) && user.contrasena) {
		next();
	} else {
		res.status(400).send('Todos los campos son obligatorios.');
	}
}

module.exports = {
    isAdmin,
    dataEnteredToLogin
}