const { expect } = require("chai");
const request = require("supertest");
const client = require("../../db");
require("dotenv").config();

let app;
const userRegister = {
    firstName: "John",
    lastName: "Doe",
    email: "jdoe@gmail.com",
    userPassword: "johndoe",
    gender: "Male",
    jobRole: "Secretary",
    department: "Administration",
    userAddress: "Awolowo way, Ibadan"
}

const userLogin = {
    email: "jdoe@gmail.com",
    userPassword: "johndoe"
}

describe ('Articles route', function () {
    before(async function () {
        app = require("../../index");
    })

    beforeEach('Create temporary table', async function () {
        await client.query('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)')
        await client.query('CREATE TEMPORARY TABLE articles (LIKE articles INCLUDING ALL)')
    })
    afterEach('Drop temporary table', async function () {
        await client.query('DROP TABLE IF EXISTS pg_temp.users')
        await client.query('DROP TABLE IF EXISTS pg_temp.articles')
    })
    describe('POST /articles', function () {
        it('should return 201 if article is created', function (done) {
            request(app)
                .post('/api/v1/auth/create-user')
                .send(userRegister)
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.be.an('object')
                    request(app)
                        .post('/api/v1/auth/signin')
                        .send(userLogin)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.be.an('object')
                            let token = res.body.data.token;
                            request(app)
                                .post('/api/v1/articles')
                                .set({token: token})
                                .send({
                                    title: "My title",
                                    article: "My article",
                                    user_id: res.body.data.userId
                                })
                                .expect(201)
                                .end((err, res) => {
                                    done()
                                })
                        })
                })
        })

        it('should return 400 if missing credentials', function (done) {
            request(app)
                .post('/api/v1/auth/create-user')
                .send(userRegister)
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.be.an('object')
                    request(app)
                        .post('/api/v1/auth/signin')
                        .send(userLogin)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.be.an('object')
                            let token = res.body.data.token;
                            request(app)
                                .post('/api/v1/articles')
                                .set({token: token})
                                .send({})
                                .expect(400)
                                .end((err, res) => {
                                    done()
                                })
                        })
                })
        })

        it('should return 401 if not authorized', function (done) {
            request(app)
                .post('/api/v1/articles')
                .send({
                    title: "My title",
                    article: "My article",
                    user_id: 1
                })
                .expect(401)
                .end((err, res) => {
                    done()
                })
        })
    })
})