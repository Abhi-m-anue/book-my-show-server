const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    dbName: '06-JOBS-API'
  })
}

module.exports = connectDB
