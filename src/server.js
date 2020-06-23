require('dotenv/config');
const server = require('./app');
const database = require('./dbConnection');

server.listen(3000, () => {
    database.authenticate()
        .then( () => {
            console.log('The connection with delilah was succesful.');
        })
        .catch((error) => {
            console.log('The connection with delilah was not succesful.', error);
        })
    console.log('Server listen in port 3000...Conection OK!');
});