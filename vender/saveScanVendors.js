let db = require('./dbQueryVendors')
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
const vendor = require('../model/vendor')
let vendors;
let createdOn;
let createdById;
let accessToken;
let uuid;
let active;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        if(!req.body.vendors || !req.body.vendors?.length > 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        vendors = req.body.vendors;
        uuid = createUuid.v1()
        accessToken = req.body.accessToken;
        createdOn = new Date()
        authData = await commondb.selectToken(accessToken)
        createdById = authData[0].userId
        active = 1
        let save = saveVendors(vendors, 0, vendors.length, res, createdById, active, createUuid,0, [])
        // if(saveClient.affectedRows > 0)
        // {
        //     let returnUuid = await db.getReturnUuid(saveClient.insertId)
        //     res.status(200)
        //     return res.json({
        //         "status_code" : 200,
        //         "message"     : "success",
        //         "data" : { "count" : index},
        //         "status_name" : getCode.getStatus(200)
        //     });
        // }
        // else
        // {
        //     res.status(500)
        //     return res.json({
        //         "status_code" : 500,
        //         "message"     : "Vendor not saved",
        //         "status_name" : getCode.getStatus(500)
        //     });
        // }
    }
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "Vendors not saved",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})

function saveVendors(vendors, start, end, res, createdById, active, createUuid, index, rejected)
{
  if(start < end)
  {
    ele = vendors[start]
    ele['active'] = active
    ele['uuid'] = createUuid.v1()
    ele['createdById'] = createdById
    ele['createdOn'] = new Date()

    db.saveVendors(ele).then(unique => 
      {
        if(unique)
        {
            if(unique.affectedRows > 0)
            {
                index++   
            }
            else
            {
                rejected.push(unique.code)
            }
            start++
            let v =  saveVendors(vendors, start, end, res,  createdById, active, createUuid, index, rejected)
        }
      }) 
  }
  else
  {
    console.log(new Date())
    res.status(200)
    return res.json({
    "status_code" : 200,
    "message" : "success",
    "status_name" : getCode.getStatus(200),
    "data" : { "count" : index,
                "rejectedVendorCodes" : rejected},
    })
  }
}