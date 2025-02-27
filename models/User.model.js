const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const validator =require('validator')
const ROLE = ['administrador', 'usuario'];

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Se requiere un nombre'],
        trim: true,
        minLength: [3, 'Mínimo de caracteres 3'],
        maxLength: [50, 'Máximo de caracteres 50']
    },
    email: {
        type: String,
        required: [true, 'Se requiere un email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Formato de email invalido'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Se requiere una contraseña'],
        minLength: [8, 'La contraseña debe tener mínimo 8 caracteres'],
        trim: true
    },
    role: {
        type: String,
        enum: ROLE,
        required: true,
        default: 'usuario'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret.password;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR)
            .then(salt => bcrypt.hash(user.password, salt))
            .then(hash => {
                user.password = hash;
                next();
            })
            .catch(error => next(error));
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
}

module.exports = mongoose.model('User', userSchema);