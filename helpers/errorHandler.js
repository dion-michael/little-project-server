function handleError(err, req, res, next) {
    console.log(JSON.stringify(err, null, 2), 'from error handler');
    let { statusCode, message } = err;
    if (!statusCode) statusCode = 500;
    if (!message) message = 'internal server error';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
}

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = {
    ErrorHandler,
    handleError,
};
