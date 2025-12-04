import { DeleteResult, Schema } from 'mongoose';
import Project, { IProject } from './project.model';

/* Relevant Types */
type ProjectCreationParameters =
    Required<Pick<IProject, 'name' | 'description' | 'tags' | 'team' >>
    & Partial <Pick<IProject, 'contractLink' | 'startDate' | 'finishDate'>>;

type ProjectUpdateParameters =
    Partial<
        Pick<
            IProject,
            'name'
            | 'description'
            | 'tags'
            | 'team'
            | 'startDate'
            | 'finishDate'
            | 'contractLink'
            | 'customer'
            | 'news'
        >
    >;

async function save(
    parameters: ProjectCreationParameters,
    organizationID: string
): Promise<IProject> {
    const newProject: IProject = await Project.create({ organization: organizationID, ...parameters });
    return newProject;
}

async function findByOrganization(organizationID: string): Promise<IProject[]> {
    const projects: IProject[] = await Project
        .find({ organization: organizationID })
        .populate({ path: 'team', select: 'name role _id' })
        .lean();
    return projects;
}

async function findById(projectID: string): Promise<IProject | null> {
    const project: IProject | null = await Project
        .findOne({ projectID })
        .populate({ path: 'team', select: 'name role _id' })
        .lean();
    return project;
}

async function remove(projectID: string): Promise<DeleteResult> {
    const removedProject = Project.deleteOne({
        _id: projectID,
    });
    return removedProject;
}

async function update(
    projectID: string,
    data: ProjectUpdateParameters
): Promise<IProject | null> {
    const updatedProject: IProject | null = await Project
        .findOneAndUpdate({ _id: projectID }, data);
    return updatedProject;
}

export default {
    findByOrganization,
    findById,
    remove,
    save,
    update,
};
