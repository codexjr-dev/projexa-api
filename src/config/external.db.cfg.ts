import mongoose from 'mongoose';

async function connectToExternalDB(env: string) {
    mongoose.connection.on('error', (error: unknown) => {
        console.log(`Erro ao conectar com o Banco de Dados em ${env}.`);
        if (error instanceof Error) console.log(`${error.stack}`);
    });
    mongoose.connection.on('connected', () => {
        console.log(`Conexão estabelecida com o Banco de Dados em ${env}!`);
    });
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.BD_URL!);
}

export {
    connectToExternalDB,
};
