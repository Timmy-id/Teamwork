const { expect } = require("chai");
const request = require("supertest");
const client = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

const token = jwt.sign({ userId: 1, email: "jdoe@email.com" }, process.env.jwtSecret);

describe ('Articles route', function () {
    before(async function () {
        app = require("../../index");
    })

    beforeEach('Create temporary table articles', async function () {
        await client.query('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)')
        await client.query('CREATE TEMPORARY TABLE articles (LIKE articles INCLUDING ALL)')
    })
    afterEach('Drop temporary table', async function () {
        await client.query('DROP TABLE IF EXISTS pg_temp.users')
        await client.query('DROP TABLE IF EXISTS pg_temp.articles')
    })
    describe('POST /', function () {
        it('should return a 401 if user is unauthorized', async function () {
            const userArticle = { title: 'My title', article: 'My Article', user_id: 1 };
            await postArticle(userArticle, 401)
        })

        it('Should create a new article', async function() {
            const req = userRegister;
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(req.userPassword, salt);
            req.userPassword = bcryptPassword;
        
            const res = await postUser(req)

            const user = await client.query("SELECT * FROM users WHERE userid=$1",
                [res.data.userId]);

            const userArticle = { title: 'My title', article: 'My Article', user_id: user.rows[0].userid };
            
            const article = await client.query(
                "INSERT INTO articles (title, article, user_id) VALUES ($1, $2, $3) RETURNING *",
                [userArticle.title, userArticle.article, userArticle.user_id]
            )
            expect(article.rows[0]).to.be.an('object')
            expect(article.rows[0]).to.have.property('articleid')
            expect(article.rows[0]).to.have.property('title')
        })
    })

    describe('GET /:articleId', function () {
        it('should return an article of valid articleId', async function () {
            
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

    async function postArticle (req, status=201) {
        const { body } = await request(app)
            .post('/api/v1/articles')
            .send(req)
            .expect(status)
        return body
    }
})