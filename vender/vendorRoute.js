const express = require('express');
const vendorRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

vendorRoute.use('/scanVendorExcel',require('../authenticate/validateToken'),require('./scanVendorExcel'))
vendorRoute.use('/saveScanVendors',require('../authenticate/validateToken'),require('./saveScanVendors'))
vendorRoute.use('/getVendors',require('../authenticate/validateToken'),require('./getVendors'))
vendorRoute.use('/updateVendor',require('../authenticate/validateToken'),require('./updateVendor'))
vendorRoute.use('/saveVendor',require('../authenticate/validateToken'),require('./saveVendor'))
vendorRoute.use('/deleteVendor',require('../authenticate/validateToken'),require('./deleteVendor'))
vendorRoute.use('/getMappedVendors',require('../authenticate/validateToken'),require('./getMappedVendors'))
vendorRoute.use('/getVendor',require('../authenticate/validateToken'),require('./getVendor'))

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