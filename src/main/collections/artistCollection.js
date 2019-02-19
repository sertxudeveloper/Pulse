const Base = require('./_base').default

class ArtistCollection extends Base {
  constructor () {
    super({model: 'artists'})
  };

  /**
   * Gets an Object with a document page and a count of all elements
   * @param page
   * @param pageSize
   * @param where
   * @returns {Object}
   */
  async paginate (page, pageSize, where = {}) {
    let response = {}
    this.collection.createIndex({name: 1})
    const cursor = this.collection.find(where, {_id: 0}).sort({name: 1})

    response.data = await cursor.skip(pageSize * (page - 1)).limit(pageSize).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await cursor.count()
    return response
  }

  /**
   * Gets an Object with an Album document page and a count of all elements
   * @param page
   * @param pageSize
   * @param where
   * @returns Object
   */
  async albums (page, pageSize, where = {}) {
    let response = {}
    this.collection.createIndex({name: 1})

    const cursor = this.collection.aggregate([
      {$match: where},
      {$lookup: {from: 'songs', localField: '_id', foreignField: 'artists', as: 'songs'}},
      {$unwind: '$songs'},
      {$replaceRoot: {newRoot: '$songs'}},
      {$group: {_id: '$album'}},
      {$lookup: {from: 'albums', localField: '_id', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$replaceRoot: {newRoot: '$album'}},
      {$addFields: {id: {$toString: '$_id'}}},
      {$sort: {title: 1}}
    ])

    response.count = (await cursor.toArray()).length
    response.data = await cursor.skip(pageSize * (page - 1)).limit(pageSize).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    return response
  }

  /**
   * Gets an Array with all the songs related to the requested artist
   * @param where
   * @returns {Array}
   */
  async playAll (where) {
    return await this.collection.aggregate([
      {$match: where},
      {$lookup: {from: 'songs', localField: '_id', foreignField: 'artists', as: 'songs'}},
      {$unwind: '$songs'},
      {$replaceRoot: {newRoot: '$songs'}},
      {$lookup: {from: 'albums', localField: 'album', foreignField: '_id', as: 'album'}},
      {$unwind: '$album'},
      {$lookup: {from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists'}},
      {$project: {'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
      {$addFields: {id: {$toString: '$_id'}}},
      {$sort: {title: 1}}
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  /**
   * Search the query in the model and return all the result documents
   * @param query
   * @returns {Array}
   */
  async search (query) {
    this.collection.createIndex({name: 'text'})
    return await this.collection.aggregate([
      {$match: {$text: {$search: query, $caseSensitive: false, $diacriticSensitive: false}}},
      {$project: {_id: 0}},
      {$sort: {name: 1}}
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }
}

export default ArtistCollection
