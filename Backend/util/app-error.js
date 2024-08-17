import HttpStatusCodes from "../constants/http-status-code.js";

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        // Ensure statusCode is a valid HTTP status code constant
        if (!Object.values(HttpStatusCodes).includes(statusCode)) {
            throw new Error('Invalid status code');
        }

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
        this.isOperational = true;

        // Capture stack trace excluding constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
