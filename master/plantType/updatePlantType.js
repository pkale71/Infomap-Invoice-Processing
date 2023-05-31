let db = require('./dbQueryPlantType')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let name;
let modifyOn;
let modifyById;
let accessToken;
let id;
let isActive;
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
        let identifierName = 'plant_type'
        let columnName = ['name']
        let columnValue = 
        {
            "name" : name
        }
        let uniqueCheck = await uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0)
        if(uniqueCheck == 0)
        {
            isActive = 1
            modifyOn = new Date()
            authData = await commondb.selectToken(accessToken)
            modifyById = authData[0].userId
            let updatePlantType = await db.updatePlantType(name, modifyOn, modifyById, id, isActive)
            if(updatePlantType.affectedRows > 0)
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
                    "message"     : "Plant Type not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else if(uniqueCheck == 1)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Plant Type Already Exist",
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
            "message"     : "Plant Type not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})