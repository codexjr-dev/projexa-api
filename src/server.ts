import "module-alias/register";
import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import databaseConfig from "./config/database";

import organizationRoutes from "./modules/organization/organization.routes";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/user/auth/auth.routes";
import projectRoutes from "./modules/project/project.routes";
import linkRoutes from "./modules/link/link.routes";
import newsRoutes from "./modules/news/news.routes";

const server = express();
server.use(cors());
server.get("/api", function (request: Request, response: Response) {
    return response.json({ message: "API conectada" });
});

databaseConfig();

server.use(express.json());
server.use(organizationRoutes);
server.use(userRoutes);
server.use(authRoutes);
server.use(projectRoutes);
server.use(linkRoutes);
server.use(newsRoutes);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const port = process.env.PORT || 4444;
server.listen(port);

export default server;
