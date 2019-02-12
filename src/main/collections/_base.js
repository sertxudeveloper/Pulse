class Base {

  constructor (data) {
    this.model = data.model
    if (global && global.db) this.collection = global.db.collection(this.model)
  }

  async get () {
    this.collection.createIndex({title: 1})
    return await this.collection.find({}, {_id: 0}).sort({title: 1}).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async search (query) {
    this.collection.createIndex({title: 1})
    this.collection.createIndex({name: 'text'})
    return await this.collection.find({
      // name: {$regex: query, $options: 'i'}
      $text: {$search: query, $caseSensitive: false, $diacriticSensitive: false}
    }, {_id: 0}).sort({title: 1}).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
  }

  async paginate (page, pageSize) {
    // Get all elements
    let response = {}
    this.collection.createIndex({title: 1})
    const cursor = this.collection.find({}, {_id: 0}).sort({title: 1})

    response.data = await cursor.skip(pageSize * (page - 1)).limit(pageSize).toArray()
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))

    response.count = await cursor.count()
    return response
  }

  async find (where) {
    return await this.collection.findOne(where)
  }

  async insert (data) {
    return await this.collection.insertOne(data)
      .then(res => res)
      .catch(error => console.error(error))
  }

  async firstOrCreate (data) {
    let find = await this.collection.findOne({title: data._id})
      .then(result => (result) ? result : null)
      .catch(error => console.error(error))
    if (find !== null) return find
    return await this.collection.insertOne(data)
      .then(res => res)
      .catch(error => console.error(error))
  }
}

export default Base
