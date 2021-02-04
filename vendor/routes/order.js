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
 * /order/:
 *   get:
 *     description: For getting orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/', (request, response) => 
{


  try {

    const ven_id = request.userId
    
    const statement = `select o.o_date ,o.o_start_time,o.o_vehicle_reg_no, u.u_first_name,u.u_last_name from orders o  join user u on  o.u_id=u.u_id where ven_id='${ven_id}'`

    db.query(statement, (error, orders) => {

      if (orders.length > 0) {
        const order = orders;
        response.send(utils.createResult(error, order))
      }
      else {

        response.send(utils.createError(`there is no order with this id`))
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
 * /order/history:
 *   get:
 *     description: For getting order history
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/history', (request, response) => 
{


  try {

   
    
    const statement =`select * from orders where active=0;`

    db.query(statement, (error, orders) => {

      if (orders.length > 0) {
        const order = orders;
        response.send(utils.createResult(error, order))
      }
      else {

        response.send(utils.createError(`there is no order with this id`))
      }

    })
  } catch (ex) {
    response.status = 401
    response.send("you are not authorize to do it")

  }

})

// router.get('/:id', (request, response) => {


//   try {
//     const mech_id=request.params
//     const ven_id = request.userId
//     const statement = `select *  from mechanic where mech_id=${mech_id}`

//     db.query(statement, (error, mechanics) => {

//       if (mechanics.length > 0) {
//         const mechanic = mechanics;
//         response.send(utils.createResult(error, mechanic))
//       }
//       else {

//         response.send(utils.createError(`there is no mechanic with this id`))
//       }

//     })
//   } catch (ex) {
//     response.status = 401
//     response.send("you are not authorize to do it")

//   }

// })

/**
 * @swagger
 *
 * /order/details:
 *   get:
 *     description: For getting order details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */

router.get('/details/:id', (request, response) => {
  const {id} = request.params
    const statement = `select *  from mechanic where mech_id=${id}`
 
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
    } else {
      // empty products collection
      const mechanics = []

      // iterate over the collection and modify the structure
      for (let index = 0; index < data.length; index++) {
        const tmpMechanic = data[index];
        const mechnaic = {
          mech_id: tmpMechanic['mech_id'],
          mech_first_name: tmpMechanic['mech_first_name'],
          mech_last_name: tmpMechanic['mech_last_name'],
          mech_mobile: tmpMechanic['mech_mobile'],
         
        }
        mechanics.push(mechnaic)
      }

      response.send(utils.createSuccess(mechanics ))
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
 * /offer/create:
 *   post:
 *     description: For creating offer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mech_first_name
 *         description: mechanic first name
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: mech_last_name
 *         description: mechanic last name
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: mech_mobile
 *         description: mechanic mobile number
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
  const { mech_first_name, mech_last_name, mech_mobile } = request.body
  const statement = `insert into mechanic (mech_first_name, mech_last_name, mech_mobile, ven_id) values (
    '${mech_first_name}', '${mech_last_name}', '${mech_mobile}', '${ven_id}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


// ----------------------------------------------------
// PUT
// ----------------------------------------------------
router.put('/:mech_id', (request, response) => {
  const ven_id = request.userId
  const { mech_id } = request.params
  const { mech_first_name, mech_last_name, mech_mobile } = request.body

  const statement = `update mechanic set 
  mech_first_name = '${mech_first_name}',
      mech_last_name = '${mech_last_name}',
      mech_mobile = '${mech_mobile}',
      ven_id = '${ven_id}'
   
  where mech_id = ${mech_id}`
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
  const statement = `delete from mechanic where mech_id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


module.exports = router