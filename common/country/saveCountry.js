let db = require('./dbQueryCountry')
let uniqueFunction = require('../commonFunction/uniqueSearchFunction')
let commondb = require('../commonFunction/dbQueryCommonFuntion')
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let name;
let createdOn;
let createdById;
let accessToken;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.name)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        name = req.body.name;
        accessToken = req.body.accessToken;
        let identifierName = 'country'
        let id = 0
        let columnName = ['name']
        let columnValue = 
        {
            "name" : name
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            createdOn = new Date()
            authData = await commondb.selectToken(accessToken)
            createdById = authData[0].userId
            let saveCountry = await db.saveCountry(name, createdOn, createdById)
            if(saveCountry.affectedRows > 0)
            {
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : "success",
                    "data"        : {"id" : saveCountry.insertId},
                    "status_name" : getCode.getStatus(200)
                });
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "Country not saved",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Country Name Already Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
    }
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Country not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})