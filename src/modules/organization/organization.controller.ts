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

    switch (result.error) {
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

async function getBalance(request: ERequest, response: EResponse) {
    const { id } = request.params;
    
    const result = await catchErrors(service.getBalance(id));
    if (result.data) return response.status(200).send({ balance: result.data });

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function addFinancialEvent(request: ERequest, response: EResponse) {
    const { id } = request.params;
    const { description, date, value, author } = request.body;

    const financialEvent = {
        description,
        date,
        value,
        author,
    };
    
    const result = await catchErrors(service.addFinancialEvent(id, financialEvent));
    if (result.data) return response.status(201).send({ financialEvent: result.data });

    switch (result.error) {
        default:
            console.error(result.error);
            return response.status(500).send(result.error);
    }
}

async function addRecurrentEvent(request: ERequest, response: EResponse) {
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
    
    const result = await catchErrors(service.addRecurrentEvent(id, recurrentEvent));
    if (result.data) return response.status(201).send({ message: "Evento recorrente adicionado com sucesso" });

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
    getBalance,
    addFinancialEvent,
    addRecurrentEvent,
};
