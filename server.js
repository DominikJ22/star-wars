const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser= require('body-parser')
const PORT = 3000

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected')
})
  db.on('error', err => {
    console.error('connection error:', err)
  })

app.set('view engine', 'ejs')

//middlewares
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray()
  .then(results => {
    res.render('index.ejs', { quotes: results })
  })
  .catch(/* ... */)
})

app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
   .then(result => {
      res.redirect('/')
    })
   .catch(error => console.error(error))
})

app.use(express.static('public'))

app.listen(3000,function(){
    console.log('listening on 3000')
})

