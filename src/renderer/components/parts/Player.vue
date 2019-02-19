<template>
  <div class="plyr plyr--full-ui plyr--audio plyr--html5">
    <div class="plyr__controls">
      <div class="col-2 d-flex align-items-center" v-if="currentSong.title">
        <button type="button" class="plyr__control" data-plyr="previous" v-on:click="$parent.previousSong()">
          <i class="fas fa-step-backward"></i>
          <span class="plyr__tooltip" role="tooltip">Previous</span>
        </button>
        <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play"
                v-on:click="$parent.playOrPause()">
          <i class="fas fa-pause" v-if="status.playing"></i>
          <i class="fas fa-play" v-else></i>
          <span v-if="status.playing" class="plyr__tooltip" role="tooltip">Pause</span>
          <span v-else class="plyr__tooltip" role="tooltip">Play</span>
        </button>
        <button type="button" class="plyr__control" data-plyr="next" v-on:click="$parent.nextSong()">
          <i class="fas fa-step-forward"></i>
          <span class="plyr__tooltip" role="tooltip">Next</span>
        </button>
        <div class="plyr__time plyr__time--current" aria-label="Current time">
          {{status.currentTime.minutes || '00'}}:{{status.currentTime.seconds || '00'}}
        </div>
        <div class="plyr__time plyr__time--duration" aria-label="Duration">
          {{status.duration.minutes || '00'}}:{{status.duration.seconds || '00'}}
        </div>
      </div>
      <div class="plyr__progress p-0" v-if="currentSong.title">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" v-on:input="$parent.seek($event)"
               v-on:mouseup="$parent.muteOrUnmute('unmute')" v-on:mousedown="$parent.muteOrUnmute('mute')"
               :value="status.currentTime.original / status.duration.original * 100" aria-label="Seek"
               :style="'--value:' + (status.currentTime.original / status.duration.original * 100) + '%'">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
      </div>
      <div class="plyr__details col-7 d-flex flex-column" v-if="currentSong.title">
        <span>{{currentSong.title}}</span>
        <div class="text-muted details">
          <small class="text-right"><i class="fas fa-compact-disc"></i> {{currentSong.album.name}}</small>
          &nbsp;&nbsp;
          <small class="text-left"><i class="fas fa-user"></i> {{getArtists(currentSong)}}</small>
        </div>
      </div>
      <div class="plyr__details col-12 d-flex flex-column" v-else>
        <span class="text-muted">Select a song</span>
      </div>
      <div class="align-items-center col-3 d-flex justify-content-between" v-if="currentSong.title">
        <div class="btn-group dropup">
          <a class="text-light dropdown-toggle px-5 py-3" role="button" id="playlistDropup"
             data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false" v-on:click="togglePlaylist($event)">
            <i class="fas fa-list"></i>
          </a>
          <div class="dropdown-menu playlist dropdown-menu-right bg-dark overflow-y-auto overflow-x-hidden"
               aria-labelledby="playlistDropup">
            <ul class="list-group list-group-flush">
              <li class="bg-transparent d-flex justify-content-end list-group-item pt-1 text-light" v-on:click="$parent.clearPlayer()">
                  <i class="fa-trash fas"></i>
              </li>
              <li class="bg-transparent list-group-item text-light d-flex" v-for="(song, index) in $parent.playlist">
                <div class="col-2 position-relative px-0" v-on:click="$parent.nextSong(index)">
                  <div class="position-absolute active w-100 h-100 d-flex justify-content-center align-items-center"
                       v-if="song.id === $parent.currentSong.id">
                    <i class="fas fa-pause" v-if="song.id === $parent.currentSong.id && $parent.status.playing"></i>
                    <i class="fas fa-play" v-else></i>
                  </div>
                  <img :src="song.picture" :alt="song.title" width="100%" height="100%" class="d-block">
                </div>
                <div class="col-9">
                  <span class="title">{{song.title}}</span><br>
                  <div class="d-flex flex-column details">
                    <div>
                      <small class="align-items-center text-muted">
                        <i class="fas fa-compact-disc mr-1"></i>
                        <router-link :to="{name: 'albums-show', params: {name: song.album.name}}" class="text-muted">
                          {{song.album.name}}
                        </router-link>
                      </small>
                    </div>
                    <div>
                      <small class="align-items-center text-muted">
                        <i class="fas fa-user mr-1"></i> {{getArtists(song)}}
                      </small>
                    </div>
                  </div>
                </div>
                <i class="fa-times fas position-absolute text-muted remove-song"
                   v-on:click="$parent.removeFromPlaylist(index, song)"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="d-flex">
          <button type="button" class="p-1 plyr__control" aria-label="Repeat" data-plyr="repeat"
                  v-on:click="$parent.repeat()">
            <svg v-if="status.repeat === 0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50pt" height="50pt" viewBox="0 0 50 50" version="1.1">
              <path style=" stroke:none;fill-rule:nonzero;fill:#FFFFFF;fill-opacity:1;" d="M 32.894531 6.578125 L 32.894531 11.511719 L 13.15625 11.511719 C 7.730469 11.511719 3.289063 15.953125 3.289063 21.382813 C 3.28125 21.972656 3.589844 22.523438 4.105469 22.828125 C 4.621094 23.121094 5.25 23.121094 5.761719 22.828125 C 6.277344 22.523438 6.585938 21.972656 6.578125 21.382813 C 6.578125 17.730469 9.507813 14.800781 13.15625 14.800781 L 32.894531 14.800781 L 32.894531 19.738281 L 44.40625 13.15625 Z M 44.382813 26.289063 C 43.476563 26.308594 42.75 27.054688 42.761719 27.960938 C 42.761719 31.609375 39.832031 34.539063 36.183594 34.539063 L 16.449219 34.539063 L 16.449219 29.605469 L 4.933594 36.183594 L 16.449219 42.761719 L 16.449219 37.828125 L 36.183594 37.828125 C 41.613281 37.828125 46.050781 33.390625 46.050781 27.960938 C 46.058594 27.515625 45.886719 27.085938 45.570313 26.773438 C 45.257813 26.457031 44.824219 26.285156 44.382813 26.289063 Z "/>
            </svg>
            <svg v-else-if="status.repeat === 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50pt" height="50pt" viewBox="0 0 50 50" version="1.1">
                <path style=" stroke:none;fill-rule:nonzero;fill:#ff3348;fill-opacity:1;" d="M 32.894531 6.578125 L 32.894531 11.511719 L 13.15625 11.511719 C 7.730469 11.511719 3.289063 15.953125 3.289063 21.382813 C 3.28125 21.972656 3.589844 22.523438 4.105469 22.828125 C 4.621094 23.121094 5.25 23.121094 5.761719 22.828125 C 6.277344 22.523438 6.585938 21.972656 6.578125 21.382813 C 6.578125 17.730469 9.507813 14.800781 13.15625 14.800781 L 32.894531 14.800781 L 32.894531 19.738281 L 44.40625 13.15625 Z M 44.382813 26.289063 C 43.476563 26.308594 42.75 27.054688 42.761719 27.960938 C 42.761719 31.609375 39.832031 34.539063 36.183594 34.539063 L 16.449219 34.539063 L 16.449219 29.605469 L 4.933594 36.183594 L 16.449219 42.761719 L 16.449219 37.828125 L 36.183594 37.828125 C 41.613281 37.828125 46.050781 33.390625 46.050781 27.960938 C 46.058594 27.515625 45.886719 27.085938 45.570313 26.773438 C 45.257813 26.457031 44.824219 26.285156 44.382813 26.289063 Z "/>
            </svg>
            <svg v-else-if="status.repeat === 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50pt" height="50pt" viewBox="0 0 50 50" version="1.1">
              <path style="stroke:none;fill-rule:nonzero;fill:#ff3348;fill-opacity:1;" d="M 24.671875 6.578125 L 24.671875 11.511719 L 13.15625 11.511719 C 7.730469 11.511719 3.289063 15.953125 3.289063 21.382813 C 3.28125 21.972656 3.589844 22.523438 4.105469 22.828125 C 4.621094 23.121094 5.25 23.121094 5.761719 22.828125 C 6.277344 22.523438 6.585938 21.972656 6.578125 21.382813 C 6.578125 17.730469 9.507813 14.800781 13.15625 14.800781 L 24.671875 14.800781 L 24.671875 19.738281 L 36.183594 13.15625 Z M 42.808594 6.988281 L 39.570313 9.199219 L 39.570313 11.988281 L 42.640625 9.914063 L 42.808594 9.914063 L 42.808594 19.738281 L 46.050781 19.738281 L 46.050781 6.988281 Z M 44.382813 26.289063 C 43.476563 26.308594 42.75 27.054688 42.761719 27.960938 C 42.761719 31.609375 39.832031 34.539063 36.183594 34.539063 L 16.449219 34.539063 L 16.449219 29.605469 L 4.933594 36.183594 L 16.449219 42.761719 L 16.449219 37.828125 L 36.183594 37.828125 C 41.613281 37.828125 46.050781 33.390625 46.050781 27.960938 C 46.058594 27.515625 45.886719 27.085938 45.570313 26.773438 C 45.257813 26.457031 44.824219 26.285156 44.382813 26.289063 Z "/>
            </svg>
            <span class="plyr__tooltip" role="tooltip">Repeat</span>
          </button>
          <button type="button" class="p-1 plyr__control" aria-label="shuffle" data-plyr="shuffle"
                  v-on:click="$parent.shuffle()">
            <svg v-if="status.shuffle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50pt" height="50pt" viewBox="0 0 50 50" version="1.1">
                <path style=" stroke:none;fill-rule:nonzero;fill:#ff3348;fill-opacity:1;" d="M 34.539063 8.222656 L 34.539063 13.15625 L 30.714844 13.15625 C 27.421875 13.15625 24.335938 14.808594 22.507813 17.550781 L 19.738281 21.710938 L 16.96875 17.550781 C 15.136719 14.808594 12.054688 13.15625 8.757813 13.15625 L 4.933594 13.15625 C 4.34375 13.152344 3.789063 13.460938 3.488281 13.972656 C 3.191406 14.488281 3.191406 15.117188 3.488281 15.632813 C 3.789063 16.144531 4.34375 16.453125 4.933594 16.449219 L 8.757813 16.449219 C 10.960938 16.449219 13.011719 17.546875 14.230469 19.378906 L 17.757813 24.671875 L 14.230469 29.964844 C 13.011719 31.796875 10.960938 32.894531 8.757813 32.894531 L 4.933594 32.894531 C 4.34375 32.886719 3.789063 33.195313 3.488281 33.710938 C 3.191406 34.226563 3.191406 34.855469 3.488281 35.367188 C 3.789063 35.882813 4.34375 36.191406 4.933594 36.183594 L 8.757813 36.183594 C 12.054688 36.183594 15.136719 34.53125 16.96875 31.789063 L 19.738281 27.632813 L 22.507813 31.789063 C 24.335938 34.53125 27.421875 36.183594 30.714844 36.183594 L 34.539063 36.183594 L 34.539063 41.117188 L 44.40625 34.539063 L 34.539063 27.960938 L 34.539063 32.894531 L 30.714844 32.894531 C 28.511719 32.894531 26.464844 31.796875 25.242188 29.964844 L 21.714844 24.671875 L 25.242188 19.378906 C 26.464844 17.546875 28.511719 16.449219 30.714844 16.449219 L 34.539063 16.449219 L 34.539063 21.382813 L 44.40625 14.800781 Z "/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50pt" height="50pt" viewBox="0 0 50 50" version="1.1">
                <path style=" stroke:none;fill-rule:nonzero;fill:#FFFFFF;fill-opacity:1;" d="M 34.539063 8.222656 L 34.539063 13.15625 L 30.714844 13.15625 C 27.421875 13.15625 24.335938 14.808594 22.507813 17.550781 L 19.738281 21.710938 L 16.96875 17.550781 C 15.136719 14.808594 12.054688 13.15625 8.757813 13.15625 L 4.933594 13.15625 C 4.34375 13.152344 3.789063 13.460938 3.488281 13.972656 C 3.191406 14.488281 3.191406 15.117188 3.488281 15.632813 C 3.789063 16.144531 4.34375 16.453125 4.933594 16.449219 L 8.757813 16.449219 C 10.960938 16.449219 13.011719 17.546875 14.230469 19.378906 L 17.757813 24.671875 L 14.230469 29.964844 C 13.011719 31.796875 10.960938 32.894531 8.757813 32.894531 L 4.933594 32.894531 C 4.34375 32.886719 3.789063 33.195313 3.488281 33.710938 C 3.191406 34.226563 3.191406 34.855469 3.488281 35.367188 C 3.789063 35.882813 4.34375 36.191406 4.933594 36.183594 L 8.757813 36.183594 C 12.054688 36.183594 15.136719 34.53125 16.96875 31.789063 L 19.738281 27.632813 L 22.507813 31.789063 C 24.335938 34.53125 27.421875 36.183594 30.714844 36.183594 L 34.539063 36.183594 L 34.539063 41.117188 L 44.40625 34.539063 L 34.539063 27.960938 L 34.539063 32.894531 L 30.714844 32.894531 C 28.511719 32.894531 26.464844 31.796875 25.242188 29.964844 L 21.714844 24.671875 L 25.242188 19.378906 C 26.464844 17.546875 28.511719 16.449219 30.714844 16.449219 L 34.539063 16.449219 L 34.539063 21.382813 L 44.40625 14.800781 Z "/>
            </svg>
            <span class="plyr__tooltip" role="tooltip">Shuffle</span>
          </button>
          <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute"
                  v-on:click="$parent.muteOrUnmute()">
            <i v-if="!status.muted && status.volume >= 0.5" class="fas fa-volume-up"></i>
            <i v-else-if="!status.muted && status.volume < 0.5 && status.volume != 0" class="fas fa-volume-down"></i>
            <i v-else class="fas fa-volume-mute"></i>
            <span v-if="status.muted" class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
            <span v-else class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
          </button>
          <div class="plyr__volume">
            <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" v-model="$parent.status.volume"
                   autocomplete="off" aria-label="Volume" :style="'--value:' + status.volume * 100 + '%'">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['currentSong', 'status'],
    methods: {
      togglePlaylist (event) {
        event.stopPropagation()
        const element = $('#playlistDropup~div')
        const active = element.hasClass('show');
        (active) ? element.removeClass('show') : element.addClass('show')
      },
      getArtists: function (song) {
        let response = []
        for (let key in song.artists) {
          if (!song.artists[key]) return null
          response.push(song.artists[key].name)
        }
        return response.join(', ')
      }
    }
  }
