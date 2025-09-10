import "module-alias/register";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./modules/User/auth/auth.routes";
import linkRoutes from "./modules/link/link.routes";
import newsRoutes from "./modules/news/news.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import projectRoutes from "./modules/project/project.routes";
import userRoutes from "./modules/user/user.routes";

/* Configurando o servidor Express */
const server = express();
server.use(cors());
server.get("/api", function (request: Request, response: Response) {
    return response.json({ message: "API conectada!" });
});
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
