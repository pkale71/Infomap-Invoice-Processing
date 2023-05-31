let db = require('./dbQueryBusinessPlace')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let name;
let createdOn;
let createdById;
let accessToken;
let code;
let uuid;
let isActive;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.name || !req.body.code)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        name = req.body.name;
        uuid = createUuid.v1()
        code = req.body.code;
        accessToken = req.body.accessToken;
        let identifierName = 'business_place'
        let id = 0
        let columnName = ['code']
        let columnValue = 
        {
            "code" : code
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            isActive = 1
            let saveBusinessPlace = await db.saveBusinessPlace(uuid, name, code, createdOn, createdById, isActive)
            if(saveBusinessPlace.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveBusinessPlace.insertId)
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : "success",
                    "data" : { "uuid" : returnUuid[0].uuid},
                    "status_name" : getCode.getStatus(200)
                });
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "Business place not saved",
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
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Business place not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})