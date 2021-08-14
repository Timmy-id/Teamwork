const { expect } = require("chai");
const request = require("supertest");
const client = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

const token = jwt.sign({ userId: 1, email: "jdoe@email.com" }, process.env.jwtSecret);

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
    describe('POST create-user/', function () {
        it('Should create a new user', async function() {
            const req = userRegister;
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(req.userPassword, salt);
            req.userPassword = bcryptPassword;
        
            const res = await postUser(req)
            
            expect(res).to.be.an('object')
            expect(res).to.have.property('status')
            expect(res).to.have.property('data')
        })

        it('Should fail if user exists', async function () {
            const req = userRegister;
            await postUser(req)
            await postUser(req, 400)
        })

        it('it should fail if request is missing body', async function () {
            await postUser({}, 400)
        })
    })

    describe('POST signIn/', function () {
        it('should return a 400 if login details are missing', async function () {
            await loginUser({}, 400)
        })

        it('should return a 400 if user email or password is invalid', async function () {
            await loginUser(userLogin, 400)
        })

        it('should return 200 if user details are correct', async function () {
            const req = userRegister;
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(req.userPassword, salt);
            req.userPassword = bcryptPassword;
            const res = await postUser(req)
            
            const user = await client.query("SELECT * FROM users WHERE email=$1",
                [userLogin.email]);

            const validPassword = await bcrypt.compare(
                userLogin.userPassword,
                user.rows[0].userpassword
            );
            if (validPassword) {
                const res = await loginUser(userLogin)
                expect(res).to.be.an('object')
                expect(res).to.have.property('status')
                expect(res).to.have.property('data')
            }
        })
    })

    async function postUser (req, status=201) {
        const { body } = await request(app)
            .post('/api/v1/auth/create-user')
            .set('token', token)
            .send(req)
            .expect(status)
        return body
    }

    async function loginUser (req, status=200) {
        const { body } = await request(app)
            .post('/api/v1/auth/signin')
            .set('token', token)
            .send(req)
            .expect(status)
        return body
    }
})