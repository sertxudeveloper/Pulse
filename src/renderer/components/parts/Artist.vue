<template>
  <div class="col-3 col-md-2 my-2">
    <div class="poster position-relative" v-on:click="goToArtist(artist.name)">
      <div class="h-100 hover position-absolute w-100">
        <div class="w-50 h-50 d-flex justify-content-center align-items-center">
          <i class="fas fa-folder-open"></i>
        </div>
      </div>
      <img :src="artist.picture" :alt="artist.name" width="100%" height="100%" class="d-block">
    </div>
    <div class="text-muted pt-1 details position-relative">
      <div class="text">
        <span class="text-light">{{artist.name}}</span>
      </div>
      <div class="position-absolute options px-2"
           role="button" :id="'options_'+artist.title" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
      </div>

      <div class="dropdown-menu options-container" :aria-labelledby="'options_'+artist.title">
        <ul class="list-unstyled mb-0 py-2">
          <li class="py-1 px-3"><i class="fas fa-list text-muted pr-3"></i>Add to playlist</li>
          <li class="py-1 px-3"><i class="fas fa-search text-muted pr-3"></i>Get Recommendations</li>
          <li class="py-1 px-3"><i class="fas fa-minus-circle text-muted pr-3"></i>Remove</li>
          <li class="py-1 px-3"><i class="fas fa-pencil-alt text-muted pr-3"></i>Edit</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['artist'],
    methods: {
      goToArtist (name) {
        this.$router.push({name: 'artists-show', params: {name}})
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
