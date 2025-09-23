import { Schema, model } from "mongoose";
type ID = Schema.Types.ObjectId;

interface IOrganization {
    _id: ID;
    name: string;
    departments: string[];
    skills: string[];
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
}, { timestamps: true });

export default model("Organization", organizationSchema);
export { IOrganization, OrganizationParameters };
