let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let db = require('./dbQueryPlant')
let errorCode = require('../../common/errorCode/errorCode')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
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
let shortCode;
let countryId;
let stateId;
let cityId;
let plantTypeId;
let clientUuid;
let clientId;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.code || !req.body.name || !req.body.address || !req.body.shortCode || !req.body.country || !parseInt(req.body.country?.id) || !req.body.state || !parseInt(req.body.state?.id) || !req.body.city || !parseInt(req.body.city?.id) || !req.body.client || !parseInt(req.body.client?.uuid) || !req.body.plantType || !parseInt(req.body.plantType?.id) )
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
        shortCode = req.body.shortCode
        countryId = req.body.country?.id
        stateId = req.body.state?.id
        cityId = req.body.city?.id
        clientUuid = req.body.client?.uuid
        plantTypeId = req.body.plantType?.id
        uuid = createUuid.v1()
        clientId = await db.getClientId(clientUuid)
        if(clientId.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Client Id Not Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        clientId = clientId[0].id
        accessToken = req.body.accessToken;
        let identifierName = 'plant'
        let id = 0
        let uniqueCheckShortCode = await uniqueFunction.unquieName(identifierName, ['short_code'],  {
        "short_code" : shortCode } , id, 0)
        if(uniqueCheckShortCode != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Short Code Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let uniqueCheckClientId = await uniqueFunction.unquieName(identifierName, ['client_id'],  { "client_id" : clientId } , id, 0)
        if(uniqueCheckClientId != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Client Id Already Exist",
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
            let savePlant = await db.savePlant(uuid, code, name, address, shortCode, clientId, plantTypeId, countryId, stateId, cityId, createdOn, createdById, isActive)
            if(savePlant.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(savePlant.insertId)
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
                    "message"     : "Plant not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Plant code Already Exist",
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
            "message"     : "Plant not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})