<template>
  <div>
    <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
      <h3 class="mb-0">Artists</h3>
      <span class="align-self-end d-flex">{{count}} artists</span>
    </div>
    <div class="row">
      <artist :artist="artist" v-for="artist in artists" :key="artist.name"></artist>
    </div>
    <div class="row my-5">
      <div class="col-12">
        <pagination v-if="artists.length && Math.ceil(count / pageSize) > 1"
                    :pagination="{current_page: page, last_page: Math.ceil(count / pageSize) }"
                    :offset="6" v-on:changePage="changePage"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  import Artist from '../parts/Artist'
  import Pagination from '../parts/Pagination'

  export default {
    components: {Artist, Pagination},
    data () {
      return {
        artists: [],
        page: 1,
        pageSize: 18,
        count: null
      }
    },
    methods: {
      changePage(page) {
        this.page = page
        this.requestArtist()
      },
      requestArtist () {
        ipc.send('artists', {method: 'paginate', page: this.page, pageSize: this.pageSize})
      }
    },
    created () {
      this.requestArtist()
      ipc.on('artists-paginate', (event, response) => {
        this.artists = response.data
        this.count = response.count
      })
    }
  }
</script>

<style>

</style>
