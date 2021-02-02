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
router.get('/', (request, response) => {


  try {

    const ven_id = request.userId
    const statement = `select *  from offer where ven_id=${ven_id}`

    db.query(statement, (error, offers) => {

      if (offers.length > 0) {
        const offer = offers;
        response.send(utils.createResult(error, offer))
      }
      else {

        response.send(utils.createError(`there is no offer with this id`))
      }

    })
  } catch (ex) {
    response.status = 401
    response.send("you are not authorize to do it")

  }

})


router.get('/details/:id', (request, response) => {
  const {id} = request.params
    const statement = `select *  from offer where ofr_id=${id}`
 
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
    } else {
      // empty products collection
      const offers = []

      // iterate over the collection and modify the structure
      for (let index = 0; index < data.length; index++) {
        const tmpOffer = data[index];
        const offer = {
          ofr_id: tmpOffer['ofr_id'],
          ofr_code: tmpOffer['ofr_code'],
          ofr_discount: tmpOffer['ofr_discount'],
          ofr_name: tmpOffer['ofr_name'],
          ofr_validity: tmpOffer['ofr_validity'],
          

         
        }
        offers.push(offer)
      }

      response.send(utils.createSuccess(offers ))
    }

  })
})
// ----------------------------------------------------


// ----------------------------------------------------
// POST
// ----------------------------------------------------
router.post('/create', (request, response) => {
  const ven_id = request.userId
  const{ ofr_code, ofr_discount,ofr_name,ofr_validity } = request.body
  const statement = `insert into offer (ofr_code, ofr_discount,ofr_name,ofr_validity,  ven_id) values (
    '${ofr_code}', '${ofr_discount}','${ofr_name}','${ofr_validity}' , '${ven_id}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


// ----------------------------------------------------
// PUT
// ----------------------------------------------------
router.put('/:ofr_id', (request, response) => {
  const ven_id = request.userId
  const { ofr_id } = request.params
  const { ofr_code, ofr_discount,ofr_name,ofr_validity }  = request.body

  const statement = `update offer set 
  ofr_code = '${ofr_code}',
  ofr_discount = '${ofr_discount}',
  ofr_name = '${ofr_name}',
  ofr_validity = '${ofr_validity}',
  ven_id = '${ven_id}'
   
  where ofr_id = ${ofr_id}`
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
  const statement = `delete from offer where ofr_id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


module.exports = router