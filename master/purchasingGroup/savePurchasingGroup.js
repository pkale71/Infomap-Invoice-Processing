let db = require('./dbQueryPurchasingGroup')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let description;
let createdOn;
let createdById;
let accessToken;
let uuid;
let isActive;
let code;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.description || !req.body.code)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        description = req.body.description;
        uuid = createUuid.v1()
        code = req.body.code;
        // if(!code)
        // {
        //     res.status(400)
        //     return res.json({
        //         "status_code" : 400,
        //         "message"     : "Only number is accepted for code",
        //         "status_name" : getCode.getStatus(400)
        //     });
        // }
        // if(String(accountNumber).match(/\d/g).length)
        // {
            
        // }
        accessToken = req.body.accessToken;
        let identifierName = 'purchasing_group'
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
            let savePurchasingGroup = await db.savePurchasingGroup(uuid, code, description, createdOn, createdById, isActive)
            if(savePurchasingGroup.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(savePurchasingGroup.insertId)
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
                    "message"     : "Purchasing Group not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Purchasing Group code Already Exist",
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
            "message"     : "Purchasing Group not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})