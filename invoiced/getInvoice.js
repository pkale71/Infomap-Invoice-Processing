let db = require('./dbQueryInvoice')
let invoiceObj = require('../model/invoice')
let invoice = new invoiceObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getInvoice;
let invoiceList = []
let invoiceUuid;
module.exports = require('express').Router().get('/:invoiceUuid',async(req,res) => 
{
    try
    {
        invoiceUuid = req.params.invoiceUuid
        getInvoice = await db.getInvoice(invoiceUuid)
        if(getInvoice.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"invoice" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            invoiceList = []
            getInvoice.forEach((element) => 
            {
                invoice.setInvoice(element)
                invoiceList.push(invoice.getInvoice())
            });
            getInvoice[0]['invoiceDetails'] = invoiceList
            invoice.setDataAll(getInvoice[0])
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"invoice" : invoice.getDataAll()},
                "status_name" : getCode.getStatus(200)
            });
        }
    }
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "No Data Found",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})