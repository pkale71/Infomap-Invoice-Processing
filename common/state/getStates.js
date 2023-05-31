let db = require('./dbQueryState')
let stateObj = require('../../model/state')
let state = new stateObj()
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let getStates;
let statesList = []
let countryId;
module.exports = require('express').Router().get('/:countryId',async(req,res) => 
{
    try
    {
        countryId = req.params.countryId
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
        getStates = await db.getStates(countryId)
        if(getStates.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"states" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            statesList = []
            getStates.forEach((element) => 
            {
                state.setDataAll(element)
                statesList.push(state.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"states" : statesList},
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