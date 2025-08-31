const express = require('express');
const cors = require('cors');
const Clients_routes = require('./routes/Clients_routes');
const exports_routes = require('./routes/exports_routes');
const plans_controller = require('./routes/plans_routes');
const boleto_routes = require('./routes/boleto_rotes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/Customer', Clients_routes);

app.use('/', exports_routes);

app.use('/Plans', plans_controller);
app.use('/Boleto', boleto_routes);

module.exports = app;