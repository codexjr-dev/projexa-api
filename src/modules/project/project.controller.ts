import { Request, Response } from "express";
import service from "./project.service";
import { ProjectParameters } from "./project.model";

async function save(request: Request, response: Response): Promise<any> {
    try {
        const { name, description, tags, organization, team } = request.body;
        const parameters: ProjectParameters = {
            name,
            description,
            tags,
            team
        };

        const newProject = await service.save(parameters, organization);
        return response.status(201).send({ project: newProject });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro desconhecido",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findByOrganization
(request: Request, response: Response): Promise<any> {
    try {
        /* Este ID é colocado aqui pelo middleware de autenticação. */
        const { id } = response.locals.organization;

        const projects = await service.findByOrganization(id);
        return response.status(200).send({ projects })
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro desconhecido",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findById(request: Request, response: Response): Promise<any> {
    try {
        const { id } = request.params;

        const project = await service.findById(id);
        return response.status(200).send({ project });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro desconhecido",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function remove(request: Request, response: Response): Promise<any> {
    try {
        const { id } = request.params;

        const deletionResults = await service.remove(id);
        return response.status(200).send({
            project: deletionResults,
            message: "Projeto removido com sucesso!"
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro desconhecido",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function update(request: Request, response: Response): Promise<any> {
    try {
        const { id } = request.params;
        const parameters: ProjectParameters = request.body;

        const updatedProject = await service.update(id, parameters);
        return response.status(200).send({
            project: updatedProject,
            message: "Projeto atualizado com sucesso!"
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro desconhecido",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

export {
    findById,
    findByOrganization,
    remove,
    save,
    update,
};
