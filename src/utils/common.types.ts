import { Schema } from 'mongoose';

export type ID = Schema.Types.ObjectId | string;

export type TimeStamps = {
    createdAt: Date;
    updatedAt: Date;
}

export type MongooseObject = {
    _id: Schema.Types.ObjectId;
    __v: number;
}