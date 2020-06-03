const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

var reposIDX = "";

function checkReposIDX(request,response,next){
  const id = request.params.id;
  const {method} = request;

  reposIDX = repositories.findIndex(rps => rps.id == id);
  
  if (reposIDX < 0){
      return response.status(400).json({
        "Error":"Repositorio inexistente",
        "Função": method
      });
  }

  return next();

};



app.get("/repositories", (request, response) => {
  // Lista todo repositório
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // Inserindo um novo repositório
  const id = uuid();
  const { title, url, techs } = request.body;

  const repos = {
    "id": id,
    "title": title,
    "url": url,
    "techs": techs,
    "likes": 0
  }

  repositories.push(repos);

  return response.json(repos);
});

app.put("/repositories/:id",checkReposIDX, (request, response) => {
  // Altera um repositório
  const id = request.params.id;
  const { title, url, techs } = request.body;

  const repos = {
    "id": id,
    "title": title,
    "url": url,
    "techs": techs,
    "likes": repositories[reposIDX].likes
  }

  repositories[reposIDX] = repos;

  return response.json(repos);

});

app.delete("/repositories/:id",checkReposIDX, (request, response) => {
  // Deletar um repositório
  
  const id = request.params.id;

  repositories.splice(reposIDX,1);

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  // Adiciona like
  const id = request.params.id;

  var repos = id 
      ? repositories.filter(rps => rps.id.includes(id))
      : [];
      
  if (repos.length == 0){
    return response.status(400).json({
      "Erro Likes":"Repositorio inexistente"
    });
  }

  reposIDX = repos.length - 1;

  lastRepos = {
    "id": id,
    "title": repos[reposIDX].title,
    "url": repos[reposIDX].url,
    "techs": repos[reposIDX].techs,
    "likes": repos[reposIDX].likes + 1
  }
  repositories.push(lastRepos);

  return response.json(lastRepos);

});

module.exports = app;
