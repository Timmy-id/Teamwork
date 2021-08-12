const express = require('express');
const app = express();
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./api.yaml");
const authRoutes = require("./routes/user");
const dashboardRoute = require("./routes/dashboard");
const articleRoutes = require("./routes/article");
const gifRoutes = require("./routes/gif");
const feedRoute = require("./routes/feed");

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use("/api/v1/feed", feedRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/gifs", gifRoutes);

app.listen(5000, () => {
    console.log('Server listening on port 5000');
})

module.exports = app;