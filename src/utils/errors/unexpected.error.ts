export default class UnexpectedError<E extends Error> extends Error {
    public readonly originalError: Error;
    public readonly timestamp: Date;
    public readonly code?: string;

    constructor(error: E, context?: string, code?: string) {
        const message = context
            ? `${context}: ${error.message}`
            : error.message;
        super(message);

        if (error.name && error.name !== 'Error') {
            this.name = `UnexpectedError<${ error.name }>`;
        } else this.name = 'UnexpectedError';

        this.originalError = error;
        this.timestamp = new Date();
        if (code) this.code = code;
        if (error.stack) this.stack = error.stack;

        Object.assign(this, {
            ...Object.getOwnPropertyDescriptors(error),
        });
    }
}