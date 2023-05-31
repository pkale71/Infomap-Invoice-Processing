let db = require('./dbQueryAuthenticate')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let users = require('../model/user')
let generate_token = require('./tokenGenerate')
let useUser = new users()
let email;
let password;
let userId
let user
module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        email = req.body.email;
        password = req.body.password;
        user = await db.getUserByEmail(email);
        if(user.length == 0)
        {
            res.status(401)
            return res.json({
                "status_code" : 401,
                "message"     : "Invalid email or password",
                "status_name" : getCode.getStatus(401)
            })
        }
        user[0]['time'] = new Date()
        userId = user[0].id
        let isValidPassword = user[0].password == password
        if(isValidPassword && user[0].is_active == 1)
        {
            user.password = undefined;
            let mysqlDatetime = user[0].time;
            const jsontoken = generate_token(56)
            if(jsontoken != null || jsontoken != undefined)
            {
                user[0]['access_token']=jsontoken
                let insertToken = await db.insertToken(jsontoken, userId, mysqlDatetime)
                let insert_lastLogin = await db.insertLastLogin(mysqlDatetime, userId)
                useUser.setData(user[0])
                res.status(200)
                return res.json(useUser.getData())
            } 
        }  
        else
        {
            res.status(401)
            return res.json({
                "status_code" : 401,
                "message": "Invalid email or password",
                "status_name" : getCode.getStatus(401)
            });
        } 
    } 
    catch(e)
    {
        res.status(401)
        return res.json({
            "status_code" : 401,
            "message"     : "Invalid email or password",
            "status_name" : getCode.getStatus(401),
            "errror"      : e.sqlMessage
        });
    }
})
