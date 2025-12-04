import { CleanUser } from '../../modules/user/user.model';
import { fail, succeed } from '../../utils/error.handling';
import Authorization from './auth.abstract';
import { UnauthorizedError } from '../../utils/errors/errors';

class Restricted extends Authorization {
    override async tryAuthorize(): Promise<Result<boolean, Error>> {
        const resultUser = await this.getUserFromToken();
        if (resultUser.error) return resultUser;
        const user: CleanUser = resultUser.data;

        const leadershipRoles = ['Presidente', 'Diretor(a)', 'Guardiã(o)'];
        const idOnBody = this.request.body._id;

        const hasAdminRights = leadershipRoles.includes(user.role);
        const ownsResource = idOnBody === user._id.valueOf();

        switch (hasAdminRights || ownsResource) {
            case true: return succeed(true);
            default: return fail(UnauthorizedError, 'Usuário não autorizado!');
        }
    }
}

export default Restricted;
