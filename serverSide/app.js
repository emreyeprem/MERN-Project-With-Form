const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const PORT = 3003
var cors = require('cors')
app.use(cors())
// parse application/json
app.use(bodyParser.json())
// ===================== mongoDB ============
const mongoose = require('mongoose')
const MERNList = require('./schemas/mernlist')
mongoose.connect('mongodb://localhost/merndb')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We are connected to the database..")
});

//-----------------to enable CORS-------
app.use(function(req, res, next) {
  //
  // res.header("Access-Control-Allow-Headers: Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization,X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, function(){
  console.log('Server is running...')
})
//===========================================================
