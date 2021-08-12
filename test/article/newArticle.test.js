// const { expect } = require("chai");
// const request = require("supertest");
// const client = require("../../db");
// const bcrypt = require("bcryptjs");
// // const jwtGenerator = require("../../utils/jwtGenerator");
// const Pool = require('pg').Pool;
// require("dotenv").config();

// describe ('User route', function () {
//     let app;
//     before('Mock db connection and load app', async function () {
//         const pool = new Pool({
//             host: process.env.HOST,
//             user: process.env.USER,
//             password: process.env.PASSWORD,
//             port: process.env.PORT,
//             database: process.env.DATABASE,
//             max: 1,
//             idleTimeoutMillis: 0
//         })

//         client.query = (text, values) => {
//             return pool.query(text, values)
//         }
//         app = require("../../index");
//     })

//     beforeEach('Create temporary table', async function () {
//         await client.query('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)')
//     })
//     afterEach('Drop temporary table', async function () {
//         await client.query('DROP TABLE IF EXISTS pg_temp.users')
//     })
//     describe('POST /auth/create-user', function () {
//         it('Should create a new user', async function() {
//             const req = {
//                 firstName: "John",
//                 lastName: "Doe",
//                 email: "jdoe@gmail.com",
//                 userPassword: "johndoe",
//                 gender: "Male",
//                 jobRole: "Secretary",
//                 department: "Administration",
//                 userAddress: "Awolowo way, Ibadan"
//             }
//             const salt = await bcrypt.genSalt(10);
//             const bcryptPassword = await bcrypt.hash(req.userPassword, salt);
//             req.userPassword = bcryptPassword;
        
//             await postUser(req)
    
//             const { rows } = await client.query('SELECT * FROM users WHERE email=$1',[
//                 req.email
//             ])
//             expect(rows).lengthOf(1)
//             // expect(rows[0]).to.deep.equal(req)
//         })

//     })
//     async function postUser (req, status=201) {
//         const { body } = await request(app)
//             .post('/auth/create-user')
//             .send(req)
//             .expect(status)
//         return body
//     }
// })