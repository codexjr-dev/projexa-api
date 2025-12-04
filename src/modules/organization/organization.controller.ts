import { Request, Response } from 'express';
import service from './organization.service';
import { IUser } from '../user/user.model';
import { catchErrors } from '../../utils/error.handling';

type UserCreationParameters =
    Pick<
        IUser,
        'name'
        | 'email'
        | 'role'
        | 'birthDate'
        | 'password'
    >;

async function save(request: Request, response: Response) {
    const { name, presidentData } = request.body;
    const president: UserCreationParameters = {
        name: presidentData.name,
        email: presidentData.email,
        birthDate: presidentData.birthDate,
        password: presidentData.password,
        role: 'Presidente',
    };

    const result = await catchErrors(service.save(name, president));
    if (result.data) return response.status(201).send(result.data);

    switch (result.error.name) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findAll(request: Request, response: Response) {
    const result = await catchErrors(service.findAll());
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findById(request: Request, response: Response) {
    const { id } = request.params;

    const result = await catchErrors(service.findById(id));
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findPresident(request: Request, response: Response) {
    const { id } = request.params;

    const result = await catchErrors(service.findPresident(id));
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

export {
    findAll,
    findById,
    findPresident,
    save,
};
