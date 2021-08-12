CREATE DATABASE new_teamwork;

CREATE TABLE users(
    userId SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    userPassword VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    jobRole VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    userAddress VARCHAR(255) NOT NULL);

CREATE TABLE articles(
    articleId SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    article TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(userId) ON DELETE CASCADE);

CREATE TABLE gifs(
    gifId SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    createdOn  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(userId) ON DELETE CASCADE);

CREATE TABLE comments(
    commentId SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER,
    article_id INTEGER,
    gif_id INTEGER,
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES users(userId),
    CONSTRAINT fk_article FOREIGN KEY (article_id) REFERENCES articles(articleId),
    CONSTRAINT fk_gif FOREIGN KEY (gif_id) REFERENCES gifs(gifId));