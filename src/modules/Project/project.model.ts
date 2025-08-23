import { Schema, model } from "mongoose";
import ej from "../Ej/Ej";
import member from "../Member/Member";
type ID = Schema.Types.ObjectId;
type Tag =
    ( "Backend" | "Frontend" | "Mobile" |
    "Wordpress" | "Assessoria" | "Treinamento");

interface ICustomer {
    email?: string;
    contact?: string;
    name?: string;
}

interface IProject {
    _id: ID;
    name: string;
    description: string;
    tags: Tag[];
    ej: ID;
    team: ID[];
    startDate?: Date;
    finishDate?: Date;
    contractLink?: string;
    customer: ICustomer;
    news: ID[];
}

interface ProjectParameters {
    _id: ID;
    name?: string;
    description?: string;
    tags?: Tag[];
    ej?: ID;
    team?: ID[];
    startDate?: Date;
    finishDate?: Date;
    contractLink?: string;
    customer?: ICustomer;
    news?: ID[];
}

const customerSchema = new Schema<ICustomer>({
    email: String,
    contact: String,
    name: String,
});

const projectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        enum: [
            "Backend",
            "Frontend",
            "Mobile",
            "Wordpress",
            "Assessoria",
            "Treinamento",
        ],
        required: false,
    }],
    ej: {
        type: Schema.Types.ObjectId,
        ref: ej,
        required: true,
    },
    team: [
        {
            type: Schema.Types.ObjectId,
            ref: member,
            required: false,
        },
    ],
    startDate: {
        type: Date,
        required: true,
    },
    finishDate: {
        type: Date,
        required: true,
    },
    contractLink: {
        type: String,
        required: false,
    },
    customer: customerSchema,
    news: [{
        type: Schema.Types.ObjectId,
        ref: "News",
        required: false,
        default: [],
    }],
}, { timestamps: true });

export default model("Project", projectSchema);
export { IProject, ProjectParameters, ICustomer };
