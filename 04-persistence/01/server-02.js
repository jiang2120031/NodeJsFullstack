
const express= require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const port = process.env.PORT || 1337

const app = express()
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products',api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.use(middleware.handleError)
app.use(middleware.notFound)
app.listen(port,() => console.log(`server listening on port ${port}`))