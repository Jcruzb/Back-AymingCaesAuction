// routes/company.routes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Rutas CRUD para compañías
router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;