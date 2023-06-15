let db = require('./dbQueryPlant')
let errorCode = require('../../common/errorCode/errorCode')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let getCode = new errorCode()
let uuid;
let isActive;
let modifyOn;
let modifyById;
let accessToken;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.uuid)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        uuid = req.body.uuid
        accessToken = req.body.accessToken
        isActive = 0
        // Check here country existed
        let checkUsed = [{isExist : 0}]
        if(checkUsed[0].isExist == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let deletePlant = await db.deletePlant(uuid, isActive, modifyOn, modifyById)
            if(deletePlant.affectedRows > 0)
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
                    "message"     : "Plant not deleted",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Plant is already in use",
                "status_name" : getCode.getStatus(400)
            });
        }
    }
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Plant not deleted",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})