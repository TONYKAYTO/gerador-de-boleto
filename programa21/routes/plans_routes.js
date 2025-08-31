const express = require('express');
const router = express.Router();
const plans_controller = require('../controllers/plans_controller');

router.post('/', plans_controller.planInsert);
router.get('/', plans_controller.getAllPlan);
router.get('/:id', plans_controller.GetPlanName);
router.put('/:id', plans_controller.UpdtPlan);
router.delete('/:id', plans_controller.DeletePlan);

module.exports = router;