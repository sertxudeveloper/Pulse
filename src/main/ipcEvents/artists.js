const ipc = require('electron').ipcMain

const Artist = require('../collections/artistCollection').default
const ArtistCollection = new Artist()

export default () => {
  ipc.on('artists', async function (event, request) {
    let response

    switch (request.method) {
      case 'firstOrCreate':
        if (!request.where) return null
        if (!request.insert) return null
        response = await ArtistCollection.firstOrCreate(request.where, request.insert)
        if (response) event.returnValue = response
        break

      case 'paginate':
        if (!request.page) return null
        if (!request.pageSize) return null
        response = await ArtistCollection.paginate(request.page, request.pageSize)
        event.sender.send('artists-paginate', response)
        break

      case 'show':
        if (!request.where) return null
        response = await ArtistCollection.find(request.where)
        event.sender.send('artists-show', response)
        break

      case 'albums':
        if (!request.page) return null
        if (!request.pageSize) return null
        if (!request.where) return null
        response = await ArtistCollection.albums(request.page, request.pageSize, request.where)
        event.sender.send('artist-albums', response)
        break

      case 'playAll':
        if (!request.where) return null
        response = await ArtistCollection.playAll(request.where)
        event.sender.send('add-songs-playlist', response)
        break

      case 'remove':
        if (!request.where) return null
        console.log('remove')
        break

      case 'edit':
        if (!request.where) return null
        console.log('edit')
        break

      case 'getRecommendation':
        if (!request.where) return null
        console.log('getRecommendation')
        break

      case 'addToPlaylist':
        if (!request.where) return null
        if (!request.playlist) return null
        console.log('addToPlaylist')
        break
    }
  })
}
