require('dotenv/config');
const bcrypt = require('bcrypt');
const database = require('../dbConnection');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//GENERAL FUNCTIONS
async function login(req, res) {
    const key = process.env.SECRET_KEY;
    const statement = process.env.GET_USER_BY_USERNAME_EMAIL_COMPLETE;
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

async function postUser(req, res) {
    let newUser = req.body;
    const statement = process.env.LOAD_USER;

    try {
        newUser.contrasena = await bcrypt.hash(newUser.contrasena, 10);
        await database.query(statement, { replacements: newUser });
        res.status(201).send('Usuario creado y registrado en la base de datos.');
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

//PRODUCTS FUNCTIONS 
async function getFavorites (req, res) {
    const id = req.id;
    const statement = process.env.GET_FAVORITES;
    try {
        let favorites = await database.query(statement, {replacements: [id]});
        favorites = favorites [0];
        if (favorites.length === 0) {
            res.send('Aún no hay favoritos.');
        } else {
            res.json(favorites);
        }
    } catch (error) {
        console.log(error);
    }
}

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
                
            }
            res.status(200).send(orderDetail);
        } else {
            res.status(404).send('No hay ningún pedido asociado a ese id.');
        }
    } catch (error) {
        res.status(500).send();
    }
}

function setSubtotal(idProduct, units) {
    return new Promise(async (resolve, reject) => {
        let statement = process.env.GET_PRICE;
        await database.query(statement, { replacements: [idProduct] })
            .then((data) => {
                data = data[0];
                data = JSON.parse(JSON.stringify(data[0]));
                let subtotal = data.precio * units;
                resolve(subtotal)
            })
            .catch((error) => {
                console.log(error);
            })
    })
}

function setDescription(idProduct, units) {
    return new Promise(async (resolve, reject) => {
        let statement = process.env.GET_DESCRIPTION;
        await database.query(statement, { replacements: [idProduct] })
            .then((data) => {
                data = data[0];
                data = JSON.parse(JSON.stringify(data[0]));
                let description = `${units} ${data.descripcion}`;
                resolve(description)
            })
            .catch((error) => {
                console.log(error);
            })
    })
}

async function postOrderDetail(idOrder, detail) {
    return new Promise((resolve, reject) => {
        let total = 0;
        let description = '';
        const statement = process.env.LOAD_ORDER_DETAIL;
        detail.forEach(async element => {
            let s; 
            let d;
            await setSubtotal(element.id_producto, element.q_unidades)
            .then((subtotal)=> {
                total += subtotal;
                // sub = subtotal;
            });
            await setDescription(element.id_producto, element.q_unidades)
            .then((desc) => {
                description += `${desc} `;
                // det = desc;
            });
            await database.query(statement, {
                replacements: [
                    idOrder,
                    element.id_producto,
                    await setDescription(element.id_producto, element.q_unidades),
                    element.q_unidades,
                    await setSubtotal(element.id_producto, element.q_unidades)
                ]
            })
            .then((nuevo) => {
                resolve([total, description]);
            })
            .catch((error) => {
                console.log(error);
            }) 
        });
    })
}
async function postOrder(req, res) {
    const data = req.body;
    console.log('Esto es detalle: ', data.detalle);
    let hour = moment().format("YYYY-MM-DD HH:mm:ss");
    const statement = process.env.LOAD_ORDER;
    try {
        await database.query(statement, {
            replacements: [
                data.id_usuario,
                1,
                hour,
                data.id_forma_pago
            ]
        })
            .then(async (loaded) => {
                let id = loaded[0];
                await postOrderDetail(id, data.detalle)
                    .then(async (detail) => {
                        const statement = process.env.UPDATE_ORDER;
                        detail[0] = parseFloat(detail[0]).toFixed(2);
                        await database.query(statement, { replacements: [detail[1], detail[0], id] })
                        res.status(201).send('Pedido realizado.');
                    })
            })
    } catch (error) {
        res.status(500).send('No fue posible realizar el pedido.');
    }
}

module.exports = {
    login,
    postUser,
    getFavorites,
    getProducts,
    getOrderStatus,
    postOrder
}