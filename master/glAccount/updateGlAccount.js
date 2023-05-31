let db = require('./dbQueryGlAccount')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let ledgerDescription;
let modifyOn;
let modifyById;
let accessToken;
let uuid;
let accountNumber;
let isActive;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.ledgerDescription || !req.body.accountNumber || !req.body.uuid)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        ledgerDescription = req.body.ledgerDescription;
        uuid = req.body.uuid
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
        isActive = 1
        accessToken = req.body.accessToken;
        let identifierName = 'gl_account'
        let columnName = ['account_number']
        let columnValue = 
        {
            "account_number" : accountNumber
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, 0, uuid)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updateGlAccount = await db.updateGlAccount(uuid, accountNumber,  ledgerDescription,modifyOn, modifyById, isActive)
            if(updateGlAccount.affectedRows > 0)
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
                    "message"     : "GL Account not updated",
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
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "GL Account not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})