const jsmediatags = require('jsmediatags')
const fs = require('fs')
const path = require('path')
const queue = require('async/queue')
const ObjectID = require('mongodb').ObjectID
const mp3Duration = require('mp3-duration')
const md5 = require('js-md5')

const Song = require('../collections/songCollection').default
const SongCollection = new Song()

const Artist = require('../collections/artistCollection').default
const ArtistCollection = new Artist()

const Album = require('../collections/albumCollection').default
const AlbumCollection = new Album()

const route = process.argv[2]
const userRoute = process.argv[3]

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

const taskQueue = queue((route, callback) => {
  jsmediatags.read(route, {
    onSuccess: async (media) => {

      if (!media.tags.picture.data) return null

      const {data} = media.tags.picture
      const byteArray = new Uint8Array(data)
      const hash = md5(byteArray)
      const pictureName = hash + '.jpeg'
      const routePath = path.join(userRoute, 'pictures')
      const picturePath = path.join(routePath, pictureName)

      if (!fs.existsSync(routePath)) fs.mkdirSync(routePath)

      if (!fs.existsSync(picturePath)) {
        fs.writeFileSync(picturePath, byteArray)
      } else {
        let stats = fs.statSync(picturePath)
        if (!stats.size) {
          fs.writeFileSync(picturePath, byteArray)
        }
      }

      let metaArtists = media.tags.artist.split(/;|,+/g)

      let saveArtists = new Promise(async (resolve, reject) => {
        let artists = []

        for (let key in metaArtists) {
          const el = metaArtists[key]
          let response = await ArtistCollection.firstOrCreate({name: el.trim()}, {picture: picturePath})
          let _id = (response.value) ? response.value._id : response.lastErrorObject.upserted
          artists.push(ObjectID(_id))
        }
        resolve(artists)
      })

      let saveAlbum = new Promise(async (resolve, reject) => {
        let response = await AlbumCollection.firstOrCreate({name: media.tags.album.trim()}, {picture: picturePath})
        let _id = (response.value) ? response.value._id : response.lastErrorObject.upserted
        resolve(ObjectID(_id))
      })

      saveArtists.then((artists) => {
        saveAlbum.then(async (album) => {
          let song = {route, title: media.tags.title.trim(), album, artists, picture: picturePath}

          if (!album || !artists.length) {
            let text = 'Error adding song "' + song.title + '", retrying...'
            process.send({text, type: 'error', layout: 'topRight', timeout: 6000, queue: 'error'})
            taskQueue.push(route)
            callback()
            return null
          }

          mp3Duration(route, async function (err, duration) {
            if (err) return console.log(err.message)
            song.duration = duration
            let response = await SongCollection.firstOrCreate({title: song.title}, song)
            if (response.value && response.value._id) {
              let text = 'Song "' + song.title + '" already added'
              process.send({text, type: 'warning', layout: 'topRight', timeout: 3000, queue: 'warning'})
            }

            if (!response.value && response.lastErrorObject.upserted) {
              let text = 'Song "' + song.title + '" added successfully'
              process.send({text, type: 'success', layout: 'topRight', timeout: 3000, queue: 'success'})
            }

            callback()
          })
        })
      })
    },
    onError: (error) => {
      let text = /*error.info +*/ ' "' + route + '" not processed'
      process.send({text, type: 'error', layout: 'topRight', timeout: 6000, queue: 'error'})
      callback()
    }
  })
}, 1)

taskQueue.drain = () => {
  process.send({finished: true})
}

if (fs.lstatSync(route).isDirectory()) {
  getFolderElements(route)
} else {
  addSong(route)
}

function getFolderElements (route) {
  fs.readdir(route, (err, files) => {
    files.forEach(file => {
      let newRoute = route + '\\' + file
      if (fs.lstatSync(newRoute).isDirectory()) {
        return getFolderElements(newRoute)
      } else {
        return addSong(newRoute)
      }
    })
  })
}

function addSong (route) {
  taskQueue.push(route)
}
