import CustomError from "./custom.error";

export default class FailedToUpdateResourceError extends CustomError {
    override name = 'FailedToUpdateResourceError';
}
