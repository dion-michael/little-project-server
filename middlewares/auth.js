const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/errorHandler');
const UserDAO = require('../controllers/user/data_access');

function Authenticate(req, res, next) {
    if (req.headers.hasOwnProperty('token')) {
        const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        req.loggedUser = decode;
        next();
    } else {
        next(new ErrorHandler(401, 'not logged in'));
    }
}

function Authorize(permission) {
    return async (req, res, next) => {
        const { computed_permissions } = await UserDAO.getComputedPermissions(
            req.loggedUser.id,
        );
        if (computed_permissions[permission]) {
            next();
        } else {
            next(new ErrorHandler(401, 'unauthorized'));
        }
    };
}

function IsNotYourOwnData(req, res, next) {
    if (req.params.user_id === req.loggedUser.id) {
        next(new ErrorHandler(403, 'forbidden'));
    }
    next();
}

module.exports = {
    Authenticate,
    Authorize,
    IsNotYourOwnData,
};
