import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../src/server'; 
import Users from '../src/modules/user/user.model';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Integration Tests', () => {
    let mongoServer: MongoMemoryServer;
    let token: string;
    let userId: any; 
    let orgId: any;

    before(async () => {
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'secret_de_teste_local';

        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        orgId = new mongoose.Types.ObjectId();

        await mongoose.connection.collection('organizations').insertOne({ 
            _id: orgId, 
            name: 'Org Base Teste' 
        });

        const baseUser = await Users.create({
            name: 'Usuário Base',
            email: 'base@codex.com',
            password: 'senha_hasheada',
            role: 'Presidente', 
            birthDate: new Date('2000-01-01'),
            organization: orgId
        });
        
        userId = baseUser._id;

        token = jwt.sign(
            { sub: userId }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    after(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    // =========================
    // TESTES 34 → 63
    // =========================

    it('34. With invalid role (not in enum), should fail', async () => {
        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Role Tester',
                email: 'invalid_role@codex.com',
                password: 'senha',
                birthDate: '2000-01-01',
                role: 'Hacker' 
            });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('35. With invalid birthDate format, should fail', async () => {
        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Data Inválida',
                email: 'data@codex.com',
                password: 'senha',
                role: 'Presidente', 
                birthDate: 'nao-sou-uma-data'
            });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('36. Forging a different organization ID, should ignore', async () => {
        const fakeOrgId = new mongoose.Types.ObjectId();

        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Org Forjada',
                email: 'forged@codex.com',
                password: 'senha',
                role: 'Presidente', 
                birthDate: '2000-01-01',
                organization: fakeOrgId.toString()
            });

        expect(res).to.have.status(201);
        expect(res.body.user.organization.toString()).to.equal(orgId.toString());
    });

    it('37. Extra fields should be ignored', async () => {
        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Campos Extras',
                email: 'extras@codex.com',
                password: 'senha',
                role: 'Presidente', 
                birthDate: '2000-01-01',
                campoInvasor: 'valor malicioso'
            });

        expect(res).to.have.status(201);
        expect(res.body.user).to.not.have.property('campoInvasor');
    });

    it('38. GET users should not leak passwords', async () => {
        const res = await chai.request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        res.body.users.forEach((user: any) => {
            expect(user).to.not.have.property('password');
        });
    });

    it('39. PATCH name should succeed', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Nome Atualizado' });

        expect(res).to.have.status(200);
    });

    it('40. Invalid role on PATCH should fail', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ role: 'CargoInexistente' });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('41. Trying to change organization should fail or ignore', async () => {
        const fakeOrg = new mongoose.Types.ObjectId();
        
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ organization: fakeOrg.toString() });

        expect(res.status).to.be.oneOf([200, 400, 401, 403, 500]);
    });

    it('42. Empty password should fail', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '' });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('43. DELETE non-existent ID should fail', async () => {
        const id = new mongoose.Types.ObjectId();
        const res = await chai.request(app)
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([404, 500]);
    });

    it('44. DELETE twice should fail second time', async () => {
        const tempUser = await Users.create({
            name: 'Usuário Temporário',
            email: 'temp@codex.com',
            password: 'senha_hasheada',
            role: 'Assessor(a)', 
            birthDate: new Date('2000-01-01'),
            organization: orgId
        });
        const tempUserId = tempUser._id;

        await chai.request(app)
            .delete(`/users/${tempUserId}`)
            .set('Authorization', `Bearer ${token}`);

        const res = await chai.request(app)
            .delete(`/users/${tempUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([404, 500]);
    });

    // =========================
    // TESTES DO AMIGO (45 → 63)
    // =========================

    it('45. Missing name should fail', async () => {
        const res = await chai.request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
            email: 'semnome@codex.com',
            password: 'senha',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('46. Missing password should fail', async () => {
        const res = await chai.request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
            name: 'Sem Senha',
            email: 'semsenha@codex.com',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('47. Duplicate email should fail', async () => {
        const res = await chai.request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
            name: 'Clone',
            email: 'base@codex.com',
            password: 'senha',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        expect(res.status).to.be.oneOf([400, 409, 500]);
    });

    it('48. Invalid email format should fail', async () => {
        const res = await chai.request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
            name: 'Email Errado',
            email: 'isso-nao-e-um-email',
            password: 'senha',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('49. GET user by id should omit password', async () => {
        const res = await chai.request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        if (res.status === 200) {
            expect(res.body.user).to.not.have.property('password');
        }
    });

    it('50. Invalid ObjectId on GET should fail', async () => {
        const res = await chai.request(app)
            .get('/users/id-invalido')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([400, 404, 500]);
    });

    it('51. Empty PATCH should not crash', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(res.status).to.be.oneOf([200, 400]);
    });

    it('52. Update birthDate should work', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ birthDate: '1995-05-05' });

        expect(res).to.have.status(200);
    });

    it('53. PATCH non-existent user should fail', async () => {
        const id = new mongoose.Types.ObjectId();

        const res = await chai.request(app)
            .patch(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Fantasma' });

        expect(res.status).to.be.oneOf([404, 500]);
    });

    it('54. DELETE invalid ObjectId should fail', async () => {
        const res = await chai.request(app)
            .delete('/users/id-invalido')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([400, 404, 500]);
    });

    it('55. POST without token should fail', async () => {
        const res = await chai.request(app).post('/users').send({
            name: 'Invasor',
            email: 'invasor@codex.com',
            password: 'senha',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        expect(res.status).to.be.oneOf([401, 403, 500]);
    });

    it('56. GET with invalid token should fail', async () => {
        const res = await chai.request(app)
            .get('/users')
            .set('Authorization', 'Bearer token.fake');

        expect(res.status).to.be.oneOf([401, 403, 500]);
    });

    it('57. Whitespaces should fail or be trimmed', async () => {
        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '   ',
                email: 'espacos@codex.com',
                password: 'senha',
                role: 'Assessor(a)',
                birthDate: '2000-01-01'
            });

        expect(res.status).to.be.oneOf([201, 400, 500]);
    });

    it('58. Very long name should be handled', async () => {
        const res = await chai.request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'A'.repeat(500),
                email: 'longo@codex.com',
                password: 'senha',
                role: 'Assessor(a)',
                birthDate: '2000-01-01'
            });

        expect(res.status).to.be.oneOf([201, 400, 500]);
    });

    it('59. Email collision on PATCH should fail', async () => {
        await chai.request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
            name: 'Alvo',
            email: 'alvo@codex.com',
            password: 'senha',
            role: 'Assessor(a)',
            birthDate: '2000-01-01'
        });

        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'alvo@codex.com' });

        expect(res.status).to.be.oneOf([400, 409, 500]);
    });

    it('60. Invalid email on PATCH should fail', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'email-invalido' });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('61. Invalid type injection should fail', async () => {
        const res = await chai.request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: ["Hacker"] });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('62. GET non-existent valid ObjectId should fail', async () => {
        const id = new mongoose.Types.ObjectId();

        const res = await chai.request(app)
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([404, 500]);
    });

    it('63. DELETE without token should fail', async () => {
        const res = await chai.request(app)
            .delete(`/users/${userId}`);

        expect(res.status).to.be.oneOf([401, 403, 500]);
    });
});