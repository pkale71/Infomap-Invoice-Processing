let db = require('./dbQueryCountry')
let countryObj = require('../../model/country')
let country = new countryObj()
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let getCountries;
let countriesList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getCountries = await db.getCountries()
        if(getCountries.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"countries" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            countriesList = []
            getCountries.forEach((element) => 
            {
                country.setDataAll(element)
                countriesList.push(country.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"countries" : countriesList},
                "status_name" : getCode.getStatus(200)
            });
        }
    }
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "No Data Found",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})