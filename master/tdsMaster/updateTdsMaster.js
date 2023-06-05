let db = require('./dbQueryTdsMaster')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let description;
let modifyOn;
let modifyById;
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
        if(!req.body.description || !req.body.uuid || !req.body.taxSection || !req.body.gstMaster || !req.body.gstMaster?.uuid || !parseFloat(req.body.rate) || !req.body.glAccount || !req.body.glAccount?.uuid)
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
        isActive = 1
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, 0, uuid)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updateTdsMaster = await db.updateTdsMaster(uuid, description, taxSection, rate, glAccountId, gstMasterId, modifyOn, modifyById, isActive)
            if(updateTdsMaster.affectedRows > 0)
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
                    "message"     : "TDS Data not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "TDS Master Already Exist For GL Code, Tax Code And Tax Section",
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
            "message"     : "TDS Data not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})