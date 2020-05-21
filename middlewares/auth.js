const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/errorHandler');

function Authenticate(req, res, next) {
    console.log(req.headers.hasOwnProperty('token'));
    console.log(req.headers);
    if (req.headers.hasOwnProperty('token')) {
        const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        console.log(decode, ' decode');
        req.loggedUser = decode;
        next();
    } else {
        next(new ErrorHandler(401, 'unauthorized'));
    }
}

module.exports = {
    Authenticate,
};
