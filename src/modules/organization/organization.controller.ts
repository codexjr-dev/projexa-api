import { Request, Response } from "express";
import service from "./organization.service";
import { OrganizationParameters } from "./organization.model";
import { UserParameters } from "modules/user/user.model";

async function save(request: Request, response: Response) {
    try {
        const { name, presidentData } = request.body;
        const president: UserParameters = {
            name: presidentData.name,
            email: presidentData.email,
            birthDate: presidentData.birthDate,
            password: presidentData.password,
            role: "Presidente",
        }

        const newOrganization = await service.save(name, president);
        return response.status(201).send(newOrganization);
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findAll(request: Request, response: Response) {
    try {
        const organizations = await service.findAll();
        return response.status(200).send({ ejs: organizations });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findById(request: Request, response: Response) {
    try {
        const { id } = request.params;

        const organization = await service.findById(id);
        return response.status(200).send({ ej: organization });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function findPresident(request: Request, response: Response) {
    try {
        const { id } = request.params;

        const organization = await service.findPresident(id);
        return response.status(200).send({ organization });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

export {
    findAll,
    findById,
    findPresident,
    save,
};
