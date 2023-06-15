let db = require('./dbQueryClient')
let vendorObj = require('../model/vendor')
let vendor = new vendorObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getVendors;
let vendorList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getVendors = await db.getVendors()
        if(getVendors.length == 0)
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
            getVendors.forEach((element) => 
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