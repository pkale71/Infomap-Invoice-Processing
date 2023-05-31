let db = require('./dbQueryGlAccount')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let ledgerDescription;
let createdOn;
let createdById;
let accessToken;
let uuid;
let isActive;
let accountNumber;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.ledgerDescription || !req.body.accountNumber)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        ledgerDescription = req.body.ledgerDescription;
        uuid = createUuid.v1()
        accountNumber = parseInt(req.body.accountNumber);
        if(!accountNumber)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for account number",
                "status_name" : getCode.getStatus(400)
            });
        }
        // if(String(accountNumber).match(/\d/g).length)
        // {
            
        // }
        accessToken = req.body.accessToken;
        let identifierName = 'gl_account'
        let id = 0
        let columnName = ['account_number']
        let columnValue = 
        {
            "account_number" : accountNumber
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            isActive = 1
            let saveGlAccount = await db.saveGlAccount(uuid, accountNumber, ledgerDescription, createdOn, createdById, isActive)
            if(saveGlAccount.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveGlAccount.insertId)
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
                    "message"     : "GL Account not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "GL Account number Already Exist",
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
            "message"     : "GL Account not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})