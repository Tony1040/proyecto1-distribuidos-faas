"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const albums_data = require("./albums");
const artist_data = require("./artistas");

const file_location = "/../data/discograficas.json";

let publishers = [
  {
    id: 1,
    nombre: "Columbia Records",
    fundacion: "1887",
    fundador: "Edward D. Easton",
    director: "Rob Stringer",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/columbia_records.png",
  },
  {
    id: 2,
    nombre: "Impulse! Records",
    fundacion: "1960",
    fundador: "Creed Taylor",
    director: "Dickon Stainer/Verve Records",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/impulse_records.jpg",
  },
  {
    id: 3,
    nombre: "Blue Note Records",
    fundacion: "1939",
    fundador: "Alfred Lion, Francis Wolff, Max Margulis",
    director: "Steve Barnett/Universal Music Group",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/blue_note_records.png",
  },
  {
    id: 4,
    nombre: "Verve Records",
    fundacion: "1956",
    fundador: "Norman Granz",
    director: "Dickon Stainer",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/verve_records.png",
  },
  {
    id: 5,
    nombre: "Riverside Records",
    fundacion: "1953",
    fundador: "Bill Grauer, Jr, Orrin Keepnews",
    director: "Bill Grauer, Jr, Orrin Keepnews",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/riverside_records.png",
  },
  {
    id: 6,
    nombre: "Philips Records",
    fundacion: "1950",
    fundador: "Koninklijke Philips B.V.",
    director: "Steve Barnett/Universal Music Group",
    pais: "Paises Bajos",
    imagen: "../images/discograficas/phillips_records.png",
  },
  {
    id: 7,
    nombre: "Warner Bros records",
    fundacion: "1958",
    fundador: "Warner Bros.",
    director: " Stephen Cooper/Warner Music Group",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/warner_bros_records.png",
  },
  {
    id: 8,
    nombre: "Columbia Records test",
    fundacion: "1887",
    fundador: "Edward D. Easton",
    director: "Rob Stringer",
    pais: "Estados Unidos",
    imagen: "../images/discograficas/columbia_records.png",
  },
];

const RUN_NETLIFY_CLOUD = true;
function readPublishers() {
  if (!RUN_NETLIFY_CLOUD) {
    console.log(__dirname + file_location);
    fs.readFile(__dirname + file_location, "utf8", (err, data) => {
      artists = JSON.parse(data);
    });
  }
}
readPublishers();

function savePublishers() {
  if (!RUN_NETLIFY_CLOUD) {
    let data = JSON.stringify(publishers);
    fs.writeFileSync(__dirname + file_location, data);
  }
}

const app = express.Router();

app.get("/", (req, res) => {
  publishers.forEach((publisher) => {
    publisher.albums = albums_data.albums.filter(
      (album) => album.id_discografica == publisher.id
    );
  });
  res.json(publishers);
});

app.get("/:id", (req, res) => {
  let publisher = publishers.find((i) => i.id == req.params.id);
  if (publisher == undefined)
    res.status(404).send("Discografica no encontrada");

  publisher.albums = albums_data.albums.filter(
    (album) => album.id_discografica == publisher.id
  );
  res.json(publisher);
});

app.get("/:id/albums", (req, res) => {
  let disc_albums = albums_data.albums.filter((album) => album.id_artista == req.params.id);
  if (disc_albums == undefined) res.status(404).send("No albums found");

  disc_albums.forEach(album => {
    let artista = artist_data.artists.find(
      (i) => i.id == album.id_artista
    );
    album.artista = artista;
  });

  res.json(disc_albums);
});

app.post("/:id", (req, res) => {
  let index = publishers.findIndex((i) => i.id == req.params.id);
  if (index == -1) res.status(404).send("Discografica no existe");

  publishers[index] = req.body;
  savePublishers();
  res.status(200).send("Discografica actualizada existosamente");
});

app.put("/", (req, res) => {
  let index = publishers.findIndex((i) => i.id == req.body.id);
  if (index != -1) res.status(303).send("Esta discografica ya existe");
  else {
    publishers.push(req.body);
    savePublishers();
    res.status(200).send("Discografica agregada exitosamente");
  }
});

app.delete("/:id", (req, res) => {
  let index = publishers.findIndex((i) => i.id == req.params.id);
  if (index == -1) return resolve();
  else {
    publishers = publishers.filter((i) => i.id != req.params.id);

    albums_data.albums = albums_data.albums.filter(
      (album) => album.id_discografica != req.params.id
    );
    savePublishers();
    res.status(200).send("Discografica eliminada exitosamente")
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/discograficas", app);
module.exports = exp;
module.exports.handler = serverless(exp);

module.exports.publishers = publishers;
