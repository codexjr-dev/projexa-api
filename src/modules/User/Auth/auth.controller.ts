import { Request, Response } from "express";
import service from "./auth.service";

async function signIn(request: Request, response: Response): Promise<any> {
    try {
        const dados = await service.signIn(request.body);

        if (dados?.erro) return response.status(401).send({ error: dados.erro });
        return response.status(200).send({ dados });
    } catch(error: unknown) {
        if (error instanceof Error)
            return response.status(500).send({ error: error?.message });
        return response.status(500).send({ erro: error });
    }
}

export { signIn };
