const ipc = require('electron').ipcMain


export default () => {

  require('./ipcEvents/songs').default()
  require('./ipcEvents/artists').default()
  require('./ipcEvents/albums').default()

  require('./ipcEvents/search').default()

  // ipc.on('album-tracks', async function (event, request) {
  //   let response
  //
  //   switch (request.method) {
  //     case 'paginate':
  //       if (!request.page) return null
  //       if (!request.pageSize) return null
  //       response = await SongCollection.getWherePagination(request.page, request.pageSize, request.where)
  //       event.sender.send('album-tracks-pagination', response)
  //       break
  //   }
  // })
  //
  // ipc.on('artist-albums', async function (event, request) {
  //   let response
  //
  //   switch (request.method) {
  //     case 'paginate':
  //       if (!request.page) return null
  //       if (!request.pageSize) return null
  //       response = await SongCollection.getAlbumsPaginate(request.page, request.pageSize, request._id)
  //       event.sender.send('artist-albums-paginate', response)
  //       break
  //   }
  // })
  //
  // ipc.on('populars', async function (event, request) {
  //
  // })
  //
  //
  // ipc.on('play-all', async function (event, request) {
  //   let response
  //
  //   switch (request.method) {
  //     case 'album':
  //       response = await AlbumCollection.getAllSongs(request._id)
  //       event.sender.send('add-songs-playlist', response)
  //       break
  //
  //     case 'artist':
  //       response = await ArtistCollection.getAllSongs(request._id)
  //       event.sender.send('add-songs-playlist', response)
  //       break
  //   }
  // })

}
