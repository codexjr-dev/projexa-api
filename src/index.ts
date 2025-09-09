import { loadEnviron, startDatabase } from "./config/config";
import server from "./server";

/* Checando variáveis de ambiente e abrindo Banco de Dados! */
loadEnviron();
startDatabase();

/* Inicializando o servidor */
const port = process.env.PORT!;
try {
    server.listen(port);
    console.log(`Servidor rodando na porta ${port}`);
} catch (error: unknown) {
    if (error instanceof Error) console.log(`${error.stack}`);
    console.log(`Erro fatal: Existe a possibilidade de a porta ${port} já estar em uso.`);
}