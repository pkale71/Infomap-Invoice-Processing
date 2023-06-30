let db = require('./dbQueryPOs')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let createUuid = require('uuid')
let uuid;
let accessToken;
let plantUuid;
let purchasingGroupUuid;
let materialGroupUuid;
let totalAmount;
let poDetails = [];
let poMasterId;
let userId;
module.exports = require('express').Router().post('/',async(req,res) => 
{
    try
    {
        poDetails = []
        if(!req.body.uuid || !req.body.plant || !req.body.plant?.uuid || !req.body.purchasingGroup || !req.body.purchasingGroup?.uuid || !req.body.materialGroup || !req.body.materialGroup?.uuid|| !req.body.totalAmount || req.body.poDetails.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "Provide all values",
                "status_name" : getCode.getStatus(400)
            });
        }
        uuid = req.body.uuid
        plantUuid = req.body.plant?.uuid
        purchasingGroupUuid = req.body.purchasingGroup?.uuid
        materialGroupUuid = req.body.materialGroup?.uuid
        totalAmount = req.body.totalAmount
        poDetails = req.body.poDetails
        accessToken = req.body.accessToken;
        poMasterId = await db.getPoMasterId(uuid)
        if(poMasterId.length == 0)
        {
            res.status(400)
            return res.json({
                "status_code" : 400,
                "message"     : "PO Number Not Exist",
                "status_name" : getCode.getStatus(400)
            });
        }
        poMasterId = poMasterId[0].id
        authData = await commondb.selectToken(accessToken)
        userId = authData[0].userId

        isActive = 1
        savePODetails(poDetails, 0, poDetails.length, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, poDetails.length, userId, poMasterId, res)
    }
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message"     : "PO Master not updated",
            "status_name" : getCode.getStatus(500),
            "error"       : e
        });
    }
})

function savePODetails(poDetails, start, end, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
{
  
  if(start < end)
  {

            if(poDetails[start].oper == 'Edit')
            {

                poDetails[start]['modifyOn'] = new Date()
                poDetails[start]['modifyById'] = userId
                poDetails[start]['poMasterId'] = poMasterId
                poDetails[start]['glAccountUuid'] = poDetails[start].glAccount?.uuid
                db.updatePO(poDetails[start]).then(updatePO => {
                    if(updatePO)
                    {
                        if(updatePO.affectedRows > 0)
                        {
                            start++
                            savePODetails(poDetails, start, end, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
                        }
                    }
                })
            }
            else if(poDetails[start].oper == 'New')
            {

                poDetails[start]['createdOn'] = new Date()
                poDetails[start]['createdById'] = userId
                poDetails[start]['poMasterId'] = poMasterId
                poDetails[start].uuid = createUuid.v1()
                poDetails[start]['glAccountUuid'] = poDetails[start].glAccount?.uuid
                db.savePO(poDetails[start]).then(savePO => {
                    if(savePO)
                    {
                        if(savePO.affectedRows > 0)
                        {
                            start++
                            savePODetails(poDetails, start, end, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
                        }
                    }
                })
            }
            else
            {
                start++
                savePODetails(poDetails, start, end, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
            }
  }
  else
  {
    savePOMasters(poDetails, 0, 0, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
  }

}

function savePOMasters(poDetails, start, end, uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems, userId, poMasterId, res)
{ 
     db.updatePOMaster(uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, poDetails.length).then(updatePOMaster => {
        if(updatePOMaster)
        {
            if(updatePOMaster.affectedRows > 0)
            {
                uniqueFunction.isProcessedPO(poMasterId).then(verify => {
                    if(verify)
                    {
                        db.updatePOMasterStatus(uuid, 2).then(status => {
                            if(status.affectedRows > 0)
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
                                res.status(200)
                                return res.json({
                                    "status_code" : 200,
                                    "message"     : "success",
                                    "status_name" : getCode.getStatus(200)
                                });
                            }
                        })
                    }
                    else
                    {
                        res.status(200)
                        return res.json({
                            "status_code" : 200,
                            "message"     : "success",
                            "status_name" : getCode.getStatus(200)
                        });
                    }
                })
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "PO Master not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
        }
        else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message"     : "PO Master not updated",
                    "status_name" : getCode.getStatus(500)
                });
            }
     })
}