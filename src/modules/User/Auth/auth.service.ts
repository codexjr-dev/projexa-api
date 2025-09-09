import bcrypt from "bcrypt";
import User, { IUser, UserParameters } from "../user.model";
import JWT from "jsonwebtoken";
import { Request } from "express";
const JWT_SECRET = `${process.env.JWT_SECRET}`;

function signToken(user: UserParameters) {
    return JWT.sign({
        iss: "TCC",
        sub: user,
        iat: new Date().getTime(),
    }, JWT_SECRET);
}

async function signIn(request: Request) {
    const { email, password } = request.params;
    const user: IUser | null = await User
        .findOne({ email })
        .populate({ path: "organization", select: "name" });

    if (!user) return { erro: "Usuário ou senha incorretos" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { error: "Usuário ou senha incorretos" };

    const result = user as UserParameters;
    delete result.password;

    const token = signToken(user);
    return { user: result, token };
}

export default { signIn };
