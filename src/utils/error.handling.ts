import UnexpectedError from './errors/unexpected.error';

type Success<T> = {
    data: T;
    error: null;
};

type Failure<E> = {
    data: null;
    error: E;
};

type Result<T, E extends Error> = Success<T> | Failure<E>;

function fail<E extends new (...args: any[]) => Error> (
    ErrorType: E,
    message: string
): Failure<InstanceType<E>> {
    return {
        data: null,
        error: new ErrorType(message) as InstanceType<E>
    };
}

function succeed<T>(data: T): Success<T> {
    return { data, error: null };
}

async function catchErrors<T, E extends new (message?: string) => Error>(
    promise: Promise<T>,
    expectedErrors: E[] = []
): Promise<Result<T, InstanceType<E> | UnexpectedError<InstanceType<E>>>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error: any) {
        if (expectedErrors.length === 0) return { data: null, error };
        if (expectedErrors.some(e => error instanceof e)) {
            return { data: null, error };
        }
        return { data: null, error: new UnexpectedError(error) };
    }
}

export { catchErrors, fail, succeed, Result };