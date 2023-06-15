let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let db = require('./dbQueryPlant')
let errorCode = require('../../common/errorCode/errorCode')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let getCode = new errorCode()
let code;
let modifyOn;
let modifyById;
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
let clientId;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.uuid || !req.body.code || !req.body.name || !req.body.address || !req.body.shortCode || !req.body.country || !parseInt(req.body.country?.id) || !req.body.state || !parseInt(req.body.state?.id) || !req.body.city || !parseInt(req.body.city?.id) || !req.body.client || !parseInt(req.body.client?.id) || !req.body.plantType || !parseInt(req.body.plantType?.id) )
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
        clientId = req.body.client?.id
        plantTypeId = req.body.plantType?.id
        uuid = req.body.uuid
        accessToken = req.body.accessToken;
        let identifierName = 'plant'
        let id = 0
        let uniqueCheckShortCode = await uniqueFunction.unquieName(identifierName, ['short_code'],  {
        "short_code" : shortCode } , id, uuid)
        if(uniqueCheckShortCode != 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Short Code Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        let uniqueCheckClientId = await uniqueFunction.unquieName(identifierName, ['client_id'],  { "client_id" : clientId } , id, uuid)
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
        isActive = 1
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, 0, uuid)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updatePlant = await db.updatePlant(uuid, code, name, address, shortCode, clientId, plantTypeId, countryId, stateId, cityId, modifyOn, modifyById, isActive)
            if(updatePlant.affectedRows > 0)
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
                    "message"     : "Plant not updated",
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
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Plant not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})