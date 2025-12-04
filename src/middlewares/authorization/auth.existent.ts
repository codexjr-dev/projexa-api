import { CleanUser } from '../../modules/user/user.model';
import { fail, succeed, Result } from '../../utils/error.handling';
import Authorization from './auth.abstract';
import { ObjectNotFoundError } from '../../utils/errors/errors';

class Existent extends Authorization {
    override async tryAuthorize(): Promise<Result<boolean, Error>> {
        const userResult: Result<CleanUser, Error> = await this
            .getUserFromToken();
        if (userResult.error) return userResult;
        const user: CleanUser | null = userResult.data;
        if (!user) return fail(ObjectNotFoundError, 'Usuário não encontrado!');
        return succeed(!!user);
    }
}

export default Existent;
