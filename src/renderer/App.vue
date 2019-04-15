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
  const win = require('electron').remote.getCurrentWindow()

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
          repeat: 0, /** 0 No repeat | 1 Repeat all | 2 Repeat one */
          songsPlayed: 0
        },
      }
    },
    methods: {
      clearPlayer () {
        this.playlist = []
        this.original = []
        this.currentSong = {title: '', artist: '', album: '', picture: '', route: ''}
        this.status.playing = false
        this.$refs.audio.pause()
        ipc.send('playing-status', {remove: true})
      },
      nextSong (index = 1) {
        if (index === 0) return this.playOrPause()

        if (this.status.repeat === 2) {
          this.$refs.audio.currentTime = 0
          return this.playOrPause('play')
        }

        ++this.status.songsPlayed

        if (this.status.songsPlayed === this.playlist.length) {
          this.status.songsPlayed = 0
          if (this.status.repeat === 0) return this.clearPlayer()
          /** if (this.status.repeat === 1) continue executing the following code, the repeat all is the main mode*/
        }

        /** Change current queue */
        const skippedSongs = this.playlist.splice(0, index)
        for (let i = 0; i < skippedSongs.length; i++) this.playlist.push(skippedSongs[i])

        /** Change original queue */
        const skippedOriginalSongs = this.original.splice(0, index)
        for (let i = 0; i < skippedOriginalSongs.length; i++) this.original.push(skippedOriginalSongs[i])
        this.setSong(this.playlist[0])
      },
      previousSong () {
        --this.status.songsPlayed

        /** Change current queue */
        const skippedSongs = this.playlist.splice(-1, 1)
        for (let i = 0; i < skippedSongs.length; i++) this.playlist.unshift(skippedSongs[i])

        /** Change original queue */
        const skippedOriginalSongs = this.original.splice(-1, 1)
        for (let i = 0; i < skippedOriginalSongs.length; i++) this.original.unshift(skippedOriginalSongs[i])
        this.setSong(this.playlist[0])
      },
      playOrPause (action) {
        if (!this.$refs.audio.duration) return null
        if (!action) {
          (!this.status.playing) ? this.$refs.audio.play() : this.$refs.audio.pause()
        } else {
          (action === 'play') ? this.$refs.audio.play() : this.$refs.audio.pause()
        }
        this.status.playing = !this.$refs.audio.paused
        ipc.send('playing-status',
          {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})
        clearInterval(this.status.interval)
        if (this.status.playing) this.updateTime()
      },
      playSong (song) {
        if (this.currentSong.id === song.id) {
          this.playOrPause()
        } else {
          this.clearPlayer()
          this.addToPlaylist(song)
        }
      },
      setSong (song) {
        this.currentSong = song
        this.$refs.audio.oncanplay = () => {
          this.status.duration.original = this.$refs.audio.duration
          let minutes = Math.floor(this.$refs.audio.duration / 60)
          let seconds = this.$refs.audio.duration - minutes * 60
          this.status.duration.minutes = this.setLeading(minutes)
          this.status.duration.seconds = this.setLeading(Math.floor(seconds))
          this.playOrPause('play')
          this.sendNotification()
          this.$refs.audio.oncanplay = null
        }
      },
      addToPlaylist (song, immediate = false) {
        if (!this.currentSong.title || immediate) this.setSong(song)
        this.playlist.push(song)
        this.original.push(song)
      },
      removeFromPlaylist (index, song) {
        if (song === this.currentSong) this.nextSong()
        this.playlist.splice(index, 1)
        this.original.splice(index, 1)
        if (!this.playlist.length) this.clearPlayer()
      },
      shuffle () {
        this.status.shuffle = !this.status.shuffle
        ipc.send('playing-status',
          {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})

        if (this.status.shuffle) {
          /** Desordenar canciones sin tocar la activa */
          const actualSongObj = this.playlist.splice(0, 1)
          this.playlist = this._shuffle(this.playlist)
          this.playlist.unshift(actualSongObj[0])
          this.status.songsPlayed = 0
        } else {
          /** Ordenar las canciones sin tocar la activa */
          const actualSongObj = this.playlist.splice(0, 1)
          this.playlist.splice(0, this.playlist.length)
          this.playlist.push(actualSongObj[0])
          for (let i = 0; i < this.original.length; i++) {
            if (this.original[i].id !== actualSongObj[0].id) {
              this.playlist.push(this.original[i])
            }
          }
        }
      },
      _shuffle (a) {
        let x, t, r = new Uint32Array(1)
        for (let i = 0, c = a.length - 1, m = a.length; i < c; i++, m--) {
          crypto.getRandomValues(r)
          x = Math.floor(r / 65536 / 65536 * m) + i
          t = a [i], a [i] = a [x], a [x] = t
        }

        return a
      },
      repeat () {
        this.status.repeat = (this.status.repeat === 2) ? 0 : ++this.status.repeat
        ipc.send('playing-status',
          {shuffle: this.status.shuffle, repeat: this.status.repeat, playing: this.status.playing})
      },
      muteOrUnmute (action) {
        if (!action) {
          this.status.muted = !this.status.muted
        } else {
          if (action !== 'mute' && action !== 'unmute') return null
          this.status.muted = (action === 'mute')
        }

        this.$refs.audio.muted = this.status.muted
      },
      seek (event) {
        this.$refs.audio.currentTime = (event.target.value / 100 * this.status.duration.original)
      },
      endedSong () {
        clearInterval(this.status.interval)
        this.status.playing = false
        if (this.currentSong._id) ipc.send('history', {method: 'add', _id: this.currentSong._id})
        this.nextSong()
      },
      updateTime () {
        this.status.interval = setInterval(function () {
          this.status.currentTime.original = this.$refs.audio.currentTime
          if (parseFloat((this.status.currentTime.original).toFixed(1)) === parseFloat((this.status.duration.original).toFixed(1))) this.endedSong()
          let minutes = Math.floor(this.$refs.audio.currentTime / 60)
          let seconds = this.$refs.audio.currentTime - minutes * 60
          this.status.currentTime.minutes = this.setLeading(minutes)
          this.status.currentTime.seconds = this.setLeading(Math.floor(seconds))
        }.bind(this), 100)
      },
      setLeading (value) {
        return (value < 10 ? '0' : '') + value
      },
      sendNotification () {
        /** Chrome Notification **/
        const notification = new Notification('► ' + this.currentSong.title,
          {icon: this.currentSong.picture, body: this.currentSong.album.name, tag: 'reproduciendo', renotify: true})

        notification.onclick = () => win.focus()
        notification.onclose = () => window.close.bind(notification)
        setTimeout(() => notification.close(), 7000)
      }
    },
    created () {
      $('img').on('dragstart', (event) => event.preventDefault())
      $('main').on('scroll', () => $('.dropdown-toggle').dropdown('hide'))

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
      ipc.on('add-songs-playlist', (event, response) => response.forEach((song) => this.addToPlaylist(song)))
    },
    watch: {
      'status.volume': function () {
        this.$refs.audio.volume = this.status.volume
      },
      'currentSong.route': function (value) {
        return value.replace('#', '%23')
      }
    },
    computed: {
      audioSource: function () {
        return this.currentSong.route.replace('#', '%23')
      }
    }
  }
</script>

<style>
</style>
