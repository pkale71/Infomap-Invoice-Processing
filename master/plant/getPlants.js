let plantObj = require('../../model/plant')
let plant = new plantObj()
let db = require('./dbQueryPlant')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getPlants;
let plantMasterList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getPlants = await db.getPlants()
        if(getPlants.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"plants" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            plantMasterList = []
            getPlants.forEach((element) => 
            {
                plant.setDataAll(element)
                plantMasterList.push(plant.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"plants" : plantMasterList},
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