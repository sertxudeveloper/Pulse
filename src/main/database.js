const MongoClient = require('mongodb').MongoClient

class Database {
  constructor (url, dbName) {
    this.url = url || 'mongodb://localhost:27017'
    this.dbName = dbName || 'music'
  }

  connect () {
    return new Promise(async (resolve, reject) => {
      MongoClient.connect(this.url, {useNewUrlParser: true})
        .then(client => {
          this.database = client.db(this.dbName)
          resolve(this.database)
        }).catch(error => console.error(error))
    })
  }
}

export default Database
