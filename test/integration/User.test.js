const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');

/* Project Imports */
const data = require('../datas/users.data.json');
const Member = require('@member/Member');
const User = require('@user/User');
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


describe('@User', () => {
    let EJ_MOCK = {};

    before(async () => {
        const response = await chai.request(server)
        .post('/ej')
        .send({
            ...ejMockDefault
        });

        EJ_MOCK = response.body.ej;
        DEFAULT.ej = EJ_MOCK._id;
        PRESIDENT.ej = EJ_MOCK._id;
        DIRECTOR.ej = EJ_MOCK._id;
        ADVISOR.ej = EJ_MOCK._id;
        TRAINEE.ej = EJ_MOCK._id;
    });


    describe('POST /user', () => {
        const login = {};

        before( async () => {
            login.default = await chai.request(server)
            .post('/sign-in')
            .send({
                email: ejMockDefault.presidentData.email,                
                password: ejMockDefault.presidentData.password,

            });
            DEFAULT.token = login.default.body.dados.token;

            
        });

        afterEach( async () => {
            await User.deleteOne({
                $or: [
                    { 'name': 'Fulano'},
                    {'email': 'teste@codexjr.com.br'}
                ],
            });
        });

        it('01. With all fields empty', async () => {
            
            const response = await chai.request(server)
            .post('/user')
            .set({ 'Authorization' : `Bearer ${DEFAULT.token}`})
            .send({
                name: '',
                email: '',
                role: '',
                password: ''
            }).catch((err) => done(err)); 
            response.body.should.have.property('error');
            response.should.have.status(500);
            response.body.error.should.be.equals('EMPTY_NAME');
        })

        it('02. With name field empty', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                name: '',
            }).catch((err) => done(err));
            response.should.have.status(500);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_NAME');
        });

        it('03. With email field empty', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                email: '',
            }).catch((err) => done(err));
            response.should.have.status(500);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_EMAIL');
        });

        it('04. With role field empty', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                role: '',
            }).catch((err) => done(err));
            response.should.have.status(500);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_ROLE');
        });

        it('05. With password field empty', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                password: '',
            }).catch((err) => done(err));
            response.should.have.status(500);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_PASSWORD');
        });

        it('06. With password field empty', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                password: '',
            }).catch((err) => done(err));
            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('EMPTY_PASSWORD');
        });

        it('07. With all fields filled', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT
            }).catch((err) => done(err));

            response.should.have.status(HTTP_CODE.CREATED);
            response.body.should.have.property('user');

            const user = response.body.user;

            user.name.should.equals(USER_DEFAULT.name);
            user.email.should.equals(USER_DEFAULT.email);
            user.role.should.equals(USER_DEFAULT.role);
            user.password.should.equals(USER_DEFAULT.password);
        });

        it('08. With already email existent', async () => {
            const createUser = await chai.request(server).post('/user').set({
                'Authorization': `Bearer ${DEFAULT.token}`
            })
            .send({
                ...USER_DEFAULT
            }).catch((err) => done(err));

            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT
            }).catch((err) => done(err));
            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.should.have.property('error');
            response.body.error.should.be.equals('Já existe um usuário cadastrado para esse email!');
        });

        it('09. With incorrect email format', async () => {
            const response = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send({
                ...USER_DEFAULT,
                email: 'teste@codex',
            }).catch((err) => done(err));

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property('error');
            response.body.error.should.be.equals('INVALID_EMAIL_FORMAT');
        });
    });

    describe('GET /user', () => {
        
        const login = {};
        before(async () => {

             login.default = await chai.request(server)
            .post('/sign-in')
            .send({
                email: ejMockDefault.presidentData.email,                
                password: ejMockDefault.presidentData.password,
            });
            DEFAULT.token = login.default.body.dados.token;

            const resp = await chai.request(server)
                .post('/user')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(
                    PRESIDENT
                );
            login.president = await chai.request(server)
                .post('/sign-in')
                .send({
                    email: PRESIDENT.email,
                    password: PRESIDENT.password,
                });
                
            
            PRESIDENT.token = login.president.body.dados.token;
            

            /* DIRECTOR */
            await chai.request(server)
                .post('/user')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(DIRECTOR);

            login.director = await chai.request(server)
                .post('/sign-in')
                .send({
                    email: DIRECTOR.email,
                    password: DIRECTOR.password,
                });
            DIRECTOR.token = login.director.body.dados.token;

            /* ADVISOR */
            await chai.request(server)
                .post('/user')
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send(ADVISOR);

            login.advisor = await chai.request(server)
                .post('/sign-in')
                .send({
                    email: ADVISOR.email,
                    password: ADVISOR.password,
                });
            ADVISOR.token = login.advisor.body.dados.token;
        });

        //after(async () => {
        //    await Member.deleteMany({
        //        $or: [
        //            { 'name': 'Fulano Presidente' },
        //            { 'name': 'Fulano Assessor' },
        //            { 'name': 'Fulano Diretor' }
        //        ],
        //    });
        //});

        it('10. No \'Authorization\' field on header', async () => {
            const response = await chai.request(server)
                .get('/user');

           response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('11. Badly formatted \'Authorization\' field on header', async () => {
            const response = await chai.request(server)
                .get('/user')
                .set({ 'Authorization': `Bear ${ADVISOR.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('12. Invalid token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/user')
                .set({ 'Authorization': `Bearer 12345`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

        it('13. Valid Advisor token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/user')
                .set({ 'Authorization': `Bearer ${ADVISOR.token}`});

            response.should.have.status(HTTP_CODE.OK);
        });

        it('14. Valid President token for field \'Authorization\' on header', async () => {
                    const response = await chai.request(server)
                        .get('/user')
                        .set({ 'Authorization': `Bearer ${PRESIDENT.token}`});
        
                    response.should.have.status(HTTP_CODE.OK);
        });

        it('15. Valid Director token for field \'Authorization\' on header', async () => {
            const response = await chai.request(server)
                .get('/user')
                .set({ 'Authorization': `${DIRECTOR.token}`});

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
        });

    });

    describe('PATCH /user/:id', () => {
        const login = {};
        const INVALID_ID = "5630c99bbeee65b2ca1e40c8";
        const EMPTY_ID = "";
         
        before( async () => {
            //await Member.deleteMany({
            //    $or: [
            //        { 'name': 'Fulano Presidente' },
            //        { 'name': 'Fulano Assessor' },
            //        { 'name': 'Fulano Diretor' }
            //    ],
            //});
            const login = {};
            /* PRESIDA */
            login.president = await chai.request(server).post('/sign-in')
            .send({
                email: ejMockDefault.presidentData.email,
                password: ejMockDefault.presidentData.password
            });
            
            DEFAULT.token = login.president.body.dados.token;
            DEFAULT.valid_id = login.president.body.dados.user._id;

            /* director */         
            await chai.request(server)
            .post('/user')
            .set({ 'Authorization' : `Bearer ${DEFAULT.token}`}
            )
            .send(DIRECTOR);

            login.director = await chai.request(server)
            .post('/sign-in')
            .send({
                email: DIRECTOR.email,
                password: DIRECTOR.password,
            });
            
            DIRECTOR.token = login.director.body.dados.token;
            DIRECTOR.valid_id = login.director.body.dados.user._id;

            /* advisor */

            const respo = await chai.request(server)
            .post('/user')
            .set({'Authorization': `Bearer ${DEFAULT.token}`})
            .send(ADVISOR);

            login.advisor = await chai.request(server)
            .post('/sign-in')
            .send({
                email: ADVISOR.email,
                password: ADVISOR.password,
            });

            
            ADVISOR.token = login.advisor.body.dados.token;
            ADVISOR.valid_id = login.advisor.body.dados.user._id;

            /* TRAINEE */
            await chai.request(server)
            .post('/user')
            .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
            .send(TRAINEE);

            login.trainee = await chai.request(server)
            .post('/sign-in')
            .send({
                email: TRAINEE.email,
                password: TRAINEE.password,
            });

            TRAINEE.token = login.trainee.body.dados.token;
            TRAINEE.valid_id = login.trainee.body.dados.user._id;
        });

        it.skip('16. Invalid :id parameter, should fail',
            async () => {
                const response = await chai.request(server)
                .patch(`/user/${INVALID_ID}`)
                .set( { 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    password: "senha123"
                });

                response.should.have.status(HTTP_CODE.FORBIDDEN);
                response.should.have.property('error');
                response.body.error.should.equals("Usuário sem permissão.");
            }
        );

        it('17. Valid :id parameter, but no authorization on header, should fail', async () => {
            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .send({
                    password: "password20"
               });
            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equals("Requisição sem token.");
        });

        it('18. Valid :id parameter, but badly formatted token for field \'Authorization\' on header, should fail', async () => {
                    const response = await chai.request(server)
                        .patch(`/user/${ADVISOR.valid_id}`)
                        .set({ 'Authorization': `Bear ${DEFAULT.token}` })
                        .send({
                            password: "password21"
                        });
        
                    response.should.have.status(HTTP_CODE.UNAUTHORIZED);
                    response.body.should.have.property("error");
                    response.body.error.should.equals("Token mal formatado.");
                });

        it('19. Valid :id parameter, valid Advisor token (on header), but not the owner of user ID passed as parameter, should fail', async () => {
                const response = await chai.request(server)
                    .patch(`/user/${TRAINEE.valid_id}`)
                    .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                    .send({
                        password: "password22"
                    });
                    
                response.should.have.status(HTTP_CODE.FORBIDDEN);
                response.body.should.have.property("error");
                response.body.error.should.equals("Usuário sem permissão.");
        });

        it('20. Valid :id parameter, valid Advisor token (on header) and owner of the ID passed as parameter, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                .send({
                    password: "password23",
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Usuário atualizado com sucesso!");
        });

        it('21. Valid :id parameter and valid President token on header, should succeed', async () => {
                    const response = await chai.request(server)
                        .patch(`/user/${ADVISOR.valid_id}`)
                        .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                        .send({
                            password: "password24",
                        });
        
                    response.should.have.status(HTTP_CODE.OK);
                    response.body.should.have.property("message");
                    response.body.message.should.equals("Usuário atualizado com sucesso!");
        });

        it('22. Valid :id parameter, valid Director token on header, should succeed', async () => {
            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DIRECTOR.token}` })
                .send({
                    password: "password25",
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equals("Usuário atualizado com sucesso!");
        });

        it('23. Valid :id parameter and authorization on header, but fails as email is badly formatted', async () => {
            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                .send({
                    email: "teste@codexjr",
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equals("INVALID_EMAIL_FORMAT");
        });

        it('24. Valid :id parameter and valid authorization on header, but fails as email is already in use', async () => {
                    const response = await chai.request(server)
                        .patch(`/user/${ADVISOR.valid_id}`)
                        .set({ 'Authorization': `Bearer ${DEFAULT.token}` })
                        .send({
                            email: "teste.diretor@codexjr.com.br",
                        });
        
                    response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
                    response.body.should.have.property("error");
                    response.body.error.should.equals("Já existe um usuário cadastrado para esse email!");
                });
                
        it('25. Valid :id parameter, valid Advisor token (owner) on header, should fail on changing role', async () => {
                const response = await chai.request(server)
                    .patch(`/user/${ADVISOR.valid_id}`)
                    .set({ 'Authorization': `Bearer ${ADVISOR.token}` })
                    .send({
                        role: "Trainee",
                    });
    
                response.should.have.status(HTTP_CODE.FORBIDDEN);
                response.body.should.have.property("error");
                response.body.error.should.equals("Usuário sem permissão.");

                // se tem mesmo id params que corresponde ao mesmo do token, pode apenas rebaixar, nada de se autopromover a diretor ou presida
        });

        it('26. Valid :id parameter, valid leadership token on header, should succeed at changing role', async () => {
            const new_role = "Diretor(a)";
            new_role.should.not.equal(ADVISOR.role);

            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ role: new_role });
            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Usuário atualizado com sucesso!");

            const new_response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({ role: ADVISOR.role });
            
            new_response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Usuário atualizado com sucesso!");
        });

        it('27. Valid :id parameter, valid leadership token on header, should succeed on changing department', async () => {
                    const new_department = "Marketing";
                    new_department.should.not.equal(ADVISOR.department);
        
                    const response = await chai.request(server)
                        .patch(`/user/${ADVISOR.valid_id}`)
                        .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                        .send({ department: new_department });
        
                    response.should.have.status(HTTP_CODE.OK);
                    response.body.should.have.property("message");
                    response.body.message.should.equal("Usuário atualizado com sucesso!");
        
                    const new_response = await chai.request(server)
                        .patch(`/user/${ADVISOR.valid_id}`)
                        .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                        .send({ department: ADVISOR.department });
        
                    new_response.should.have.status(HTTP_CODE.OK);
                    response.body.should.have.property("message");
                    response.body.message.should.equal("Usuário atualizado com sucesso!");
        });

        it('28. Valid :id parameter, valid token and authorization on header, should succeed on changing password', async () => {
            // TODO Maybe needing test for other fields?
            const response = await chai.request(server)
                .patch(`/user/${ADVISOR.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}`})
                .send({
                    password: PATCH_DEFAULT.password,
                });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Usuário atualizado com sucesso!");
        });
    });

    describe('DELETE /user/:id',  () => {
        const login = {};
        const INVALID_ID = "5630c99bbeee65b2ca1e40c8";
        const EMPTY_ID = "";
        

        before(async () => {
            await User.deleteOne({name: "Fulano Assessor"});
            await User.deleteOne({ name: "Fulano Trainee"});
            login.default = await chai.request(server)
            .post('/sign-in').send({
                email: ejMockDefault.presidentData.email,
                password: ejMockDefault.presidentData.password,

            });
            
            DEFAULT.token = login.default.body.dados.token;

            /* ADVISOR */
            await chai.request(server)
            .post('/user')
            .set({
                'Authorization': `Bearer ${DEFAULT.token}`
            })
            .send(ADVISOR);

            login.advisor = await chai.request(server)
            .post('/sign-in')
            .send({
                email: ADVISOR.email,
                password: ADVISOR.password
            });
            
            ADVISOR.token = login.advisor.body.dados.token;
            
            ADVISOR.valid_id = login.advisor.body.dados._id;

            /* TRAINEE */
            await chai.request(server)
            .post('/user')
            .set({
                'Authorization': `Bearer ${DEFAULT.token}`
            }).send(TRAINEE);

            login.trainee = await chai.request(server)
            .post('/sign-in')
            .send({
                email: TRAINEE.email,
                password: TRAINEE.password
            });

            TRAINEE.token = login.trainee.body.dados.token;
            TRAINEE.valid_id = login.trainee.body.dados.user._id;
        });

        after( () => {
             User.deleteOne({name: "Fulano Assessor"});
             User.deleteOne({ name: "Fulano Trainee"});
        });

        it('29. With an invalid :id, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${INVALID_ID}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.equal("INVALID_ID");
        });

        it('30. Valid :id parameter, but no\'Authorization\' on the header, should fail', async () => {
                    const response = await chai.request(server)
                        .delete(`/user/${TRAINEE.valid_id}`);
        
                    response.should.have.status(HTTP_CODE.UNAUTHORIZED);
                    response.body.should.have.property("error");
                    response.body.error.should.equal("Requisição sem token.");
        });

        it('31. Valid :id parameter, but badly formatted \'Authorization\' on header, should fail', async () => {
                    const response = await chai.request(server)
                        .delete(`/user/${TRAINEE.valid_id}`)
                        .set({ 'Authorization': `Bear ${DEFAULT.token}` });
        
                    response.should.have.status(HTTP_CODE.UNAUTHORIZED);
                    response.body.should.have.property("error");
                    response.body.error.should.equal("Token mal formatado.");
        
        });

        it('32. Valid :id parameter, with a valid Advisor token on \'Authorization\' on header, should fail', async () => {
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bear ${ADVISOR.token}` });

            response.should.have.status(HTTP_CODE.UNAUTHORIZED);
            response.body.should.have.property("error");
            response.body.error.should.equal("Token mal formatado.");
        });

        it('33. Valid :id parameter, valid leadership token on \'Authorization\' on header, should succeed', async () => {
            
            const response = await chai.request(server)
                .delete(`/user/${TRAINEE.valid_id}`)
                .set({ 'Authorization': `Bearer ${DEFAULT.token}` });

            response.should.have.status(HTTP_CODE.OK);
            response.body.should.have.property("message");
            response.body.message.should.equal("Usuário removido com sucesso!");
        });        
    });

});
