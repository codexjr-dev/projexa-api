import News, { INews, NewsParameters } from './news.model';
import Project, { IProject } from '../project/project.model';
import { catchErrors, fail,  succeed, Result } from '../../utils/error.handling';
import {
    FailedToCreateResourceError,
    FailedToUpdateResourceError,
    ObjectNotFoundError
} from '../../utils/errors/errors';


/* Relevant Types */
type SearchResult = NewsParameters | null;
type NewsAndProject = {
    news: INews[];
    project: Pick<IProject, '_id' | 'name'>;
};

type NewsCreationParameters =
    Required< Pick<INews, 'description'> >
    & Partial< Pick<INews, 'image' | 'updateLink'> >;

async function save(
    userID: string,
    projectID: string,
    data: NewsCreationParameters
): Promise<Result<INews, Error>> {
    const newsResult = await catchErrors(
        News.create({
            user: userID,
            project: projectID,
            description: data.description,
            image: data.image,
            updateLink: data.updateLink,
        })
    );

    if (newsResult.error) return newsResult;
    if (!newsResult.data) return fail(
        FailedToCreateResourceError, 'Não foi possível criar esta notícia!'
    );

    const projectResult = await catchErrors(
        Project.findOneAndUpdate(
            { _id: projectID },
            { $push: { news: newsResult.data._id } }
        )
    );

    if (projectResult.error) return projectResult;
    if (!projectResult.data) return fail(
        FailedToUpdateResourceError, 'Não foi possível atualizar este projeto!'
    );

    return succeed(newsResult.data);
}

async function findByProject(
    projectId: string
): Promise<Result<NewsAndProject, Error>> {
    const projectResult = await catchErrors(
        Project
            .findOne({ _id: projectId })
            .select('_id news name')
            .populate({ path: 'news', options: { sort: [['_id', 'desc']] } })
            .lean()
    );

    if (projectResult.error) return projectResult;
    if (!projectResult.data) return fail(
        ObjectNotFoundError, 'Projeto não encontrado!'
    );

    const { news, ...rest } = projectResult.data;
    const project: Pick<IProject, '_id' | 'name'> = rest;
    const result: NewsAndProject = { news: news as any as INews[], project };

    return succeed(result);
}

async function update(newsID: string, parameters: NewsParameters): Promise<SearchResult> {
    const updatedNews = await News.findOneAndUpdate(
        { _id: newsID },
        parameters,
        { new: true }
    );
    if (!updatedNews) throw new Error('Erro ao atualizar notícia!');
    return await News.findOne({ project: updatedNews!.project })
        .select('-__v')
        .populate('user', '_id name')
        .sort({ _id: -1 })
        .exec();
}

async function remove(projectId: string, parameters: NewsParameters): Promise<SearchResult> {
    const project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { news: parameters._id }},
        { new: true }
    );

    const deletedNews = await News.deleteOne({ _id: parameters._id });

    if (deletedNews.deletedCount < 1)
        throw new Error('Atualização não encontrada.');
    return await News
        .find({ _id: { $in: project!.news }})
        .select('-__v')
        .populate('user', '_id name')
        .sort({ _id: -1 })
        .exec() as NewsParameters;
}

async function getAllNewsByOrganization(organizationID: string) {
    const projects = await Project.find({ organization: organizationID }).select('_id');
    let projectsIds = projects.map(
        (project: IProject) => project._id.toString()
    );
    return await News
        .find({ project: { $in: projectsIds }})
        .select('-__v')
        .populate('user', '_id name')
        .populate('project', '_id name')
        .sort({ _id: -1 })
        .exec();
}

export default {
    findByProject,
    getAllNewsByOrganization,
    remove,
    save,
    update,
};
