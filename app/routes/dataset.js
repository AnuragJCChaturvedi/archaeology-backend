const express = require('express');
const router = express.Router();
const datasetCtrl = require('../controllers/dataset');
const helpers = require('../helpers/user');

router.get('/all', async (req, res, next) => {
  const data = await datasetCtrl.getAllDataset();
  res.json({
    code: 200,
    payload: { success: true, data },
  });
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const data = await datasetCtrl.getDatasetById({ id });
  res.json({
    code: 200,
    payload: { success: true, data },
  });
});

module.exports = router;
