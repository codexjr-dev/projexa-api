import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connectToLocalDB() {
    mongoose.connection.on("error", (error: unknown) => {
        console.log("Erro ao conectar com um Banco de Dados local.");
        if (error instanceof Error) console.log(`${error.stack}`);
    });
    mongoose.connection.on('connected', () => {
        console.log('Conexão estabelecida com um Banco de Dados local!');
    });
    mongoose.set("strictQuery", false);
    const LOCAL_INSTANCE = await MongoMemoryServer.create();
    const URI = LOCAL_INSTANCE.getUri();
    mongoose.connect(URI);
}

export {
    connectToLocalDB,
};
