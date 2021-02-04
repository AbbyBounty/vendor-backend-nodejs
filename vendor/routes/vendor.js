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
 * /vendor/profile:
 *   get:
 *     description: For getting vendor profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/profile',(request,response) =>{

  //const {id}= request.params
  //console.log(`id=${id}`)
  const token=request.headers['token']
  console.log(request.token)
  try{
  const data=jwt.verify(token,'1234567890abcdefghijklmnopqrstuvwxyz')
  const id=data['id']
  console.log(id)
  const statement=`select ven_id,ven_address, ven_first_name,ven_mobile,ven_proof,ven_shop_name, ven_last_name from vendor where ven_id=${id}`
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


/**
 * @swagger
 *
 * /vendor/details:
 *   get:
 *     description: For getting vendor details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */

// router.get('/details/:id',(request,response) =>{

//   const {id}= request.params


//   try{
 
 
//   const statement=`select ven_id, ven_first_name,ven_mobile,ven_shop_name, ven_last_name from vendor where ven_id=${id}`
//   // console.log(ven_id)
//   // console.log("hello")
//   db.query(statement,(error,users)=>{
  
//   if(users.length>0 )
//   {      const user=users[0];
 
//        response.send(utils.createResult(error,user))
//   }
//   else{
  
//       response.send(utils.createResult(`there is no user with this id`))
//   }
  
//   })
//   }  catch( ex){
//         response.status=401
//        response.send("you are not authorize to do it")
  
//   }
  
//   })
// ----------------------------------------------------



// ----------------------------------------------------
// POST
// ----------------------------------------------------

/**
 * @swagger
 *
 * /vendor/signup:
 *   post:
 *     description: For signing up an vendor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: ven_address
 *         description: vendor address
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_email
 *         description: email of vendor 
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_first_name
 *         description:  first name of vendor
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_last_name
 *         description: last name of vendor
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_mobile
 *         description: mobile number of vendor
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_password
 *         description: password of vendor
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_proof
 *         description: proof of vendor
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_shop_name
 *         description: shopname of vendor
 *         in: formData
 *         required: true
 *         type: string 
 * 
 *     responses:
 *       200:
 *         description: successful message
 */




 ////////////////////////////////////////////////////////////////
///////////////////// Register Vendor //////////////////////////////
////////////////////////////////////////////////////////////////

router.post('/signup', (request, response) => {
  const { ven_address, ven_email,  ven_first_name, ven_last_name, ven_mobile, ven_password, ven_proof, ven_shop_name } = request.body

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
 * /vendor/signin:
 *   post:
 *     description: For signing in an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: ven_id
 *         description: email of admin user used for authentication
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_first_name
 *         description: admin's password.
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_mobile
 *         description: vendor mobile number.
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_proof
 *         description: vendor proof.
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_shop_name
 *         description: vendor shop name.
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: ven_last_name
 *         description: vendor last name.
 *         in: formData
 *         required: true
 *         type: string
 * 
 *      
 *     responses:
 *       200:
 *         description: successful message
 */


////////////////////////////////////////////////////////////////
/////////////////////  Vendor Login//////////////////////////////
////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////
///////////////////// Update Profile//////////////////////////////
////////////////////////////////////////////////////////////////


router.put('/profile/',(request,response) => {
  //const {id}= request.params
  const token=request.headers['token']
  
        
  const data=jwt.verify(token,'1234567890abcdefghijklmnopqrstuvwxyz')
  const userId=data['id']
  const { ven_address, ven_email,  ven_first_name,ven_last_name,ven_mobile,ven_proof,ven_shop_name } = request.body
 // const{ u_address, u_email, u_first_name, u_last_name, u_mobile  }=request.body
  
  const statement= `update vendor set 
  ven_address='${ven_address}',
  ven_email='${ven_email}',
  ven_first_name='${ven_first_name}',
  ven_last_name='${ven_last_name}',
  ven_mobile='${ven_mobile}',
  ven_proof='${ven_proof}',
  ven_shop_name='${ven_shop_name}'
    where ven_id=${userId}  `
                      
  db.query(statement,(error,result)=>{
  
  response.send(utils.createResult(error,result))
  
  
  })
  
})
module.exports = router