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
app.post('/sendListItem',function(req,res){
 let title = req.body.title
 let description = req.body.description
 console.log(title,description)

 let listItem = new MERNList({title:title,description:description})
   listItem.save((error, newAddedItem)=>{
     if(error){
       console.log(error)
       res.status(500).json({error: "Unable to post"})
       return
     }
     console.log(newAddedItem)
     res.json({'success':true, 'newAddedItem' : newAddedItem})

 })
})
app.get('/getList',function(req,res){

  MERNList.find({},(error,items) => {
     res.json(items)
   })

})
app.get('/delete/:id',function(req,res){
  let itemId = req.params.id
  console.log(itemId)
 MERNList.findByIdAndDelete(itemId,(error,item)=>{
  if(error) {
     res.status(500).json({error: 'Unable to delete..'})
     return
      }
      res.json({success: true})
   })
})
