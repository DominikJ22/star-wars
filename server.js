const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser= require('body-parser')

dotenv.config({ path: "./config/.env" })

const PORT = process.env.PORT || 3000
const app = express()


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())


let db;

db = mongoose.connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


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
//quotesCollection.insertOne method
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

connectDB().then(() => {
//Connect to the database before listening
  app.listen(process.env.PORT || PORT, () => {
      console.log("listening for requests");
  })
})