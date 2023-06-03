let commondb = require('../common/commonFunction/dbQueryCommonFuntion')
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()
let userTypeCode;
let accessToken;
let userId;
let authData;
let tokenArr;
let email

async function  verifyToken  (req, res, next)
{
    try 
    {
        let token = req.headers['authorization']
        if(!token)
        {
            res.status(401)
            return res.json({
                "message": "Provide Token",
                "status_name" : getCode.getStatus(401),
                "status_code"   :  401
            })
        }
        if(typeof token !== 'undefined')
        {
            tokenArr = token.split(" ")
            accessToken = tokenArr[1]
            accessToken = accessToken.toString()
        }
        if(accessToken.length == 0)
        {
            res.status(401)
            return res.json({
                "message": "Invalid Token",
                "status_name" : getCode.getStatus(401),
                "status_code"   :  401
            })
        }
        authData = await commondb.selectToken(accessToken)
        if(authData.length == 0)
        {
            res.status(401)
            return res.json({
                "message": "Invalid Token",
                "status_name" : getCode.getStatus(401),
                "status_code"   :  401
            })
        }
        userId = authData[0].userId
        if(userId)
        {
            user = await commondb.getUserById(userId);
            email = user[0].email
            if(user.length == 0)
            {
                console.log("1****")
                res.status(401)
                return res.json({
                    "message": "User not active",
                    "status_name" : getCode.getStatus(401),
                    "status_code"   :  401
                })
            }
            userTypeCode = user[0].user_type_code
            const verified = (accessToken === authData[0].authToken)    
            if(verified)
            {
                if((userTypeCode == 'ADM') && ( req.baseUrl ==  '/common/saveCountry' || req.baseUrl ==  '/common/updateCountry' || req.baseUrl ==  '/common/deleteCountry' || req.baseUrl ==  '/common/saveState' || req.baseUrl ==  '/common/updateState' || req.baseUrl ==  '/common/deleteState' || req.baseUrl ==  '/common/saveCity' || req.baseUrl ==  '/common/updateCity' || req.baseUrl ==  '/common/deleteCity' || req.baseUrl ==  '/master/saveBusinessPlace' || req.baseUrl ==  '/master/updateBusinessPlace' || req.baseUrl ==  '/master/deleteBusinessPlace' || req.baseUrl ==  '/master/saveCostCenter' || req.baseUrl ==  '/master/updateCostCenter' || req.baseUrl ==  '/master/deleteCostCenter' || req.baseUrl ==  '/master/saveGLAccount' || req.baseUrl ==  '/master/updateGLAccount' || req.baseUrl ==  '/master/deleteGLAccount' || req.baseUrl ==  '/master/saveMaterialGroup' || req.baseUrl ==  '/master/updateMaterialGroup' || req.baseUrl ==  '/master/deleteMaterialGroup' || req.baseUrl ==  '/master/savePlantType' || req.baseUrl ==  '/master/updatePlantType' || req.baseUrl ==  '/master/deletePlantType' || req.baseUrl ==  '/master/saveProfitCenter' || req.baseUrl ==  '/master/updateProfitCenter' || req.baseUrl ==  '/master/deleteProfitCenter' || req.baseUrl ==  '/master/savePurchasingGroup' || req.baseUrl ==  '/master/updatePurchasingGroup' || req.baseUrl ==  '/master/deletePurchasingGroup'|| req.baseUrl ==  '/master/saveGSTMaster' || req.baseUrl ==  '/master/updateGSTMaster' || req.baseUrl ==  '/master/deleteGSTMaster'|| req.baseUrl ==  '/master/saveTDSMaster' || req.baseUrl ==  '/master/updateTDSMaster' || req.baseUrl ==  '/master/deleteTDSMaster' || req.baseUrl ==  '/master/saveClient' || req.baseUrl ==  '/master/updateClient' || req.baseUrl ==  '/master/deleteClient' ))
                {
                    req.body.accessToken = accessToken
                    next()
                }
                else if(req.method == 'GET' && (req.baseUrl.includes('get') ||req.baseUrl ==  '/auth/logout'))
                {
                    req.body.accessToken = accessToken
                    next()
                }
                else 
                {
                        res.status(401)
                        return res.json({
                            'message'       :       `Invalid user`,
                            "status_name" : getCode.getStatus(401),
                            "status_code"   :       401
                        });
                } 
            }
            else
            {
                console.log("9")
                res.status(401)
                return res.json({
                    'message'       :       `Invalid user`,
                    "status_name" : getCode.getStatus(401),
                    "status_code"   :       401
                });
            }
        }
        else
        {
            console.log("10")
            res.status(401)
            return res.json({
                'message'       :       `Unauthenticated User "${email}"`,
                "status_name" : getCode.getStatus(401),
                "status_code"   :       401
            });
        }
    } 
    catch (error) 
    {
        res.status(401)
        return res.json({
            'message'       :       `Unauthoried User "${email}"`,
            "status_name"   :       getCode.getStatus(401),
            "status_code"   :       401,
            "error"         :       error
        });
    }
}
module.exports = verifyToken;