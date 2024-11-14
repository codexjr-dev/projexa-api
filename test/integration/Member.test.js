/* External Libraries */
const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');

/* Project Imports */
const data = require('../datas/members.data.json');
const Member = require("@member/Member");

/* Constants */
const HTTP_CODE = data.HTTP_CODE;
const DEFAULT = data.memberDefault;

chai.use(chai_http);

/* Crie um teste para:
* 01. POST /member, com os campos vazios;
02. POST /member, com o campo de name vazio;
03. POST /member, com o campo de email vazio;
04. POST /member, com o campo de role vazio;
05. POST /member, com o campo de password vazio;
06. POST /member, com o campo de birthDate vazio;
07. POST /member, com o campo de entryDate vazio;
08. POST /member, com o campo de department vazio;
09. POST /member, com todos os campos preenchidos;
10. POST /member, com o campo de email repetido;
11. POST /member, com o campo de email mal formatado;
12. GET /member, sem authorization no header;
13. GET /member, com o token mal formatado no authorization do header;
14. GET /member, com o token invalido no authorization do header;
15. GET /member, com o token válido para Assessor no authorization do header;
16. GET /member, com o token válido para Presidente no authorization do header;
17. GET /member, com o token válido para Diretor(a) no authorization do header;
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

// TODO Autorização
describe('@Member', () => {
    describe('POST', () => {
        before( async () => {
            // TODO Adicionar um administrador no BD ou usar um existente
            const response = await chai.request(server).post('')
        });

        afterEach( async () => {
            // TODO Apagar o usuário recém criado
            const deletedCount = await Member.deleteOne({
                $or: [
                    { 'name': "Fulano" },
                    { 'email': "teste@codexjr.com.br" }
                ],
            });

            deletedCount.length.should.equals(1);
        });

        it('01. Com os campos vazios', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    name: "",
                    email: "",
                    role: "",
                    password: "",
                    birthDate: "",
                    entryDate: "",
                    phone: "",
                    observations: "",
                    habilities: "",
                    department: "",
                }).catch((err) => done(err));

            response.should.have.status(401);
            response.body.should.have.property("error");
            response.body.error.should.be.equals("EMPTY_EMAIL");
        });


        it('02. Com o campo de name vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    name: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.be.equals("EMPTY_NAME");
        });

        it('03. Com o campo de email vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    email: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.be.equals("EMPTY_EMAIL");
        });

        it('04. Com o campo de role vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    role: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.be.equals("EMPTY_ROLE");
        });

        it('05. Com o campo de password vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    password: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.error.should.be.equals("EMPTY_PASSWORD");
        });

        it('06. Com o campo de birthDate vazio', async () => {
            const response = await hai.request(server)
                .post('/member')
                .send({
                    birthDate: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('07. Com o campo de entryDate vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    entryDate: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('08. Com o campo de department vazio', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    department: "",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.CREATED);
        });

        it('09. Com todos os campos preenchidos', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.CREATED);
            response.body.should.have.property("member");
            const thisMember = response.body.member;
            thisMember.name.should.equals(DEFAULT.name);
            thisMember.email.should.equals(DEFAULT.email);
            thisMember.role.should.equals(DEFAULT.role);
            thisMember.birthDate.should.equals(DEFAULT.birthDate);
            thisMember.entryDate.should.equals(DEFAULT.entryDate);
            thisMember.phone.should.equals(DEFAULT.phone);
            thisMember.habilities.should.equals(DEFAULT.habilities);
            thisMember.department.should.equals(DEFAULT.department);
        });

        it('10. Com o campo de email repetido', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.should.be.equals("EMAIL_ALREADY_IN_USE");
        });

        it('11. Com o campo de email mal formatado', async () => {
            const response = await chai.request(server)
                .post('/member')
                .send({
                    email: "fulano@codex",
                    ...DEFAULT,
                });

            response.should.have.status(HTTP_CODE.INTERNAL_ERROR);
            response.body.should.have.property("error");
            response.body.should.be.equals("INVALID_EMAIL_FORMAT");
        });
    });

    describe('GET', async () => {

    });

    describe('PATCH', async () => {
    
    });

    describe('DELETE', async () => {
    
    });

});


