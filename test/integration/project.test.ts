import * as chai from "chai";
import chaiHttp, { request } from "chai-http";
import server from "../../src/server";
import Project from "../../src/modules/project/project.model";
import { startDatabase } from "../../src/config/config";
import * as dotenv from "dotenv";
import data from "../datas/projects.data.json";
import mainData from "../data.json";

const HTTP_CODE = data.HTTP_CODE;
const PROJECT_DEFAULT = data.projectDefault;
const PROJECT_PATCH = data.projectPatch;
const DIRECTOR: Record<string, string> = { ...data.memberDirector };
const ADVISOR: Record<string, string> = { ...data.memberAdvisor };
const TRAINEE: Record<string, string> = { ...data.memberTrainee };
const DEFAULT: Record<string, string> = {};
const organizationDefault = mainData.organizationDefault;

chai.use(chaiHttp);

describe('@Project', () => {
    let EJ_MOCK: Record<string, string> = {};
    let PROJECT_ID: string = '';

    before(async () => {
        dotenv.config({ path: '.env.default' });
        await startDatabase();

    const ejResponse = await request
      .execute(server)
      .post("/organization")
      .send({ ...organizationDefault });

        if (ejResponse.status !== 201) {
            console.error('Erro ao criar organização:', ejResponse.status, ejResponse.body);
            throw new Error(`Falha ao criar organização: ${ejResponse.status}`);
        }

        EJ_MOCK = ejResponse.body.organization || ejResponse.body;
        console.log('Organization criada:', EJ_MOCK);

    const loginResponse = await request.execute(server).post("/signIn").send({
      email: organizationDefault.presidentData.email,
      password: organizationDefault.presidentData.password,
    });

        if (loginResponse.status !== 200) {
            console.error('Erro ao fazer login:', loginResponse.status);
            console.error('Response body:', loginResponse.body);
            console.error('Tentando com:', {
                email: organizationDefault.presidentData.email,
                password: organizationDefault.presidentData.password,
            });
            throw new Error(`Falha ao fazer login: ${loginResponse.status}`);
        }

        console.log('Login response:', loginResponse.body);
        DEFAULT.token = loginResponse.body.dados.token;
        DEFAULT.valid_id = loginResponse.body.dados.user._id;
    });

  describe("POST /project", () => {

    // tá voltando 500, quando devia ser 401
    it("01. Tenta criar um projeto sem estar autorizado", async () => {
      const response = await request
        .execute(server)
        .post("/project")
        .send({ ...PROJECT_DEFAULT });

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

        it('02. Cria um projeto com autorização de liderança com sucesso', async () => {
            const response = await request.execute(server)
                .post('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send({
                    ...PROJECT_DEFAULT,
                    organization: EJ_MOCK._id
                });

            chai.expect(response).to.have.status(HTTP_CODE.CREATED);
            chai.expect(response.body).to.have.property('project');
            chai.expect(response.body.project).to.have.property('_id');
            chai.expect(response.body.project).to.have.property('name', PROJECT_DEFAULT.name);
            chai.expect(response.body.project).to.have.property('description', PROJECT_DEFAULT.description);

            PROJECT_ID = response.body.project._id;
        });

        it('03. Cria um projeto sem campos opcionais', async () => {
            const minimalProject = {
                name: 'Projeto Minimalista',
                description: 'Projeto sem datas',
                tags: ['Frontend'],
                team: [],
                organization: EJ_MOCK._id
            };

            const response = await request.execute(server)
                .post('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send(minimalProject);

            chai.expect(response).to.have.status(HTTP_CODE.CREATED);
            chai.expect(response.body).to.have.property('project');
            chai.expect(response.body.project).to.have.property('name', minimalProject.name);
        });

    });

    describe('GET /project', () => {

        it('01. Tenta listar projetos sem estar autorizado', async () => {
            const response = await request.execute(server)
                .get('/project');

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

        it('02. Lista projetos da organização com sucesso', async () => {
            const response = await request.execute(server)
                .get('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body).to.have.property('projects');
            chai.expect(response.body.projects).to.be.an('array');
        });

        it('03. Retorna projetos com dados estruturados corretamente', async () => {
            const response = await request.execute(server)
                .get('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body.projects).to.be.an('array');

            if (response.body.projects.length > 0) {
                const project = response.body.projects[0];
                chai.expect(project).to.have.property('_id');
                chai.expect(project).to.have.property('name');
                chai.expect(project).to.have.property('organization');
            }
        });

    });

    describe('GET /project/:id', () => {

        it('01. Tenta obter um projeto específico sem estar autorizado', async () => {
            const response = await request.execute(server)
                .get(`/project/${PROJECT_ID}`);

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

        it('02. Obtém um projeto específico com sucesso', async () => {
            const response = await request.execute(server)
                .get(`/project/${PROJECT_ID}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body).to.have.property('project');
            chai.expect(response.body.project).to.have.property('_id');
        });

        it('03. Retorna null ao buscar um ID de projeto inválido', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request.execute(server)
                .get(`/project/${invalidId}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body.project).to.be.null;
        });

    });

    describe('PATCH /project/:id', () => {

        it('01. Tenta atualizar um projeto sem estar autorizado', async () => {
            const response = await request.execute(server)
                .patch(`/project/${PROJECT_ID}`)
                .send({ ...PROJECT_PATCH });

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

        it('02. Atualiza um projeto com autorização de liderança com sucesso', async () => {
            const response = await request.execute(server)
                .patch(`/project/${PROJECT_ID}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send({ ...PROJECT_PATCH });

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body).to.have.property('project');
            chai.expect(response.body).to.have.property('message', 'Projeto atualizado com sucesso!');
            chai.expect(response.body.project).to.have.property('name', PROJECT_PATCH.name);
        });

        it('03. Atualiza apenas campos específicos do projeto', async () => {
            const partialUpdate = {
                description: 'Nova descrição apenas'
            };

            const response = await request.execute(server)
                .patch(`/project/${PROJECT_ID}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send(partialUpdate);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body).to.have.property('project');
            chai.expect(response.body.project).to.have.property('description', partialUpdate.description);
        });

        it('04. Retorna null ao atualizar um ID de projeto inválido', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request.execute(server)
                .patch(`/project/${invalidId}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send({ ...PROJECT_PATCH });

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body.project).to.be.null;
        });

    });

    describe('DELETE /project/:id', () => {

        it('01. Tenta deletar um projeto sem estar autorizado', async () => {
            const response = await request.execute(server)
                .delete(`/project/${PROJECT_ID}`);

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

        it('02. Deleta um projeto com autorização de liderança com sucesso', async () => {
            const createResponse = await request.execute(server)
                .post('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send({
                    ...PROJECT_DEFAULT,
                    name: 'Projeto para deletar',
                    organization: EJ_MOCK._id
                });

            const projectToDelete = createResponse.body.project._id;

            const deleteResponse = await request.execute(server)
                .delete(`/project/${projectToDelete}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(deleteResponse).to.have.status(HTTP_CODE.OK);
            chai.expect(deleteResponse.body).to.have.property('message', 'Projeto removido com sucesso!');
        });

        it('03. Retorna sucesso ao deletar um ID de projeto inválido', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request.execute(server)
                .delete(`/project/${invalidId}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(response).to.have.status(HTTP_CODE.OK);
            chai.expect(response.body).to.have.property('message', 'Projeto removido com sucesso!');
        });

        it('04. Projeto deletado não é mais recuperável', async () => {
            const createResponse = await request.execute(server)
                .post('/project')
                .set('Authorization', `Bearer ${DEFAULT.token}`)
                .send({
                    ...PROJECT_DEFAULT,
                    name: 'Projeto para verificar deleção',
                    organization: EJ_MOCK._id
                });

            const projectId = createResponse.body.project._id;

            await request.execute(server)
                .delete(`/project/${projectId}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            const getResponse = await request.execute(server)
                .get(`/project/${projectId}`)
                .set('Authorization', `Bearer ${DEFAULT.token}`);

            chai.expect(getResponse.body.project).to.be.null;
        });

    });
});
