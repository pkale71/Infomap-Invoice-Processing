let db = require('./dbQueryGlAccount')
let glAccountObj = require('../../model/glAccount')
let glAccount = new glAccountObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getGlAccounts;
let glAccountList = []
module.exports = require('express').Router().get('/',async(req,res) => 
{
    try
    {
        getGlAccounts = await db.getGlAccounts()
        if(getGlAccounts.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"glAccounts" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            glAccountList = []
            getGlAccounts.forEach((element) => 
            {
                glAccount.setDataAll(element)
                glAccountList.push(glAccount.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"glAccounts" : glAccountList},
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