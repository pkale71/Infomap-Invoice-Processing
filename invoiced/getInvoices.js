let db = require('./dbQueryInvoice')
let invoiceObj = require('../model/invoice')
let invoice = new invoiceObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getInvoices;
let invoiceList = []
let vendorUuid;
module.exports = require('express').Router().get('/:vendorUuid?*',async(req,res) => 
{
    try
    {
        if(req.params['0'].length > 0 &&  req.params['0'] != '/')
        {
            let a = req.params['0'].split('/')
            if(a.length > 1)
            {
                vendorUuid = req.params['vendorUuid'] + a[0]
            }
            else if(a.length == 1) 
            {
                vendorUuid = req.params['vendorUuid']+ a[0]
            }
        }
        else
        {
            vendorUuid = req.params['vendorUuid']
        }
        getInvoices = await db.getInvoices(vendorUuid)
        if(getInvoices.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"invoices" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            invoiceList = []
            getInvoices.forEach((element) => 
            {
                invoice.setDataAll(element)
                invoiceList.push(invoice.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"invoices" : invoiceList},
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