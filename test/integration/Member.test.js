const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');
const data = require('../datas/members.data.json');
const HTTP_CODE = data.HTTP_CODE;

chai.use(chai_http);

/* Crie um teste para:
01. POST /member, com os campos vazios;
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
describe('POST', async () => {
    test('/member | Com os campos vazios', () => {
        chai.request(server)
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
            })
            .end(async (err, response) => {
                response.should.have.status(HTTP_CODE.INTERNAL_SERVER_ERROR);
                response.body.should.have.property("error");
                response.body.error.should.be.equals('EMPTY_EMAIL');
                done();
            });
    });

});

describe('GET', async () => {

});

describe('PATCH', async () => {

});

describe('DELETE', async () => {

});
