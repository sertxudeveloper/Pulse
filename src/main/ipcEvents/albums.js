const ipc = require('electron').ipcMain

const Album = require('../collections/album').default
const AlbumCollection = new Album()

export default () => {
  ipc.on('albums', async function (event, request) {
    let response

    switch (request.method) {
      case 'firstOrCreate':
        if (!request.data) return null
        response = await AlbumCollection.firstOrCreate(request.data)
        if (response) event.returnValue = response
        break

      case 'show':
        if (!request.where) return null
        response = await AlbumCollection.find(request.where)
        console.log(request, response)
        event.sender.send('albums-show', response)
        break

      case 'paginate':
        if (!request.page) return null
        if (!request.pageSize) return null
        response = await AlbumCollection.paginate(request.page, request.pageSize)
        event.sender.send('albums-paginate', response)
        break
    }
  })
}
