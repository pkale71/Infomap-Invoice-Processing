let plantTypeObj = require('../../model/plantType')
let plantType = new plantTypeObj()
let db = require('./dbQueryPlantType')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getPlantTypes;
let plantTypeList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getPlantTypes = await db.getPlantTypes()
        if(getPlantTypes.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"plantTypes" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            plantTypeList = []
            getPlantTypes.forEach((element) => 
            {
                plantType.setDataAll(element)
                plantTypeList.push(plantType.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"plantTypes" : plantTypeList},
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