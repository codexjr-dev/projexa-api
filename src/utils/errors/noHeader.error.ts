import CustomError from "./custom.error";

export default class NoHeaderError extends CustomError {
    override name = 'NoHeaderError';
}
