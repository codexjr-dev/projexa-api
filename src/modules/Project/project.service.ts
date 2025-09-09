import { DeleteResult, Schema } from "mongoose";
import Project, { ProjectParameters } from "./project.model";
type SearchResult = ProjectParameters | null;

async function save
(parameters: ProjectParameters, organizationID: string): Promise<ProjectParameters> {
    const newProject = {
        ...parameters!,
        organization: new Schema.Types.ObjectId(organizationID),
    };
    return await Project.create(newProject);
}

async function findByOrganization(organizationID: string): Promise<SearchResult[]> {
    const projects = await Project
        .find({ organization: new Schema.Types.ObjectId(organizationID) })
        .populate({ path: "team", select: "name role _id" });
    return projects;
}

async function findById(_id: string): Promise<SearchResult> {
    const project = await Project
        .findOne({ _id })
        .populate({ path: "team", select: "name role _id" });
    return project;
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
    findByOrganization,
    findById,
    remove,
    save,
    update,
};
