const express = require('express');
const poRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

poRoute.use('/scanPOExcel',require('../authenticate/validateToken'),require('./pOMaster/scanPoExcel'))
poRoute.use('/getPOs',require('../authenticate/validateToken'),require('./pOMaster/getPOs'))
poRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = poRoute