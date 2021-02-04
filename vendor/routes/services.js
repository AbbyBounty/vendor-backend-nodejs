const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('../../config')


// multer: used for uploading document
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const router = express.Router()

// ----------------------------------------------------
// GET
// ----------------------------------------------------
/**
 * @swagger
 *
 * /services/:
 *   get:
 *     description: For getting services
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/', (request, response) => {


  try {

    const ven_id = request.userId
    const statement = `select *  from service where ven_id=${ven_id}`

    db.query(statement, (error, services) => {

      if (services.length > 0) {
        const service = services;
        response.send(utils.createResult(error, service))
      }
      else {

        response.send(utils.createError(`there is no service with this id`))
      }

    })
  } catch (ex) {
    response.status = 401
    response.send("you are not authorize to do it")

  }

})

/**
 * @swagger
 *
 * /services/details:
 *   get:
 *     description: For getting services details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */

router.get('/details/:id', (request, response) => {
  const {id} = request.params
    const statement = `select *  from service where stv_id=${id}`
 
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
    } else {
      // empty products collection
      const services = []

      // iterate over the collection and modify the structure
      for (let index = 0; index < data.length; index++) {
        const tmpservice = data[index];
        const service = {
          stv_id: tmpservice['stv_id'],
          stv_name: tmpservice['stv_name'],
          stv_price: tmpservice['stv_price']
          
          

         
        }
        services.push(service)
      }

      response.send(utils.createSuccess(services ))
    }

  })
})

// ----------------------------------------------------


// ----------------------------------------------------
// POST
// ----------------------------------------------------
/**
 * @swagger
 *
 * /services/create:
 *   post:
 *     description: For creating offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: stv_name
 *         description: service name
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: stv_price
 *         description: service price
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_id
 *         description: vendor id
 *         in: formData
 *         required: true
 *         type: string
 *      
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/create', (request, response) => {
  const ven_id = request.userId
  const { stv_name, stv_price} = request.body
  const statement = `insert into service (stv_name, stv_price,  ven_id) values (
    '${stv_name}', '${stv_price}',  '${ven_id}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


// ----------------------------------------------------
// PUT
// ----------------------------------------------------
router.put('/:stv_id', (request, response) => {
  const ven_id = request.userId
  const { stv_id } = request.params
  const { stv_name, stv_price }  = request.body

  const statement = `update service set 
  stv_name = '${stv_name}',
  stv_price = '${stv_price}',
      ven_id = '${ven_id}'
   
  where stv_id = ${stv_id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})



// ----------------------------------------------------



// ----------------------------------------------------
// DELETE
// ----------------------------------------------------
router.delete('/:id', (request, response) => {
  const { id } = request.params
  const statement = `delete from service where stv_id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


module.exports = router