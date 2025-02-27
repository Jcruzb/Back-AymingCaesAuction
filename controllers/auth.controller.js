const User = require('../models/User.model');
const HttpStatus = require('http-status-codes');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res, next) => {
    const loginError = createError(HttpStatus.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    const { email, password } = req.body;
  
    if (!email || !password) {
        return next(loginError);
    }
  
    // Check email
    User.findOne({ email })
        .then(user => {
            if (!user) return next(loginError);

            // Check password
            return user.checkPassword(password)
                .then(match => {
                    if (!match) return next(loginError);

                    // Generate JWT token
                    const token = jwt.sign(
                        { id: user.id, role: user.role },
                        process.env.JWT_SECRET || 'SuperSecret',
                        { expiresIn: '1h' }
                    );

                    res.json({ accessToken: token });
                });
        })
        .catch(next);
};