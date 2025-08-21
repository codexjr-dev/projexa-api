import { Schema, model } from "mongoose";
import ej from "../Ej/Ej";
type ID = Schema.Types.ObjectId;
type Tag = "Importante" | "Treinamento" | "Documentação";
type Department =
    "Presidência" |
    "Gente & Gestão" |
    "Projetos" |
    "Qualidade" |
    "Marketing" |
    "Negócios";

interface ILink {
    name: string;
    url: string;
    tags: Tag[];
    ej: ID;
    departments: Department[];
    observations: string;
}

interface LinkOptional {
    name?: string;
    url?: string;
    tags?: Tag[];
    ej?: ID;
    departments?: Department[];
    observations?: string;
}

const LINK_SCHEMA = new Schema<ILink>({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        enum: ["Importante", "Treinamento", "Documentação"],
        required: false,
    },],
    ej: {
        type: Schema.Types.ObjectId,
        ref: ej,
        required: true,
    },
    departments: [{
        type: String,
        enum: [
            "Presidência",
            "Gente & Gestão",
            "Projetos",
            "Qualidade",
            "Marketing",
            "Negócios",
        ],
        required: false,
    },],
    observations: {
        type: String,
        required: false,
    }
}, { timestamps: true });

export default model("Link", LINK_SCHEMA);
export { ILink, LinkOptional }