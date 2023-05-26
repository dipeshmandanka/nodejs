const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect("mongodb://localhost:27017/bookstore")
        .then(client => {
            dbConnection = client.db()
            cb()
        })
        .catch(err => {
            console.log("Error connecting to Mongo: " + err.message);
            cb(err);
        })
    },
    getDb: () => dbConnection
}