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
const TRAINEE = data.memberTrainee;
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
* 13. GET /member, com o token mal formatado no campo \'Authorization\' do cabeçalho;
* 14. GET /member, com o token invalido no campo \'Authorization\' do cabeçalho;
* 15. GET /member, com o token válido para Assessor no campo \'Authorization\' do cabeçalho;
* 16. GET /member, com o token válido para Presidente no campo \'Authorization\' do cabeçalho;
* 17. GET /member, com o token válido para Diretor(a) no campo \'Authorization\' do cabeçalho;
* 18. PATCH /member/:id, com um :id invalido;
* 19. PATCH /member/:id, sem um :id;
* 20. PATCH /member/:id, com um :id válido, mas sem authorization no header;
* 21. PATCH /member/:id, com um :id válido, mas com o token mal formatado no campo \'Authorization\' do cabeçalho;
* 22. PATCH /member/:id, com um :id válido, mas com o token válido para Assessor (não dono do Membro) no campo \'Authorization\' do cabeçalho;
* 23. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no campo \'Authorization\' do cabeçalho;
* 24. PATCH /member/:id, com um :id válido, com o token válido para Presidente no campo \'Authorization\' do cabeçalho;
* 25. PATCH /member/:id, com um :id válido, com o token válido para Diretor(a) no campo \'Authorization\' do cabeçalho;
* 26. PATCH /member/:id, com um :id válido, com o token válido e com permissão no campo \'Authorization\' do cabeçalho, mas com email mal formatado;
* 27. PATCH /member/:id, com um :id válido, com o token válido e com permissão no campo \'Authorization\' do cabeçalho, mas com email mal repetido;
* 28. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no campo \'Authorization\' do cabeçalho, buscando alterar o role;
* 29. PATCH /member/:id, com um :id válido, com o token válido para Assessor (dono do Membro) no campo \'Authorization\' do cabeçalho, buscando alterar a diretoria;
* 30. PATCH /member/:id, com um :id válido, com o token válido para Liderança no campo \'Authorization\' do cabeçalho, buscando alterar o role;
* 31. PATCH /member/:id, com um :id válido, com o token válido para Liderança no campo \'Authorization\' do cabeçalho, buscando alterar a diretoria;
* 32. PATCH /member/:id, com um :id válido, com o token válido e com permissão no campo \'Authorization\' do cabeçalho, alterando os demais campos;
33. DELETE /member/:id, com o :id invalido;
34. DELETE /member/:id, sem um :id;
35. DELETE /member/:id, com um :id válido, mas sem authorization no header;
36. DELETE /member/:id, com um :id válido, com o token mal formatado no campo \'Authorization\' do cabeçalho;
37. DELETE /member/:id, com um :id válido, mas com o token válido para Assessor no campo \'Authorization\' do cabeçalho;
38. DELETE /member/:id, com um :id válido, com o token válido para Liderança no campo \'Authorization\' do cabeçalho;
*/
describe('@Member', () => {
    describe('POST /member', () => {
        const login = {};

        before( async () => {
            login.default = await chai.request(server).post('/signIn').send({
                email: ejDefault.presidentData.email,
                password: ejDefault.presidentData.password,
            });
            DEFAULT.token = login.default.body.dados.token;
        });

        afterEach( async () => {
            await Member.deleteOne({
                $or: [
                    { 'name': 'Fulano' },
                    { 'email': 'teste.presidente@codexjr.com.br' }
                ],
            });
        });

        it('01. With all fields empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
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


        it('02. With the \'name\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    name: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_NAME');
        });

        it('03. With the \'email\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    email: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_EMAIL');
        });

        it('04. With the \'role\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    role: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_ROLE');
        });

        it('05. With the \'passwordz\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    password: '',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_PASSWORD');
        });

        it('06. With the \'birthDate\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    birthDate: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('07. With the \'entryDate\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    entryDate: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('08. With the \'department\' field empty', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    department: '',
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('09. With all fields properly filled', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
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

        it('10. With an already existing \'email\'', async () => {
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(DEFAULT);
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(DEFAULT);

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMAIL_ALREADY_IN_USE');
        });

        it('11. With a badly formatted \'email\'', async () => {
            const response = await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    ...DEFAULT,
                    email: 'fulano@codex',
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('INVALID_EMAIL_FORMAT');
        });
    });

    describe('GET /member', () => {
        const login = {};

        before(async () => {
            /* PRESIDENT */
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(PRESIDENT);
            login.president = await chai.request(server)
                .post('/signIn')
                .send({
                    email: PRESIDENT.email,
                    password: PRESIDENT.password,
                });
            PRESIDENT.token = login.president.body.dados.token;

            /* DIRECTOR */
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(DIRECTOR);
            login.director = await chai.request(server)
                .post('/signIn')
                .send({
                    email: DIRECTOR.email,
                    password: DIRECTOR.password,
                });
            DIRECTOR.token = login.director.body.dados.token;

            /* ADVISOR */
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(ADVISOR);
            login.advisor = await chai.request(server)
                .post('/signIn')
                .send({
                    email: ADVISOR.email,
                    password: ADVISOR.password,
                });
            ADVISOR.token = login.advisor.body.dados.token;
        });

        after(async () => {
            await Member.deleteMany({
                $or: [
                    { 'name': 'Fulano Presidente' },
                    { 'name': 'Fulano Assessor' },
                    { 'name': 'Fulano Diretor' }
                ],
            });
        });

        it('12. No \'Authorization\' field on header', async () => {
            const response = await chai.request(server)
                .get('/member');

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('13. Badly formatted \'Authorization\' field on header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ 'Authorization': `Bear ${DEFAULT.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('14. Invalid token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ 'Authorization': `Bearer 12345`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('15. Valid Advisor token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ 'Authorization': `Bearer ${ADVISOR.token}`});

            response.should.have.status(HTTP_CODE.OK);
        });

        it('16. Valid President token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ 'Authorization': `Bearer ${PRESIDENT.token}`});

            response.should.have.status(HTTP_CODE.OK);
        });

        it('17. Valid Director token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/member')
                .set({ 'Authorization': `${DIRECTOR.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });
    });

    describe('PATCH /member/:id', () => {
        const login = {};
        const INVALID_ID = "5630c99bbeee65b2ca1e40c8";
        const EMPTY_ID = "";

        before(async () => {
            const login = {};
            login.president = await chai.request(server).post('/signIn').send({
                email: ejDefault.presidentData.email,
                password: ejDefault.presidentData.password,
            });
            DEFAULT.token = login.president.body.dados.token;
            DEFAULT.valid_id = login.president.body.dados.member._id;

            // DIRECTOR
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(DIRECTOR);
            login.director = await chai.request(server)
                .post('/signIn')
                .send({
                    email: DIRECTOR.email,
                    password: DIRECTOR.password,
                });
            DIRECTOR.token = login.director.body.dados.token;
            DIRECTOR.valid_id = login.director.body.dados.member._id;

            // ADVISOR
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(ADVISOR);
            login.advisor = await chai.request(server)
                .post('/signIn')
                .send({
                    email: ADVISOR.email,
                    password: ADVISOR.password,
                });
            ADVISOR.token = login.advisor.body.dados.token;
            ADVISOR.valid_id = login.advisor.body.dados.member._id;

            // TRAINEE
            await chai.request(server)
                .post('/member')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(TRAINEE);
            login.trainee = await chai.request(server)
                .post('/signIn')
                .send({
                    email: TRAINEE.email,
                    password: TRAINEE.password,
                });
            TRAINEE.token = login.trainee.body.dados.token;
            TRAINEE.valid_id = login.trainee.body.dados.member._id;
        });

        it('18. Invalid :id parameter, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${INVALID_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    email: "teste.18@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("INVALID_ID");
        });

        it('19. No :id parameter, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${EMPTY_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    email: "teste.19@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("EMPTY_ID");
        });

        it('20. Valid :id parameter, but no authorization on header, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .send({
                    email: "teste.20@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equals("Requisição sem token.");
        });

        it('21. Valid :id parameter, but badly formatted token for field \'Authorization\' on header, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bear ${DEFAULT.token}` })
                .send({
                    email: "teste.21@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equals("Token mal formatado.");
        });

        it('22. Valid :id parameter, valid Advisor token (on header), but not the owner of member ID passed as parameter, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                .send({
                    email: "teste.22@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.FORBIDDEN);
            response.body.should.have.property("error");
            response.body.error.should.equals("Usuário sem permissão.");
        });

        it('23. Valid :id parameter, valid Advisor token (on header) and owner of the ID passed as parameter, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                .send({
                    email: "teste.23@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Membro atualizado com sucesso!");
        });

        it('24. Valid :id parameter and valid President token on header, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    email: "teste.24@codexjr.com.br"
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Membro atualizado com sucesso!");
        });

        it('25. Valid :id parameter, valid Director token on header, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DIRECTOR.token}` })
                .send(PATCH_DEFAULT);

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Membro atualizado com sucesso!");
        });

        it('26. Valid :id parameter and authorization on header, but fails as email is badly formatted', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    ...PATCH_DEFAULT,
                    email: "teste@codexjr",
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.message.should.equals("INVALID_EMAIL_FORMAT");
        });

        it('27. Valid :id parameter and valid authorization on header, but fails as email is already in use', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    email: "teste.diretor@codexjr.com.br",
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("EMAIL_ALREADY_IN_USE");
        });

        it('28. Valid :id parameter, valid Advisor token (owner) on header, should fail on changing role', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                .send({
                    role: "Trainee",
                });


            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("NO_PERMISSION");
        });

        it('29. Valid :id parameter and valid Advisor token (owner) on header, should fail on changing department', async () => {
            const new_department = "Negócios";
            new_department.should.not.equal(ADVISOR.department);

            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                .send({
                    department: new_department,
                });


            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            /* Currently no error message is set for this case */
            // response.body.error.should.equals();
        });

        it('30. Valid :id parameter, valid leadership token on header, should succeed at changing role', async () => {
            const new_role = "Diretor(a)";
            new_role.should.not.equal(ADVISOR.role);

            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ role: new_role });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro atualizado com sucesso!");

            const new_response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ role: ADVISOR.role });

            new_response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro atualizado com sucesso!");
        });

        it('31. Valid :id parameter, valid leadership token on header, should succeed on changing department', async () => {
            const new_department = "Marketing";
            new_department.should.not.equal(ADVISOR.department);

            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ department: new_department });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro atualizado com sucesso!");

            const new_response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ department: ADVISOR.department });

            new_response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro atualizado com sucesso!");
        });

        it('32. Valid :id parameter, valid token and authorization on header, should succeed on changing password', async () => {
            // TODO Maybe needing test for other fields?
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    password: PATCH_DEFAULT.password,
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro atualizado com sucesso!");
            // response.body.member.email.equal("teste.novo@codexjr.com.br");
            // response.body.member.role.equal("Trainee");
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

        it('36. Com um :id válido, com o token mal formatado no campo \'Authorization\' do cabeçalho', async () => {

        });

        it('37. Com um :id válido, mas com o token válido para Assessor no campo \'Authorization\' do cabeçalho', async () => {

        });

        it('38. Com um :id válido, com o token válido para Liderança no campo \'Authorization\' do cabeçalho', async () => {

        });
    });
});


