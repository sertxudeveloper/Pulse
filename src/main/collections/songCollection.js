const Base = require('./_base').default

class SongCollection extends Base {
  constructor () {
    super({model: 'songs'})
  };

  async get () {
    const cursor = this.collection.aggregate([
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {
        $project: {_id: {$toString: '$_id'}, 'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}
      },
    ])

    return await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async search (query) {
    this.collection.createIndex({title: 'text'})
    const cursor = this.collection.aggregate([
      {$match: {$text: {$search: query, $caseSensitive: false, $diacriticSensitive: false}}},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ])

    return await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async searchOne (query) {
    this.collection.createIndex({title: 'text'})
    const cursor = this.collection.aggregate([
      {$match: {$text: {$search: query, $caseSensitive: false, $diacriticSensitive: false}}},
      {$limit: 1},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ])

    return await cursor.next()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async paginate (page, pageSize) {
    let response = {}
    this.collection.createIndex({title: 1})

    const cursor = this.collection.aggregate([
      {$sort: {title: 1}},
      {$skip: pageSize * (page - 1)},
      {$limit: pageSize},
      {
        $lookup: {
          from: 'albums',
          localField: 'album',    // field in the current collection
          foreignField: '_id',  // field in the from collection
          as: 'album'
        }
      },
      {$unwind: '$album'},
      {
        $lookup: {
          from: 'artists',
          localField: 'artists',    // field in the current collection
          foreignField: '_id',  // field in the from collection
          as: 'artists'
        }
      },
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ])

    response.data = await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await this.collection.find({}).count()
    return response
  }

  async playAll () {
    return await this.collection.aggregate([
      {$sort: {title: 1}},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  /**
   * Get the requested document
   * @param where Object with the query
   * @returns {Object}
   */
  async find (where) {
    return await this.collection.aggregate([
      {$match: where},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}}
    ]).next()
  }
}

export default SongCollection
