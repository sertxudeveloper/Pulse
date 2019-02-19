<template>
  <div class="row" v-if="artist && artist.name">
    <div class="col-3">
      <div>
        <img :src="artist.picture" :alt="artist.name" width="100%">
      </div>
      <div class="mt-3 text-center">
        <h3><i class="fas fa-user text-muted pr-2"></i> {{artist.name}}</h3>
      </div>
      <hr class="border-light">
      <div class="text-center">
        <button class="btn btn-radius btn-outline-light" v-on:click="playAllSongs()">Add to queue</button>
      </div>
    </div>
    <div class="col-9">
      <h4 class="border-bottom pb-2">Albums</h4>
      <div class="row">
        <album :album="album" v-for="album in albums" :key="album.name"></album>
      </div>
      <div class="row my-5">
        <div class="col-12">
          <pagination v-if="albums.length && Math.ceil(count / pageSize) > 1"
                      :pagination="{current_page: page, last_page: Math.ceil(count / pageSize) }"
                      :offset="6" v-on:changePage="changePage"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  import Album from '../parts/Album'
  import Pagination from '../parts/Pagination'

  export default {
    components: {Album, Pagination},
    data () {
      return {
        artist: {},
        albums: [],
        page: 1,
        pageSize: 18,
        count: null
      }
    },
    methods: {
      changePage (page) {
        this.page = page
        this.requestAlbums()
      },
      requestArtist () {
        ipc.send('artists', {method: 'show', where: {name: this.$route.params.name}})
      },
      requestAlbums () {
        ipc.send('artists', {method: 'albums', page: this.page, pageSize: this.pageSize, where: {name: this.$route.params.name}})
      },
      playAllSongs () {
        ipc.send('artists', {method: 'playAll', where: {name: this.$route.params.name}})
      }
    },
    created () {
      this.requestArtist()
      this.requestAlbums()
      ipc.on('artists-show', (event, response) => this.artist = response)
      ipc.on('artist-albums', (event, response) => {
        this.albums = response.data
        this.count = response.count
      })
    }
  }
</script>

<style>

</style>
