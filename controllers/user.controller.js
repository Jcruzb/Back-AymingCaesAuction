const User = require('../models/User.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

module.exports.register = (req, res, next) => {
    User.create(req.body)
        .then(user => {
            res.status(HttpStatus.StatusCodes.CREATED).json(user);
        })
        .catch(next);
};

module.exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(HttpStatus.StatusCodes.OK).json(users);
        })
        .catch(next);
};

module.exports.getUser = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then(user => {
            if (!user) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(user);
        })
        .catch(next);
};

module.exports.editUser = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body, { new: true })
        .then(user => {
            if (!user) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json(user);
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error updating user')));
};

module.exports.deleteUser = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then(user => {
            if (!user) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'User deleted successfully' });
        })
        .catch(() => next(createError(HttpStatus.StatusCodes.CONFLICT, 'Error deleting user')));
};

module.exports.activate = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { active: true }, { new: true })
        .then(user => {
            if (!user) return res.status(HttpStatus.StatusCodes.NOT_FOUND).send();
            res.redirect(`${process.env.APP_FRONTEND}/login`);
        })
        .catch(next);
};

module.exports.me = (req, res, next) => {
    console.log('entra en me')
    User.findById(req.currentUser.id)
        .then(user => {
            if (!user) return next(createError(HttpStatus.StatusCodes.NOT_FOUND, "User not found"));
            res.json(user);
        })
        .catch(next);
};

module.exports.getUsersNameAndEmail = (req, res, next) => {
    User.find({}, { name: 1, email: 1 })
        .then(users => {
            res.status(HttpStatus.StatusCodes.OK).json(users);
        })
        .catch(next);
};