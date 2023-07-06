const express = require('express');
const invoiceRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

invoiceRoute.use('/saveInvoice',require('../authenticate/validateToken'),require('./saveInvoice'))
invoiceRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = invoiceRoute