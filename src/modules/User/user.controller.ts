import service, { UpdateUserInterface } from "./user.service";
import { Request, Response } from "express";
import { Schema } from "mongoose";

async function save(request: Request, response: Response): Promise<any> {
    try {
        const { organizationID } = response.locals;
        const user = await save(request.body, organizationID);
        return response.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: error.message
        }); return response.status(500).send(error);
    }
}

async function findByOrganization(request: Request, response: Response): Promise<any> {
    try {
        const { organizationID } = response.locals;
        const users = await service.findByOrganization(organizationID);
        return response.status(200).send({ users });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: error.message
        }); return response.status(500).send(error);
    }
}


async function remove(request: Request, response: Response): Promise<any> {
    try {
        const { id } = request.params;
        const objID = new Schema.Types.ObjectId(id);

        const removedUser = await service.remove(objID);
        return response.status(200).send({ user: removedUser, })
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: error.message
        }); return response.status(500).send(error);
    }
}

async function update(request: Request, response: Response): Promise<any> {
    try {
        const { id } = request.params;
        const { name, email, password,
            role, birthDate, organization } = request.body;
        const parameters = {
            name,
            email,
            password,
            role,
            birthDate,
            organization
        } as UpdateUserInterface;
        const objID = new Schema.Types.ObjectId(id);

        const updatedUser = await service.update(objID, parameters);
        return response.status(200).send({
            user: updatedUser,
            message: 'Usuário atualizado com sucesso!'
        });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: error.message
        }); return response.status(500).send(error);
    }
}

export {
    save,
    findByOrganization,
    remove,
    update,
}
