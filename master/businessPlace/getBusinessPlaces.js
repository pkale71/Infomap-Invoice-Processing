let db = require('./dbQueryBusinessPlace')
let businessPlaceObj = require('../../model/businessPlace')
let businessPlace = new businessPlaceObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getBusinessPlaces;
let businessPlaceList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getBusinessPlaces = await db.getBusinessPlaces()
        if(getBusinessPlaces.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"businessPlaces" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            businessPlaceList = []
            getBusinessPlaces.forEach((element) => 
            {
                businessPlace.setDataAll(element)
                businessPlaceList.push(businessPlace.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"businessPlaces" : businessPlaceList},
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