import { Schema, model } from "mongoose";
import member from "../Member/Member";
type ID = Schema.Types.ObjectId;
type Buffer = Schema.Types.Buffer;

interface INews {
    member: ID;
    project: ID;
    description: string;
    image?: Buffer;
    updateLink?: string;
}

interface NewsOptional {
    member?: ID;
    project?: ID;
    description?: string;
    image?: Buffer;
    updateLink?: string;
}

const NEWS_SCHEMA = new Schema<INews>({
    member: {
        type: Schema.Types.ObjectId,
        ref: member,
        required: true,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    image: {
        type: Schema.Types.Buffer,
        required: false,
    },
    updateLink: {
        type: String,
        required: false,
    },
}, { timestamps: true });

export default model("News", NEWS_SCHEMA);
export { INews, NewsOptional };