import { Request, Response } from "express";
import service from "./link.service";
import { ILink, LinkParameters } from "./link.model";

async function save(request: Request, response: Response) {
    try {
        const { organizationID } = response.locals;
        const { name, url, tags, departments, observations } = request.body;

        const parameters: LinkParameters = {
            name,
            url,
            tags,
            departments,
            observations,
        }
        const newLink = await service.save(parameters, organizationID);

        return response.status(201).send({ link: newLink });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findByOrganization(request: Request, response: Response) {
    try {
        const { organizationID } = response.locals;

        const links = await service.findByOrganization(organizationID);
        return response.status(200).send({ links });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function remove(request: Request, response: Response) {
    try {
        const { id } = request.params;

        const removedLink = await service.remove(id);
        return response.status(200).send({
            link: removedLink,
            message: "Link removido com sucesso!"
        })
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function update(request: Request, response: Response) {
    try {
        const { id } = request.params;
        const optionalParameters = request.body;

        const updatedLink = await service.update(id, optionalParameters);
        return response.status(200).send({
            link: updatedLink,
            message: "Link atualizado com sucesso!",
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

export {
    save,
    findByOrganization,
    remove,
    update,
};
