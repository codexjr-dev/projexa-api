import { checkEnvironmentVariables, startDatabase } from './config/config';
import server from './server';
import dotenv from 'dotenv';

/* Checando variáveis de ambiente e abrindo Banco de Dados! */
dotenv.config({ quiet: true });
checkEnvironmentVariables();
startDatabase();

/* Inicializando o servidor */
const port = process.env.PORT!;
try {
    server.listen(port);
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/docs`);
} catch (error: unknown) {
    if (error instanceof Error) console.log(`${error.stack}`);
    console.log(`Erro fatal: Existe a possibilidade de a porta ${port} já estar em uso.`);
}