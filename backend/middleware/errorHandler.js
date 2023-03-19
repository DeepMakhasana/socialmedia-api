const errorHandler = (err, req, res, next) => {
    err.message = err.message || "Internal Server error.";
    err.statusCode = err.statusCode || 500;

    if (err.statusCode === 11000) {
        return res.status(400).json({
            success: false,
            message: "This is already exist.",
        });
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}

module.exports = errorHandler;