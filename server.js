const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser= require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())




let db;

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
 db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected')
})
  db.on('error', err => {
    console.error('connection error:', err)
  })

  const quotesCollection = db.collection('quotes')


//middlewares
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray()
  .then(results => {
    res.render('index.ejs', { quotes: results })
  })
  .catch(/* ... */)
})

app.post('/quotes', (req, res) => {
  //insertOne method
  quotesCollection.insertOne(req.body)
  .then (result => {
    console.log(result)
    res.redirect('/')
  })
  .catch(error => console.error)
})


app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})


//Connect to the database before listening

  app.listen(process.env.PORT || PORT, () => {
      console.log("listening for requests");
  })



