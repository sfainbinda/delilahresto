require('dotenv/config');
const bcrypt = require('bcrypt');
const database = require('../dbConnection');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//ADMIN FUNCTIONS
async function login(req, res) {
    const key = process.env.SECRET_KEY;
    const statement = process.env.GET_USER_BY_USERNAME_EMAIL;
    const user = req.body;

    try {
        let userFound = await database.query(statement, { replacements: [user.usuario, user.email] });
        userFound = userFound[0];
        userFound = userFound[0];
        if (userFound !== 'undefined') {
            userFound = JSON.parse(JSON.stringify(userFound));
            let match = await bcrypt.compareSync(user.contrasena, userFound.contrasena); //no da lo mismo el orden de los parámetros.
            if (match) {
                const token = jwt.sign(userFound, key);
                res.status(200).json({ token: token });
            } else {
                res.status(401).send('Usuario o contraseña incorrecta.');
            }
        }
    } catch (error) {
        res.status(500).send('Usuario no registrado.');
    }
}

//PRODUCTS FUNCTIONS 
async function getProducts(req, res) {
    const statement = process.env.GET_PRODUCTS;
    try {
        let products = await database.query(statement);
        products = products[0];
        res.json(products);
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

async function getProduct(req, res) {
    const statement = process.env.GET_PRODUCT;
    try {
        let product = await database.query(statement, {replacements: [req.params.id]});
        product = product[0];
        res.json(product);
    } catch (error) {
        console.log(error);
    }
}

async function postProduct(req, res) {
    let newProduct= req.body;
    const statement = process.env.LOAD_PRODUCT;
    try {
        await database.query(statement, { replacements: newProduct });
        res.status(201).send('Producto creado y registrado en la base de datos.');
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

async function updateProduct(req, res) {
    let product = req.body;
    const statement = process.env.UPDATE_PRODUCT;
    try {
        await database.query(statement, {replacements: [
            product.descripcion,
            product.precio,
            product.stock,
            product.url_imagen,
            product.id
        ]});
        res.status(203).send('Producto actualizado exitosamente.');
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al actualizar producto. ${error}`);
    }
}

async function deleteProduct(req, res) {
    const statement = process.env.DELETE_PRODUCT;
    console.log(statement);
    try {
        console.log(req.params.id);
        await database.query(statement, {replacements: [req.params.id]});
        res.status(200).send('El producto ha sido eliminado de manera exitosa.');
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

//ORDER FUNCTIONS
async function getOrders (req, res) {
    const statement = process.env.GET_ALL_ORDERS;
    try {
        let orders = await database.query(statement);
        orders = orders[0];
        if (orders.length === 0) {
            res.send('Aún no hay pedidos.');
        } else {
            res.send(orders);
        }
    } catch (error) {
        console.log('Error.', error);
    }
}


async function getOrderStatus(req, res) {
    const orderId = req.params.id;
    const productStatement = process.env.GET_ORDER_PRODUCTS;
    const detailStatement = process.env.GET_ORDER_DETAIL_RESUME;
    let productList = [];
    try {
        let products = await database.query(productStatement, { replacements: [orderId]});
        let detail = await database.query(detailStatement, { replacements: [orderId]});
        detail = detail[0];
        if (detail.length > 0 && products.length > 0) {
            products[0].forEach(element => { 
                let product = {
                    "descripcion": `${element.q_unidades} ${element.descripcion}`,
                    "precio": element.subtotal
                }
                productList.push(product);
            });
            detail = JSON.parse(JSON.stringify(detail[0]));
            let orderDetail = {
                "estado": detail.estado,
                "detalle": productList,
                "forma_pago": detail.forma_pago,
                "importe_final": detail.importe_final,
                "direccion_envio": detail.direccion,
                "telefono": detail.telefono,
                "email": detail.email,
                "nombre": detail.nombre,
                "apellido": detail.apellido
            }
            res.status(200).send(orderDetail);
        } else {
            res.status(404).send('No hay ningún pedido asociado a ese id.');
        }
    } catch (error) {
        res.status(500).send();
    }
}

async function updateState(req, res) {
    let order = req.body;
    let statement = process.env.UPDATE_ORDER_STATE;
    try {
        await database.query(statement, { replacements: [order.id_estado, order.id_pedido] });
        res.status(200).send('Estado de pedido actualizado.');
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al actualizar el estado del pedido. ${error}`);
    }
}

//CLIENTS FUNCTIONS
async function getUsers(req, res) {
    const statement = process.env.GET_USERS;
    try {
        let users = await database.query(statement);
        users = users[0];
        if (users.length === 0) {
            res.send('No hay usuarios registrados.');
        } else {
            res.json(users);
        }
    } catch (error) {
        console.log('Error.', error);
    }
}

async function getUser(req, res) {
    const statement = process.env.GET_USER_BY_USERNAME_EMAIL;
    try {
        let user = await database.query(statement, { replacements: [req.params.usuario, req.params.usuario] });
        user = user[0];
        console.log(user);
        if (user.length === 0) {
            res.send('El usuario no existe.');
        } else {
            res.json(user);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    login,
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    getOrderStatus,
    updateState,
    getUsers,
    getUser
}