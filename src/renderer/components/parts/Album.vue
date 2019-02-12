<template>
  <div class="col-3 col-md-2 my-2" v-on:click="goToAlbum(album.name)">
    <div class="poster position-relative">
      <div class="h-100 hover position-absolute w-100">
        <div class="w-50 h-50 d-flex justify-content-center align-items-center">
          <i class="fas fa-folder-open"></i>
        </div>
      </div>
      <img :src="album.picture" :alt="album.name" width="100%" height="100%" class="d-block">
    </div>
    <div class="text text-muted pt-1">
      <span class="text-light">{{album.name}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['album'],
    methods: {
      goToAlbum (name) {
        this.$router.push({name: 'albums-show', params: {name}})
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
