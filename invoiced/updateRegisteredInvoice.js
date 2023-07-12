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
        poMasterId = ''
        if(!req.body.uuid || !req.body.vendor || !req.body.vendor?.uuid || !req.body.barCode || !req.body.invoiceNumber || !req.body.invoiceDate || !req.body.baseAmount    || (parseFloat(req.body.discount) < 0) || !req.body.gstAmount || !req.body.netAmount || req.body.invoiceDetails.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        uuid = req.body.uuid
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
        let status = await db.getIdAndStatus(uuid);
        if(status.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message" : "Provide Valid Invoice Id",
                "status_name" : getCode.getStatus(400)
            })
        }
        if(status[0].name == 'Registered')
        {
            let poDetailStatusIdUpdate = await db.poDetailStatusIdUpdate(status[0].id, new Date(), userId)
            if(poDetailStatusIdUpdate.affectedRows > 0)
            {
                let poMasterStatusIdUpdate = await db.poMasterStatusIdUpdate(status[0].po_master_id)
                if(poMasterStatusIdUpdate.affectedRows > 0)
                {
                    let poStatusList = await db.poStatusList(poMasterId)
                    invoiceId = status[0].id
                    updateInvoiceDateAll(invoiceDetails, 0, poStatusList.length, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId, poStatusList)
                }
                else
                {
                    res.status(400)
                    return res.json({
                        "status_code" : 400,
                        "message" : `Invoice Master not Updated`,
                        "status_name" : getCode.getStatus(400)
                    })
                }
            }
            else
            {
                res.status(400)
                    return res.json({
                        "status_code" : 400,
                        "message" : `Invoice Master not Updated`,
                        "status_name" : getCode.getStatus(400)
                    })
            }
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message" : `Invoice Status Is ${status[0].name}, You Cannot Update`,
                "status_name" : getCode.getStatus(400)
            })
        }
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
                    if(poMasterId.length == 0)
                    {
                        poMasterId = ids[0].poMasterId
                    }
                    else
                    {
                        poMasterId = poMasterId + ',' + ids[0].poMasterId
                    }
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
            db.poDetailsUpdate(poDetailIds, new Date(), userId).then(poDetail => {
                if(poDetail)
                {
                    if(poDetail.affectedRows > 0)
                    {
                        db.poStatusUpdate(poMasterId, new Date(), userId).then(poMaster => {
                            if(poMaster)
                            {
                                res.status(200)
                                return res.json({
                                    "status_code" : 200,
                                    "message"     : "success",
                                    "status_name" : getCode.getStatus(200)
                                });
                            }
                        })
                    }
                }
            })
        }
    }
    catch(e)
    {
        console.log(e)
    }
}

function updateInvoiceMasters(invoiceDetails, start, end,  uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
{ 
    totalItems = 0
    let identifierName = 'invoice_master'
    let id = 0
    uniqueFunction.unquieName(identifierName, ['invoice_number'], {"invoice_number" : invoiceNumber}, id, uuid).then(uniqueInvoice => {
        if(uniqueInvoice == 0 || uniqueInvoice == 1 || (uniqueInvoice == -1))
        {
            if(uniqueInvoice == 0)
            {
                let columnName = ['barcode']
                let columnValue = 
                {
                    "barcode" : barCode,
                }
                uniqueFunction.unquieName(identifierName, columnName, columnValue, id, uuid).then(uniqueCheck => 
                {
                    if(uniqueCheck == 0 || uniqueCheck == 1 || (uniqueCheck == -1))
                    {
                        if(uniqueCheck == 0)
                        {
                            db.updateInvoiceMaster(uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount).then(updateInvoiceMaster => {
                            if(updateInvoiceMaster)
                            {
                                if(updateInvoiceMaster.affectedRows > 0)
                                {
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

function updateInvoiceDateAll(invoiceDetails, start, end,  uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId, poStatusList)
{ 
    try
    {
        if(start < end)
        {
            if((poStatusList[start].name == 'Partially-Invoiced') || (poStatusList[start].name == 'Invoiced'))
            {
                let sql = `UPDATE po_master SET invoiced_on = ?, invoiced_by_id = ${userId} WHERE id = ${poStatusList[start].id}`;
                db.updateInvoiceDate(sql, new Date()).then(updateInvoiceDate => {
                    if(updateInvoiceDate)
                    {
                        start++
                        updateInvoiceDateAll(invoiceDetails, start, end,  uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId, poStatusList)
                    }
                })
            }
            else
            {
                let sql = `UPDATE po_master SET invoiced_on = null, invoiced_by_id = null WHERE id = ${poStatusList[start].id}`;
                db.updateInvoiceDate(sql, new Date()).then(updateInvoiceDate => {
                    if(updateInvoiceDate)
                    {
                        start++
                        updateInvoiceDateAll(invoiceDetails, start, end,  uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId, poStatusList)
                    }
                })
            }
        }
        else
        {
            db.deleteInvoiceDetails(invoiceId).then((deleteInvoice) =>{
                if(deleteInvoice)
                {
                    if(deleteInvoice.affectedRows > 0)
                    {
                        invoiceId = status[0].id
                        updateInvoiceMasters(invoiceDetails, 0, 0, uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, totalItems, userId, res, detail, invoiceId, poDetailIds, poMasterId)
                    }
                    else
                    {
                        res.status(400)
                        return res.json({
                            "status_code" : 400,
                            "message" : `Invoice Master not Updated`,
                            "status_name" : getCode.getStatus(400)
                        })
                    }
                }
                else
                {
                    res.status(400)
                    return res.json({
                        "status_code" : 400,
                        "message" : `Invoice Master not Updated`,
                        "status_name" : getCode.getStatus(400)
                    })
                }
            })
                   
        }
    }
    catch(e)
    {
        console.log(e)
    }
}