import { fail, succeed, catchErrors, Result } from '../../utils/error.handling';
import Projects, { IProject } from "../../modules/project/project.model";
import ObjectNotFoundError from "../../utils/errors/objectNotFound.error";
import UnauthorizedError from "../../utils/errors/unauthorized.error";
import { CleanUser } from "../../modules/user/user.model";
import Authorization from "./auth.abstract";

class Team extends Authorization {
    override async tryAuthorize(): Promise<Result<boolean, Error>> {
        const resultUser = await this.getUserFromToken();
        if (resultUser.error) return resultUser;
        const user: CleanUser = resultUser.data;

        const leadershipRoles = ['Presidente', 'Diretor(a)', 'Guardiã(o)'];

        const projectID = this.request.body.projectID;
        const projectResult: Result<IProject | null, Error> = await
            catchErrors(Projects.findById(projectID));
        if (projectResult.error) return projectResult;
        const project = projectResult.data;
        if (!project) return fail(
            ObjectNotFoundError, 'Projeto não encontrado!'
        );

        const hasAdminRights = leadershipRoles.includes(user.role);
        const isTeamMember = project.team.includes(user._id);

        switch (hasAdminRights || isTeamMember) {
            case true: return succeed(true);
            default: return fail(UnauthorizedError, 'Usuário não autorizado!');
        }
    }
}

export default Team;