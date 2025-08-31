const express = require("express");
const router = express.Router();
const { gerarBoleto, listarBoletos, gerarBoletoPDF } = require("../controllers/boleto_controllers");

// Rota para gerar boleto para um cliente específico
router.get("/boleto/:id_cliente", gerarBoleto);

// Rota para listar todos os boletos de um cliente
router.get("/boletos/:id_cliente", listarBoletos);

// Rota para gerar boleto em PDF para um cliente específico
router.get("/boleto-pdf/:id_cliente", gerarBoletoPDF);

module.exports = router;