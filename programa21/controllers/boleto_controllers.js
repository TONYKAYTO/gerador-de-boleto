const { Boleto } = require("node-boleto");
const db = require("../db"); // conexão mysql

async function gerarBoleto(req, res) {
  try {
    const { id_cliente } = req.params;

    const [clienteRows] = await db.query("SELECT * FROM clientes WHERE id_cliente = ?", [id_cliente]);
    if (clienteRows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    const cliente = clienteRows[0];

    const [planoRows] = await db.query("SELECT * FROM planos WHERE nomeplano = ?", [cliente.plano]);
    if (planoRows.length === 0) {
      return res.status(404).json({ error: "Plano não encontrado" });
    }
    const plano = planoRows[0];

    const hoje = new Date();
    const vencimento = new Date(hoje.getFullYear(), hoje.getMonth(), parseInt(cliente.vencimento));

    const boleto = new Boleto({
      banco: "santander",
      data_emissao: hoje,
      data_vencimento: vencimento,
      valor: plano.valor,
      nosso_numero: "1234567",
      numero_documento: "1234",
      cedente: "GraceNet Provedora",
      cedente_cnpj: "12.345.678/0001-99",
      agencia: "1234",
      codigo_cedente: "1234567",
      carteira: "102",
      pagador: `${cliente.nome_completo} - CPF: ${cliente.cpf}`
    });

    boleto.renderHTML((html) => {
      res.send(html);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar boleto" });
  }
}

module.exports = { gerarBoleto };
