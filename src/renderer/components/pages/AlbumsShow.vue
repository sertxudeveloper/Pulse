<template>
  <div class="row" v-if="album && album.name">
    <div class="col-3">
      <div>
        <img :src="album.picture" :alt="album.name" width="100%">
      </div>
      <div class="mt-3 text-center">
        <h3><i class="fas fa-compact-disc text-muted pr-2"></i> {{album.name}}</h3>
      </div>
      <hr class="border-light mb-2">
      <div class="mt-2 text-center">
        <span class="text-muted"><i class="fas fa-users"></i> Artists</span>
        <ul class="list-unstyled">
          <li v-for="artist in album.artists">
            <router-link class="text-light" :to="{ name: 'artists-show', params: { name: artist.name }}">
              {{artist.name}}
            </router-link>
          </li>
        </ul>
      </div>
      <hr class="border-light">
      <div class="text-center">
        <button class="btn btn-radius btn-outline-light" v-on:click="playAllSongs()">Add to queue</button>
      </div>
    </div>
    <div class="col-9">
      <h4 class="border-bottom pb-2">Songs</h4>
      <div class="row">
        <song :song="song" v-for="song in songs" :key="song.title"></song>
      </div>
      <div class="row my-5">
        <div class="col-12">
          <pagination v-if="songs.length && Math.ceil(count / pageSize) > 1"
                      :pagination="{current_page: page, last_page: Math.ceil(count / pageSize) }"
                      :offset="6" v-on:changePage="changePage"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  import Song from '../parts/Song'
  import Pagination from '../parts/Pagination'

  export default {
    components: {Song, Pagination},
    data () {
      return {
        album: {},
        songs: [],
        page: 1,
        pageSize: 18,
        count: null
      }
    },
    methods: {
      changePage (page) {
        this.page = page
        this.requestSongs()
      },
      requestAlbum () {
        ipc.send('albums', {method: 'show', where: {name: this.$route.params.name}})
      },
      requestSongs () {
        ipc.send('albums', {method: 'songs', page: this.page, pageSize: this.pageSize, where: {name: this.$route.params.name}})
      },
      playAllSongs () {
        ipc.send('albums', {method: 'playAll', where: {name: this.$route.params.name}})
      }
    },
    created () {
      this.requestAlbum()
      this.requestSongs()
      ipc.on('albums-show', (event, response) => this.album = response)
      ipc.on('albums-songs', (event, response) => {
        this.songs = response.data
        this.count = response.count
      })
    }
  }
</script>

<style>

</style>
