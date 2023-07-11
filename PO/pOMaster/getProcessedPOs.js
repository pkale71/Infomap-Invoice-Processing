let db = require('./dbQueryPOs')
let poObj = require('../../model/po')
let po = new poObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getProcessedPOs;
let poList = []
let vendorUuid;
let invoiceUuid;
module.exports = require('express').Router().get('/:vendorUuid/:invoiceUuid?*',async(req,res) => 
{
    try
    {
        if(req.params['0'].length > 0 &&  req.params['0'] != '/')
        {
            let a = req.params['0'].split('/')
            if(a.length > 1)
            {
                vendorUuid = req.params.vendorUuid + a[0]
                invoiceUuid = a[1]
            }
            else if(a.length == 1) 
            {
                vendorUuid = req.params.vendorUuid + a[0]
                invoiceUuid = ""
            }
        }
        else
        {
            vendorUuid = req.params.vendorUuid
            invoiceUuid = req.params['invoiceUuid'] ? req.params['invoiceUuid'] : ""
        }
        getProcessedPOs = await db.getProcessedPOs(vendorUuid, invoiceUuid)
        if(getProcessedPOs.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"processedPOs" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            poList = []
            getProcessedPOs.forEach((element) => 
            {
                po.setDataAll(element)
                poList.push(po.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"processedPOs" : poList},
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