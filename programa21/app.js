const cors = require('cors');
const Clients_routes = require('./routes/Clients_routes');
const exports_routes = require('./routes/exports_routes');
const plans_controller = require('./routes/plans_routes');

app.use(cors());

 -12,4 +13,6  app.use('/Customer', Clients_routes);

app.use('/', exports_routes);

app.use('/Plans', plans_controller);

module.exports = app;