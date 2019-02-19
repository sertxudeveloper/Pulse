const Mongo = require('../database').default

class Base {

  constructor (data) {
    this.model = data.model
    if (global && global.db) this.collection = global.db.collection(this.model)
  }

  /**
   * Gets the first document, if not exists will create it
   * @param where
   * @param insert
   * @returns {Object}
   */
  async firstOrCreate (where, insert) {
    /**
     * Check if this.collection is defined, if not create a new connection
     * This conditional is executed if it's requested by the worker
     */
    if (!this.collection) {
      const mongo = new Mongo()
      const db = await mongo.connect()
      this.collection = db.collection(this.model)
    }

    return await this.collection.findOneAndUpdate(
      where, {$setOnInsert: insert}, {returnNewDocument: true, upsert: true})
  }

  /**
   * Get the requested document
   * @param where Object with the query
   * @returns {Object}
   */
  async find (where) {
    return await this.collection.findOne(where)
  }
}

 export default Base
