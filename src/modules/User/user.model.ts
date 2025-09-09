import { Schema, model } from "mongoose";
import organization from "../organization/organization.model";

interface IUser {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role:
        "Presidente" | "Diretor(a)" | "Assessor(a)" |
        "Conselheiro(a)" | "Pós-Júnior" | "Guardião" |
        "Trainee" | "Ex-Trainee";
    birthDate: Date;
    organization: Schema.Types.ObjectId;
    __v: number;
}

interface UserParameters {
    _id?: Schema.Types.ObjectId;
    name?: string;
    email?: string;
    password?: string;
    role?:
        "Presidente" | "Diretor(a)" | "Assessor(a)" |
        "Conselheiro(a)" | "Pós-Júnior" | "Guardião" |
        "Trainee" | "Ex-Trainee";
    birthDate?: Date;
    organization?: Schema.Types.ObjectId;
    __v?: number;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [
            "Presidente", "Diretor(a)", "Assessor(a)",
            "Conselheiro(a)","Pós-Júnior", "Guardiã(o)",
            "Trainee", "Ex-Trainee"
        ],
        required: true,
        default: "Assessor(a)",
    },
    birthDate: {
        type: Date,
        required: true,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: organization,
        required: true,
    },
},
{ timestamps: true, });

export default model("User", userSchema);
export { IUser, UserParameters };
