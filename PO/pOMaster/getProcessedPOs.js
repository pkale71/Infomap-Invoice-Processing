let db = require('./dbQueryPOs')
let poObj = require('../../model/po')
let po = new poObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getProcessedPOs;
let poList = []
let vendorUuid;
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getProcessedPOs = await db.getProcessedPOs()
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