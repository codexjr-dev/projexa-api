import CustomError from "./custom.error";

export default class FailedToCreateResourceError extends CustomError {
    override name = 'FailedToCreateResourceError';
}
