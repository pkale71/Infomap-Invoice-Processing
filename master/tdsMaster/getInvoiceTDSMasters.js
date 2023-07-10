let db = require('./dbQueryTdsMaster')
let tdsMasterObj = require('../../model/tdsMaster')
let tdsMaster = new tdsMasterObj()
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let getTdsInvoiceMasters;
let tdsMasterList = []
let glAccountUuid;
let gstMasterUuid;
module.exports = require('express').Router().get('/:glAccountUuid/:gstMasterUuid',async(req,res) => 
{
    try
    {
        gstMasterUuid = req.params.gstMasterUuid
        glAccountUuid   = req.params.glAccountUuid
        getTdsInvoiceMasters = await db.getTdsInvoiceMasters(glAccountUuid, gstMasterUuid)
        if(getTdsInvoiceMasters.length == 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"tdsMasters" : []},
                "status_name" : getCode.getStatus(200)
            });
        }
        else
        {
            tdsMasterList = []
            getTdsInvoiceMasters.forEach((element) => 
            {
                tdsMaster.setDataAll(element)
                tdsMasterList.push(tdsMaster.getDataAll())
            });
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : "success",
                "data"        : {"tdsMasters" : tdsMasterList},
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