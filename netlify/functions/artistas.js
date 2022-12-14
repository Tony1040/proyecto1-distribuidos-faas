"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
let albums_data = require("./albums");
const publisher_data = require("./discograficas");

const file_location = "/../data/artistas.json";
let artists = [
  {
    id: 1,
    nombre: "Miles Davis",
    fecha_nacimiento: "26/05/1926",
    fallecimiento: "28/09/1991",
    origen: "Illinois, Estados Unidos",
    instrumentos: "Trompeta, Compositor",
    imagen: "../images/artistas/miles_davis.jpg",
  },
  {
    id: 2,
    nombre: "John Coltrane",
    fecha_nacimiento: "23/09/1926",
    fallecimiento: "17/07/1967",
    origen: "Carolina del Norte, Estados Unidos",
    instrumentos:
      "saxofonista tenor y saxo soprano. Ocasionalmente, tocó el saxo alto y la flauta.",
    imagen: "../images/artistas/john_coltrane.jpg",
  },
  {
    id: 3,
    nombre: "Charlie Parker",
    fecha_nacimiento: "29/08/1920",
    fallecimiento: "12/03/1955",
    origen: "Kansas City, Estados Unidos",
    instrumentos: "Saxofon",
    imagen: "../images/artistas/charlie_parker.jpg",
  },
  {
    id: 4,
    nombre: "Clark Terry",
    fecha_nacimiento: "14/12/1920",
    fallecimiento: "21/02/2015",
    origen: "St Louis, Misuri, Estados Unidos",
    instrumentos: "Trompeta, Voz, Fliscorno",
    imagen: "../images/artistas/clark_terry.jpg",
  },
  {
    id: 5,
    nombre: "Nina Simone",
    fecha_nacimiento: "21/02/1933",
    fallecimiento: "21/04/2003",
    origen: "Carolina del Norte, Estados Unidos",
    instrumentos: "Voz, Piano",
    imagen: "../images/artistas/nina_simone.jpg",
  },
  {
    id: 6,
    nombre: "Wingy Manone",
    fecha_nacimiento: "13/02/1900",
    fallecimiento: "09/07/1982",
    origen: "Nueva Orleans, Estados Unidos",
    instrumentos: "Corneta, Trompeta, Voz",
    imagen: "../images/artistas/wingy_manone.jpg",
  },
];

const RUN_NETLIFY_CLOUD = true;
function readArtists() {
  if (RUN_NETLIFY_CLOUD == false) {
    console.log(__dirname + file_location);
    fs.readFile(__dirname + file_location, "utf8", (err, data) => {
      artists = JSON.parse(data);
    });
  }
}
readArtists();

function saveArtists() {
  if (RUN_NETLIFY_CLOUD == false) {
    let data = JSON.stringify(artists);
    fs.writeFileSync(__dirname + file_location, data);
  }
}

const app = express.Router();

app.get("/", (req, res) => {
  artists.forEach((artist) => {
    artist.albums = albums_data.albums.filter(
      (album) => album.id_artista == artist.id
    );
  });
  res.json(artists);
});

app.get("/:id", (req, res) => {
  let artist = artists.find((i) => i.id == req.params.id);
  if (artist == undefined) res.status(404).send("Artist not found");
  artist.albums = albums_data.albums.filter(
    (album) => album.id_artista === artist.id
  );
  res.json(artist);
});

app.get("/:id/albums", (req, res) => {
  let art_albums = albums_data.albums.filter(
    (album) => album.id_artista == req.params.id
  );
  if (art_albums == undefined) res.status(404).send("No albums found");

  art_albums.forEach((album) => {
    let publisher = publisher_data.publishers.find(
      (i) => i.id == album.id_discografica
    );
    album.discografica = publisher;
  });

  res.json(art_albums);
});

app.post("/:id", (req, res) => {
  let index = artists.findIndex((i) => i.id == req.params.id);
  if (index == -1) res.status(404).send("Artist not found");

  artists[index] = req.body;
  saveArtists();
  res.status(200).send("Artist updated successfully");
});

app.put("/", (req, res) => {
  let index = artists.findIndex((i) => i.id == req.body.id);
  if (index != -1) res.status(303).send("Artist already exits");
  else {
    artists.push(req.body);
    saveArtists();
    res.status(200).send("Artist added");
  }
});

app.delete("/:id", (req, res) => {
  let index = artists.findIndex((i) => i.id == req.params.id);
  if (index == -1) return resolve();
  else {
    artists = artists.filter((i) => i.id != req.params.id);

    albums_data.albums = albums_data.albums.filter(
      (album) => album.id_artista != req.params.id
    );
    saveArtists();
    res.status(200).send("Artist deleted");
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/artistas", app);
module.exports = exp;
module.exports.handler = serverless(exp);

module.exports.artists = artists;
