import CustomError from "./custom.error";

export default class MalformattedTokenError extends CustomError {
    override name = 'MalformattedTokenError';
}
