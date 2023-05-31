const express = require('express');
const authRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
authRoute.use('/login', require('./login'))
authRoute.use('/logout', require('./validateToken'), require('./logout'))
authRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = authRoute