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
        
        userId = baseUser._id.toString();

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

    it('34. With invalid role (not in enum), should fail', async () => {
        const res = await (chai as any).request(app)
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
        expect(res.body).to.have.property('name').that.includes('Error');
    });

    it('35. With invalid birthDate format, should fail', async () => {
        const res = await (chai as any).request(app)
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

    it('36. Forging a different organization ID on creation, should ignore body and use locals', async () => {
        const fakeOrgId = new mongoose.Types.ObjectId();

        const res = await (chai as any).request(app)
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
        expect(res.body.user.organization.toString()).to.not.equal(fakeOrgId.toString());
    });

    it('37. Sending unexpected/extra fields on creation, should ignore them and succeed', async () => {
        const res = await (chai as any).request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Campos Extras',
                email: 'extras@codex.com',
                password: 'senha',
                role: 'Presidente', 
                birthDate: '2000-01-01',
                campoInvasor: 'valor malicioso',
                isCEO: true
            });

        expect(res).to.have.status(201);
        expect(res.body.user).to.not.have.property('campoInvasor');
        expect(res.body.user).to.not.have.property('isCEO');
        expect(res.body.user).to.have.property('name', 'Campos Extras');
    });

    it('38. Fetching users by organization, should return an array and NEVER leak passwords', async () => {
        const res = await (chai as any).request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body.users).to.be.an('array');
        expect(res.body.users.length).to.be.greaterThan(0);
        
        res.body.users.forEach((user: any) => {
            expect(user).to.not.have.property('password');
        });
    });

    it('39. Valid :id and token, updating ONLY the name (Partial Update), should succeed', async () => {
        const res = await (chai as any).request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Nome Atualizado' });

        expect(res).to.have.status(200);
        expect(res.body.user).to.have.property('name', 'Nome Atualizado');
        expect(res.body.user).to.not.have.property('password');
    });

    it('40. Valid :id and token, but sending invalid role bypassing Mongoose, should fail', async () => {
        const res = await (chai as any).request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ role: 'CargoInexistente' });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('41. Valid :id and token, attempting to maliciously change organization, should fail or ignore', async () => {
        const fakeOrg = new mongoose.Types.ObjectId();
        
        const res = await (chai as any).request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ organization: fakeOrg.toString() });

        if (res.status === 200) {
            const returnedOrg = typeof res.body.user.organization === 'object' 
                ? res.body.user.organization._id 
                : res.body.user.organization;
                
            expect(returnedOrg.toString()).to.equal(orgId.toString());
            expect(returnedOrg.toString()).to.not.equal(fakeOrg.toString());
        } else {
            expect(res.status).to.be.oneOf([400, 401, 403, 500]);
        }
    });

    it('42. Valid :id and token, sending empty password string, should fail', async () => {
        const res = await (chai as any).request(app)
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '' });

        expect(res.status).to.be.oneOf([400, 500]);
    });

    it('43. Deleting a valid ObjectId that does not exist in DB, should return error (Not Found)', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        
        const res = await (chai as any).request(app)
            .delete(`/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.be.oneOf([404, 500]); 
    });

    it('44. Calling DELETE twice for the same user (Idempotency), should fail on the second try', async () => {
        const firstRes = await (chai as any).request(app)
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(firstRes).to.have.status(200);

        const secondRes = await (chai as any).request(app)
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(secondRes.status).to.be.oneOf([404, 500]);
    });
});