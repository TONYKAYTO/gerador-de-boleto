const plans_models = require('../models/plans_models');


//controller para quando for criado um novo plano
async function planInsert(req, res) {
    const {nomeplano, descricao, velocidade, valor, status, criado_em} = req.body; //trazendo os dados para gerenciar campos nulos
    const {nomeplano, descricao, velocidade, valor, status} = req.body; //trazendo os dados para gerenciar campos nulos

    if(!nomeplano || !descricao || !velocidade || !valor || !status){
        return res.status(400).json({ Msg: 'Erro é necessário que todos os campos estejam preenchidos' });
@@ -51,7 +50,7 @@ async function UpdtPlan(req, res){
}


async function DeleteCustomer(req, res) {
async function DeletePlan(req, res) {
    const id_plano = req.params.id_plano;
    try {
        const result = await plans_models.delPlan(id_plan);
@@ -63,3 +62,10 @@ async function DeleteCustomer(req, res) {



module.exports = {
    planInsert,
    GetPlanName,
    UpdtPlan,
    getAllPlan,
    DeletePlan
}