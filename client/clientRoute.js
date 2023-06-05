const express = require('express');
const clientRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

clientRoute.use('/saveClient',require('../authenticate/validateToken'),require('./saveClient'))
clientRoute.use('/updateClient',require('../authenticate/validateToken'),require('./updateClient'))
clientRoute.use('/deleteClient',require('../authenticate/validateToken'),require('./deleteClient'))
clientRoute.use('/getClients',require('../authenticate/validateToken'),require('./getClients'))

clientRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = clientRoute