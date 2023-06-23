let db = require('./dbQueryVendors')
let vendorObj = require('../model/vendor')
let vendor = new vendorObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getMappedVendors;
let clientUuid;
let vendorList = []
module.exports = require('express').Router().get('/:clientUuid?*',async(req,res) => 
{
    try
    {
        console.log(req.params)
        if(req.params['0'].length > 0 &&  req.params['0'] != '/')
        {
            let a = req.params['0'].split('/')
            if(a.length > 1)
            {
                clientUuid = req.params['clientUuid'] + a[0]
            }
            else if(a.length == 1) 
            {
                clientUuid = req.params['clientUuid']+ a[0]
            }
        }
        else
        {
            clientUuid = req.params['clientUuid']
        }
        getMappedVendors = await db.getMappedVendors(clientUuid)
        console.log(getMappedVendors)
        if(getMappedVendors.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"vendors" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            vendorList = []
            getMappedVendors.forEach((element) => 
            {
                vendor.setDataAll(element)
                vendorList.push(vendor.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"vendors" : vendorList},
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