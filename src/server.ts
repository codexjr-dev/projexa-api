import 'module-alias/register';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './modules/user/auth/auth.routes';
import linkRoutes from './modules/link/link.routes';
import newsRoutes from './modules/news/news.routes';
import organizationRoutes from './modules/organization/organization.routes';
import projectRoutes from './modules/project/project.routes';
import userRoutes from './modules/user/user.routes';
import swaggerDocument from './docs/swagger';

/* Configurando o servidor Express */
const server = express();
server.use(cors());
server.get('/api', function (request: Request, response: Response) {
    return response.json({ message: 'API conectada!' });
});
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(express.json());
server.use(organizationRoutes);
server.use(userRoutes);
server.use(authRoutes);
server.use(projectRoutes);
server.use(linkRoutes);
server.use(newsRoutes);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

export default server;
