import { Schema, model } from 'mongoose';

interface IOrganization extends MongooseObject, HasTimeStamps {
    name: string;
    departments?: string[];
    skills?: string[];
}

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
}, { timestamps: true });

export default model('Organization', organizationSchema, 'organizations');
export { IOrganization };
