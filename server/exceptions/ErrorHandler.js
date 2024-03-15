class ErrorHandler extends Error {
    statusCode;

    constructor(messsage, statusCode) {
        super(messsage);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
