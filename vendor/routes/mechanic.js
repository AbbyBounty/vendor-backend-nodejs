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
    const statement = `select *  from mechanic where ven_id=${ven_id}`

    db.query(statement, (error, mechanics) => {

      if (mechanics.length > 0) {
        const mechanic = mechanics;
        response.send(utils.createResult(error, mechanic))
      }
      else {

        response.send(utils.createError(`there is no mechanic with this id`))
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