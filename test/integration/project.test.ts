import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';
import server from '../../src/server';
import Project from '../../src/modules/project/project.model';
import { startDatabase } from '../../src/config/config';
import * as dotenv from 'dotenv';
import data from '../datas/projects.data.json';
import mainData from '../data.json';

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

    before(async () => {
        dotenv.config();
        await startDatabase();

        const ejResponse = await request.execute(server)
            .post('/organization')
            .send({ ...organizationDefault });

        EJ_MOCK = ejResponse.body.organization;

        const loginResponse = await request.execute(server)
            .post('/signIn')
            .send({
                email: organizationDefault.presidentData.email,
                password: organizationDefault.presidentData.password,
            });

        DEFAULT.token = loginResponse.body.dados.token;
        DEFAULT.valid_id = loginResponse.body.dados.user._id;
    });

    describe('POST /project', () => {

        it('01. Tenta criar um projeto sem estar autorizado', async () => {
            const response = await request.execute(server)
                .post('/project')
                .send({ ...PROJECT_DEFAULT });

            chai.expect(response).to.have.status(HTTP_CODE.UNAUTHORIZED);
            chai.expect(response.body).to.have.property('error');
        });

    });
});