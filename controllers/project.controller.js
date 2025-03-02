const Project = require('../models/Project.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.createProject = (req, res, next) => {
    Project.create(req.body)
        .then(project => {
            res.status(HttpStatus.StatusCodes.CREATED).json(project);
        })
        .catch(next);
};

module.exports.getProjects = (req, res, next) => {
    console.log('Entraaaa')
    Project.find()
        .then(projects => {
            res.status(HttpStatus.StatusCodes.OK).json(projects);
        })
        .catch(next);
};

module.exports.getProject = (req, res, next) => {
    const { id } = req.params;
    Project.findById(id)
        .then(project => {
            if (!project) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(project);
        })
        .catch(next);
};

module.exports.updateProject = (req, res, next) => {
    const { id } = req.params;
    Project.findByIdAndUpdate(id, req.body, { new: true })
        .then(project => {
            if (!project) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(project);
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error updating project')));
};

module.exports.deleteProject = (req, res, next) => {
    const { id } = req.params;
    Project.findByIdAndDelete(id)
        .then(project => {
            if (!project) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Project deleted successfully' });
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error deleting project')));
};