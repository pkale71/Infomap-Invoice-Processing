let db = require('./dbQueryPurchasingGroup')
let purchasingGroupObj = require('../../model/purchasingGroup')
let purchasingGroup = new purchasingGroupObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getPurchasingGroups;
let purchasingGroupList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getPurchasingGroups = await db.getPurchasingGroups()
        if(getPurchasingGroups.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"purchasingGroups" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            purchasingGroupList = []
            getPurchasingGroups.forEach((element) => 
            {
                purchasingGroup.setDataAll(element)
                purchasingGroupList.push(purchasingGroup.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"purchasingGroups" : purchasingGroupList},
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