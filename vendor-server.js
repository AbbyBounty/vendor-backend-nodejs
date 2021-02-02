const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const config = require('./config')
const cors = require('cors')

// morgan: for logging
const morgan = require('morgan')

// swagger: for api documentation
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


// routers

const mechanicRouter = require('./vendor/routes/mechanic')
const vendorRouter = require('./vendor/routes/vendor')
const serviceRouter = require('./vendor/routes/services')
const offerRouter = require('./vendor/routes/offers')
const orderRouter = require('./vendor/routes/order')


const app = express()
app.use(cors('*'))

app.use(bodyParser.json())
app.use(morgan('combined'))

// swagger init
const swaggerOptions = {
  definition: {
    info: {
      title: 'Amazon Server (Admin Panel)',
      version: '1.0.0',
      description: 'This is a Express server for amazon application'
    }
  },
  apis: ['./admin/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// add a middleware for getting the id from token
function getUserId(request, response, next) {

  if (request.url == '/vendor/signin' 
      || request.url == '/vendor/signup'
      || request.url.startsWith('/product/image') ) {
    // do not check for token 
    next()
  } else {

    try {
      const token = request.headers['token']
   

      const data = jwt.verify(token, config.secret)

   

      // add a new key named userId with logged in user's id
      request.userId = data['id']

      // go to the actual route
      next()
      
    } catch (ex) {
      response.status(401)
      response.send({status: 'error', error: 'protected api'})
    }
  }
}

app.use(getUserId)

// required to send the static files in the directory named images
app.use(express.static('images/'))

// add the routes
app.use('/mechanic', mechanicRouter)
app.use('/vendor', vendorRouter)
app.use('/services', serviceRouter)
app.use('/offer', offerRouter)
app.use('/myorders', orderRouter)


// default route
app.get('/', (request, response) => {
  response.send('welcome to my application')
})

app.listen(3000, '0.0.0.0', () => {
  console.log('server started on port 3000')
})