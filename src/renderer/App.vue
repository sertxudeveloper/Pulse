<template>
  <div id="app">
    <navbar ref="navbar"></navbar>
    <div class="container-fluid h-100">
      <div class="row h-100">
        <aside-nav></aside-nav>
        <main class="overflow-y-auto p-3 text-light position-relative">
          <drop-area></drop-area>
          <router-view></router-view>
        </main>
      </div>
      <div class="row audio-container fixed-bottom">
        <div class="col-12">
          <audio :src="audioSource || '/'" id="player" preload ref="audio"></audio>
          <player :currentSong="currentSong" :status="status"></player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './components/parts/Navbar'
  import AsideNav from './components/parts/AsideNav'
  import Player from './components/parts/Player'
  import DropArea from './components/parts/DropArea'
  const ipc = require('electron').ipcRenderer

  export default {
    components: {Navbar, AsideNav, Player, DropArea},
    data () {
      return {
        searchResults: {
          artists: [],
          albums: [],
          songs: [],
          query: ''
        },
        playlist: [],
        original: [],
        currentSong: {_id: null, title: '', artist: '', album: '', picture: '', route: ''},
        status: {
          playing: false,
          interval: null,
          currentTime: {minutes: null, seconds: null, original: null},
          duration: {minutes: null, seconds: null, original: null},
          muted: false,
          volume: 1.0,
          shuffle: false,
          repeat: 0 // 0 No repeat | 1 Repeat all | 2 Repeat one
        },
      }
    },
    methods: {
      clearPlayer () {
        this.playlist = []
        this.currentSong = {title: '', artist: '', album: '', picture: '', route: ''}
        this.status.playing = false
        ipc.send('playing-status', {remove: true})
      },
      playSong (song) {
        this.addToPlaylist(song, true)
      },
      setSong (song) {
        this.currentSong = song
        console.log('setSong', this.currentSong)
        this.$refs.audio.oncanplay = () => {
          this.status.duration.original = this.$refs.audio.duration
          let minutes = Math.floor(this.$refs.audio.duration / 60)
          let seconds = this.$refs.audio.duration - minutes * 60
          this.status.duration.minutes = this.setLeading(minutes)
          this.status.duration.seconds = this.setLeading(Math.floor(seconds))
          this.playOrPause('play')
        }
      },
      nextSong () {
        let index = this.playlist.indexOf(this.currentSong)
        let nextSong = null
        if (index >= 0 && index < this.playlist.length - 1) nextSong = this.playlist[index + 1]
        console.log('nextSong', nextSong)
        if (!nextSong) {
          this.clearPlayer()
          return null
        }
        this.setSong(nextSong, true)
      },
      previousSong () {
        console.log('previousSong')
        let index = this.playlist.indexOf(this.currentSong)
        let previousSong = null
        if (index > 0 && index <= this.playlist.length - 1) previousSong = this.playlist[index - 1]
        if (!previousSong) return null
        this.setSong(previousSong, true)
      },
      addToPlaylist (song, immediate = false) {
        console.log('addToPlaylist', song)
        if (this.currentSong === song) return this.playOrPause()
        if(!this.currentSong.title || immediate) this.setSong(song)
        this.playlist.push(song)
      },
      removeFromPlaylist (index, song) {
        if (song === this.currentSong) this.nextSong()
        this.playlist.splice(index, 1)
      },
      playOrPause (action) {
        if (!this.$refs.audio.duration) return null
        if (!action) {
          if (!this.status.playing) {
            this.$refs.audio.play()
          } else {
            this.$refs.audio.pause()
          }
        } else {
          if (action === 'play') {
            this.$refs.audio.play()
          } else {
            this.$refs.audio.pause()
          }
        }
        this.status.playing = !this.$refs.audio.paused
        ipc.send('playing-status', {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})
        clearInterval(this.status.interval)
        if (this.status.playing) this.updateTime()
      },
      shuffle () {
        console.log('shuffle')
        this.status.shuffle = !this.status.shuffle
        ipc.send('playing-status', {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})
      },
      repeat () {
        this.status.repeat = (this.status.repeat === 2) ? 0 : ++this.status.repeat
        console.log('repeat', this.status.repeat)
        ipc.send('playing-status', {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})
      },
      muteOrUnmute () {
        this.status.muted = !this.status.muted
        this.$refs.audio.muted = this.status.muted
      },
      seek (event) {
        this.$refs.audio.currentTime = (event.target.value / 100 * this.status.duration.original)
      },
      endedSong () {
        clearInterval(this.status.interval)
        this.status.playing = false
        this.nextSong()
      },
      updateTime () {
        this.status.interval = setInterval(function () {
          // console.log('interval')
          if (this.status.currentTime.original === this.status.duration.original) this.endedSong()
          this.status.currentTime.original = this.$refs.audio.currentTime
          let minutes = Math.floor(this.$refs.audio.currentTime / 60)
          let seconds = this.$refs.audio.currentTime - minutes * 60
          this.status.currentTime.minutes = this.setLeading(minutes)
          this.status.currentTime.seconds = this.setLeading(Math.floor(seconds))
        }.bind(this), 300)
      },
      setLeading (value) {
        return (value < 10 ? '0' : '') + value
      }
    },
    created () {
      $('img').on('dragstart', (event) => event.preventDefault())
      $('main').on('scroll', () =>  {
        console.log('scrolling')
        $('.dropdown-toggle').dropdown('hide')
      })

      window.onkeydown = (e) => {
        if (e.target !== document.body) return null
        e.preventDefault()
        if (e.key === ' ') this.playOrPause()

        return false
      }

      ipc.on('player-previous', () => this.previousSong())
      ipc.on('player-playOrPause', () => this.playOrPause())
      ipc.on('player-next', () => this.nextSong())
      ipc.on('player-clear', () => this.clearPlayer())
      ipc.on('player-shuffle', () => this.shuffle())
      ipc.on('player-repeat', () => this.repeat())
      ipc.on('add-songs-playlist', (event, response) => {
        response.forEach((song) => {
          this.addToPlaylist(song)
        })
      })
    },
    watch: {
      'status.volume': function (value) {
        this.$refs.audio.volume = this.status.volume
      },
      'currentSong.route': function (value) {
        return value.replace('#', '%23')
      }
    },
    computed: {
      audioSource: function (value) {
        return this.currentSong.route.replace('#', '%23')
      }
    }
  }
</script>

<style>
</style>
