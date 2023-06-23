let clientObj = require('../../model/client')
let client = new clientObj()
let db = require('./dbQueryPlant')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getClients;
let unmappedClientList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getClients = await db.getClients()
        console.log(getClients)
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
            unmappedClientList = []
            getClients.forEach((element) => 
            {
                client.setDataAll(element)
                unmappedClientList.push(client.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"clients" : unmappedClientList},
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