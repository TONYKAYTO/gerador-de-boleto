const { Boleto } = require("node-boleto");
const db = require("../db"); // conexão mysql

// Configurações do boleto
const CONFIGURACAO_BOLETO = {
  banco: "santander",
  cedente: "GraceNet Provedora",
  cedente_cnpj: "12.345.678/0001-99",
  agencia: "1234",
  codigo_cedente: "1234567",
  carteira: "102"
};

/**
 * Gera um boleto para um cliente específico
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
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

    // Gera um número único para o documento baseado no ID do cliente e timestamp
    const timestamp = Date.now();
    const numeroDocumento = `${id_cliente}${timestamp.toString().slice(-4)}`;
    const nossoNumero = `${id_cliente}${timestamp.toString().slice(-7)}`;
    
    const boleto = new Boleto({
      ...CONFIGURACAO_BOLETO,
      data_emissao: hoje,
      data_vencimento: vencimento,
      valor: plano.valor,
      nosso_numero: nossoNumero,
      numero_documento: numeroDocumento,
      pagador: `${cliente.nome_completo} - CPF: ${cliente.cpf}`
    });

    // Salvar informações do boleto no banco de dados
    try {
      await db.query(
        "INSERT INTO boletos (id_cliente, nosso_numero, numero_documento, valor, data_emissao, data_vencimento) VALUES (?, ?, ?, ?, ?, ?)",
        [id_cliente, boleto.nosso_numero, boleto.numero_documento, plano.valor, hoje, vencimento]
      );
    } catch (error) {
      console.warn("Tabela de boletos pode não existir:", error.message);
      // Continua mesmo se não conseguir salvar no banco
    }

    boleto.renderHTML((html) => {
      res.send(html);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar boleto" });
  }
}

/**
 * Lista todos os boletos de um cliente específico
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
async function listarBoletos(req, res) {
  try {
    const { id_cliente } = req.params;

    // Verifica se o cliente existe
    const [clienteRows] = await db.query("SELECT * FROM clientes WHERE id_cliente = ?", [id_cliente]);
    if (clienteRows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    // Tenta buscar os boletos do cliente
    try {
      const [boletosRows] = await db.query(
        "SELECT * FROM boletos WHERE id_cliente = ? ORDER BY data_emissao DESC", 
        [id_cliente]
      );
      
      return res.status(200).json(boletosRows);
    } catch (error) {
      // Se a tabela não existir, retorna array vazio
      console.warn("Erro ao buscar boletos:", error.message);
      return res.status(200).json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar boletos" });
  }
}

/**
 * Gera um boleto em formato PDF para um cliente específico
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
async function gerarBoletoPDF(req, res) {
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

    // Gera um número único para o documento baseado no ID do cliente e timestamp
    const timestamp = Date.now();
    const numeroDocumento = `${id_cliente}${timestamp.toString().slice(-4)}`;
    const nossoNumero = `${id_cliente}${timestamp.toString().slice(-7)}`;
    
    const boleto = new Boleto({
      ...CONFIGURACAO_BOLETO,
      data_emissao: hoje,
      data_vencimento: vencimento,
      valor: plano.valor,
      nosso_numero: nossoNumero,
      numero_documento: numeroDocumento,
      pagador: `${cliente.nome_completo} - CPF: ${cliente.cpf}`
    });

    // Salvar informações do boleto no banco de dados
    try {
      await db.query(
        "INSERT INTO boletos (id_cliente, nosso_numero, numero_documento, valor, data_emissao, data_vencimento) VALUES (?, ?, ?, ?, ?, ?)",
        [id_cliente, boleto.nosso_numero, boleto.numero_documento, plano.valor, hoje, vencimento]
      );
    } catch (error) {
      console.warn("Tabela de boletos pode não existir:", error.message);
      // Continua mesmo se não conseguir salvar no banco
    }

    // Gera o PDF e envia como download
    boleto.renderPDF((err, pdf) => {
      if (err) {
        console.error("Erro ao gerar PDF:", err);
        return res.status(500).json({ error: "Erro ao gerar PDF do boleto" });
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=boleto-${cliente.nome_completo.replace(/\s+/g, '-')}-${vencimento.toISOString().split('T')[0]}.pdf`);
      res.send(pdf);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar boleto PDF" });
  }
}

module.exports = { gerarBoleto, listarBoletos, gerarBoletoPDF };
