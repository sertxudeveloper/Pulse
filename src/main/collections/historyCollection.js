const Spotify = require('../providers/Spotify').default
const SpotifyProvider = new Spotify()
const Song = require('./songCollection').default
const SongCollection = new Song()

const Base = require('./_base').default

class HistoryCollection extends Base {
  constructor () {
    super({model: 'history'})
  };

  async add (_id) {
    return await this.collection.insertOne({song: _id, time: new Date()})
  }

  async getListenedWeek () {
    const from = new Date(new Date().setDate(new Date().getDate() - 7))
    const to = new Date()
    return await this.getSongs(from, to)
  }

  async getListenedMonth () {
    const from = new Date(new Date().setMonth(new Date().getMonth() - 7))
    const to = new Date()
    return await this.getSongs(from, to)
  }

  async getRecommendedWeek () {
    const listened = await this.getListenedWeek()
    return await this.getRecommended(listened)
  }

  async getRecommendedMonth () {
    const listened = await this.getListenedMonth()
    return await this.getRecommended(listened)
  }

  async getLastListened () {
    return await this.collection.aggregate([
      {$sort: {time: -1}},
      {$limit: 6},
      {$lookup: {from: 'songs', localField: 'song', foreignField: '_id', as: 'song'}},
      {$unwind: '$song'},
      {$replaceRoot: {newRoot: '$song'}},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0, 'count': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async getRecommended (listened) {
    let response = []
    for (let el in listened) {
      let fount = await SpotifyProvider.search(listened[el].title + ' ' + listened[el].artists[0].name, 'tracks')
      if (!fount) continue
      let uri = fount.split(':')[2]

      let recommendations = await SpotifyProvider.getRecommendation(uri, 'tracks')

      for (let el in recommendations) {
        let locale = await SongCollection.searchOne('"' + recommendations[el].name + '"')
        if (locale) {
          response.push(locale)
          continue
        }

        let artists = []

        for (let i in recommendations[el].artists) {
          artists.push({name: recommendations[el].artists[i].name})
        }

        let song = {
          album: {name: recommendations[el].album.name},
          artists,
          duration: recommendations[el].duration_ms,
          id: recommendations[el].id,
          picture: recommendations[el].album.images[0].url,
          route: recommendations[el].preview_url,
          title: recommendations[el].name,
          preview: true
        }

        response.push(song)
      }
    }

    return response
  }

  async getSongs (from, to) {
    return await this.collection.aggregate([
      {$match: {time: {$gte: from, $lt: to}}},
      {$group: {_id: '$song', 'count': {'$sum': 1}}},
      {$sort: {count: -1}},
      {$limit: 6},
      {$lookup: {from: 'songs', localField: '_id', foreignField: '_id', as: 'song'}},
      {$unwind: '$song'},
      {$replaceRoot: {newRoot: '$song'}},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0, 'count': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

}

export default HistoryCollection
