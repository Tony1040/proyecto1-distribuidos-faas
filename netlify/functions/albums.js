"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const publisher_data = require("./discograficas");
const artist_data = require("./artistas");
const fs = require('fs');

const file_location = "/netlify/data/albums.json"
let albums = [];

const readAlbums = () => {
  fs.readFile(file_location, 'utf8', (err, data) => {
      albums = JSON.parse(data)
  });
}
readAlbums();

const saveAlbums = () => {
  let data = JSON.stringify(albums)
  fs.writeFileSync(__dirname + file_location, data)
}

const app = express.Router();
app.get("/", (req, res) => {
  albums.forEach((album) => {
    album.discografica = publisher_data.publishers.find(
      (i) => i.id == album.id_discografica
    );
    album.artista = artist_data.artists.find((i) => i.id == album.id_artista);
  });
  res.status(200).send(process.env.LAMBDA_TASK_ROOT);
  // res.json(albums);
});

app.get("/:id", (req, res) => {
  let album = albums.find((i) => i.id == req.params.id);
  if (album == undefined) res.status(404).send("Album not found");

  let publisher = publisher_data.publishers.find(
    (i) => i.id == album.id_discografica
  );
  let artist = artist_data.artists.find((i) => i.id == album.id_artista);

  album.discografica = publisher;
  album.artista = artist;

  res.json(album);
});

app.get("/artistas/:id", (req, res) => {
  let art_albums = albums.filter((album) => album.id_artista == req.params.id);
  if (art_albums == undefined) res.status(404).send("No albums found");

  res.json(art_albums);
});

app.post("/:id", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.params.id);
  if (index == -1) res.status(404).send("Album not found");

  albums[index] = req.body
  res.status(200).send("Album updated successfully");
});

app.put("/", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.body.id);
  if (index != -1) res.status(303).send("Album already exits");
  else {
    albums.push(req.body);
    res.status(200).send("Album added");
  }
});

app.delete("/:id", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.params.id);
  if (index == -1) return resolve();
  else {
    albums = albums.filter((i) => i.id != req.params.id);
    res.status(404).send("Album deleted");
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/albums", app);
module.exports = exp;
module.exports.handler = serverless(exp);
module.exports.albums = albums;
