let db = require('./dbQueryAuthenticate')
let token;
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
module.exports = require('express').Router().get('/',async(req,res) =>
{
    try
    {
        token = req.body.accessToken       
        let deletedToken = await db.deleteToken(token)
        if(deletedToken.affectedRows > 0)
        {
            res.status(200)
            return res.json({
                "status_code" : 200,
                "message" : "success",
                "status_name" : 'ok'
            })            
        }
        else
        {
            res.status(404)
            return res.json({
                "status_code" : 404,
                "message" : "Logout Failed, user not found",
                "status_name" : getCode.getStatus(404)
            }) 
        }   
    } 
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Logout Failed",
                "status_name" : getCode.getStatus(500),
            "error"     : e.sqlMessage
        }) 
    }
})
