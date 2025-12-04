import { Schema } from 'mongoose';
import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction
} from 'express';

declare global {
    type ID = Schema.Types.ObjectId | string;

    interface HasTimeStamps {
        createdAt: Date;
        updatedAt: Date;
    }
    interface MongooseObject {
        _id: Schema.Types.ObjectId;
        __v: number;
    }

    type Success<T> = {
        data: T;
        error: null;
    }
    type Failure<E> = {
        data: null;
        error: E;
    }
    type Result<T, E extends Error> = Success<T> | Failure<E>;

    type ERequest = ExpressRequest;
    type EResponse = ExpressResponse;
    type Next = NextFunction;
}