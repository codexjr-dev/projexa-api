import CustomError from "./custom.error";

export default class UnauthorizedError extends CustomError {
    override name = 'UnauthorizedError';
}
