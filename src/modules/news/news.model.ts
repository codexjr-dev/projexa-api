import { Schema, model } from "mongoose";
import User from "../user/user.model";
import { ID, MongooseObject, TimeStamps } from "../../utils/common.types";
type Buffer = Schema.Types.Buffer;

interface INews extends MongooseObject, TimeStamps {
    user: ID;
    project: ID;
    description: string;
    image?: Buffer;
    updateLink?: string;
}

interface NewsParameters extends Partial<INews> { };

const newsSchema = new Schema<INews>({
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
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

export default model("News", newsSchema);
export { INews, NewsParameters };
