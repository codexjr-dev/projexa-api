import { CleanUser } from '../../modules/user/user.model';
import News, { INews } from '../../modules/news/news.model';
import { fail, succeed, catchErrors } from '../../utils/error.handling';
import Authorization from './auth.abstract';
import {
    ObjectNotFoundError,
    UnauthorizedError,
} from '../../utils/errors/errors';

class Owner extends Authorization {
    override async tryAuthorize(): Promise<Result<boolean, Error>> {
        const resultUser = await this.getUserFromToken();
        if (resultUser.error) return resultUser;
        const user: CleanUser = resultUser.data;

        const leadershipRoles = ['Presidente', 'Diretor(a)', 'Guardiã(o)'];
        const newsID = this.request.body.newsID;
        const newsResult: Result<INews | null, Error> = await catchErrors(
            News.findOne({ _id: newsID })
        );
        if (newsResult.error) return newsResult;
        const news: INews | null = newsResult.data;
        if (!news) return fail(ObjectNotFoundError, 'Evento não encontrado!');

        const hasAdminRights = leadershipRoles.includes(user.role);
        const ownsThisNews = news.user.valueOf() === user._id.valueOf();

        switch (hasAdminRights || ownsThisNews) {
            case true: return succeed(true);
            default: return fail(UnauthorizedError, 'Usuário não autorizado!');
        }
    }
}

export default Owner;
