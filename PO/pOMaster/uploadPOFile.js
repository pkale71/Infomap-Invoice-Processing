let db = require('./dbQueryPOs')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let createUuid = require('uuid')
let formidable = require('formidable');
let path = require('path')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let fs = require('fs');
let docPath = require('../../DOC_FOLDER_PATH/docPath')
let getPath = new docPath()
let errorCode = require('../../common/errorCode/errorCode');
let getCode = new errorCode()
let fileObject;
let originalFilename;
let poNumber;
let poUuid;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        const options = {
            maxFiles: 1
        };
        accessToken = req.body.accessToken;
        let form = new formidable.IncomingForm(options);
        form.parse(req, async function (error, fields, file) 
        {
            if(error) throw error
            if(Object.keys(file).length > 0)
            {
                fileObject = file
                let fileType = file.poFile['mimetype']
                originalFilename = file.poFile.originalFilename
            }
            req.body = fields
            if(!req.body.poNumber)
            {
                res.status(400)
                return res.json({
                    "status_code" : 400,
                    "message" : "Provide all values",
                    "status_name" : getCode.getStatus(400)
                })
            }
            poNumber = req.body.poNumber;
            poUuid = await db.getReturnUuid(poNumber);
            if(poUuid.length == 0)
            {
                res.status(400)
                return res.json({
                    "status_code" : 400,
                    "message" : "Provide Valid PO Number",
                    "status_name" : getCode.getStatus(400)
                })
            }

            poUuid = poUuid[0].uuid
            let upload = await uniqueFunction.singleFileUpload(fileObject, getPath.getName('po'), originalFilename, poUuid)
            if(upload)
            {
                let updated = await db.updatePOMasterFile(poNumber, originalFilename)
                console.log(uploaded + " File uploaded successfully")
                if(updated.affectedRows > 0)
                {
                    res.status(200)
                    return res.json({
                        "status_code" : 200,
                        "message" : "success",
                        "status_name" : getCode.getStatus(200)
                    })
                }
                else
                {
                    let deleteUpload = await uniqueFunction.deleteUploadedFile(getPath.getName('po'), originalFilename, poUuid)
                    if(deleteUpload)
                    {
                        res.status(400)
                        return res.json({
                            "status_code" : 400,
                            "message" : "PO File Not Uploaded",
                            "status_name" : getCode.getStatus(400)
                        }) 
                    }
                }
            }

        });
        } 
        catch(e)
        {
            console.log(e)
            if(e.code == 'ER_DUP_ENTRY')
            {
                let msg = e.sqlMessage.replace('_UNIQUE', '');
                res.status(500)
                return res.json({
                    "status_code"   : 500,
                    "message"       : msg,
                    "status_name"     : getCode.getStatus(500),
                    "error"         : msg
                }) 
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "PO File Not Uploaded",
                    "status_name" : getCode.getStatus(500),
                    "error"     :      e.sqlMessage
                }) 
            }
        }
})