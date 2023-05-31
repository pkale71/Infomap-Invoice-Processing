let db = require('./dbQueryCity')
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let id;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.id)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        id = req.body.id
        // Check here country existed
        let checkUsed = [{isExist : 0}]
        if(checkUsed[0].isExist == 0)
        {
            let deleteCity = await db.deleteCity(id)
            if(deleteCity.affectedRows > 0)
            {
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : "success",
                    "status_name" : getCode.getStatus(200)
                });
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "City not deleted",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "City is already in use",
                "status_name" : getCode.getStatus(400)
            });
        }
    }
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "City not deleted",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})