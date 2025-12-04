import { Schema } from "mongoose";
import News, { INews, NewsParameters } from "./news.model";
import Project, { IProject, ProjectParameters } from "../project/project.model";
type SearchResult = NewsParameters | null;
type NewsAndProject = {
    news: NewsParameters;
    project: ProjectParameters;
};

async function save(userId: string, projectId: string, parameters: NewsParameters): Promise<INews> {
    const userObjectID = new Schema.Types.ObjectId(userId);
    const projectObjectID = new Schema.Types.ObjectId(projectId);
    const news: INews = await News.create({
        user: userObjectID,
        project: projectObjectID,
        description: parameters.description,
        image: parameters.image,
        updateLink: parameters.updateLink,
    });
    await Project.findOneAndUpdate(
        { _id: projectObjectID },
        { $push: { news: news._id } }
    );
    return news;
}

async function findByProject(projectId: string): Promise<NewsAndProject> {
    const project = (await Project
        .findOne({ _id: projectId })
        .select("_id news name")) as ProjectParameters;

    if (!project) throw new Error("Projeto não encontrado!");
    const news = await News.find({ _id: { $in: project.news }})
        .select("-__v")
        .populate("user", "_id name")
        .sort({ _id: -1 })
        .exec() as NewsParameters;

    delete project.news;
    const result: NewsAndProject = {
        news,
        project,
    };

    return result;
}

async function update(newsId: string, parameters: NewsParameters): Promise<SearchResult> {
    const updatedNews = await News.findOneAndUpdate(
        { _id: newsId },
        parameters,
        { new: true }
    );
    if (!updatedNews) throw new Error("Erro ao atualizar notícia!");
    return await News.findOne({ project: updatedNews!.project })
        .select("-__v")
        .populate("user", "_id name")
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
        throw new Error("Atualização não encontrada.");
    return await News
        .find({ _id: { $in: project!.news }})
        .select("-__v")
        .populate("user", "_id name")
        .sort({ _id: -1 })
        .exec() as NewsParameters;
}

async function getAllNewsByOrganization(organizationID: string) {
    const projects = await Project.find({ organization: organizationID }).select("_id");
    let projectsIds = projects.map(
        (project: IProject) => project._id.toString()
    );
    return await News
        .find({ project: { $in: projectsIds }})
        .select("-__v")
        .populate("user", "_id name")
        .populate("project", "_id name")
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
