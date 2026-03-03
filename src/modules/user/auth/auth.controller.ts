import service from './auth.service';
import { catchErrors } from '../../../utils/error.handling';

type Credentials = {
    email: string;
    password: string;
}

async function signIn(request: ERequest, response: EResponse) {
    const { email, password } = request.body;

    const credentials: Credentials = { email, password };
    const result = await catchErrors(service.signIn(credentials));

    if (result.data) return response.status(200).send({ dados: result.data });
    switch (result.error.name) {
        case 'InvalidCredentialsError':
            return response.status(401).send({ error: result.error.message });
        default:
            console.error('Auth error:', result.error);
            return response.status(500).send({ error: result.error.message || 'Erro desconhecido' });
    }
}

export { signIn };
