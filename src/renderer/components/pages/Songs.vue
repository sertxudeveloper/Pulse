<template>
  <div>
    <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
      <h3 class="mb-0">Tracks</h3>
      <span class="align-self-end d-flex">{{count}} tracks</span>
    </div>
    <div class="row">
      <song :song="song" v-for="song in songs" :key="song.route"></song>
    </div>
    <div class="row my-5">
      <div class="col-12">
        <pagination v-if="songs.length && Math.ceil(count / pageSize) > 1"
                    :pagination="{current_page: page, last_page: Math.ceil(count / pageSize) }"
                    :offset="6" v-on:changePage="changePage"></pagination>
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
        songs: [],
        page: 1,
        pageSize: 18,
        count: null
      }
    },
    methods: {
      changePage(page) {
        this.page = page
        this.requestTracks()
      },
      requestTracks () {
        ipc.send('tracks', {method: 'paginate', page: this.page, pageSize: this.pageSize})
      }
    },
    created () {
      this.requestTracks()
      ipc.on('tracks-paginate', (event, response) => {
        this.songs = response.data
        this.count = response.count
      })
    }
  }
</script>

<style>

</style>
