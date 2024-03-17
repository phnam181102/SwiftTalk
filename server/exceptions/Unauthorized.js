import ErrorHandler from './ErrorHandler.js';

export class UnauthorizedException extends ErrorHandler {
    constructor(message, errors) {
        super(message, 401, errors);
    }
}
