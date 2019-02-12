const Base = require('./_base').default
const Mongo = require('../database').default

class Album extends Base {
  constructor () {
    super({model: 'albums'})
  };

  async firstOrCreate (data) {
    const mongo = new Mongo()
    const db = await mongo.connect()
    this.collection = db.collection(this.model)

    return await this.collection.findOneAndUpdate(
      {name: data.name},
      {$setOnInsert: {picture: data.picture}},
      {returnNewDocument: true, upsert: true})
  }

  async find (where) {
    this.collection.createIndex({title: 1})

    const cursor = this.collection.aggregate([
      {$match: where},
      {
        $lookup: {
          from: 'songs',
          localField: '_id',    // field in the current collection
          foreignField: 'album',  // field in the from collection
          as: 'songs'
        }
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'songs.artists',    // field in the current collection
          foreignField: '_id',  // field in the from collection
          as: 'artists'
        }
      },
      {$project: {'songs': 0, 'artists.picture': 0, 'artists._id': 0}}
    ])

    return await cursor.next()
  }

  async paginate (page, pageSize, where = {}) {
    // Get all elements
    let response = {}
    this.collection.createIndex({name: 1})
    const cursor = this.collection.find(where, {_id: 0}).sort({name: 1})

    response.data = await cursor.skip(pageSize * (page - 1)).limit(pageSize).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await cursor.count()
    return response
  }

  async getAllSongs (_id) {
    return await this.collection.aggregate([
      {$match: {_id}},
      {
        $lookup: {
          from: 'songs',
          localField: '_id',
          foreignField: 'artists',
          as: 'songs'
        }
      },
      {$unwind: '$songs'},
      {$replaceRoot: { newRoot: "$songs"}},
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
    ]).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }
}

export default Album
