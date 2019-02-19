const Base = require('./_base').default
const Mongo = require('../database').default

class Song extends Base {
  constructor () {
    super({model: 'songs'})
  };

  async get () {
    const cursor = this.collection.aggregate([
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
      {$project: {_id: {$toString: "$_id"},'album.picture': 0, 'album._id': 0, 'artists.picture': 0, 'artists._id': 0}},
    ])

    return await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async search (query) {
    this.collection.createIndex({title: 'text'})
    const cursor = this.collection.aggregate([
      {$match: {$text: {$search: query, $caseSensitive: false, $diacriticSensitive: false}}},
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
      {$addFields: {id: { $toString: "$_id" }}}
    ])

    return await cursor.toArray()
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
      {$addFields: {id: { $toString: "$_id" }}}
    ])

    response.data = await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await this.collection.find({}).count()
    return response
  }

  async firstOrCreate (data) {
    const mongo = new Mongo()
    const db = await mongo.connect()
    this.collection = db.collection(this.model)

    return await this.collection.findOneAndUpdate(
      {title: data.title},
      {$setOnInsert: data},
      {returnNewDocument: true, upsert: true})
  }

  async getWherePagination (page, pageSize, where = {}) {
    let response = {}
    this.collection.createIndex({title: 1})

    const cursor = this.collection.aggregate([
      {$match: where},
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
      {$addFields: {id: { $toString: "$_id" }}}
    ])

    response.data = await cursor.toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await this.collection.find(where).count()
    return response
  }

  async getAlbumsPaginate (page, pageSize, _id) {
    let response = {}
    this.collection.createIndex({title: 1})

    const cursor = this.collection.aggregate([
      {$match: {artists: _id}},
      {$group: {_id: '$album'}},
      {
        $lookup: {
          from: 'albums',
          localField: '_id',    // field in the current collection
          foreignField: '_id',  // field in the from collection
          as: 'album'
        }
      },
      {$unwind: '$album'},
      {$replaceRoot: {newRoot: '$album'}},
      {$sort: {title: 1}}
    ])

    response.count = (await cursor.toArray()).length
    response.data = await cursor.skip(pageSize * (page - 1)).limit(pageSize).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    return response
  }
}

export default Song
