import JWT, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import Users, { CleanUser, IUser } from '../../modules/user/user.model';
import { fail, succeed, catchErrors } from '../../utils/error.handling';
import {
    InvalidTokenError,
    MalformattedTokenError,
    NoHeaderError,
    ObjectNotFoundError,
    UnauthorizedError,
    UnexpectedError,
} from '../../utils/errors/errors';

abstract class Authorization {
    request: ERequest;
    response: EResponse;
    next: Next;

    readonly bearerRegEx = /^Bearer$/i;
    readonly leadershipRoles = ['Presidente', 'Diretor(a)', 'Guardiã(o)'];
    readonly bannedRoles = ['Ex-Trainee'];

    constructor(request: ERequest, response: EResponse, next: Next) {
        this.request = request;
        this.response = response;
        this.next = next;
    }

    headerExists(): boolean {
        return !!this.request.headers.authorization;
    }

    extractToken(): Result<string, Error> {
        if (!this.headerExists()) {
            return fail(NoHeaderError, 'Requisição sem token');
        }

        const parts = this.request.headers.authorization!.split(' ');
        const isCorrectLength = parts.length === 2;
        const matchSyntax = parts[0].match(this.bearerRegEx);

        if (!isCorrectLength || !matchSyntax) {
            return fail(MalformattedTokenError, 'Token mal formatado');
        }

        return succeed(parts[1]);
    }

    verifyToken(
        token: string,
        secret: string
    ): Promise<Result<JwtPayload, Error>> {
        return new Promise((resolve, reject) => {
            JWT.verify(token, secret, (
                error: VerifyErrors | null,
                decoded: object | string | undefined
            ) => {
                if (error || !decoded) {
                    resolve( fail(InvalidTokenError, 'Token inválido') );
                } else resolve( succeed(decoded as JwtPayload) );
            });
        });
    }

    async getUserFromToken(): Promise<Result<IUser, Error>> {
        const JWT_SECRET = process.env.JWT_SECRET!;

        const tokenResult = this.extractToken();
        if (tokenResult.error) return tokenResult;

        const decodedResult = await this
            .verifyToken(tokenResult.data, JWT_SECRET);
        if (decodedResult.error) return decodedResult;

        const decoded = decodedResult.data;
        if (!decoded.sub) return fail(InvalidTokenError, 'Token inválido');

        const findUser = await catchErrors( Users
            .findOne({ _id: decoded.sub })
            .populate({ path: 'organization', select: 'name' })
            .lean());
        if (findUser.error) return fail(UnexpectedError, findUser.error.message);

        const user = findUser.data;
        if (!user) return fail(ObjectNotFoundError, 'Usuário não encontrado!');

        if (this.bannedRoles.includes(user.role)) {
            return fail(UnauthorizedError, 'Usuário não autorizado!');
        }

        this.storeIDs(user);

        return succeed(user);
    }

    private storeIDs(user: CleanUser) {
        this.response.locals.user = { _id: user._id };
        this.response.locals.organization = user.organization;
    }

    abstract tryAuthorize(): Promise<Result<boolean, Error>>;
}

export default Authorization;