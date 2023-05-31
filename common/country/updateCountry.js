let db = require('./dbQueryCountry')
let uniqueFunction = require('../commonFunction/uniqueSearchFunction')
let commondb = require('../commonFunction/dbQueryCommonFuntion')
let errorCode = require('../errorCode/errorCode')
let getCode = new errorCode()
let name;
let modifyOn;
let modifyById;
let accessToken;
let id;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.name || !req.body.id)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        name = req.body.name;
        id = req.body.id
        accessToken = req.body.accessToken;
        let identifierName = 'country'
        let columnName = ['name']
        let columnValue = 
        {
            "name" : name
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updateCountry = await db.updateCountry(name, modifyOn, modifyById, id)
            if(updateCountry.affectedRows > 0)
            {
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : "success",
                    "status_name" : getCode.getStatus(200)
                });
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "Country not updated",
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
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Country not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})