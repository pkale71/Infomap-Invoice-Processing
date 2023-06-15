let db = require('./dbQueryClient')
let clientObj = require('../model/client')
let client = new clientObj()
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let getClients;
let clientMasterList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getClients = await db.getClients()
        if(getClients.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"clients" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            clientMasterList = []
            getClients.forEach((element) => 
            {
                client.setDataAll(element)
                clientMasterList.push(client.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"clients" : clientMasterList},
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