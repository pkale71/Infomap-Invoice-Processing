let db = require('./dbQueryGstMaster')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let description;
let modifyOn;
let modifyById;
let accessToken;
let uuid;
let taxCode;
let isActive;
let cgst;
let sgst;
let igst;
let ugst;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.description || !req.body.taxCode || !req.body.cgst || !req.body.sgst || !req.body.igst || !req.body.ugst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        description = req.body.description;
        taxCode = req.body.taxCode;
        uuid = req.body.uuid
        cgst = parseInt(req.body.cgst);
        if(!cgst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for CGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        sgst = parseInt(req.body.sgst);
        if(!sgst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for SGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        igst = parseInt(req.body.igst);
        if(!igst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for IGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        ugst = parseInt(req.body.ugst);
        if(!ugst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for UGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        accessToken = req.body.accessToken;
        let identifierName = 'gst_master'
        let id = 0
        let columnName = ['description','tax_code']
        let columnValue = 
        {
            "tax_code" : taxCode,
            "description" : description
        }
        isActive = 1
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, 0, uuid)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updateGstMaster = await db.updateGstMaster(uuid, description, taxCode, cgst, sgst, igst, ugst, modifyOn, modifyById, isActive)
            if(updateGstMaster.affectedRows > 0)
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
                    "message"     : "GST Data not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "GST Data Already Exist For Tax Code And Description",
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
            "message"     : "GST Data not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})