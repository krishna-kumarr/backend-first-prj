module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        })
    }

    if (process.env.NODE_ENV === "production") {
        let message = err.message;
        let error = new Error(message)

        if (err.name === "ValidationError") {
            message = Object.values(err.errors).map(value => value.message)
            error = new Error(message)
        }

        if (err.name === "CastError") {
            message = `Resource Not Found: ${err.path}`;
            error = new Error(message)
        }

        if(err.code === 11000){
            message = `Email ${Object.values(err.keyValue)} already exist`;
            error = new Error(message);
        }

        if(err.name === 'JSONWebTokenError'){
            message =  `JSON web token is invalid. try again`;
            error = new Error(message);
        }

        if(err.name === 'TokenExpiredError'){
            message =  `JSON web token is expired. try again`;
            error = new Error(message);
        }

         
        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }
}