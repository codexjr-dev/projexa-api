import { Request, Response } from "express";
import service from "./auth.service";

async function signIn(request: Request, response: Response) {
    try {
        const dados = await service.signIn(request.body);

        if (dados.error) return response.status(401).send({
            error: dados.erro
        });
        return response.status(200).send({ dados });
    } catch (error: unknown) {
        if (error instanceof Error) return response.status(500).send({
            error: error.message,
            trace: error.stack
        }); return response.status(500).send({ error });
    }
}

export { signIn };
