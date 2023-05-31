let verifyToken = require('./verifyToken')
let app = require('express').Router();

app.get('/:id',async (req,res,next) => 
{
    console.log("v1")
    verifyToken(req,res,next)
})

app.get('/',async (req,res,next) => 
{
    console.log("v1")
    verifyToken(req,res,next)
})

app.post('/',async (req,res,next) => 
{
    console.log("v2")
    verifyToken(req,res,next)
})

module.exports = app