let db = require('./dbQueryMaterialGroup')
let materialGroupObj = require('../../model/materialGroup')
let materialGroup = new materialGroupObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getMaterialGroups;
let materialGroupList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getMaterialGroups = await db.getMaterialGroups()
        if(getMaterialGroups.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"materialGroups" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            materialGroupList = []
            getMaterialGroups.forEach((element) => 
            {
                materialGroup.setDataAll(element)
                materialGroupList.push(materialGroup.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"materialGroups" : materialGroupList},
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