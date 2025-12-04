import CustomError from "./custom.error";

export default class UnexpectedError<E extends Error> extends CustomError {
    public readonly originalError: Error;
    public readonly timestamp: Date;
    public override readonly code?: string;

    constructor(error: E, context?: string, code: string = '') {
        const message = context
            ? `${context}: ${error.message}`
            : error.message;
        super(message);

        if (error.name && error.name !== 'Error') {
            this.name = `UnexpectedError<${ error.name }>`;
        } else this.name = 'UnexpectedError';

        this.originalError = error;
        this.timestamp = new Date();
        this.code = code;
        if (error.stack) this.stack = error.stack;

        Object.assign(this, {
            ...Object.getOwnPropertyDescriptors(error),
        });
    }
}
