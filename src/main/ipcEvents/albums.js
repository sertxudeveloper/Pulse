const ipc = require('electron').ipcMain

const Album = require('../collections/albumCollection').default
const AlbumCollection = new Album()

export default () => {
  ipc.on('albums', async function (event, request) {
    let response

    switch (request.method) {
      case 'firstOrCreate':
        if (!request.where) return null
        if (!request.insert) return null
        response = await AlbumCollection.firstOrCreate(request.where, request.insert)
        if (response) event.returnValue = response
        break

      case 'paginate':
        if (!request.page) return null
        if (!request.pageSize) return null
        response = await AlbumCollection.paginate(request.page, request.pageSize)
        event.sender.send('albums-paginate', response)
        break

      case 'show':
        if (!request.where) return null
        response = await AlbumCollection.find(request.where)
        event.sender.send('albums-show', response)
        break

      case 'songs':
        if (!request.page) return null
        if (!request.pageSize) return null
        if (!request.where) return null
        response = await AlbumCollection.songs(request.page, request.pageSize, request.where)
        event.sender.send('albums-songs', response)
        break

      case 'playAll':
        if (!request.where) return null
        response = await AlbumCollection.playAll(request.where)
        event.sender.send('add-songs-playlist', response)
        console.log('playAll', response, request)
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
