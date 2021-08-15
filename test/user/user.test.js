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

describe ('Users route', function () {
    before(async function () {
        app = require("../../index");
    })

    beforeEach('Create temporary table', async function () {
        await client.query('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)')
    })
    afterEach('Drop temporary table', async function () {
        await client.query('DROP TABLE IF EXISTS pg_temp.users')
    })
    describe('POST /create-user', function () {
        it('Should create a new user', function(done) {
            request(app)
                .post('/api/v1/auth/create-user')
                .send(userRegister)
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.be.an('object')
                    done()
                })
        })

        it('Should return 400 if missing credentials', function(done) {
            request(app)
                .post('/api/v1/auth/create-user')
                .send({})
                .expect(400)
                .end((err, res) => {
                    done()
                })
        })
    })

    describe('POST /signIn', function () {
        it('should return a 200 if user details are correct', function (done) {
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
                            done()
                        })
                })
        })

        it('should return a 400 if missing credentials', function (done) {
            request(app)
                .post('/api/v1/auth/create-user')
                .send(userRegister)
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.be.an('object')
                    request(app)
                        .post('/api/v1/auth/signin')
                        .send({})
                        .expect(400)
                        .end((err, res) => {
                            done()
                        })
                })
        })
    })
})