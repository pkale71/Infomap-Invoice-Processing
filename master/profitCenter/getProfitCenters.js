let db = require('./dbQueryProfitCenter')
let profitCenterObj = require('../../model/profitCenter')
let profitCenter = new profitCenterObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getProfitCenters;
let profitCenterList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getProfitCenters = await db.getProfitCenters()
        if(getProfitCenters.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"profitCenters" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            profitCenterList = []
            getProfitCenters.forEach((element) => 
            {
                profitCenter.setDataAll(element)
                profitCenterList.push(profitCenter.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"profitCenters" : profitCenterList},
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