<!-- bookDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
     <form>
     <div class="row">
      <div class="four columns">
       <label for="titleInput">Nombre</label>
       <input class="u-full-width" type="text"
         v-model="album.nombre">
      </div>
      <div class="four columns">
       <label for="editionInput">Fecha publicación</label>
       <input class="u-full-width" type="text"
          v-model="album.fecha_publicacion">
      </div>
      <div class="four columns">
       <label for="copyrightInput">Duración</label>
       <input class="u-full-width" type="text"
          v-model="album.duracion">
      </div>
     </div>
     <div class="row">
      <div class="four columns">
       <label for="emailInput">Author</label>
       <input class="u-full-width" type="email"
          v-model="author.name">
      </div>
      <div class="four columns">
       <label for="phoneInput">Discografica</label>
       <input class="u-full-width" type="tel"
         v-model="publisher.name">
      </div>
      <div class="four columns">
       <label for="phoneInput">Generos</label>
       <input class="u-full-width" type="tel"
         v-model="album.genero">
      </div>
      <router-link class="button button-primary" 
        to="/book">Back</router-link>
      <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updateAlbum()">Update</a>
      <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createAlbum()">Create</a>
     </div>

     <div class="row">
      <div class="twelve columns">
       <label for="descriptionInput">Descripción</label>
       <input class="u-full-width" type="text"
         v-model="album.descripcion">
      </div>
      <router-link class="button button-primary" 
        to="/album">Back</router-link>
      <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updateAlbum()">Update</a>
      <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createAlbum()">Create</a>
     </div>
    </form>
   </div>
  </div>
</template>

<script>
	
import { useRoute } from 'vue-router'
	
export default {
  props: ['create','edit','show'],
  data: function() {
    return {
      title: "Información de album",
      album: {},
    }
  },
  created () {
   const route = useRoute();  
   this.findAlbum(route.params.id);
  },
  methods: {
    findAlbum: function(id) {
      fetch('/.netlify/functions/albums/'+id,
        { headers: {'Accept': 'application/json'}})
        .then((response) => response.json())
        .then((result) => {
          this.album = result;
        })
    },
    updateAlbum: function() {
      const route = useRoute(); 
      var id = route.params.id;
      fetch('/.netlify/functions/albums/'+id,
        { headers: {'Content-Type':'application/json'},
          method: 'POST',
          body: JSON.stringify(this.album)})
        .then((data) => {
          router.push('/album');
        }
      )
    },
    createAlbum: function() {
      fetch('/.netlify/functions/albums',
        { headers: {'Content-Type':'application/json'},
          method: 'PUT',
          body: JSON.stringify(this.album)})
        .then((data) => {
           router.push('/book');
        }
      )
    }
  }
}
</script>