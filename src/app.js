const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({origin: "*"}), bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/clients');

app.use('/admin', adminRoutes);
app.use('/clientes', clientRoutes);

module.exports = app;