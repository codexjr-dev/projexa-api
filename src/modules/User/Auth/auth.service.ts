import bcrypt from "bcrypt";
import User, { IUser, UserOptional } from "../user.model";
import JWT from "jsonwebtoken";
import { Request } from "express";
const JWT_SECRET = `${process.env.JWT_SECRET}`;

function signToken(user: UserOptional) {
    return JWT.sign({
        iss: "TCC",
        sub: user,
        iat: new Date().getTime(),
    }, JWT_SECRET);
}

async function signIn(data: Request["params"]) {
    const { email, password } = data;
    const user: IUser | null = await User
        .findOne({ email })
        .populate({ path: "ej", select: "name" });

    if (!user) return { erro: "Usuário ou senha incorretos" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { erro: "Usuário ou senha incorretos" };

    const result = user as UserOptional;
    delete result.password;

    const token = signToken(user);
    return { user: result, token };
}

export default { signIn };
