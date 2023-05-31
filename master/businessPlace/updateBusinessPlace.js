let db = require('./dbQueryBusinessPlace')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let name;
let modifyOn;
let modifyById;
let accessToken;
let uuid;
let code;
let isActive;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.name || !req.body.code || !req.body.uuid)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        name = req.body.name;
        uuid = req.body.uuid
        code = req.body.code
        isActive = 1
        accessToken = req.body.accessToken;
        let identifierName = 'business_place'
        let columnName = ['code']
        let columnValue = 
        {
            "code" : code
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, 0, uuid)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updateBusinessPlace = await db.updateBusinessPlace(uuid, name, code, modifyOn, modifyById, isActive)
            if(updateBusinessPlace.affectedRows > 0)
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
                    "message"     : "Business place not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Business Place Code Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
    }
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Business place not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})