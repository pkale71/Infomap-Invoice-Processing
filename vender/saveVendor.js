let db = require('./dbQueryVendors')
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
let name;
let countryId;
let stateId;
let cityId;
let gstNumber;
let panNumber;
let msmeNumber;
let isActive
let clientId
let clientUuid
let email1
let email2
let email3
let accountGroup
let addressLine1
let addressLine2
let addressLine3
let addressLine4
let postalCode
let corporateGroup
let contact1
let contact2
let telephoneExchange
let faxNumber
let industryType
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.code || !req.body.name || !req.body.addressLine1 || !req.body.email1 || !req.body.contact1 || !req.body.accountGroup || !req.body.corporateGroup || !req.body.country || !parseInt(req.body.country?.id) || !req.body.state || !parseInt(req.body.state?.id) || !req.body.city || !parseInt(req.body.city?.id)|| !req.body.gstNumber || !req.body.panNumber || !req.body.industryType ||!req.body.msmeNumber || !req.body.client || !req.body.client?.uuid ||!req.body.postalCode)
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
        addressLine1 = req.body.addressLine1
        addressLine2 = req.body.addressLine2
        addressLine3 = req.body.addressLine3
        addressLine4 = req.body.addressLine4
        email1 = req.body.email1
        email2 = req.body.email2
        email3 = req.body.email3
        countryId = req.body.country?.id
        stateId = req.body.state?.id
        cityId = req.body.city?.id
        clientUuid = req.body.client?.uuid
        gstNumber = req.body.gstNumber
        panNumber = req.body.panNumber
        faxNumber = req.body.faxNumber
        msmeNumber = req.body.msmeNumber
        uuid = createUuid.v1()
        postalCode = req.body.postalCode
        corporateGroup = req.body.corporateGroup
        contact1 = req.body.contact1
        contact2 = req.body.contact2
        telephoneExchange = req.body.telephoneExchange
        industryType = req.body.industryType
        accountGroup = req.body.accountGroup
        accessToken = req.body.accessToken;
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
        let identifierName = 'vendor'
        let id = 0
        let columnName = ['code']
        let columnValue = 
        {
            "code" : code,
        }
        isActive = 1
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            let saveVendor = await db.saveVendor(uuid, code, name, addressLine1, addressLine2, addressLine3, addressLine4, email1, email2, email3, gstNumber, panNumber, faxNumber, msmeNumber, countryId, stateId, cityId, clientId, createdOn, postalCode, corporateGroup, contact1, contact2, telephoneExchange, industryType, accountGroup, createdById, isActive)
            if(saveVendor.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveVendor.insertId)
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
                    "message"     : "Vendor not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Vendor code Already Exist",
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
            "message"     : "Vendor not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})