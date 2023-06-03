let db = require('./dbQueryGstMaster')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let description;
let createdOn;
let createdById;
let accessToken;
let taxCode;
let uuid;
let isActive;
let cgst;
let sgst;
let igst;
let ugst;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.description || !req.body.taxCode || !req.body.sgst || (!req.body.cgst && !req.body.igst) || !req.body.ugst)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        description = req.body.description;
        taxCode = req.body.taxCode
        uuid = createUuid.v1()
        cgst = parseFloat(req.body.cgst);
        if(isNaN(cgst))
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for CGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        sgst = parseFloat(req.body.sgst);
        if(isNaN(sgst))
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for SGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        igst = parseFloat(req.body.igst);
        if(isNaN(igst))
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Only number is accepted for IGST",
                "status_name" : getCode.getStatus(400)
            });
        }
        ugst = parseFloat(req.body.ugst);
        if(isNaN(ugst))
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
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            isActive = 1
            let saveGstMaster = await db.saveGstMaster(uuid, description, taxCode, cgst, sgst, igst, ugst, createdOn, createdById, isActive)
            if(saveGstMaster.affectedRows > 0)
            {
                let returnUuid = await db.getReturnUuid(saveGstMaster.insertId)
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
                    "message"     : "GST Data not saved",
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
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "GST Data not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})