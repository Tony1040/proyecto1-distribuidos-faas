"use strict";
const fs = require("fs");
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const publisher_data = require("./discograficas");
const artist_data = require("./artistas");
let path = require("path");

const file_location = "/../data/albums.json";
let albums = [
  {
    id: 1,
    id_artista: 1,
    id_discografica: 1,
    fecha_publicacion: "1959",
    generos: "Modal Jazz",
    duracion: "45:44",
    nombre: "Kind of Blue",
    descripcion:
      "Kind of Blue —en español: Una especie de tristeza o algún tipo de tristeza— es un álbum de estudio del músico estadounidense de jazz Miles Davis editado en agosto de 1959",
    imagen: "../images/albums/kind_of_blue.jpg",
  },
  {
    id: 2,
    id_artista: 1,
    id_discografica: 1,
    fecha_publicacion: "1930",
    generos:
      "Jazz, Jazz fusión, Rock, Free jazz, Avant-garde jazz, Música psicodélica, Avant-funk",
    duracion: "93:57",
    descripcion:
      "Bitches Brew es un disco del trompetista de jazz Miles Davis, editado en 1970 por Columbia-CBS en el que, por primera vez, utiliza de forma extensiva instrumentos eléctricos y estructuras rítmicas y armónicas relacionadas con el rock, conceptos que ya había esbozado en su anterior álbum In A Silent Way",
    nombre: "Bitches Brew",
    imagen: "../images/albums/bitches_brew.jpg",
  },
  {
    id: 3,
    id_artista: 2,
    id_discografica: 2,
    fecha_publicacion: "1965",
    generos:
      "Jazz, Free jazz, Hard bop, Jazz modal, Avant-garde jazz, Post-bop",
    duracion: "33:02",
    descripcion:
      "A Love Supreme es un álbum de jazz grabado por el cuarteto de John Coltrane el 9 de diciembre de 1964 en el estudio de Rudy Van Gelder en Englewood Cliffs, Nueva Jersey. El disco es una suite en cuatro partes, que se corresponden con sendos temas: Acknowledgement, Resolution, Pursuance y Psalm.",
    nombre: "A Love Supreme",
    imagen: "../images/albums/a_love_supreme.jpg",
  },
  {
    id: 4,
    id_artista: 2,
    id_discografica: 3,
    fecha_publicacion: "1958",
    generos: "Jazz, Hard bop",
    duracion: "42:14",
    descripcion:
      "Blue Train es un álbum de jazz de John Coltrane, publicado en 1957. Es considerado por muchos como el primer álbum auténticamente de solos de Coltrane, el primer grabado con músicos y canciones exclusivamente de su elección. Todas las piezas fueron compuestas por Coltrane, excepto una.",
    nombre: "Blue Train",
    imagen: "../images/albums/blue_train.jpg",
  },
  {
    id: 5,
    id_artista: 3,
    id_discografica: 4,
    fecha_publicacion: "1952",
    generos: "Jazz",
    duracion: "1:01:32",
    descripcion:
      'El álbum incluye una melodía de blues original ("Jam Blues"), una mezcla de baladas seleccionadas por cada músico y una melodía de blues suave llamada "Funky Blues". El estándar "What is This Thing Called Love" se destaca particularmente por su estilo final de seguimiento del líder, con cada músico intercambiando cuatros.',
    nombre: "Jam Session",
    imagen: "../images/albums/jam_session.jpg",
  },
  {
    id: 6,
    id_artista: 3,
    id_discografica: 4,
    fecha_publicacion: "1992",
    generos: "Jazz",
    duracion: "1:08:00",
    descripcion:
      "Una recopilacion de grabaciones en vivo de la legendaria presentacion de Charlie Parker en la Filarmonica en 1946, presentada por Verve Records",
    nombre: "Jazz at the philharmonic 1946",
    imagen: "../images/albums/philharmonic_1946.jpg",
  },
  {
    id: 7,
    id_artista: 4,
    id_discografica: 5,
    fecha_publicacion: "1957",
    generos: "Jazz",
    duracion: "41:32",
    descripcion:
      "Album debut del trompetista estadounidense Clark Terry, tocando canciones grabadas en 1957 para la marca Riverside records",
    nombre: "Serenade to a Bus Seat",
    imagen: "../images/albums/serenate_bus_seat.jpg",
  },
  {
    id: 8,
    id_artista: 4,
    id_discografica: 5,
    fecha_publicacion: "1957",
    generos: "Jazz",
    duracion: "38:09",
    descripcion:
      "Duke with a Difference es un album de Jazz el trompetista estadounidense Clark Terry grabado en 1957 para la marca Riverside Records",
    nombre: "Duke with a Difference",
    imagen: "../images/albums/Duke_with_a_Difference.jpg",
  },
  {
    id: 9,
    id_artista: 5,
    id_discografica: 6,
    fecha_publicacion: "1965",
    generos: "Jazz, Blues, Soul, Pop, Música vocal, Jazz vocal",
    duracion: "34:21",
    descripcion:
      "I Put A Spell On You es un álbum de estudio de la cantante y compositora estadounidense Nina Simone, publicado en junio de 1965 por Philips Records, y grabado en Nueva York entre 1964 y 1965. Contiene la canción homónima que alcanzó el puesto número 23 en la lista Hot R&B/Hip-Hop Songs y el puesto número 28 en los UK Singles Chart.",
    nombre: "I Put A Spell On You",
    imagen: "../images/albums/I_put_a_spell.jpg",
  },
  {
    id: 10,
    id_artista: 1,
    id_discografica: 7,
    fecha_publicacion: "1986",
    generos:
      "Jazz, Jazz fusión, Funk, Smooth jazz, R&B contemporáneo, Electropop",
    duracion: "42:05",
    descripcion:
      'Tutu es un álbum del trompetista de jazz estadounidense Miles Davis, lanzado en 1986 por Warner Bros. Records. Fue grabado principalmente en Capitol Studios en Los Ángeles y Clinton Recording en Nueva York, excepto la canción "Backyard Ritual", que fue grabada en Le Gonks en West Hollywood',
    nombre: "Tutu",
    imagen: "../images/albums/tutu.jpg",
  },
  {
    id: 11,
    id_artista: 2,
    id_discografica: 2,
    fecha_publicacion: "1963",
    generos: "Jazz",
    duracion: "32:18",
    descripcion:
      "Ballads es un álbum de jazz de John Coltrane lanzado en enero de 1963 por Impulse! Registros. Fue grabado en diciembre de 1961 y 1962 y lanzado con el número de catálogo A-32 y AS-32. El crítico Gene Lees declaró que el cuarteto nunca antes había tocado las melodías",
    nombre: "Ballads",
    imagen: "../images/albums/ballads.jpg",
  },
  {
    id: 12,
    id_artista: 4,
    id_discografica: 2,
    fecha_publicacion: "1964",
    generos: "Jazz",
    duracion: "39:09",
    descripcion:
      "The Happy Horns of Clark Terry es un álbum del músico estadounidense de trompetas y trompetas de jazz Clark Terry que presenta actuaciones grabadas en marzo de 1964 para The Impulse. etiqueta. Reeditado en 2012 para conmemorar el 50 aniversario de Impulse!",
    nombre: "The Happy Horns of Clark Terry",
    imagen: "../images/albums/The_Happy_Horns_of_Clark_Terry.jpg",
  },
  {
    id: 13,
    id_artista: 4,
    id_discografica: 2,
    fecha_publicacion: "1964",
    generos: "Jazz",
    duracion: "39:09",
    descripcion:
      "The Happy Horns of Clark Terry es un álbum del músico estadounidense de trompetas y trompetas de jazz Clark Terry que presenta actuaciones grabadas en marzo de 1964 para The Impulse. etiqueta. Reeditado en 2012 para conmemorar el 50 aniversario de Impulse!",
    nombre: "The Happy Horns of Clark Terry test",
    imagen: "../images/albums/The_Happy_Horns_of_Clark_Terry.jpg",
  },
];

