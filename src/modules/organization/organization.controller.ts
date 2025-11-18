import { Request, Response } from "express";
import service from "./organization.service";
import { UserParameters } from "../user/user.model";

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
        return response.status(200).send({ organizations });
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
        return response.status(200).send({ organization });
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

async function getBalance(request: Request, response: Response) {
    try {
        const { id } = request.params;

        const balance = await service.getBalance(id);
        return response.status(200).send({ balance });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: "Erro inesperado",
            trace: error.stack,
        }); else return response.status(500).send({ error });
    }
}

async function addFinancialEvent(request: Request, response: Response) {
    try {
        const { id } = request.params;
        const { description, date, value, author } = request.body;
        const financialEvent = {
            description,
            date,
            value,
            author,
        };
        const result = await service.addFinancialEvent(id, financialEvent);
        return response.status(201).send({ financialEvent: result });
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
    getBalance,
    addFinancialEvent
};
