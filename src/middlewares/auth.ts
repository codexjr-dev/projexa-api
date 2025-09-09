import JWT from "jsonwebtoken";
import Users, { IUser } from "../modules/user/user.model";
import Projects, { IProject } from "../modules/project/project.model"
import News, { INews } from "../modules/news/news.model";
import { NextFunction, Request, Response } from "express";

const bearerRegEx = /^Bearer$/i;
const JWT_SECRET = process.env.JWT_SECRET!;
const leadershipRoles = ["Presidente", "Diretor(a)", "Guardiã(o)"];
const bannedRoles = ["Ex-Trainee"];

enum AuthTypes {
    EXISTENT,
    AUTHORIZED,
    LEADERSHIP,
    TEAM,
    NEWS_OWNER,
}

function existentUser
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthTypes.EXISTENT);
}

function authorizedUser
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthTypes.AUTHORIZED);
}

function isLeadership
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthTypes.LEADERSHIP);
}

function isMemberOnProject
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthTypes.TEAM);
}

function haveRightsToTheNews
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthTypes.NEWS_OWNER);
}

function authorize
(request: Request, response: Response, next: NextFunction, type: AuthTypes) {
    const authHeader = request.headers.authorization;

    if (!authHeader) return response
        .status(401)
        .send({ error: "Requisição sem token." });

    const parts = authHeader.split(" ");
    const [scheme, token] = parts.length === 2? parts : [null, null];
    if (!token || !scheme || !scheme.match(bearerRegEx))
        return response.status(401).send({ error: "Token mal formatado" });

    JWT.verify(token, JWT_SECRET, async (error, decoded) => {
        if (error) return response
            .status(401)
            .send({ error: "Token inválido." });

        const user = (await Users.findOne({ _id: decoded!.sub })) as IUser;

        if (!user) return response
            .status(404)
            .send({ error: "Usuário não existe." });

        if (isOnBlacklist(user)) return response
            .status(401)
            .send({ error: "Usuário sem permissão." });

        switch (type) {
            case AuthTypes.EXISTENT:
                break;

            case AuthTypes.AUTHORIZED:
                const idOnBody = request.body._id;
                if (!isLeader(user) && !isSameUser(user, idOnBody))
                    return response
                        .status(403)
                        .send({ error: "Usuário sem permissão" });
                break;

            case AuthTypes.LEADERSHIP:
                if (!isLeader(user)) return response
                    .status(403)
                    .send({ error: "Usuário sem permissão" });
                break;

            case AuthTypes.NEWS_OWNER:
                const newsId = request.body.newsId
                const news = (await News.findOne({ _id: newsId })) as INews;
                if (!isLeader(user) && !isNewsOwner(user, news))
                    return response
                        .status(403)
                        .send({ error: "Usuário sem permissão" });
                break;

            case AuthTypes.TEAM:
                const projectId = request.body.projectId;
                const project =
                    (await Projects.findOne({ _id: projectId })) as IProject;
                if (!isLeader(user) && !isProjectMember(user, project))
                    return response
                        .status(403)
                        .send({ error: "Usuário sem permissão" });
                break;
        }

        response.locals.organization._id = user.ej;
        response.locals.user._id = user._id;
        return next();
    }); return next();
}

function isSameUser(user: IUser, anotherID: string) {
    return user._id.toString() === anotherID;
}

function isOnBlacklist(user: IUser): boolean {
    return user && bannedRoles.includes(user.role);
}

function isLeader(user: IUser): boolean {
    return user && leadershipRoles.includes(user.role);
}

function isNewsOwner(user: IUser, news: INews): boolean {
    return user && (news.user.toString() === user._id.toString());
}

function isProjectMember(user: IUser, project: IProject) {
    return user && project && project.team.includes(user._id);
}

export {
    existentUser,
    authorizedUser,
    isLeadership,
    isMemberOnProject,
    haveRightsToTheNews,
};
