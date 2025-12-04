import bcrypt from 'bcrypt';
import User, { IUser } from '../user.model';
import JWT from 'jsonwebtoken';
import InvalidCredentialsError from '../../../utils/errors/invalidCredentials.error';


type CleanUser = Omit<IUser, 'password' | '__v'>;
type Credentials = {
    email: string;
    password: string;
}
type SignInResponse = {
    user: CleanUser;
    token: string;
}

const msgUserNotFound = 'Usuário ou senha incorretos!';
const msgWrongPassword = msgUserNotFound;

function signToken(user: IUser) {
    const JWT_SECRET: string = process.env.JWT_SECRET!;
    return JWT.sign({
        iss: 'TCC',
        sub: user._id,
        iat: new Date().getTime(),
    }, JWT_SECRET);
}

async function signIn(credentials: Credentials) {
    const { email, password } = credentials;
    const user: IUser | null = await User
        .findOne({ email })
        .populate({ path: 'organization', select: 'name' })
        .lean();

    if (!user) throw new InvalidCredentialsError(msgUserNotFound);

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) throw new InvalidCredentialsError(msgWrongPassword);

    const loggedUser: CleanUser = sanitize(user);

    const token = signToken(user);
    const result: SignInResponse = {
        user: loggedUser,
        token,
    };
    return result;
}

function sanitize(user: IUser): CleanUser {
    const { password, __v, ...otherFields } = user;
    return otherFields;
}

export default { signIn };