const RUN_NETLIFY_CLOUD = true;
function readAlbums() {
  if (!RUN_NETLIFY_CLOUD) {
    console.log(__dirname + file_location);
    fs.readFile(__dirname + file_location, "utf8", (err, data) => {
      albums = JSON.parse(data);
    });
  }
}
readAlbums();

function saveAlbums() {
  if (!RUN_NETLIFY_CLOUD) {
    let data = JSON.stringify(albums);
    fs.writeFileSync(__dirname + file_location, data);
  }
}

const app = express.Router();
app.get("/", (req, res) => {
  albums.forEach((album) => {
    album.discografica = publisher_data.publishers.find(
      (i) => i.id == album.id_discografica
    );
    album.artista = artist_data.artists.find((i) => i.id == album.id_artista);
  });
  res.json(albums);
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

  art_albums.forEach((album) => {
    let publisher = publisher_data.publishers.find(
      (i) => i.id == album.id_discografica
    );
    album.discografica = publisher;
  });

  res.json(art_albums);
});

app.get("/discograficas/:id", (req, res) => {
  let disc_albums = albums.filter((album) => album.id_artista == req.params.id);
  if (disc_albums == undefined) res.status(404).send("No albums found");

  disc_albums.forEach((album) => {
    let artista = artist_data.artists.find((i) => i.id == album.id_artista);
    album.artista = artista;
  });

  res.json(disc_albums);
});

app.post("/:id", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.params.id);
  if (index == -1) res.status(404).send("Album not found");

  albums[index] = req.body;
  saveAlbums();
  res.status(200).send("Album updated successfully");
});

app.put("/", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.body.id);
  if (index != -1) res.status(303).send("Album already exits");
  else {
    albums.push(req.body);
    saveAlbums();
    res.status(200).send("Album added");
  }
});

app.delete("/:id", (req, res) => {
  let index = albums.findIndex((i) => i.id == req.params.id);
  if (index == -1) return resolve();
  else {
    albums = albums.filter((i) => i.id != req.params.id);
    saveAlbums();
    res.status(404).send("Album deleted");
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/albums", app);
module.exports = exp;
module.exports.handler = serverless(exp);
module.exports.albums = albums;
