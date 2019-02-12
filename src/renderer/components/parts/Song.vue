<template>
  <div class="col-3 col-md-2 my-2">
    <div class="poster position-relative" v-on:click="$root.$refs.app.playSong(song)"
         :class="{'active': (song.id === $root.$refs.app.currentSong.id )}">
      <div class="h-100 hover position-absolute w-100">
        <div class="w-50 h-50 d-flex justify-content-center align-items-center">
          <i class="fas fa-pause" v-if="song.id === $root.$refs.app.currentSong.id && $root.$refs.app.status.playing"></i>
          <!--<i class="fas fa-plus" v-else-if="$root.$refs.app.status.playing"></i>-->
          <i class="fas fa-play" v-else></i>
        </div>
      </div>
      <img :src="song.picture" :alt="song.title" width="100%" height="100%" class="d-block">
    </div>
    <div class="text-muted details pt-1 position-relative">
      <div class="text">
        <span class="text-light">{{song.title}}</span><br>
        <small class="text-muted"><i class="fas fa-compact-disc"></i> {{song.album.name}}</small>
        <br>
        <small class="text-muted"><i class="fas fa-user"></i> {{artists}}</small>
      </div>
      <div class="position-absolute options px-2"
           role="button" :id="'options_'+song.title" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
      </div>

      <div class="dropdown-menu options-container" :aria-labelledby="'options_'+song.title">
        <ul class="list-unstyled mb-0 py-2">
          <li class="py-1 px-3"><i class="fas fa-list text-muted pr-3"></i>Add to playlist</li>
          <li class="py-1 px-3"><i class="fas fa-search text-muted pr-3"></i>Get Recommendations</li>
          <li class="py-1 px-3"><i class="fas fa-minus-circle text-muted pr-3"></i>Remove</li>
          <li class="py-1 px-3"><i class="fas fa-pencil-alt text-muted pr-3"></i>Edit</li>
        </ul>
      </div>
      <div ref="options" class=" position-absolute">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['song'],
    computed: {
      artists: function () {
        let response = []
        for (let key in this.song.artists) {
          if (!this.song.artists[key]) return null
          response.push(this.song.artists[key].name)
        }
        return response.join(', ')
      }
    },
    methods: {
      // openOptions () {
      //   $(this.$refs.options).fadeIn()
      // }
    },
    created () {
      // $(window).click(() => $('.options-container').fadeOut())
    }
  }
</script>

<style scoped>
  br {
    display: block;
    margin: -5px 0;
    content: '';
  }

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
    width: calc(100% - 5px);
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
