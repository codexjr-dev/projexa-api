const mongoose = require('mongoose');

module.exports = async () => {
    let BD_URL;
    if (process.env.NODE_ENV.replace(/'/g, '').trim() === "prod") {
        console.log('Conectando com o banco de dados de produção...');
        BD_URL = process.env.BD_PROD;
    } else if (process.env.NODE_ENV.replace(/'/g, '').trim() === "dev") {
        console.log('Conectando com o banco de dados de desenvolvimento...');
        BD_URL = process.env.BD_DEV;
    } else {
        console.log('Gerando banco de dados local...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = new MongoMemoryServer();
        const uri = await mongod.getUri();
        BD_URL = uri;
    }

    // mongoose.set('useFindAndModify', false);
    mongoose.connection.on('connected', () => {
        if (process.env.NODE_ENV !== "test") {
            console.log('Conectado com o banco de dados!');
        }
    })

    mongoose.connection.on('error', (err) => {
        console.log("Erro na conexão com o banco de dados: " + err);
    });

    mongoose.set("strictQuery", false);

    mongoose.connect(BD_URL, {
        useNewUrlParser: true,
        // poolSize: 5,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    });
}