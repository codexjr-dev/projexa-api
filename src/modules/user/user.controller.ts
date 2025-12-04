import service from "./user.service";
import { IUser } from "./user.model";
import { Request, Response } from "express";
import { Schema } from "mongoose";
import { catchErrors } from "../../utils/error.handling";
import ObjectNotFoundError from "../../utils/errors/objectNotFound.error";

/* Relevant Types */
type UserCreationParameters =
    Pick<
        IUser,
        'name'
        | 'email'
        | 'role'
        | 'birthDate'
        | 'password'
    >;
type UserUpdateParameters =
    Partial<
        Pick<
            IUser,
            'name'
            | 'email'
            | 'password'
            | 'role'
            | 'birthDate'
            | 'organization'
        >
    >;

async function save(
    request: Request, response: Response
): Promise<any> {
    const { organizationID } = response.locals;
    const { name, email, role, birthDate, password } = request.body;

    const userData: UserCreationParameters = {
        name,
        email,
        role,
        birthDate,
        password,
    };

    const result = await catchErrors(service.save(userData, organizationID));
    if (result.data) return response.status(201).send({ user: result.data });

    switch (result.error.name) {
        default:
            return response.status(500).send(result.error);
    }
}

async function findByOrganization(
    request: Request, response: Response
): Promise<any> {
    const organizationID = response.locals.organization;
    const result = await catchErrors(
        service.findByOrganization(organizationID)
    );
    if (result.data) return response.status(200).send({ users: result.data });

    switch (result.error.name) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findByToken(
    request: Request, response: Response
): Promise<any> {
    const userID = response.locals.user._id;
    const result = await catchErrors(service.findOne(userID));
    if (result.data) return response.status(200).send({ user: result.data});

    switch (result.error.name) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}


async function remove(
    request: Request, response: Response
): Promise<any> {
    const { id } = request.params;
    const userID = new Schema.Types.ObjectId(id);

    const result = await catchErrors(service.remove(userID));
    if (result.data) return response.status(200).send({ user: result.data });

    switch (result.error.name) {
        default:
            return response.status(500).send(result.error);
    }
}

async function update(
    request: Request, response: Response
): Promise<any> {
    const { id } = request.params;
    const {
        name, email, password,
        role, birthDate, organization
    } = request.body;

    const parameters: UserUpdateParameters = {
        name,
        email,
        password,
        role,
        birthDate,
        organization
    };
    const userID = new Schema.Types.ObjectId(id);

    const result = await catchErrors(service.update(userID, parameters));
    if (result.data) return response.status(200).send({ user: result.data });

    switch (result.error.name) {
        default:
            return response.status(500).send(result.error);
    }
}

export {
    save,
    findByOrganization,
    findByToken,
    remove,
    update,
}
