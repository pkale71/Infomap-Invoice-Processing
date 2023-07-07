let db = require('./dbQueryPOs')
let errorCode = require('../../common/errorCode/errorCode')
let getCode = new errorCode()
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let docPath = require('../../DOC_FOLDER_PATH/docPath')
let getPath = new docPath()
let path = require("path")
let fileName;
let poUuid;

module.exports = require('express').Router().get('/:poUuid',async(req,res) =>  
{
    try
    {
        poUuid = req.params.poUuid 
        fileName = await db.getFileName(poUuid)
        if(fileName[0].fileName == null)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message"       :   "success",
                "data"          :   {"poFile" : []},
                "status_name"   : getCode.getStatus(200)
            })   
        }
        let file = await uniqueFunction.getFileUploadedPath(getPath.getName('po'), fileName[0].fileName, poUuid)
        res.setHeader('Content-Type', `'${file.mime}'`);
        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
//   //console.log(path.join(__dirname,"../",file.path))
//   console.log(file)
// //   res.sendFile(path.join(__dirname,"../",file.path))
   res.end(file.file)
    } 
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code"   :   500,
            "message"       :   "File not found",
            "status_name"   :   getCode.getStatus(500),
            "error"         :   e.sqlMessage
        })     
    }
})
