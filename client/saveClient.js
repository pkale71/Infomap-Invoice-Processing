let db = require('./dbQueryClient')
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let code;
let createdOn;
let createdById;
let accessToken;
let uuid;
let isActive;
let name;
let address;
let landmark;
let countryId;
let stateId;
let cityId;
let gstNumber;
let panNumber;
let cinNumber;
let msmeNumber;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.code || !req.body.name || !req.body.address || !req.body.landmark || !req.body.country || !parseInt(req.body.country?.id) || !req.body.state || !parseInt(req.body.state?.id) || !req.body.city || !parseInt(req.body.city?.id)|| !req.body.gstNumber || !req.body.panNumber || !req.body.cinNumber ||!req.body.msmeNumber)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        code = req.body.code;
        name = req.body.name
        address = req.body.address
        landmark = req.body.landmark
        countryId = req.body.country?.id
        stateId = req.body.state?.id
        cityId = req.body.city?.id
        gstNumber = req.body.gstNumber
        panNumber = req.body.panNumber
        cinNumber = req.body.cinNumber
        msmeNumber = req.body.msmeNumber
        uuid = createUuid.v1()
        accessToken = req.body.accessToken;
        let identifierName = 'client'
        let id = 0
        let uniqueCheckGstNumber = await uniqueFunction.unquieName(identifierName, ['gst_number'],  {
        "gst_number" : gstNumber } , id, 0)
        if(uniqueCheckGstNumber != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "GST Number Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let uniqueCheckPanNumber = await uniqueFunction.unquieName(identifierName, ['pan_number'],  { "pan_number" : panNumber } , id, 0)
        if(uniqueCheckPanNumber != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "PAN Number Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let uniqueCheckCinNumber = await uniqueFunction.unquieName(identifierName, ['cin_number'],  { "cin_number" : cinNumber } , id, 0)
        if(uniqueCheckCinNumber != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "CIN Number Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let uniqueCheckMsmeNumber = await uniqueFunction.unquieName(identifierName, ['msme_number'],  { "msme_number" : msmeNumber } , id, 0)
        if(uniqueCheckMsmeNumber != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "MSME Number Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let columnName = ['code']
        let columnValue = 
        {
            "code" : code,
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            isActive = 1
            let saveClient = await db.saveClient(uuid, code, name, address, landmark, gstNumber, panNumber, cinNumber, msmeNumber, countryId, stateId, cityId, createdOn, createdById, isActive)
            if(saveClient.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveClient.insertId)
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
                    "message"     : "Client not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Client code Already Exist",
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
            "message"     : "Client not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})