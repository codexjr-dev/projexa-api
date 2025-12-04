import { Request, Response } from "express";
import service from "./auth.service";
import { catchErrors } from "../../../utils/error.handling";

type Credentials = {
    email: string;
    password: string;
}

async function signIn(request: Request, response: Response) {
    const { email, password } = request.body;

    const credentials: Credentials = { email, password };
    const result = await catchErrors(service.signIn(credentials));

    if (result.data) return response.status(200).send({ dados: result.data });
    switch (result.error.name) {
        case 'InvalidCredentialsError':
            return response.status(401).send(result.error);
        default:
            return response.status(500).send(result.error);
    }
}

export { signIn };
