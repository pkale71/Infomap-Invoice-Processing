let db = require('./dbQueryPOs')
let poObj = require('../../model/po')
let po = new poObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getPO;
let poList = []
let poUuid;
module.exports = require('express').Router().get('/:poUuid',async(req,res) => 
{
    try
    {
        poUuid = req.params.poUuid
        getPO = await db.getPO(poUuid)
        if(getPO.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"po" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            poList = []
            getPO.forEach((element) => 
            {
                po.setPO(element)
                poList.push(po.getPO())
            });
            getPO[0]['poDetails'] = poList
            po.setDataAll(getPO[0])
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"po" : po.getDataAll()},
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