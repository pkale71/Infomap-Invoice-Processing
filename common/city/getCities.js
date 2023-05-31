let db = require('./dbQueryCity')
let cityObj = require('../../model/city')
let city = new cityObj()
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let getCities;
let citiesList = []
let countryId;
let stateId;
module.exports = require('express').Router().get('/:countryId/:stateId',async(req,res) => 
{
    try
    {
        countryId = req.params.countryId
        stateId = req.params.stateId
        let countryIsExist = await db.countryIsExist(countryId)
        if(countryIsExist.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Country Not Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let stateIsExist = await db.stateIsExist(stateId, countryId)
        if(stateIsExist.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "State Not Exist For Country",
                "status_name" : getCode.getStatus(400)
            });
        }
        getCities = await db.getCities(countryId, stateId)
        if(getCities.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"cities" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            citiesList = []
            getCities.forEach((element) => 
            {
                city.setDataAll(element)
                citiesList.push(city.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"cities" : citiesList},
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