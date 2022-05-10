// Error handler for methods not allowed on endpoints. 
function methodNotAllowed(req, _res, next) {
    next({
        status: 405,
        message: `${req.method} not allowed for ${req.originalUrl}`
    });
};

module.exports = methodNotAllowed;