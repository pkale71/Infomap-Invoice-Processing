let db = require('./dbQueryAuthenticate')
let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('rorCode')
let getCode = new errorCode()
let user;
let oldPassword;
let newPassword;
let authData
let userId

module.exports = require('express').Router().post('/',async(req,res)=>
{
    try
    {
        oldPassword = req.body.oldPassword;
        newPassword = req.body.newPassword;
        accessToken = req.body.accessToken;
        authData = await commondb.selectToken(accessToken)
        if(authData.length == 0)
        {
            res.status(401)
            return res.json({
                "status_code" : 401,
                "message" : "Invalid access token",
                "status_name" : getCode.getStatus(401),
            }) 
        }
        userId = authData[0].userId
        if(userId)
        {
            user = await commondb.getUserById(userId)
            if(user.length == 0)
            {
                res.status(404)
                return res.json({
                    "status_code" : 404,
                    "message" : "User not found",
                    "status_name" : getCode.getStatus(404),
                })
            }
            let isValidPassword = user[0].password == oldPassword
            if(isValidPassword)
            {
                let updateUser = await db.updateUser(userId,newPassword)
                if(updateUser.affectedRows > 0)
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
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Password not changed",
                        "status_name" : getCode.getStatus(500)
                    }) 
                }
            }
            else
            {
                res.status(401)
                return res.json({
                    "status_code" : 401,
                    "message" : "Old Password not matched",
                    "status_name" : getCode.getStatus(401),
                }) 
            }       
        }
    } 
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Password not changed",
            "status_name" : getCode.getStatus(500),
            "error"     :      e.sqlMessage
        }) 
    }
})
