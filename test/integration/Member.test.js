/* External Libraries */

const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');

/* Project Imports */
const data = require('../datas/members.data.json');
const Member = require('@member/Member');
const ejDefault = require('../data.json').ejDefault;
const USER_DEFAULT = require('../data.json').userDefault;

/* Constants */
const HTTP_CODE = data.HTTP_CODE;
const DEFAULT = data.memberDefault;
const TRAINEE = data.memberTrainee;
const ADVISOR = data.memberAdvisor;
const DIRECTOR = data.memberDirector;
const PRESIDENT = data.memberDirector;
const PATCH_DEFAULT = data.patchDefault;
const ejMockDefault = data.ejDefault;


chai.use(chai_http);
chai.should();

describe('@Member', () => {
    let EJ_MOCK = {};
    

    before(async () => {
        const response = await chai.request(server)
            .post('/ej')
            .send({
                ...ejMockDefault,
                name: "CodeX Jr. 2",
            });
        EJ_MOCK = response.body.ej;
        console.log("O body: ",response.body);
        DEFAULT.ej = EJ_MOCK._id;
        PRESIDENT.ej = EJ_MOCK._id;
        DIRECTOR.ej = EJ_MOCK._id;
        ADVISOR.ej = EJ_MOCK._id;
        TRAINEE.ej = EJ_MOCK._id;
    });

    describe('POST /member', () => {
        const login = {};

        before( async () => {
            login.default = await chai.request(server).post('/sign-in').send({
                email: ejMockDefault.presidentData.email,
                password: ejMockDefault.presidentData.password,
            });
            console.log(login.default.body);
            DEFAULT.token = login.default.body.dados.token;
        });

        //afterEach( async () => {
        //    await Member.deleteOne({
        //        $or: [
        //            { 'name': 'Fulano Presidente' },
        //            { 'email': 'teste.presidente@codexjr.com.br' }
        //        ],
        //    });
        //});

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
            response.body.error.should.be.equals('EMPTY_NAME');
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
            DIRECTOR.valid_id = login.director.body.dados.member._id;

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
            ADVISOR.valid_id = login.advisor.body.dados.member._id;

            /* TRAINEE */
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
                    password: "password18"
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("INVALID_ID");
        });

        // TODO There is no PATCH /member/ route without an ID.
        it.skip('19. No :id parameter, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${EMPTY_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    password: "password19"
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("EMPTY_ID");
        });

        it('20. Valid :id parameter, but no authorization on header, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .send({
                    password: "password20"
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
                    password: "password21"
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
                    password: "password22"
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
                    password: "password23",
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
                    password: "password24",
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Membro atualizado com sucesso!");
        });

        it('25. Valid :id parameter, valid Director token on header, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DIRECTOR.token}` })
                .send({
                    password: "password25",
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Membro atualizado com sucesso!");
        });

        it('26. Valid :id parameter and authorization on header, but fails as email is badly formatted', async () => {
            const response = await chai.request(server)
                .patch(`/member/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
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
        });
    });

    describe('DELETE /member/:id', async () => {
        const login = {};
        const INVALID_ID = "5630c99bbeee65b2ca1e40c8";
        const EMPTY_ID = "";

        before(async () => {
            login.default = await chai.request(server).post('/signIn').send({
                email: ejDefault.presidentData.email,
                password: ejDefault.presidentData.password,
            });
            DEFAULT.token = login.default.body.dados.token;

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
            ADVISOR.valid_id = login.advisor.body.dados.member._id;

            /* TRAINEE */
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

        //afterEach(async () => {
        //    await Member.deleteOne({ name: "Fulano Assessor"});
        //    await Member.deleteOne({ name: "Fulano Trainee"});
        //});
//
        it('33. With an invalid :id, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${INVALID_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equal("INVALID_ID");
        });

        // TODO There isn't any DELETE /member/ route without an ID.
        it.skip('34. Without any :id, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${EMPTY_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equal("EMPTY_ID");
        });

        it('35. Valid :id parameter, but no\'Authorization\' on the header, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`);

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equal("Requisição sem token.");
        });

        it('36. Valid :id parameter, but badly formatted \'Authorization\' on header, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bear ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equal("Token mal formatado.");

        });

        it('37. Valid :id parameter, with a valid Advisor token on \'Authorization\' on header, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bear ${ADVISOR.token}` });

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equal("Token mal formatado.");
        });

        it('38. Valid :id parameter, valid leadership token on \'Authorization\' on header, should succeed', async () => {
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Membro removido com sucesso!");
        });
    });
});
