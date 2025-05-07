const Project = require('../models/Project.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');
const { uploadFile } = require('../config/cloudinary.config');
const { patch } = require('../routes/auction.routes');


module.exports.createProject = (req, res, next) => {
    // Extraemos el body del proyecto
    const projectData = { ...req.body };

    // Si se envía un archivo (por ejemplo, imagen del proyecto), se sube a Cloudinary.
    if (req.file) {
        uploadFile(req.file.buffer, 'projects')
            .then(result => {
                // Asigna la URL del archivo subido al campo image del proyecto (o el nombre de campo que decidas)
                projectData.image = result.secure_url;
                return Project.create(projectData);
            })
            .then(project => res.status(HttpStatus.StatusCodes.CREATED).json(project))
            .catch(err => console.log(err));
    } else {
        Project.create(projectData)
            .then(project => res.status(HttpStatus.StatusCodes.CREATED).json(project))
            .catch(err => console.log(err));
    }
};

module.exports.getProjects = (req, res, next) => {
    Project.find()
        .populate({
            path: 'auction',
            select: ['launched','closed']
             // Solo populamos el campo 'launched'
        })
        .then(projects => {
            res.status(HttpStatus.StatusCodes.OK).json(projects);
        })
        .catch(next);
};

module.exports.getProject = (req, res, next) => {
    const { id } = req.params;
    Project.findById(id)
    .populate({
        path: 'auction',
        select: 'durationDays'
    })
    .populate({
        path:'standardizedProject',
        select:['name', 'code']
    })
        .then(project => {
            if (!project) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(project);
        })
        .catch(next);
};
module.exports.updateProject = (req, res, next) => {
    const { id } = req.params;
    const projectData = { ...req.body };

    // Si se envía un archivo nuevo, se sube a Cloudinary
    if (req.file) {
        uploadFile(req.file.buffer, 'projects')
            .then(result => {
                projectData.image = result.secure_url;
                return Project.findByIdAndUpdate(id, projectData, { new: true });
            })
            .then(project => {
                if (!project) {
                    throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Proyecto no encontrado');
                }
                res.status(HttpStatus.StatusCodes.OK).json(project);
            })
            .catch(next);
    } else {
        Project.findByIdAndUpdate(id, projectData, { new: true })
            .then(project => {
                if (!project) {
                    throw createError(HttpStatus.StatusCodes.NOT_FOUND, 'Proyecto no encontrado');
                }
                res.status(HttpStatus.StatusCodes.OK).json(project);
            })
            .catch(next);
    }
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

module.exports.getProjectForClient = (req, res, next) => {
    const { id } = req.params;
    Project.findById(id)
        .select('-savingsOwner')
        .populate({
            path:'auction',
            select:['closed', 'minBid', 'bids', 'minBidIncrement'],
            populate: {
                path: 'bids',
                select: ['_id', 'bidPrice']
            }
        })
        .populate({
            path:'standardizedProject',
            select:['name', 'code']
        })
        
        .then(project => {
            if (!project) {
                return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Proyecto no encontrado' });
            }
            res.status(HttpStatus.StatusCodes.OK).json(project);
        })
        .catch(next);
};



module.exports.getProjectsForClient = (req, res, next) => {
    Project.find()
        .select('-savingsOwner')
        .populate({
            path:'auction',
            select:'closed'
        }) // Excluye el campo savingsOwner
        .then(projects => {
            res.status(HttpStatus.StatusCodes.OK).json(projects);
        })
        .catch(next);
};
