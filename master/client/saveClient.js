let db = require('./dbQueryClient')
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
let rate;
let taxSection;
let gstMasterUuid;
let glAccountUuid;
let gstMasterId;
let glAccountId;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.description || !req.body.taxSection || !req.body.gstMaster || !req.body.gstMaster?.uuid || !parseFloat(req.body.rate) || !req.body.glAccount || !req.body.glAccount?.uuid)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        description = req.body.description;
        taxSection = req.body.taxSection
        gstMasterUuid = req.body.gstMaster?.uuid
        glAccountUuid = req.body.glAccount?.uuid
        let ids = await db.getIdsOfAccountAndGst(gstMasterUuid, glAccountUuid)
        if(ids.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "GST Data not Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        if(!ids[0].glAccountId)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Gl Account number not Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        glAccountId = ids[0].glAccountId
        gstMasterId = ids[0].gstMasterId
        uuid = createUuid.v1()
        rate = parseFloat(req.body.rate);
        if(isNaN(rate))
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for Rate",
                "status_name" : getCode.getStatus(400)
            });
        }
        accessToken = req.body.accessToken;
        let identifierName = 'tds_master'
        let id = 0
        let columnName = ['gl_account_id','tax_section',"gst_master_id"]
        let columnValue = 
        {
            "tax_section" : taxSection,
            "gl_account_id" : glAccountId,
            "gst_master_id": gstMasterId
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            isActive = 1
            let saveTdsMaster = await db.saveTdsMaster(uuid, description, taxSection, rate, glAccountId, gstMasterId, createdOn, createdById, isActive)
            if(saveTdsMaster.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveTdsMaster.insertId)
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
                "message"     : "Client Already Exist For Tax Section, GL Account Number And GST Data",
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