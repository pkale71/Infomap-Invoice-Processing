const express = require('express');
const vendorRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

vendorRoute.use('/scanVendorExcel',require('../authenticate/validateToken'),require('./scanVendorExcel'))
vendorRoute.use('/saveScanVendors',require('../authenticate/validateToken'),require('./saveScanVendors'))
vendorRoute.use('/getVendors',require('../authenticate/validateToken'),require('./getVendors'))

vendorRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = vendorRoute