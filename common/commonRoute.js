const express = require('express');
const commonRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

commonRoute.use('/saveCountry',require('../authenticate/validateToken'),require('./country/saveCountry'))
commonRoute.use('/updateCountry',require('../authenticate/validateToken'),require('./country/updateCountry'))
commonRoute.use('/deleteCountry',require('../authenticate/validateToken'),require('./country/deleteCountry'))
commonRoute.use('/getCountries',require('../authenticate/validateToken'),require('./country/getCountries'))
commonRoute.use('/saveState',require('../authenticate/validateToken'),require('./state/saveState'))
commonRoute.use('/updateState',require('../authenticate/validateToken'),require('./state/updateState'))
commonRoute.use('/deleteState',require('../authenticate/validateToken'),require('./state/deleteState'))
commonRoute.use('/getStates',require('../authenticate/validateToken'),require('./state/getStates'))
commonRoute.use('/saveCity',require('../authenticate/validateToken'),require('./city/saveCity'))
commonRoute.use('/updateCity',require('../authenticate/validateToken'),require('./city/updateCity'))
commonRoute.use('/deleteCity',require('../authenticate/validateToken'),require('./city/deleteCity'))
commonRoute.use('/getCities',require('../authenticate/validateToken'),require('./city/getCities'))

commonRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = commonRoute