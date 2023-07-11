let db = require('./dbQueryInvoice')
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let uuid;
let accessToken;
let paymentTerms;
let postingDate;
let baselineDate;
let invoiceDate;
let currency;
let documentHeaderText;
let withTaxAmount;
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
        detail = 0
        totalItems = 0
        if(!req.body.uuid || !req.body.paymentTerms || !req.body.postingDate || !req.body.baselineDate || !req.body.currency || !req.body.documentHeaderText || !req.body.withTaxAmount || req.body.invoiceDetails?.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        uuid = req.body.uuid
        paymentTerms = req.body.paymentTerms
        postingDate = req.body.postingDate
        baselineDate = req.body.baselineDate
        currency = req.body.currency
        documentHeaderText = req.body.documentHeaderText
        withTaxAmount = req.body.withTaxAmount
        invoiceDetails = req.body.invoiceDetails
        accessToken = req.body.accessToken;
        authData = await commondb.selectToken(accessToken)
        userId = authData[0].userId
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
        if(status[0].name != 'Processed')
        {
            invoiceId = status[0].id
            updateInvoiceMasters(invoiceDetails, 0, 0, uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount, totalItems, userId, res, detail, invoiceId)
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message" : `Invoice Status Already Processed`,
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

function updateInvoiceDetails(invoiceDetails, start, end, uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount, totalItems, userId, res, detail, invoiceId)
{
    try
    {
        if(start < end)
        {
            db.updateInvoiceDetail(invoiceDetails[start]).then(saveInvoiceDetail => 
            {
                if(saveInvoiceDetail)
                {    
                    if(saveInvoiceDetail.affectedRows > 0)
                    {
                        totalItems++
                    }            
                    start++
                    updateInvoiceDetails(invoiceDetails, start, end, uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount, totalItems, userId, res, detail, invoiceId)
                }
            })
        }
        else
        {
            uniqueFunction.isProcessedInvoice(invoiceId).then(verify => {
                if(verify)
                {
                    db.invoiceStatusUpdate(invoiceId, new Date(), userId).then(invoice => {
                        if(invoice)
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
                            res.status(200)
                            return res.json({
                                "status_code" : 200,
                                "message"     : "Invoice Updated Successfully, But Not Processed",
                                "status_name" : getCode.getStatus(200)
                            });
                        }
                    })
                }
                else
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
    catch(e)
    {
        console.log(e)
    }
}

function updateInvoiceMasters(invoiceDetails, start, end, uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount, totalItems, userId, res, detail, invoiceId)
{
    db.updateInvoiceMasterProcessed(uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount).then(updateInvoiceMasterProcessed => {
    if(updateInvoiceMasterProcessed)
    {
        if(updateInvoiceMasterProcessed.affectedRows > 0)
        {
            updateInvoiceDetails(invoiceDetails, 0, invoiceDetails.length, uuid, paymentTerms, postingDate, baselineDate, currency, documentHeaderText, withTaxAmount, totalItems, userId, res, detail, invoiceId)
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