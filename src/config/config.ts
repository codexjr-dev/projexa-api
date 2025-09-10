import { connectToExternalDB } from "./external.db.cfg";
import { connectToLocalDB } from "./local.db.cfg";

async function loadEnviron() {
    const ENVIRON = (process.env.NODE_ENV! as string).trim();
    switch (ENVIRON) {
        case "dev":
            console.log("Carregando .env");
            process.loadEnvFile(`./.env`);
            break;
        case "prod":
            console.log("Carregando .env");
            process.loadEnvFile(`./.env`);
            break;
        default:
            console.log("Carregando .env.default");
            process.loadEnvFile("./.env.default");
            break;
    }
    checkEnvironmentVariables();
}

async function checkEnvironmentVariables() {
    const REQUIRED_VARIABLES = [
        "BD_URL",
        "PORT",
        "SALT_ROUNDS",
        "JWT_SECRET",
    ];

    const missing: string[] = [];
    for (const VARIABLE of REQUIRED_VARIABLES) {
        if (process.env[VARIABLE]) continue;
        missing.push(VARIABLE);
    }

    if (missing.length === 0) return;

    const message =
        `Variáveis de Ambiente não encontradas: ${missing.join(", ")}`;
    throw new Error(message);
}

async function startDatabase() {
    const ENVIRON = (process.env.NODE_ENV! as string).trim();
    switch(ENVIRON) {
        case "prod":return connectToExternalDB(ENVIRON);
        case "dev": return connectToExternalDB(ENVIRON);
        default:    return connectToLocalDB();
    }
}

export {
    loadEnviron,
    startDatabase,
};
