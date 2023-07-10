let db = require('./dbQueryInvoice')
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let uuid;
let accessToken;
let barCode;
let vendorUuid;
let invoiceNumber;
let invoiceDate;
let baseAmount;
let discount;
let gstAmount;
let netAmount;
let invoiceDetails = [];
let poMasterId;
let userId;
let detail = 0
let poDetailIds = ""
let totalItems = 0
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        invoiceDetails = []
        poDetailIds = ""
        detail = 0
        totalItems = 0
        poMasterId = 0
        if( !req.body.vendor || !req.body.vendor?.uuid || !req.body.barCode || !req.body.invoiceNumber || !req.body.invoiceDate || !req.body.baseAmount    || !req.body.discount || !req.body.gstAmount || !req.body.netAmount || req.body.invoiceDetails.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        uuid = createUuid.v1()
        vendorUuid = req.body.vendor?.uuid
        barCode = req.body.barCode
        invoiceNumber = req.body.invoiceNumber
        invoiceDate = req.body.invoiceDate
        baseAmount = req.body.baseAmount
        discount = req.body.discount
        gstAmount = req.body.gstAmount
        netAmount = req.body.netAmount
        invoiceDetails = req.body.invoiceDetails
        accessToken = req.body.accessToken;
        authData = await commondb.selectToken(accessToken)
        userId = authData[0].userId
        isActive = 1
        let invoiceId = 0
        totalItems = 0
        saveInvoiceMasters(invoiceDetails, 0, 0, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
    }
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Invoice Master not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})

function saveInvoiceDetails(invoiceDetails, start, end, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
{
    try
    {
        if(start < end)
        {
            db.getPOIds(invoiceDetails[start]).then(ids => {
                if(ids)
                {
                    console.log("invoiceDetails ",invoiceDetails.length)
                    if(ids.length == 0)
                    {
                        start++
                        saveInvoiceDetails(invoiceDetails, start, end, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
                        return
                    }
                    if(poDetailIds.length == 0)
                    {
                        poDetailIds = ids[0].poDetailId
                    }
                    else
                    {
                        poDetailIds = poDetailIds + ',' + ids[0].poDetailId
                    }
                    poMasterId = ids[0].poMasterId
                    let identifierName = 'invoice_detail'
                    let id = 0
                    let columnName = ['po_master_id', 'po_detail_id']
                    let columnValue = 
                    {
                        "po_master_id" : ids[0].poMasterId,
                        "po_detail_id" : ids[0].poDetailId
                    }
                    uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(uniqueCheck => 
                    {
                        if(uniqueCheck == 0)
                        {
                            invoiceDetails[start]['uuid'] = createUuid.v1()
                            invoiceDetails[start]['invoiceId'] = invoiceId
                            invoiceDetails[start]['poMasterId'] = ids[0].poMasterId
                            invoiceDetails[start]['poDetailId'] = ids[0].poDetailId
                            db.saveInvoiceDetail(invoiceDetails[start]).then(saveInvoiceDetail => 
                            {
                                if(saveInvoiceDetail)
                                {    
                                    if(saveInvoiceDetail.affectedRows > 0)
                                    {
                                        detail = 1
                                        totalItems++
                                    }            
                                    start++
                                    saveInvoiceDetails(invoiceDetails, start, end, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
                                }
                            })
                        }
                        else
                        {
                            start++
                            saveInvoiceDetails(invoiceDetails, start, end, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
                        }
                    })
                }
            })
        }
        else
        {
            if(detail == 0)
            {
                db.deleteInvoiceMaster(invoiceId).then(deleteMaster => {
                    if(deleteMaster)
                    {
                        res.status(400)
                        return res.json({
                            "status_code" : 400,
                            "message"     : "Invoice Details Already Exist",
                            "status_name" : getCode.getStatus(400)
                        });
                    }
                })
            }
            else
            {
                db.poDetailsUpdate(poDetailIds, new Date(), userId).then(poDetail => {
                    if(poDetail)
                    {
                        if(poDetail.affectedRows > 0)
                        {
                            db.poStatusUpdate(poMasterId, new Date(), userId).then(poMaster => {
                                if(poMaster)
                                {
                                    db.getReturnUuid(invoiceId).then(invoiceUuid => {
                                        if(invoiceUuid)
                                        {
                                            res.status(200)
                                            return res.json({
                                                "status_code" : 200,
                                                "message"     : "success",
                                                "data"        : {
                                                                    "uuid" : invoiceUuid[0].uuid,
                                                                    "totalItems" : totalItems
                                                                },
                                                "status_name" : getCode.getStatus(200)
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    }
    catch(e)
    {
        console.log(e)
    }
}

function saveInvoiceMasters(invoiceDetails, start, end,  uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
{ 
    totalItems = 0
    let identifierName = 'invoice_master'
    let id = 0
    uniqueFunction.unquieName(identifierName, ['invoice_number'], {"invoice_number" : invoiceNumber}, id, 0).then(uniqueInvoice => {
        if(uniqueInvoice == 0 || uniqueInvoice == 1 || (uniqueInvoice == -1))
        {
            if(uniqueInvoice == 0)
            {

                let columnName = ['barcode']
                let columnValue = 
                {
                    "barcode" : barCode,
                }
                uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(uniqueCheck => 
                {
                    if(uniqueCheck == 0 || uniqueCheck == 1 || (uniqueCheck == -1))
                    {
                        if(uniqueCheck == 0)
                        {
                            let createdOn  = new Date()
                            let createdById = userId
                            db.saveInvoiceMaster(uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, createdOn, createdById).then(saveInvoiceMaster => {
                            if(saveInvoiceMaster)
                            {
                                if(saveInvoiceMaster.affectedRows > 0)
                                {
                                    invoiceId = saveInvoiceMaster.insertId
                                    saveInvoiceDetails(invoiceDetails, 0, invoiceDetails.length, uuid, vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
                                }
                                else
                                {
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message"     : "Invoice Master not saved",
                                        "status_name" : getCode.getStatus(500)
                                    });
                                }
                            }
                            else
                                {
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message"     : "Invoice Master not saved",
                                        "status_name" : getCode.getStatus(500)
                                    });
                                }
                            })
                        }
                        else if(uniqueCheck == 1)
                        {
                            res.status(400)
                            return res.json({
                                "status_code" : 400,
                                "message"     : "Bar code Already Exist",
                                "status_name" : getCode.getStatus(400)
                            });
                        }
                        else
                        {
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message"     : "Something went wrong",
                                "status_name" : getCode.getStatus(500)
                            });
                        }
                    }
                })
            }
            else if(uniqueInvoice == 1)
            {
                res.status(400)
                return res.json({
                    "status_code" : 400,
                    "message"     : "Invoice Number Already Exist",
                    "status_name" : getCode.getStatus(400)
                });
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "Something went wrong",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
    })
}