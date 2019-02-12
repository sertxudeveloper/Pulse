const ipc = require('electron').ipcMain
const app = require('electron').app

const process = require('child_process')
const queue = require('async/queue')
const path = require('path')
const workerRoute = path.join(__dirname, '../../dist/electron/workers/workers.js')

const Song = require('../collections/song').default
const SongCollection = new Song()

export default () => {
  ipc.on('tracks', async function (event, request) {
    let response

    switch (request.method) {
      case 'paginate':
        if (!request.page) return null
        if (!request.pageSize) return null
        response = await SongCollection.paginate(request.page, request.pageSize)
        event.sender.send('tracks-paginate', response)
        break

      case 'show':
        if (!request.id) return null
        response = await SongCollection.find(request.id)
        event.sender.send('tracks-show', response)
        break

      case 'insert':
        if (!request.data) return null
        response = await SongCollection.insert(request.data)
        if (response) event.sender.send('tracks-add', request.data)
        break

      case 'firstOrCreate':
        if (!request.data) return null
        response = await SongCollection.firstOrCreate(request.data)
        if (response) event.returnValue = response
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
            event.sender.send('tracks-processed', data)
          })
        }, 1)

        taskQueue.push(request.data.route)
        break
    }
  })
}
