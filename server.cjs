const express = require('express')
const compression = require('compression')

// 端口
const port = 80
const app = express()

app.use(compression())
app.use(express.static('./dist'))

app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(`listening at http://localhost:${port}`)
})