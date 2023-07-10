let db = require('./dbQueryVendors')
let vendorObj = require('../model/vendor')
let vendor = new vendorObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getVendors;
let code;
let vendorUuid;
module.exports = require('express').Router().get('/:vendorUuid?*',async(req,res) => 
{
    try
    {
        if(req.params['0'].length > 0 &&  req.params['0'] != '/')
        {
            let a = req.params['0'].split('/')
            if(a.length >= 2)
            {
                vendorUuid = req.params['vendorUuid'] + a[0]
                code = a[1]
            }
            else if(a.length == 1) 
            {
                vendorUuid = req.params['vendorUuid']+ a[0]
                code = 0;
            }
        }
        else
        {
            vendorUuid = req.params['vendorUuid']
            code = 0;
        }

        if(vendorUuid.trim().length == 36)
        {
            vendorUuid = vendorUuid.trim()
            code = 0
        }
        else
        {
            code = vendorUuid.trim()
            vendorUuid = ''
        }
        getVendors = await db.getVendor(vendorUuid, code)
        if(getVendors.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"vendor" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            getVendors.forEach((element) => 
            {
                vendor.setDataAll(element)
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"vendor" : vendor.getDataAll()},
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