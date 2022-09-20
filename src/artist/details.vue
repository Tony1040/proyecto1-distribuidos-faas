<!-- bookDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 5%">
      <h2>{{ title }}</h2>
      <form>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Id</label>
            <input class="u-full-width" type="text" v-model="artist.id" />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Nombre</label>
            <input class="u-full-width" type="text" v-model="artist.nombre" />
          </div>
          <div class="four columns">
            <label for="editionInput">Pais de origen</label>
            <input class="u-full-width" type="text" v-model="artist.origen" />
          </div>
          <div class="four columns">
            <label for="copyrightInput">Instrumentos</label>
            <input
              class="u-full-width"
              type="text"
              v-model="artist.instrumentos"
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="phoneInput">Fecha de nacimiento</label>
            <input
              class="u-full-width"
              type="tel"
              v-model="artist.fecha_nacimiento"
            />
          </div>
          <div class="four columns">
            <label for="phoneInput">Fallecimiento</label>
            <input
              class="u-full-width"
              type="tel"
              v-model="artist.fallecimiento"
            />
          </div>
          <router-link class="button button-primary" to="/artista">
            Back
          </router-link>
          <a
            v-if="edit"
            class="button button-primary"
            style="float: right"
            v-on:click="updateArtist()"
            >Update</a
          >
          <a
            v-if="create"
            class="button button-primary"
            style="float: right"
            v-on:click="createArtist()"
            >Create</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  props: ["create", "edit", "show"],
  data: function () {
    return {
      title: "Información de artistas",
      album: {
        id: 0,
        id_artista: 0,
        id_discografica: 0,
        fecha_publicacion: "",
        generos: "",
        duracion: "",
        nombre: "",
        descripcion: "",
        imagen: "",
      },
      artist: {
        id: 0,
        nombre: "",
        fecha_nacimiento: "",
        fallecimiento: "",
        origen: "",
        instrumentos: "",
        imagen: "",
        albums: {
          nombre: "",
        },
      },
    };
  },
  created() {
    const route = useRoute();
    this.findArtist(route.params.id);
  },
  methods: {
    findArtist: function (id) {
      fetch("/.netlify/functions/artistas/" + id, {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("This is the result of getting artist", result);
          this.artist = result;
        });
    },
    updateArtist: function () {

      delete this.artist["albums"];

      fetch("/.netlify/functions/artistas/" + this.artist.id, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(this.artist),
      }).then((data) => {
        if (data.status != 200) {
          console.log(data);
          alert(JSON.stringify(data));
        } else {
          alert("Artist updated correctly");
          this.$router.push("/artista");
        }
      });
    },
    createArtista: function () {
      fetch("/.netlify/functions/artistas", {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(this.artist),
      }).then((data) => {
        console.log(data);
        if (data.status == 303) {
          alert(
            "There is already an object with this id, please use a different one"
          );
        } else {
          alert("Artist added");
          this.$router.push("/artista");
        }
      });
    },
  },
};
</script>
