import service from "./user.service";
import { Request, Response } from "express";
import { Schema } from "mongoose";

async function save(request: Request, response: Response): Promise<any> {
    try {
        const user = await save(request.body, (request as any).ejId);
        return response.status(201).send({ user });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).send({ error: error.message });
        return response.status(500).send(error);
    }
}

async function findByEj(request: Request, response: Response): Promise<any> {
    try {
        const users = await service.findByEj((request as any).ejId);
        return response.status(200).send({ users });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).send({ error: error.message });
        return response.status(500).send(error);
    }
}


async function remove(request: Request, response: Response): Promise<any> {
    try {
        const id = new Schema.Types.ObjectId(request.params.id);
        const removedUser = await service.remove(id);
        return response.status(200).send({ user: removedUser, })
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).send({ error: error.message });
        return response.status(500).send(error);
    }
}

async function update(request: Request, response: Response): Promise<any> {
    try {
        const id = new Schema.Types.ObjectId(request.params.id);
        const updatedUser = await service.update(id, request.body);
        return response.status(200).send({
            user: updatedUser,
            message: 'Usuário atualizado com sucesso!'
        });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).send({ error: error.message });
        return response.status(500).send(error);
    }
}

export {
    save,
    findByEj,
    remove,
    update,
}
