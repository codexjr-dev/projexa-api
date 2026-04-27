import Authorization from './authorization/auth.abstract';
import Existent from './authorization/auth.existent';
import Leadership from './authorization/auth.leadership';
import Owner from './authorization/auth.owner';
import Restricted from './authorization/auth.restricted';
import Team from './authorization/auth.team';

export function authorize(
    AuthClass: new (
        request: ERequest,
        response: EResponse,
        next: Next
    ) => Authorization
) {
    return async (request: ERequest, response: EResponse, next: Next) => {
        const auth = new AuthClass(request, response, next);
        const result: Result<boolean, Error> = await auth.tryAuthorize();

        if (result.data) return next();
        switch (result.error!.name) {
            case 'InvalidTokenError':
            case 'MalformattedTokenError':
            case 'NoHeaderError':
            case 'UnauthorizedError':
                return response.status(401).send({ error: result.error.message });
            default:
                return response.status(500).send({ error: result.error.message });
        }
    };
}

export {
    Existent,
    Leadership,
    Owner,
    Restricted,
    Team,
}