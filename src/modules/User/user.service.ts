import bcrypt from "bcrypt";
import User, { IUser } from "./user";
import { DeleteResult, Schema } from "mongoose";
const SALT_ROUNDS = `${process.env.SALT_ROUNDS}`;
type ID = Schema.Types.ObjectId;

interface UpdateUserInterface {
    _id: ID;
    name?: string;
    email?: string;
    password?: string;
    role?:
        "Presidente" | "Diretor(a)" | "Assessor(a)" |
        "Conselheiro(a)" | "Pós-Júnior" | "Guardião" |
        "Trainee" | "Ex-Trainee";
    birthDate?: Date,
    ej?: ID
}

async function save(userData: IUser, ejId: string): Promise<IUser> {
    const { name, email, role, birthDate, password } = userData;
    const ej = new Schema.Types.ObjectId(ejId);

    const user = await User.findOne({ email });
    if (user) throw new Error("Já existe um usuário cadastrado para esse email!");

    const psw = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
        name,
        email,
        birthDate,
        password: psw,
        role,
        ej,
    });

    /**
     * TODO Atentar para esse trecho. O backend jamais deve retornar a senha.
     */
    userData.password = "";
    userData._id = newUser._id;
    return userData;
}

async function findByEj(ejId: ID): Promise<IUser[]> {
    const users = await User.find({ ej: ejId }).select("-password");
    return users;
}

async function remove(userId: ID): Promise<DeleteResult> {
    const removedUser = await User.deleteOne({ _id: userId });
    return removedUser;
}

async function update(userId: ID, data: IUser) {
    if (data.hasOwnProperty("password")) {
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return await User.findOneAndUpdate({ _id: data._id }, data );
}

export default {
    save, findByEj, remove, update,
}