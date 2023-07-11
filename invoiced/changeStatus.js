let db = require('./dbQueryInvoice')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let uuid;
let accessToken;
let userId;

module.exports = require('express').Router().post('/',async(req,res) =>  {
    try
    {
        uuid = req.body.uuid;
        accessToken = req.body.accessToken;
        authData = await commondb.selectToken(accessToken)
        userId = authData[0].userId
        let checkStatus = await db.checkStatus(uuid);
        
        if(checkStatus[0].is_active == 1 && checkStatus[0].invoice_status_id == 1 && checkStatus[0].created_on != null && checkStatus[0].verified_on == null && checkStatus[0].processed_on == null)
        {
            let sql = `UPDATE invoice_master SET invoice_status_id = 2, verified_on = ?, verified_by_id = ${userId} where uuid = '${uuid}'`

            let changeStatus = await db.changeStatus(sql, new Date())

            if(changeStatus.affectedRows > 0){
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : 'success',
                    "status_name"   : getCode.getStatus(200)
                })
            } 
            else
            {
                res.status(500)
                return res.json({
                    "status_code"   :   500,
                    "message"       :   "Status not changed",
                    "status_name"   :   getCode.getStatus(500)
                })   
            }
        }
        else if(checkStatus[0].is_active == 1 && checkStatus[0].invoice_status_id == 2 && checkStatus[0].created_on != null && checkStatus[0].verified_on != null && checkStatus[0].processed_on == null)
        {
            let sql = `UPDATE invoice_master SET invoice_status_id = 3, processed_on = ?, processed_by_id = ${userId} where uuid = '${uuid}'`

            let changeStatus = await db.changeStatus(sql, new Date())

            if(changeStatus.affectedRows > 0){
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "message"     : 'success',
                    "status_name"   : getCode.getStatus(200)
                })
            } 
            else
            {
                res.status(500)
                return res.json({
                    "status_code"   :   500,
                    "message"       :   "Status not changed",
                    "status_name"   :   getCode.getStatus(500)
                })   
            }
        }
        else if(checkStatus[0].is_active == 1 && checkStatus[0].invoice_status_id == 3 && checkStatus[0].created_on != null && checkStatus[0].verified_on != null && checkStatus[0].processed_on != null)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"     : 'Invoice Already Processed',
                "status_name"   : getCode.getStatus(200)
            })   
        }
        else
        {
            res.status(400)
            return res.json({
                "status_code"   :   400,
                "message"       :   "Status not changed",
                "status_name"   :   getCode.getStatus(400)
            }) 
        }
    } 
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code"   :   500,
            "message"       :   "Status not changed",
            "status_name"   :   getCode.getStatus(500),
            "error"         :   e.sqlMessage
        })     
    }
})
