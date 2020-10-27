const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
app.use(morgan("dev"))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.send({ shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  console.log(req.body,'this is our requestn')
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);