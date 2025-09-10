import { connectToExternalDB } from "./external.db.cfg";
import { connectToLocalDB } from "./local.db.cfg";

async function checkEnvironmentVariables() {
    const REQUIRED_VARIABLES = [
        "BD_URL",
        "PORT",
        "SALT_ROUNDS",
        "JWT_SECRET",
    ];

    const missing: string[] = [];
    let found = 0;
    for (const VARIABLE of REQUIRED_VARIABLES) {
        if (process.env[VARIABLE]) {
            found++;
            continue;
        }
        missing.push(VARIABLE);
    }
    console.log(`Variáveis de ambiente encontradas: ` +
        `${found}/${REQUIRED_VARIABLES.length}`);
    if (found === REQUIRED_VARIABLES.length) return;

    const message =
        `Variáveis de Ambiente não encontradas: ${missing.join(", ")}`;
    throw new Error(message);
}

async function startDatabase() {
    const ENVIRON = `${process.env.NODE_ENV}`.trim();
    if (!ENVIRON)
        throw new Error("Variável de ambiente NODE_ENV não encontrada!");
    switch(ENVIRON) {
        case "prod":return connectToExternalDB(ENVIRON);
        case "dev": return connectToExternalDB(ENVIRON);
        default:    return connectToLocalDB();
    }
}

export {
    checkEnvironmentVariables,
    startDatabase,
};
