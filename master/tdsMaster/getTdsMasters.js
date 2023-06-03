let db = require('./dbQueryTdsMaster')
let gstMasterObj = require('../../model/gstMaster')
let gstMaster = new gstMasterObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getGstMasters;
let gstMasterList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getGstMasters = await db.getGstMasters()
        if(getGstMasters.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"gstMasters" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            gstMasterList = []
            getGstMasters.forEach((element) => 
            {
                gstMaster.setDataAll(element)
                gstMasterList.push(gstMaster.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"gstMasters" : gstMasterList},
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