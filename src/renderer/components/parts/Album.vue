<template>
  <div class="col-3 col-md-2 my-2">
    <div class="poster position-relative" v-on:click="goToAlbum(album.name)">
      <div class="h-100 hover position-absolute w-100">
        <div class="w-50 h-50 d-flex justify-content-center align-items-center">
          <i class="fas fa-folder-open"></i>
        </div>
      </div>
      <img :src="album.picture" :alt="album.name" width="100%" height="100%" class="d-block">
    </div>
    <div class="text-muted pt-1 details position-relative">
      <div class="text text-muted pt-1">
        <span class="text-light">{{album.name}}</span>
      </div>
      <div class="position-absolute options px-2"
           role="button" :id="'options_'+album.name" data-toggle="dropdown" aria-haspopup="true"
           aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
      </div>

      <div class="dropdown-menu options-container" :aria-labelledby="'options_'+album.name">
        <ul class="list-unstyled mb-0 py-2">
          <li class="py-1 px-3" v-on:click="playAllSongs(album)">
            <i class="fas fa-plus text-muted pr-3"></i>Add to queue
          </li>
          <!--<li class="py-1 px-3">
            <i class="fas fa-list text-muted pr-3"></i>Add to playlist
          </li>
          <li class="py-1 px-3">
            <i class="fas fa-search text-muted pr-3"></i>Get Recommendations
          </li>
          <li class="py-1 px-3">
            <i class="fas fa-minus-circle text-muted pr-3"></i>Remove
          </li>
          <li class="py-1 px-3" v-on:click="$parent.$refs.edit_artist_modal.openModal(artist)">
            <i class="fas fa-pencil-alt text-muted pr-3"></i>Edit
          </li>-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer

  export default {
    props: ['album'],
    methods: {
      goToAlbum (name) {
        this.$router.push({name: 'albums-show', params: {name}})
      },

      playAllSongs (album) {
        ipc.send('albums', {method: 'playAll', where: {name: album.name}})
      }
    }
  }
</script>

<style scoped>
  .hover {
    font-size: 60px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all .5s ease;
  }

  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hover:hover, .active .hover {
    opacity: 1 !important;
    cursor: pointer;
  }

  .poster {
    box-shadow: 3px 3px 10px hsla(0, 0%, 10%, 1);
    transition: all .5s ease;
  }

  .poster:hover, .poster.active {
    box-shadow: none;
  }
</style>
