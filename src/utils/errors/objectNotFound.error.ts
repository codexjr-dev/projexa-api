import CustomError from "./custom.error";

export default class ObjectNotFoundError extends CustomError {
    override name = 'ObjectNotFoundError';
}
