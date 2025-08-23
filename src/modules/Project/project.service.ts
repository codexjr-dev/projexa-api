import { DeleteResult, Schema } from "mongoose";
import Project, { ProjectParameters } from "./project.model";
type SearchResult = ProjectParameters | null;

async function save
(parameters: ProjectParameters, ejId: string): Promise<ProjectParameters> {
    const newProject = {
        ...parameters!,
        ej: new Schema.Types.ObjectId(ejId),
    };
    return await Project.create(newProject);
}

async function findByEj(ejId: string): Promise<SearchResult> {
    const projects = await Project
        .findOne({ ej: new Schema.Types.ObjectId(ejId) })
        .populate({ path: "team", select: "name role _id" });
    return projects;
}

async function remove(projectId: string): Promise<DeleteResult> {
    const id = new Schema.Types.ObjectId(projectId);
    const removedProject = Project.deleteOne({
        _id: id,
    });
    return removedProject;
}

async function update
(projectId: string, data: ProjectParameters): Promise<SearchResult> {
    const updatedProject = Project
        .findOneAndUpdate({ _id: projectId }, data);
    return updatedProject;
}

export default {
    findByEj,
    remove,
    save,
    update,
};
