// controllers/company.controller.js
const Company = require('../models/Company.model');

const createCompany = async (req, res, next) => {
    try {
        const company = new Company(req.body);
        const savedCompany = await company.save();
        res.status(201).json(savedCompany);
    } catch (error) {
        next(error);
    }
};

const getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
};

const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Compañía no encontrada' });
        res.status(200).json(company);
    } catch (error) {
        next(error);
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCompany) return res.status(404).json({ message: 'Compañía no encontrada' });
        res.status(200).json(updatedCompany);
    } catch (error) {
        next(error);
    }
};

const deleteCompany = async (req, res, next) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) return res.status(404).json({ message: 'Compañía no encontrada' });
        res.status(200).json({ message: 'Compañía eliminada' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};