let db = require('./dbQueryPOs')
let poObj = require('../../model/po')
let po = new poObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getNonInvoicedPODetails;
let poList = []
let poUuid;
module.exports = require('express').Router().get('/:poUuid',async(req,res) => 
{
    try
    {
        // getNonInvoicedPODetails
        poUuid = req.params.poUuid
        getNonInvoicedPODetails = await db.getNonInvoicedPODetails(poUuid)
        if(getNonInvoicedPODetails.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"nonInvoicedPODetails" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            poList = []
            getNonInvoicedPODetails.forEach((element) => 
            {
                po.setPO(element)
                poList.push(po.getPO())
            });
            // getNonInvoicedPODetails[0]['poDetails'] = poList
            // po.setDataAll(getNonInvoicedPODetails[0])
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"nonInvoicedPODetails" : poList},
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