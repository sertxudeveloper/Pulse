const ipc = require('electron').ipcMain

const History = require('../collections/historyCollection').default
const HistoryCollection = new History()

let cacheRecommendedWeek = []
let cacheRecommendedMonth = []

export default () => {
  ipc.on('history', async function (event, request) {
    let response

    switch (request.method) {
      case 'add':
        if (!request._id) return null
        await HistoryCollection.add(request._id)
        break

      case 'listenedWeek':
        response = await HistoryCollection.getListenedWeek()
        event.sender.send('history-listenedWeek', response)
        break

      case 'listenedMonth':
        response = await HistoryCollection.getListenedMonth()
        event.sender.send('history-listenedMonth', response)
        break

      case 'recommendedWeek':
        if (cacheRecommendedWeek.length) {
          response = cacheRecommendedWeek
        } else {
          response = await HistoryCollection.getRecommendedWeek()
          if(!response) return null
          cacheRecommendedWeek = response
        }
        event.sender.send('history-recommendedWeek', response)
        break

      case 'recommendedMonth':
        if (cacheRecommendedMonth.length) {
          response = cacheRecommendedMonth
        } else {
          response = await HistoryCollection.getRecommendedMonth()
          if(!response) return null
          cacheRecommendedMonth = response
        }
        event.sender.send('history-recommendedMonth', response)
        break

      case 'clearCacheRecommendedWeek':
        response = await HistoryCollection.getRecommendedWeek()
        if(!response) return null
        cacheRecommendedWeek = response
        event.sender.send('history-recommendedWeek', response)
        break

      case 'clearCacheRecommendedMonth':
        response = await HistoryCollection.getRecommendedMonth()
        if(!response) return null
        cacheRecommendedMonth = response
        event.sender.send('history-recommendedMonth', response)
        break

      case 'lastListened':
        response = await HistoryCollection.getLastListened()
        event.sender.send('history-lastListened', response)
        break
    }
  })
}
