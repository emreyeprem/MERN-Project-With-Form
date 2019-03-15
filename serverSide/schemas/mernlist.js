const mongoose = require('mongoose')

// define schema for post documents so these properties will be saved to the collection in the mongodb database
const ListSchema = new mongoose.Schema({
  title: String,
  description: String
})

const MERNList = mongoose.model('MERNList',ListSchema)

module.exports = MERNList
