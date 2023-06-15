const express = require('express');
const masterRoute = express.Router();
let errorCode = require('../common/errorCode/errorCode')
let getCode = new errorCode()

masterRoute.use('/saveBusinessPlace',require('../authenticate/validateToken'),require('./businessPlace/saveBusinessPlace'))
masterRoute.use('/updateBusinessPlace',require('../authenticate/validateToken'),require('./businessPlace/updateBusinessPlace'))
masterRoute.use('/deleteBusinessPlace',require('../authenticate/validateToken'),require('./businessPlace/deleteBusinessPlace'))
masterRoute.use('/getBusinessPlaces',require('../authenticate/validateToken'),require('./businessPlace/getBusinessPlaces'))
masterRoute.use('/saveCostCenter',require('../authenticate/validateToken'),require('./costCenter/saveCostCenter'))
masterRoute.use('/updateCostCenter',require('../authenticate/validateToken'),require('./costCenter/updateCostCenter'))
masterRoute.use('/deleteCostCenter',require('../authenticate/validateToken'),require('./costCenter/deleteCostCenter'))
masterRoute.use('/getCostCenters',require('../authenticate/validateToken'),require('./costCenter/getCostCenters'))
masterRoute.use('/saveGLAccount',require('../authenticate/validateToken'),require('./glAccount/saveGlAccount'))
masterRoute.use('/updateGLAccount',require('../authenticate/validateToken'),require('./glAccount/updateGlAccount'))
masterRoute.use('/deleteGLAccount',require('../authenticate/validateToken'),require('./glAccount/deleteGlAccount'))
masterRoute.use('/getGLAccounts',require('../authenticate/validateToken'),require('./glAccount/getGlAccounts'))
masterRoute.use('/saveMaterialGroup',require('../authenticate/validateToken'),require('./materialGroup/saveMaterialGroup'))
masterRoute.use('/updateMaterialGroup',require('../authenticate/validateToken'),require('./materialGroup/updateMaterialGroup'))
masterRoute.use('/deleteMaterialGroup',require('../authenticate/validateToken'),require('./materialGroup/deleteMaterialGroup'))
masterRoute.use('/getMaterialGroups',require('../authenticate/validateToken'),require('./materialGroup/getMaterialGroups'))
masterRoute.use('/savePlantType',require('../authenticate/validateToken'),require('./plantType/savePlantType'))
masterRoute.use('/updatePlantType',require('../authenticate/validateToken'),require('./plantType/updatePlantType'))
masterRoute.use('/deletePlantType',require('../authenticate/validateToken'),require('./plantType/deletePlantType'))
masterRoute.use('/getPlantTypes',require('../authenticate/validateToken'),require('./plantType/getPlantTypes'))
masterRoute.use('/saveProfitCenter',require('../authenticate/validateToken'),require('./profitCenter/saveProfitCenter'))
masterRoute.use('/updateProfitCenter',require('../authenticate/validateToken'),require('./profitCenter/updateProfitCenter'))
masterRoute.use('/deleteProfitCenter',require('../authenticate/validateToken'),require('./profitCenter/deleteProfitCenter'))
masterRoute.use('/getProfitCenters',require('../authenticate/validateToken'),require('./profitCenter/getProfitCenters'))
masterRoute.use('/savePurchasingGroup',require('../authenticate/validateToken'),require('./purchasingGroup/savePurchasingGroup'))
masterRoute.use('/updatePurchasingGroup',require('../authenticate/validateToken'),require('./purchasingGroup/updatePurchasingGroup'))
masterRoute.use('/deletePurchasingGroup',require('../authenticate/validateToken'),require('./purchasingGroup/deletePurchasingGroup'))
masterRoute.use('/getPurchasingGroups',require('../authenticate/validateToken'),require('./purchasingGroup/getPurchasingGroups'))
masterRoute.use('/saveGSTMaster',require('../authenticate/validateToken'),require('./gstMaster/saveGstMaster'))
masterRoute.use('/updateGSTMaster',require('../authenticate/validateToken'),require('./gstMaster/updateGstMaster'))
masterRoute.use('/deleteGSTMaster',require('../authenticate/validateToken'),require('./gstMaster/deleteGstMaster'))
masterRoute.use('/getGSTMasters',require('../authenticate/validateToken'),require('./gstMaster/getGstMasters'))
masterRoute.use('/saveTDSMaster',require('../authenticate/validateToken'),require('./tdsMaster/saveTdsMaster'))
masterRoute.use('/updateTDSMaster',require('../authenticate/validateToken'),require('./tdsMaster/updateTdsMaster'))
masterRoute.use('/deleteTDSMaster',require('../authenticate/validateToken'),require('./tdsMaster/deleteTdsMaster'))
masterRoute.use('/getTDSMasters',require('../authenticate/validateToken'),require('./tdsMaster/getTdsMasters'))
masterRoute.use('/savePlant',require('../authenticate/validateToken'),require('./plant/savePlant'))
masterRoute.use('/updatePlant',require('../authenticate/validateToken'),require('./plant/updatePlant'))
masterRoute.use('/deletePlant',require('../authenticate/validateToken'),require('./plant/deletePlant'))
masterRoute.use('/getPlants',require('../authenticate/validateToken'),require('./plant/getPlants'))

masterRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = masterRoute