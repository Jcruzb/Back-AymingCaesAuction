const StandardProject = require('../models/StandarProject.model')
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.createStandardProject = (req, res, next) => {
    StandardProject.create(req.body)
        .then(standarProject => {
            res.status(HttpStatus.StatusCodes.CREATED).json(standarProject);
        })
        .catch(next);
};

module.exports.getStandardProjects = (req, res, next) => {
    StandardProject.find()
        .then(standarProject => {
            res.status(HttpStatus.StatusCodes.OK).json(standarProject);
        })
        .catch(next);
};

module.exports.getStandardProject = (req, res, next) => {
    const { id } = req.params;
    StandardProject.findById(id)
        .then(standarProject => {
            if (!standarProject) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(standarProject);
        })
        .catch(next);
};

module.exports.updateStandardProject = (req, res, next) => {
    const { id } = req.params;
    StandardProject.findByIdAndUpdate(id, req.body, { new: true })
        .then(standarProject => {
            if (!standarProject) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(standarProject);
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error updating Standar project')));
};

module.exports.deleteStandardProject = (req, res, next) => {
    const { id } = req.params;
    StandardProject.findByIdAndDelete(id)
        .then(standarProject => {
            if (!standarProject) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Standar project deleted successfully' });
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error deleting standar project')));
};
