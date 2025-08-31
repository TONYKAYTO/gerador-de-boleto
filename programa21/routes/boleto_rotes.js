const express = require("express");
const router = express.Router();
const { gerarBoleto } = require("../controllers/boleto_controller");

router.get("/boleto/:id_cliente", gerarBoleto);

module.exports = router;