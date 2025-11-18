import { Schema, model } from "mongoose";
type ID = Schema.Types.ObjectId;

interface IOrganization {
    _id: ID;
    name: string;
    departments: string[];
    skills: string[];
    balance: number;
    financialEvents: financialEvent[];
    recurrentEvents: recurrentEvent[];
}

interface financialEvent {
    description: string;
    date: Date;
    value: number;
    author: string;
}

interface recurrentEvent {
    description: string;
    startDate: Date;
    endDate: Date;
    frequency: "diario" | "semanal" | "mensal" | "anual";
    value: number;
    author: string;
    exceptions: Date[];
}

interface OrganizationParameters extends Partial<IOrganization> { };

const organizationSchema = new Schema<IOrganization>({
    name: {
        type: String,
        required: true,
    },
    departments: [{
        type: String,
        required: false,
    }],
    skills: [{
        type: String,
        required: false,
    }],
    balance: {
        type: Number,
        required: true,
    },
    financialEvents: [{
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    }],
    recurrentEvents: [{
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        frequency: {
            type: String,
            enum: ["diario", "semanal", "mensal", "anual"],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        exceptions: [{
            type: Date,
            required: false,
        }],
    }],
}, { timestamps: true });

export default model("Organization", organizationSchema);
export { IOrganization, OrganizationParameters };
