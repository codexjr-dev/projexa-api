import { INews, NewsParameters } from './news.model';
import service from './news.service';

type NewsCreationParameters =
    Required< Pick<INews, 'description'> >
    & Partial< Pick<INews, 'image' | 'updateLink'> >;

async function save(request: ERequest, response: EResponse) {
    try {
        const { userId } = response.locals;
        const { projectId } = request.params;
        const { description, image, updateLink } = request.body;

        const optionalParameters: NewsCreationParameters = {
            description,
            image,
            updateLink,
        };
        const news = await service.save(userId, projectId, optionalParameters);
        return response.status(201).send({ news });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: 'Erro inesperado',
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findByProject(request: ERequest, response: EResponse) {
    try {
        const { projectId } = request.params;

        const newsAndProject = await service.findByProject(projectId);
        return response.status(200).send(newsAndProject);
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: 'Erro inesperado',
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function update(request: ERequest, response: EResponse) {
    try {
        const { newsId, description, image, updateLink } = request.body;

        const optionalParameters: NewsParameters = {
            description,
            image,
            updateLink,
        }
        const updatedNews = await service.update(newsId, optionalParameters);

        return response.status(200).send({
            news: updatedNews,
            message: 'Atualização do projeto realizada com sucesso!'
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: 'Erro inesperado',
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function remove(request: ERequest, response: EResponse) {
    try {
        const { projectId } = request.params;
        const news = request.body;

        const result = await service.remove(projectId, news);
        return response.status(200).send({
            news: result,
            message: 'Atualização do projeto removida com sucesso!'
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: 'Erro inesperado',
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function getAllNewsByOrg(request: ERequest, response: EResponse) {
    try {
        const { organizationID } = response.locals;

        const allNews = await service.getAllNewsByOrganization(organizationID);
        return response.status(200).send({ news: allNews });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: 'Erro inesperado',
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

export {
    findByProject,
    getAllNewsByOrg,
    remove,
    save,
    update,
};
