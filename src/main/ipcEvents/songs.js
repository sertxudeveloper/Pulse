const ipc = require('electron').ipcMain
const app = require('electron').app

const process = require('child_process')
const queue = require('async/queue')
const path = require('path')
const workerRoute = path.join(__dirname, '../../dist/electron/workers/workers.js')

const Song = require('../collections/songCollection').default
const SongCollection = new Song()

export default () => {
  ipc.on('songs', async function (event, request) {
    let response

    switch (request.method) {
      case 'firstOrCreate':
        if (!request.data) return null
        response = await SongCollection.firstOrCreate(request.data)
        if (response) event.returnValue = response
        break

      case 'paginate':
        if (!request.page) return null
        if (!request.pageSize) return null
        response = await SongCollection.paginate(request.page, request.pageSize)
        event.sender.send('songs-paginate', response)
        break

      // case 'show':
      //   if (!request.where) return null
      //   response = await SongCollection.find(request.where)
      //   event.sender.send('songs-show', response)
      //   break

      // case 'insert':
      //   if (!request.data) return null
      //   response = await SongCollection.insert(request.data)
      //   if (response) event.sender.send('songs-add', request.data)
      //   break

      case 'playAll':
        response = await SongCollection.playAll()
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

      case 'process':
        if (!request.data) return null
        
        const taskQueue = queue((route, callback) => {
          let worker = process.fork(workerRoute, [route, app.getPath('userData')])

          worker.on('exit', function (code, signal) {
            console.log('child process exited with ' + `code ${code} and signal ${signal}`)
            callback()
          })

          worker.on('message', (data) => {
            if (data.finished === true) return worker.kill()
            event.sender.send('songs-processed', data)
          })
        }, 1)

        taskQueue.push(request.data.route)
        break
    }
  })
}
