import CustomError from "./custom.error";

export default class InvalidTokenError extends CustomError {
    override name = 'InvalidTokenError';
}
