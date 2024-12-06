const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');
const should = chai.should();
const User = require('@user/User');
const data = require('../data.json');

chai.use(chai_http);

let presidentDefault = data.presidentDefault;
let ejDefault = data.ejDefault;
let userDefault = data.userDefault;

describe('@User', async function () {
    it('POST   | USER | sem token de acesso', function (done) {
        chai.request(server)
            .post('/user')
            .send(presidentDefault)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('POST   | USER | token de acesso incorreto', function (done) {
        presidentDefault.token = "token_incorreto";
        chai.request(server)
            .post('/user')
            .send(presidentDefault)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('POST   | USER | token de acesso correto', function (done) {
        chai.request(server)
            .post('/ej')
            .send(ejDefault)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.CREATED);
                presidentDefault = response.body.user;
                done();
            })
    });

    it('POST   | USER | Login com senha incorreta', function (done) {
        chai.request(server)
            .post('/signIn')
            .send({ "email": presidentDefault.email, "password": "senhaerrada" })
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('POST   | USER | Login com email inexistente', function (done) {
        chai.request(server)
            .post('/signIn')
            .send({ "email": "email@gmail.com", "password": "senhasenha" })
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('POST   | USER | Login com dados corretos', function (done) {
        chai.request(server)
            .post('/signIn')
            .send({ "email": presidentDefault.email, "password": "senha" })
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.OK);
                response.body.dados.should.have.property("user");
                response.body.dados.user.should.not.have.property("password");
                response.body.dados.should.have.property("token");
                presidentDefault.token = response.body.dados.token;
                done();
            })
    });

    it('POST   | USER | Cadastrar usuário no sistema sem token', function (done) {
        chai.request(server)
            .post('/user')
            .send(userDefault)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('POST   | USER | Cadastrar usuário no sistema com token', function (done) {
        chai.request(server)
            .post('/user')
            .send(userDefault)
            .set({ "Authorization": `Bearer ${presidentDefault.token}` })
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.CREATED);
                response.body.should.have.property("user");
                userDefault = response.body.user;
                done();
            })
    });

    it('GET   | USER | listar usuários da EJ sem token', function (done) {
        chai.request(server)
            .get('/user')
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('GET   | USER | listar usuários da EJ com token', function (done) {
        chai.request(server)
            .get('/user')
            .set({ "Authorization": `Bearer ${presidentDefault.token}` })
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.OK);
                response.body.should.have.property("users");
                done();
            })
    });

    it('PATCH   | USER | editar usuário da EJ sem token', function (done) {
        chai.request(server)
            .patch(`/user/${userDefault._id}`)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('PATCH   | USER | editar usuário da EJ com token', function (done) {
        chai.request(server)
            .patch(`/user/${userDefault._id}`)
            .send({ "name" : "Novo nome"})
            .set({ "Authorization": `Bearer ${presidentDefault.token}` })
            .end(async function (err, response) {
                response.should.have.status(data.HTTP_CODE.OK);
                const updatedUser = await User.find({ _id: userDefault._id })
                userDefault.name.should.be.not.equals(updatedUser.name);
                done();
            })
    });

    it('DELETE   | USER | excluir usuário da EJ sem token', function (done) {
        chai.request(server)
            .delete(`/user/${userDefault._id}`)
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
                done();
            })
    });

    it('DELETE   | USER | excluir usuário da EJ com token', async function () {
        let users = await User.find({});
        users.length.should.be.equals(3);
        chai.request(server)
            .delete(`/user/${userDefault._id}`)
            .set({ "Authorization": `Bearer ${presidentDefault.token}` })
            .end(async function (err, response) {
                response.should.have.status(data.HTTP_CODE.OK);
                users = await User.find({});
                users.length.should.be.equals(2);
            })
    });
})