let db = require('./dbQueryCostCenter')
let costCenterObj = require('../../model/costCenter')
let costCenter = new costCenterObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getCostCenters;
let costCenterList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getCostCenters = await db.getCostCenters()
        if(getCostCenters.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"costCenters" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            costCenterList = []
            getCostCenters.forEach((element) => 
            {
                costCenter.setDataAll(element)
                costCenterList.push(costCenter.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"costCenters" : costCenterList},
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