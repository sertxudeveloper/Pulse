const ipc = require('electron').ipcMain

const Artist = require('../collections/artist').default
const ArtistCollection = new Artist()

export default () => {
  ipc.on('artists', async function (event, request) {
    let response

    switch (request.method) {
      case 'firstOrCreate':
        if (!request.data) return null
        response = await ArtistCollection.firstOrCreate(request.data)
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
    }
  })
}
