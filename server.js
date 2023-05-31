let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
let dotenv = require('dotenv')
let errorCode = require('./common/errorCode/errorCode')
let getCode = new errorCode()
let app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
dotenv.config()

app.use('/common',require('./common/commonRoute'))
app.use('/master',require('./master/masterRoute'))
app.use('/auth',require('./authenticate/authenticateRoute'))
app.use('/',(req,res,next) =>
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})

app.listen(8082,() => 
{
    console.log("Server is listing on port no 8082")
})