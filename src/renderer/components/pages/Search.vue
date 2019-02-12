<template>
  <div v-if="!this.$parent.searchResults.query">
    <span>Searching...</span>
  </div>
  <div v-else>
    <div>
      <div class="d-flex justify-content-between mb-2 pb-2">
        <h3 class="mb-0">Results of "{{this.$parent.searchResults.query}}"</h3>
        <!--<span class="align-self-end d-flex">{{count}} artists</span>-->
      </div>
      <div class="row">
        <div class="col-12 mt-4">
          <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
            <h4 class="mb-0">Artists</h4>
          </div>
          <div v-if="$parent.searchResults.artists.length" class="row">
            <artist :artist="artist" v-for="artist in $parent.searchResults.artists" :key="artist.name"></artist>
          </div>
          <template v-else>
            <span>No artists found</span>
          </template>
        </div>
        <div class="col-12 mt-4">
          <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
            <h4 class="mb-0">Albums</h4>
          </div>
          <div v-if="$parent.searchResults.albums.length" class="row">
            <album :album="album" v-for="album in $parent.searchResults.albums" :key="album.name"></album>
          </div>
          <template v-else>
            <span>No albums found</span>
          </template>
        </div>
        <div class="col-12 mt-4">
          <div class="border-bottom d-flex justify-content-between mb-2 pb-2">
            <h4 class="mb-0">Tracks</h4>
          </div>
          <div v-if="$parent.searchResults.songs.length" class="row">
            <song :song="song" v-for="song in $parent.searchResults.songs" :key="song.name"></song>
          </div>
          <template v-else>
            <span>No tracks found</span>
          </template>
        </div>
      </div>
      <div class="row my-5">
        <!--{{this.$parent.searchResults}}-->
        <div class="col-12">
          <!--<pagination v-if="artists.length && Math.ceil(count / pageSize) > 1"-->
          <!--:pagination="{current_page: page, last_page: Math.ceil(count / pageSize) }"-->
          <!--:offset="6" v-on:changePage="changePage"></pagination>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Artist from '../parts/Artist'
  import Album from '../parts/Album'
  import Song from '../parts/Song'

  export default {
    components: {Artist, Album, Song}
  }
</script>

<style>

</style>
