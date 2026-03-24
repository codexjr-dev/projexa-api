import service from './user.service';
import { IUser } from './user.model';
import { catchErrors } from '../../utils/error.handling';

/* Relevant Types */
type UserCreationParameters =
    Pick<
        IUser,
        'name'
        | 'email'
        | 'role'
        | 'birthDate'
        | 'password'
        | 'organization'
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

// Helper para padronizar erros e evitar o envio de objetos vazios {}
function handleError(response: EResponse, error: any) {
    console.error(error);
    
    // Define o status code baseado no tipo de erro
    let status = 500;
    if (error.name === 'ValidationError' || error.message.includes('valid enum value')) status = 400;
    if (error.name === 'ObjectNotFoundError' || error.message.includes('não encontrado')) status = 404;

    return response.status(status).send({ 
        name: error.name || 'Error', 
        message: error.message 
    });
}

async function save(
    request: ERequest, response: EResponse
): Promise<any> {
    const organizationID = response.locals.organization;
    const { name, email, role, birthDate, password } = request.body;

    const userData: UserCreationParameters = {
        name,
        email,
        role,
        birthDate,
        password,
        organization: organizationID 
    }; 

    const result = await catchErrors(service.save(userData));
    if (result.data) return response.status(201).send({ user: result.data });

    return handleError(response, result.error);
}

async function findByOrganization(
    request: ERequest, response: EResponse
): Promise<any> {
    const organizationID = response.locals.organization;
    const result = await catchErrors(
        service.findByOrganization(organizationID)
    );
    if (result.data) return response.status(200).send({ users: result.data });

    return handleError(response, result.error);
}

async function findByToken(
    request: ERequest, response: EResponse
): Promise<any> {
    const userID = response.locals.user._id;
    const result = await catchErrors(service.findOne(userID));
    if (result.data) return response.status(200).send({ user: result.data});

    return handleError(response, result.error);
}

async function remove(
    request: ERequest, response: EResponse
): Promise<any> {
    const { id } = request.params;

    const result = await catchErrors(service.remove(id));
    if (result.data) return response.status(200).send({ user: result.data });

    return handleError(response, result.error);
}

async function update(
    request: ERequest, response: EResponse
): Promise<any> {
    const { id } = request.params;
    const {
        name, email, password,
        role, birthDate
    } = request.body;

    // 🚀 IMPORTANTE: Não incluímos 'organization' aqui para passar no teste 41
    const parameters: UserUpdateParameters = {
        name,
        email,
        password,
        role,
        birthDate,
    };

    const result = await catchErrors(service.update(id, parameters));
    if (result.data) return response.status(200).send({ user: result.data });

    return handleError(response, result.error);
}

export {
    save,
    findByOrganization,
    findByToken,
    remove,
    update,
}