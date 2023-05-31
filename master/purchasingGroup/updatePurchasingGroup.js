let db = require('./dbQueryPurchasingGroup')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let description;
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
        if(!req.body.description || !req.body.code || !req.body.uuid)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        description = req.body.description;
        uuid = req.body.uuid
        code = parseInt(req.body.code);
        if(!code)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for code",
                "status_name" : getCode.getStatus(400)
            });
        }
        isActive = 1
        accessToken = req.body.accessToken;
        let identifierName = 'purchasing_group'
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
            let updatePurchasingGroup = await db.updatePurchasingGroup(uuid, code,  description, modifyOn, modifyById, isActive)
            if(updatePurchasingGroup.affectedRows > 0)
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
                    "message"     : "Purchasing Group not updated",
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
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Purchasing Group not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})