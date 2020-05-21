const { ErrorHandler } = require('../helpers/errorHandler');

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        next(new ErrorHandler(400, error.message));
    }
};

module.exports = validate;
