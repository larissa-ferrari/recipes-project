const express = require("express");
const { MongoClient } = require("mongodb");
const server = express();
const { readFile } = require("fs").promises;
const ejs = require("ejs");

require("dotenv").config();

const port = 8080;
const client = new MongoClient(process.env.URI);
const dataBaseName = "recipes";
const collectionName = "recipes";

server.set("view engine", "ejs");

server.use(express.static("public"));

server.get("/", async (request, response) => {
    const receitas = await client
        .db(dataBaseName)
        .collection(collectionName)
        .find()
        .toArray();
    response.render("home", { receitas });
});

server.get("/receitas/*", async (request, response) => {
    const slug = request.path.split("/").pop();

    const data = await client
        .db(dataBaseName)
        .collection(collectionName)
        .findOne({ slug });

    if (data) {
        data.imagem = "data:image/svg+xml;base64, " + data.imagem;
        response.render("recipe", { data });
    } else {
        response.status(404).send(await readFile("./404.html", "utf8"));
    }
});

server.listen(process.env.PORT || port, () =>
    console.log(`App disponível em http://localhost:${port}`)
);