</script>

<style>
  .dropup .dropdown-toggle::after {
    display: none !important;
  }

  .dropup a.text-light:focus,
  .dropup a.text-light:hover {
    text-decoration: none;
  }

  .dropdown-menu {
    max-height: 600px;
    width: 500px;
    box-shadow: rgba(0, 0, 0, 0.48) 0 0 10px 2px;
  }

  .playlist .active {
    background-color: rgba(0, 0, 0, 0.60);
  }

  .playlist .col-9 i {
    font-size: 15px;
  }

  i.remove-song {
    right: 10px;
    font-size: 15px !important;
    cursor: pointer;
  }

  .playlist::-webkit-scrollbar {
    width: 5px;
  }

  .playlist::-webkit-scrollbar-track {
    background: #666;
  }

  .playlist::-webkit-scrollbar-thumb {
    background: #ddd;
  }

  .plyr .details small {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 40%;
  }

  .plyr .details small i {
    width: auto;
  }

  .playlist .details div {
    height: 20px;
  }

  .playlist .details small {
    width: 100%;
    line-height: initial;
  }

  .playlist .details small i {
    font-size: inherit;
    width: auto;
    height: inherit;
    display: inherit;
    align-items: inherit;
  }

  input:hover {
    cursor: pointer;
  }

  .playlist .col-2:hover {
    cursor: pointer;
  }

  .list-group-item .remove-song {
    display: none;
  }

  .list-group-item:hover .remove-song {
    display: block;
  }

  .plyr span.title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
  }
</style>
