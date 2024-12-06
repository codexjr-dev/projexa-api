const chai = require('chai');
const server = require('../../src/server');
const chai_http = require('chai-http');
const should = chai.should();
const Ej = require('@ej/Ej');
const User = require('@user/User');
const data = require('../data.json');

chai.use(chai_http);

const ejDefault = data.ejDefault;

describe('@EJ', async function () {
    it('POST   | EJ | Cadastro de EJ', function (done) {
        chai.request(server)
            .post('/ej')
            .send(ejDefault)
            .end(async function (err, response) {
                response.should.have.status(data.HTTP_CODE.CREATED);
                const users = await User.find({});
                const ejs = await Ej.find({});
                users.length.should.be.equals(1);
                ejs.length.should.be.equals(1);
                done();
            })
    });

    it('GET   | EJ | Get EJs cadastradas', function (done) {
        chai.request(server)
            .get('/ej')
            .end(function (err, response) {
                response.should.have.status(data.HTTP_CODE.OK);
                response.body.should.have.property("ejs");
                done();
            })
    });



    // it('POST   | USER | token de acesso incorreto', function (done) {
    //     default_adm.token = "token_incorreto";
    //     chai.request(server)
    //         .post('/adm')
    //         .send(default_adm)
    //         .end(function (err, response) {
    //             response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
    //             done();
    //         })
    // });

    // it('POST   | USER | Login com senha incorreta', function (done) {
    //     chai.request(server)
    //         .post('/adm/signIn')
    //         .send({ "email": default_adm.email, "password": "senhaerrada" })
    //         .end(function (err, response) {
    //             response.should.have.status(data.HTTP_CODE.UNAUTHORIZED);
    //             done();
    //         })
    // });

    // it('POST   | USER | Login com email inexistente', function (done) {
    //     chai.request(server)
    //         .post('/adm/signIn')
    //         .send({ "email": "email@gmail.com", "password": "senhasenha" })
    //         .end(function (err, response) {
    //             response.should.have.status(data.HTTP_CODE.NOT_FOUND);
    //             done();
    //         })
    // });

    // it('POST   | USER | Login com dados corretos', function (done) {
    //     chai.request(server)
    //         .post('/adm/signIn')
    //         .send({ "email": default_adm.email, "password": "senhasenha" })
    //         .end(function (err, response) {
    //             response.should.have.status(data.HTTP_CODE.OK);
    //             response.body.should.have.property("adm");
    //             response.body.adm.should.not.have.property("token_list");
    //             response.body.adm.should.not.have.property("password");
    //             response.body.should.have.property("token");
    //             default_adm = response.body.adm;
    //             default_adm.token_list = [response.body.token];
    //             done();
    //         })
    // });
})