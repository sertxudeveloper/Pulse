const ipc = require('electron').ipcMain

const Artist = require('../collections/artistCollection').default
const ArtistCollection = new Artist()

const Album = require('../collections/albumCollection').default
const AlbumCollection = new Album()

const Song = require('../collections/songCollection').default
const SongCollection = new Song()

export default () => {
  ipc.on('search', async function (event, request) {
    let response = {}
    let artists = ArtistCollection.search("\"" + request + "\"")
    let albums = AlbumCollection.search("\"" + request + "\"")
    let songs = SongCollection.search("\"" + request + "\"")

    Promise.all([artists, albums, songs]).then(values => {
      response.artists = values[0]
      response.albums = values[1]
      response.songs = values[2]
      response.query = request
      event.sender.send('search', response)
    });
  })
}
