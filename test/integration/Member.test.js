/* External Libraries */
const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');

/* Project Imports */
const data = require('../datas/members.data.json');
const Member = require('@member/Member');

/* Constants */
const HTTP_CODE = data.HTTP_CODE;
const DEFAULT = data.memberDefault;
const ADVISOR = data.memberAdvisor;
const DIRECTOR = data.memberDirector;
const PRESIDENT = data.memberDirector;
const PATCH_DEFAULT = data.patchDefault;
const ejDefault = require('../data.json').ejDefault;

chai.use(chai_http);

/* Crie um teste para:
* 01. POST /member, com os campos vazios;
* 02. POST /member, com o campo de name vazio;
* 03. POST /member, com o campo de email vazio;
* 04. POST /member, com o campo de role vazio;
* 05. POST /member, com o campo de password vazio;
* 06. POST /member, com o campo de birthDate vazio;
* 07. POST /member, com o campo de entryDate vazio;
* 08. POST /member, com o campo de department vazio;
* 09. POST /member, com todos os campos preenchidos;
* 10. POST /member, com o campo de email repetido;
* 11. POST /member, com o campo de email mal formatado;
* 12. GET /member, sem authorization no header;
* 13. GET /member, com o token mal formatado no authorization do header;
* 14. GET /member, com o token invalido no authorization do header;
* 15. GET /member, com o token válido para Assessor no authorization do header;
* 16. GET /member, com o token válido para Presidente no authorization do header;
* 17. GET /member, com o token válido para Diretor(a) no authorization do header;
18. PATCH /member/:id, com um :id invalido;
19. PATCH /member/:id, sem um :id;
20. PATCH /member/:id, com um :id válido, mas sem authorization no header;
21. PATCH /member/:id, com um :id válido, mas com o token mal formatado no authorization do header;
22. PATCH /member/:id, com um :id válido, mas com o token válido para Assessor (não dono do Membro) no authorization do header;
23. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header;
24. PATCH /member/:id, com um :id válido, com o token válido para Presidente no authorization do header;
25. PATCH /member/:id, com um :id válido, com o token válido para Diretor(a) no authorization do header;
26. PATCH /member/:id, com um :id válido, com o token válido e com permissão no authorization do header, mas com email mal formatado;
27. PATCH /member/:id, com um :id válido, com o token válido e com permissão no authorization do header, mas com email mal repetido;
28. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header, buscando alterar o role;
29. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header, buscando alterar a diretoria;
30. PATCH /member/:id, com um :id válido, com o token válido para Liderança no authorization do header, buscando alterar o role;
31. PATCH /member/:id, com um :id válido, com o token válido para Liderança no authorization do header, buscando alterar a diretoria;
32. PATCH /member/:id, com um :id válido, com o token válido e com permissão no authorization do header, alterando os demais campos;
33. DELETE /member/:id, com o :id invalido;
34. DELETE /member/:id, sem um :id;
35. DELETE /member/:id, com um :id válido, mas sem authorization no header;
36. DELETE /member/:id, com um :id válido, com o token mal formatado no authorization do header;
37. DELETE /member/:id, com um :id válido, mas com o token válido para Assessor no authorization do header;
38. DELETE /member/:id, com um :id válido, com o token válido para Liderança no authorization do header;
*/
describe('@Member', () => {
    before( async () => {
        const login = await chai.request(server).post('/signIn').send({
            email: ejDefault.presidentData.email,
            password: ejDefault.presidentData.password,
        });
        DEFAULT.token = login.body.dados.token;
    });

    describe('POST', () => {

        afterEach( async () => {
            // Apagar o usuário recém criado
            const deletedCount = await Member.deleteOne({
                $or: [
                    { 'name': 'Fulano' },
                    { 'email': 'teste.presidente@codexjr.com.br' }
                ],
            });
        });

        it('01. Com os campos vazios', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    name: '',
                    email: '',
                    role: '',
                    password: '',
                    birthDate: '',
                    entryDate: '',
                    phone: '',
                    observations: '',
                    habilities: '',
                    department: '',
                }).catch((err) => done(err));

            response.should.have.status(500);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_EMAIL');
        });


        it('02. Com o campo de name vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    name: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_NAME');
        });

        it('03. Com o campo de email vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    email: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_EMAIL');
        });

        it('04. Com o campo de role vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    role: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_ROLE');
        });

        it('05. Com o campo de password vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    password: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_PASSWORD');
        });

        it('06. Com o campo de birthDate vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    birthDate: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('07. Com o campo de entryDate vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    entryDate: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('08. Com o campo de department vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    department: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('09. Com todos os campos preenchidos', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.CREATED);
            response.body.should.have.property('member');
            const thisMember = response.body.member;
            thisMember.name.should.equals(DEFAULT.name);
            thisMember.email.should.equals(DEFAULT.email);
            thisMember.role.should.equals(DEFAULT.role);
            thisMember.birthDate.should.equals(DEFAULT.birthDate);
            thisMember.entryDate.should.equals(DEFAULT.entryDate);
            thisMember.phone.should.equals(DEFAULT.phone);
            response.body.member.should.have.property('habilities');
            thisMember.habilities.length.should.equals(DEFAULT.habilities.length);
            thisMember.department.should.equals(DEFAULT.department);
        });

        it('10. Com o campo de email repetido', async () => {
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(DEFAULT);
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(DEFAULT);

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMAIL_ALREADY_IN_USE');
        });

        it('11. Com o campo de email mal formatado', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    email: 'fulano@codex',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('INVALID_EMAIL_FORMAT');
        });
    });

    describe('GET', () => {
        before(async () => {
            // DIRECTOR
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(DIRECTOR);
            const login_director = await chai.request(server).post('/signIn').send({
                email: DIRECTOR.email,
                password: DIRECTOR.password,
            });
            DIRECTOR.token = login_director.body.dados.token;

            // ADVISOR
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(ADVISOR);
            const login_advisor = await chai.request(server).post('/signIn').send({
                email: ADVISOR.email,
                password: ADVISOR.password,
            });
            DEFAULT.token = login_advisor.body.dados.token;

            // PRESIDENT
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(PRESIDENT);
            const login_president = await chai.request(server).post('/signIn').send({
                email: PRESIDENT.email,
                password: PRESIDENT.password,
            });
            PRESIDENT.token = login_president.body.dados.token;
        });

        after(async () => {
            // Apagar os membros recém criados
            await Member.deleteMany({
                $or: [
                    { 'name': 'Fulano Presidente' },
                    { 'name': 'Fulano Assessor' },
                    { 'name': 'Fulano Diretor' }
                ],
            });
        });

        it('12. Sem authorization no header', async () => {
            const response = await chai.request(server)
                .get('/member');

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('13. Com o token mal formatado no authorization do header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ "Authorization": `Bear ${DEFAULT.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('14. Com o token invalido no authorization do header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ "Authorization": `Bearer 12345`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('15. Com o token válido para Assessor no authorization do header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ "Authorization": `Bearer ${ADVISOR.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('16. Com o token válido para Presidente no authorization do header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ "Authorization": `Bearer ${PRESIDENT.token}`});

            response.should.have.status(HTTP_CODE.OK);
        });

        it('17. Com o token válido para Diretor(a) no authorization do header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ "Authorization": `${DIRECTOR.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });
    });

    describe('PATCH', () => {
        let VALID_ID_PRES;
        let VALID_ID_DIR;
        let VALID_ID_ADV;

        before(async () => {
            // DIRECTOR
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(DIRECTOR);
            const login_director = await chai.request(server).post('/signIn').send({
                email: DIRECTOR.email,
                password: DIRECTOR.password,
            });
            DIRECTOR.token = login_director.body.dados.token;

            // ADVISOR
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(ADVISOR);
            const login_advisor = await chai.request(server).post('/signIn').send({
                email: ADVISOR.email,
                password: ADVISOR.password,
            });
            DEFAULT.token = login_advisor.body.dados.token;

            // PRESIDENT
            await chai.request(server)
                .post('/member')
                .set({ "Authorization": `Bearer ${DEFAULT.token}`})
                .send(PRESIDENT);
            const login_president = await chai.request(server).post('/signIn').send({
                email: PRESIDENT.email,
                password: PRESIDENT.password,
            });
            PRESIDENT.token = login_president.body.dados.token;
        });

        it('18. Com um :id invalido', async () => {
            // const response = await chai.request(server)
            //     .patch('/member/:id')
            //     .send(PATCH_DEFAULT);
        });

        it('19. Sem um :id', async () => {

        });

        it('20. Com um :id válido, mas sem authorization no header', async () => {

        });

        it('21. Com um :id válido, mas com o token mal formatado no authorization do header', async () => {

        });

        it('22. Com um :id válido, mas com o token válido para Assessor (não dono do Membro) no authorization do header', async () => {

        });

        it('23. Com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header', async () => {

        });

        it('24. Com um :id válido, com o token válido para Presidente no authorization do header', async () => {

        });

        it('25. Com um :id válido, com o token válido para Diretor(a) no authorization do header', async () => {

        });

        it('26. Com um :id válido, com o token válido e com permissão no authorization do header, mas com email mal formatado', async () => {

        });

        it('27. Com um :id válido, com o token válido e com permissão no authorization do header, mas com email mal repetido', async () => {

        });

        it('28. Com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header, buscando alterar o role', async () => {

        });

        it('29. Com um :id válido, com o token válido para Assessor (dono do Membro) no authorization do header, buscando alterar a diretoria', async () => {

        });

        it('30. Com um :id válido, com o token válido para Liderança no authorization do header, buscando alterar o role', async () => {

        });

        it('31. Com um :id válido, com o token válido para Liderança no authorization do header, buscando alterar a diretoria', async () => {

        });

        it('32. Com um :id válido, com o token válido e com permissão no authorization do header, alterando os demais campos', async () => {

        });
    });

    describe('DELETE', async () => {
        beforeEach( () => {
            //TODO Criar um usuário para ser apagado
        });

        afterEach( () => {
            //TODO Apagar o usuário criado, se ainda existir
        });

        it('33. Com o :id invalido', async () => {
            const response = await chai.request(server).delete('');
        });

        it('34. Sem um :id', async () => {

        });

        it('35. Com um :id válido, mas sem authorization no header', async () => {

        });

        it('36. Com um :id válido, com o token mal formatado no authorization do header', async () => {

        });

        it('37. Com um :id válido, mas com o token válido para Assessor no authorization do header', async () => {

        });

        it('38. Com um :id válido, com o token válido para Liderança no authorization do header', async () => {

        });
    });
});


