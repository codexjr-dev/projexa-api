import { CleanUser } from '../../modules/user/user.model';
import { fail, succeed, Result } from '../../utils/error.handling';
import Authorization from './auth.abstract';
import {
    ObjectNotFoundError,
    UnauthorizedError
} from '../../utils/errors/errors';

class Leadership extends Authorization {
    override async tryAuthorize(): Promise<Result<boolean, Error>> {
        const resultUser = await this.getUserFromToken();
        if (resultUser.error) return resultUser;
        const user: CleanUser = resultUser.data;

        if (!user) return fail(ObjectNotFoundError, 'Usuário não encontrado!');

        const leadershipRoles = ['Presidente', 'Diretor(a)', 'Guardiã(o)'];
        const isPartOfLeadership = leadershipRoles.includes(user.role);

        switch (isPartOfLeadership) {
            case true: return succeed(isPartOfLeadership);
            default: return fail(UnauthorizedError, 'Usuário não autorizado!');
        }
    }
}

export default Leadership;
