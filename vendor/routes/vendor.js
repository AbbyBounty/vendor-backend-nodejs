const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const config = require('../../config')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const mailer=require('../../mailer')

const router = express.Router()


// ----------------------------------------------------
// GET
// ----------------------------------------------------

/**
 * @swagger
 *
 * /admin/profile:
 *   get:
 *     description: For getting administrator profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
// router.get('/profile', (request, response) => {
//   const statement = `select firstName, lastName, email, phone from admin where id = ${request.userId}`
//   db.query(statement, (error, admins) => {
//     if (error) {
//       response.send({status: 'error', error: error})
//     } else {
//       if (admins.length == 0) {
//         response.send({status: 'error', error: 'admin does not exist'})
//       } else {
//         const admin = admins[0]
//         response.send(utils.createResult(error, admin))
//       }
//     }
//   })
// })

router.get('/profile',(request,response) =>{

  //const {id}= request.params
  //console.log(`id=${id}`)
  const token=request.headers['token']
  console.log(request.token)
  try{
  const data=jwt.verify(token,'1234567890abcdefghijklmnopqrstuvwxyz')
  const id=data['id']
  console.log(id)
  const statement=`select ven_id, ven_first_name,ven_mobile,ven_proof,ven_shop_name, ven_last_name from vendor where ven_id=${id}`
  // console.log(ven_id)
  // console.log("hello")
  db.query(statement,(error,users)=>{
  
  if(users.length>0 )
  {      const user=users[0];
 
       response.send(utils.createResult(error,user))
  }
  else{
  
      response.send(utils.createResult(`there is no user with this id`))
  }
  
  })
  }  catch( ex){
        response.status=401
       response.send("you are not authorize to do it")
  
  }
  
  })




router.get('/details/:id',(request,response) =>{

  const {id}= request.params


  try{
 
 
  const statement=`select ven_id, ven_first_name,ven_mobile,ven_shop_name, ven_last_name from vendor where ven_id=${id}`
  // console.log(ven_id)
  // console.log("hello")
  db.query(statement,(error,users)=>{
  
  if(users.length>0 )
  {      const user=users[0];
 
       response.send(utils.createResult(error,user))
  }
  else{
  
      response.send(utils.createResult(`there is no user with this id`))
  }
  
  })
  }  catch( ex){
        response.status=401
       response.send("you are not authorize to do it")
  
  }
  
  })
// ----------------------------------------------------



// ----------------------------------------------------
// POST
// ----------------------------------------------------

/**
 * @swagger
 *
 * /admin/signup:
 *   post:
 *     description: For signing up an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: first name of admin user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: last name of admin user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: email of admin user used for authentication
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: admin's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signup', (request, response) => {
  const { ven_address, ven_email,  ven_first_name,ven_last_name,ven_mobile,ven_password,ven_proof,ven_shop_name } = request.body

  const encryptedPassword = crypto.SHA256(ven_password)
  const statement = `insert into vendor (ven_address, ven_email, ven_first_name,ven_last_name,ven_mobile,ven_password,ven_proof,ven_shop_name) values (
    '${ven_address}', '${ven_email}', '${ven_first_name}','${ven_last_name}','${ven_mobile}','${encryptedPassword}','${ven_proof}','${ven_shop_name}'
  )`
  db.query(statement, (error, dbResult) => {
    const result = {}
    if (error) {
      // error occurred
    //   console.log(`error: ${error}`)
    //   result['status'] = 'error'
    //   result['error'] = error
      response.send(util.sendError(error))

    } else {

      const subject = `'welcome to Bikeclinic'`
      const body = `
      <h1>Welcome to Bikeclinc ${ven_first_name}</h1>
      <h2>this is a welcome mesage</h2>
      `
      mailer.sendEmail(ven_email, subject, body, (emailError, info) => {

        // // no error: everything looks Okay
        // console.log(`result: `, result)
        // result['status'] = 'success'
        // result['data'] = dbResult
        response.send(utils.createSuccess(dbResult))
      })
    }

  })
})


/**
 * @swagger
 *
 * /admin/signin:
 *   post:
 *     description: For signing in an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of admin user used for authentication
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: admin's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signin', (request, response) => {
  const {ven_email, ven_password} = request.body
  const statement = `select ven_id, ven_first_name,ven_mobile,ven_proof,ven_shop_name, ven_last_name from vendor where ven_email = '${ven_email}' and ven_password = '${crypto.SHA256(ven_password)}'`
  db.query(statement, (error, vendors) => {
    if (error) {
      response.send({status: 'error', error: error})
    } else {
      if (vendors.length == 0) {
        response.send({status: 'error', error: 'admin does not exist'})
      } else {
        const vendor = vendors[0]
        const token = jwt.sign({id: vendor['ven_id']}, config.secret)
        
        response.send(utils.createResult(error, {
          ven_first_name: vendor['ven_first_name'],
          ven_last_name: vendor['ven_last_name'],
          ven_mobile:vendor['ven_mobile'],
          ven_shop_name:vendor['ven_shop_name'],
          ven_proof:vendor['ven_proof'],

          token: token
        }))
      }
    }
  })
  
})

// ----------------------------------------------------



// ----------------------------------------------------
// PUT
// ----------------------------------------------------

router.put('', (request, response) => {
  response.send()
})

// ----------------------------------------------------



// ----------------------------------------------------
// DELETE
// ----------------------------------------------------

router.delete('', (request, response) => {
  response.send()
})

// ----------------------------------------------------

module.exports = router