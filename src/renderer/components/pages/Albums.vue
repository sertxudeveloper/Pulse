<template>
  <div>
    <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
      <h3 class="mb-0">Albums</h3>
      <span class="align-self-end d-flex">{{count}} albums</span>
    </div>
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
</template>

<script>
  const ipc = require('electron').ipcRenderer
  import Album from '../parts/Album'
  import Pagination from '../parts/Pagination'

  export default {
    components: {Album, Pagination},
    data () {
      return {
        albums: [],
        page: 1,
        pageSize: 18,
        count: null
      }
    },
    methods: {
      changePage(page) {
        this.page = page
        this.requestAlbums()
      },
      requestAlbums () {
        ipc.send('albums', {method: 'paginate', page: this.page, pageSize: this.pageSize})
      }
    },
    created () {
      this.requestAlbums()
      ipc.on('albums-paginate', (event, response) => {
        this.albums = response.data
        this.count = response.count
      })
    }
  }
</script>

<style>

</style>
