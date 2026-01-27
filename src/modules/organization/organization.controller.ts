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

async function save(request: ERequest, response: EResponse) {
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

async function findAll(request: ERequest, response: EResponse) {
    const result = await catchErrors(service.findAll());
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findById(request: ERequest, response: EResponse) {
    const { id } = request.params;

    const result = await catchErrors(service.findById(id));
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function findPresident(request: ERequest, response: EResponse) {
    const { id } = request.params;

    const result = await catchErrors(service.findPresident(id));
    if (result.data) return response.status(200).send(result.data);

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
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

async function addRecurrentEvent(request: Request, response: Response) {
    try {
        const { id } = request.params;
        const { description, startDate, endDate, frequency, value, author, exceptions } = request.body;
        const recurrentEvent = {
            description,
            startDate,
            endDate,
            frequency,
            value,
            author,
            exceptions,
        };
        const result = await service.addRecurrentEvent(id, recurrentEvent);
        return response.status(201).send({ message: "Evento recorrente adicionado com sucesso" });
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
    addFinancialEvent,
    addRecurrentEvent,
};
