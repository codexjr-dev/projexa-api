import CustomError from "./custom.error";

export default class InvalidCredentialsError extends CustomError {
    override name = 'InvalidCredentialsError';
}
