// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import './css/normalize.css';
import './css/skeleton.css';

import albumIndex from './album/index.vue'
import albumDetails from './album/details.vue'

const routes = [
  { path: '/album', 
    component: albumIndex,
    props: true},
  { path: '/album/show/:id',
    component: albumDetails,
    props: {show: true}},
  { path: '/album/edit/:id',
    component: albumDetails,
    props: {edit: true}},
  { path: '/album/create',
    component: albumDetails,
    props: {create: true}},
  { path: '/album/delete/:id',
    component: albumDetails,
    props: {delete: true}},
  { path: '/',
    component: albumIndex,
    props: true},
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

let app = createApp(App)

app.use(router)

app.mount('#app')