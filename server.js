let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
let dotenv = require('dotenv')
let errorCode = require('./common/errorCode/errorCode')
let getCode = new errorCode()
let https = require('https')
let app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb',extended : true}))
dotenv.config()
app.use('/common',require('./common/commonRoute'))
app.use('/master',require('./master/masterRoute'))
app.use('/client',require('./client/clientRoute'))
app.use('/auth',require('./authenticate/authenticateRoute'))
app.use('/vendor',require('./vender/vendorRoute'))
app.use('/po',require('./PO/poRoute'))
app.use('/invoice',require('./invoiced/invoiceRoute'))
app.use('/',(req,res,next) =>
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
// https.createServer(,app)
app.listen(8082,() => 
{
    console.log("Server is listing on port no 8082")
})