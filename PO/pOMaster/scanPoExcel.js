let formidable = require('formidable');
let db = require('../pOMaster/dbQueryPOs')
let commondb = require('../../common/commonFunction/dbQueryCommonFuntion')
let path = require('path')
let fs = require('fs');
let createUuid = require('uuid')
let vendorObj = require('../../model/vendor')
let vendorSet = new vendorObj()
let errorCode = require('../../common/errorCode/errorCode');
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let getCode = new errorCode()
const reader = require('xlsx');
const { isNumberObject } = require('util/types');
let headers = ['Purchasing Document','Name of Supplier', 'Plant', 'Purchasing Group', 'Line ITEMS', 'Short Text', 'Month or Period', 'Net Price', 'G/L Account']
let fileReturn = 0
let accessToken;
emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; ///^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$/;
let filepath;
let mimeType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
      console.log(new Date())
      fileReturn = 0;
        accessToken = req.body.accessToken;
        let form = new formidable.IncomingForm();
        form.parse(req, async function (error, fields, file) 
        {
            if(error) throw error
            if(Object.keys(file).length > 0)
            {
                fileObject = file
            }
            req.body = fields
            filepath = fileObject.poFile.filepath
            mimeType = fileObject.poFile.mimetype
            const file1 = reader.readFile(fileObject.poFile.filepath)
            let data = []
          
            const worksheet = file1.Sheets['PO template']
            
            // const range = reader.utils.decode_range(worksheet['!ref']);
            // const column = reader.utils.decode_col("VENDOR NUMBER");
            const jsonWorksheet = reader.utils.sheet_to_json(worksheet, { header: 1 });
          //  console.log(jsonWorksheet)

            // Get the last cell index of row one
            const lastCellIndex = jsonWorksheet[0].length ;
            let headerFlag = 0
            let columnIndex = []
            headers.forEach(ele => {
                if(jsonWorksheet[0].includes(ele))
                {
                    columnIndex.push({column : ele , index : jsonWorksheet[0].indexOf(ele)})
                }
                if(headerFlag == 1)
                {
                    return
                }
                if(!jsonWorksheet[0].includes(ele))
                {
                    console.log(ele)
                    headerFlag = 1
                    res.status(400)
                    return res.json({
                        "status_code" : 400,
                        "message" : "PO scanning process not completed. Required format not matched",
                        "status_name" : getCode.getStatus(400),
                       // "data"     :    fs.readFileSync(file.excel.filepath, 'base64')
                    }) 
                }
            })
            const statusAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex});
            const remarkAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex + 1});
            reader.utils.sheet_add_aoa(worksheet, [['STATUS']], { origin: statusAddress });
            reader.utils.sheet_add_aoa(worksheet, [['REMARKS']], { origin: remarkAddress });
          
            let accepted = []
            let rejected = []
            let poNumberList = []
            let posList = []
            amount = 0
            authData = await commondb.selectToken(accessToken)

            const pos = reader.utils.sheet_to_json(file1.Sheets['PO template'])
            jsonWorksheet.forEach((ele, i) => {
              if(ele.length == 0)
              {
                pos.splice(i-1,0,{})
              }
            })

          let scan =   scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, 0, pos.length, res, lastCellIndex, poNumberList, file1,authData[0].userId, 1, createUuid, amount)
          console.log("scan ", scan)

          //   // let dupList =  findDuplicatesInColumn(pos);
          //   // return res.json({data : dupList})
          //   console.log(headers.length)
          //   pos.forEach((ele, index) => {
          //     if(Object.keys(ele).length != 0)
          //       {
          //         ele['msg'] = ``
          //         headers.forEach((element, j) => {
          //           if( element == 'Line ITEMS' || element == 'Net Price')
          //           {
          //             if(ele[element] != '' || ele[element] != null || ele[element] != undefined)
          //             {
          //               if(element == 'Line ITEMS' && isNaN(parseInt(ele[element])) && isNumberObject(ele[element]))
          //               {                        
          //                 fileReturn = 1
          //                 ele['msg'] = ele['msg'] + `${element} must be number,`
          //               }

          //               if(element == 'Net Price' && isNaN(parseFloat(ele[element])))
          //               {
          //                 fileReturn = 1
          //                 ele['msg'] = ele['msg'] + `${element} must be number,`
          //               }
          //             }
          //           }
          //           if((ele[element] == null || ele[element] == '' || ele[element] == undefined) && element != 'Month or Period' )
          //           {
          //             fileReturn = 1
          //             ele['msg'] = ele['msg'] + `${element} can not be ${ele[element] == null ? 'null' : empty},`
          //           }
          //         })
          //         const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
          //         reader.utils.sheet_add_aoa(worksheet, [[ele['msg']]], { origin: remarkAddress });
                  
          //         if(ele['msg'].length == 0)
          //         {
          //           let code = ele['Name of Supplier'].split(" ")[0]
          //           ele['vendorCode'] = code
          //           posList.push(ele)
          //         }
          //       }
          //   })
          //   values.push(posList[0]['Purchasing Document'])
          //   authData = await commondb.selectToken(accessToken)
          //  posList.forEach(ele => {
          //   if(!values.includes(ele['Purchasing Document']))
          //   {
          //     values.push(ele['Purchasing Document']) 
          //   }
          //  })
          //   values.forEach((element, i ) => {
          //     let  filData = pos.filter(ele => ele['Purchasing Document']  == element)
          //     // vendors, start, end, res, createdById, active, createUuid, index, rejected,file1, reader, worksheet
          //     let s = savePOs(filData, 0, filData.length, res,authData[0].userId, 1, createUuid, index,file1, reader, worksheet)
          //     console.log(s)
          //     if(s && i+1 == values.length)
          //     {
          //         reader.writeFile(file1, './newfile.xlsx')
          //         data = []
                  
          //         const temp = reader.utils.sheet_to_json(worksheet)
                  
          //         temp.forEach((res) => {
          //             data.push(res)
          //         })
          //         return res.json({
          //           "status_code" : 500,
          //           "message" : "Excel error",
          //           "status_name" : getCode.getStatus(500),
          //           "error"     :     data
          //         }) 
          //     }
          //   })


          //   // reader.writeFile(file1, './newfile.xlsx')
          //   // data = []
            
          //   // const temp = reader.utils.sheet_to_json(worksheet)
            
          //   // temp.forEach((res) => {
          //   //     data.push(res)
          //   // })
          //   // return res.json({
          //   //   "status_code" : 500,
          //   //   "message" : "Excel error",
          //   //   "status_name" : getCode.getStatus(500),
          //   //   "error"     :     data
          //   // })

          //   // let s = scanUniqueVendorCode(posList, 0, posList.length,file1, reader, worksheet, res)
         
          //   console.log("999999999999999")
          //   // let s = scanUniqueVendorCode(vendorsList, 0, values.length,accepted,rejected, res)
          //  // console.log(s)
          //   // const statusAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex});
          //   // const remarkAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex + 1});
          //   // reader.utils.sheet_add_aoa(worksheet, [['STATUS']], { origin: statusAddress });
          //   // reader.utils.sheet_add_aoa(worksheet, [['REMARKS']], { origin: remarkAddress });

          //   // reader.writeFile(file1, './newfile.xlsx');

          //   // const file2 = reader.readFile(fileObject.excel.filepath)

          //   // const sheets = file2.SheetNames[0]

          //   // const temp = reader.utils.sheet_to_json(
          //   //         file2.Sheets[sheets])
          //   //       //  console.log(temp)
            
          //   // temp.forEach((res) => {
          //   //     data.push(res)
          //   // })
        })        
    } 
    catch(e)
    {
        console.log(e)
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Excel error",
            "status_name" : getCode.getStatus(500),
            "error"     :      e
        }) 
    }
})
// filData, 0, filData.length,file1, reader, worksheet, res
function savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount)
{
  if(start < end)
  {
    ele = posList[start]
    ele['active'] = active
    ele['uuid'] = createUuid.v1()
    ele['createdById'] = createdById
    ele['poId'] = poId
    ele['createdOn'] = new Date()

    let identifierName = 'po_detail'
    let id = 0
    let columnName = ['sno', 'po_master_id']
    let columnValue = 
    {
        "po_master_id" : poId,
        'sno' : ele['Line ITEMS']
    }
    uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(uniqueCheck => {
      if(uniqueCheck == 0 || uniqueCheck == 1)
              {
                if(uniqueCheck == 0)
                {
                  db.savePOs(ele).then(unique => 
                    {
                      if(unique)
                      {
                          if(unique.affectedRows > 0)
                          {
                              amount = amount +    ele['Net Price']
                          }
                          else
                          {
                            fileReturn = 1
                            index = pos.indexOf(ele)
                            pos[index]['msg'] = pos[index]['msg'] + unique.remark + `,`
                            const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
                            reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                          }
                          start++
                          let v =  savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount)
                      }
                    }) 
                }
                else if(uniqueCheck == 1)
                {
                  fileReturn = 1
                  
                  index = pos.indexOf(ele)
                  pos[index]['msg'] = pos[index]['msg'] + `Duplicate Line ITEMS,`
                  const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
                  reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                  start++
                  savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount)
                }
              }
    })

    
  }
  else
  {
    db.updatePOMasterAmount({poId : poId, amount : amount}).then(response => {
      if(response.affectedRows > 0)
      {
        console.log("inserted")
        posList = []
        poNumberList = []
        amount = 0
        scanStart++
        scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid,amount) 
      }
      else
      {
        posList = []
        poNumberList = []
        amount = 0
        scanStart++
        scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid,amount) 
      }
    })
    // console.log(new Date())
    
    // res.status(200)
    // return res.json({
    // "status_code" : 200,
    // "message" : "success",
    // "status_name" : getCode.getStatus(200),
    // "data" : { "count" : index,
    //             "failedVendors" : rejected},
    // })
  }
}

function savePOMaster(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, amount)
{
    ele = posList[start]
    ele['active'] = active
    ele['uuid'] = createUuid.v1()
    ele['createdById'] = createdById
    ele['createdOn'] = new Date()

    db.savePOMaster(ele).then(unique => 
      {
        if(unique)
        {
            if(unique.affectedRows > 0)
            {
              savePOs(posList, 0, posList.length, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, unique.insertId, amount)
              // posList = []
              // poNumberList = []
              // scanStart++
              // scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid)  
            }
            else
            {
              fileReturn = 1
              index = pos.indexOf(ele)
              pos[index]['msg'] = pos[index]['msg'] + unique.remark + `,`
              const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
              reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
              posList = []
              poNumberList = []
              amount = 0
              scanStart++
              scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
            }
            // else
            // {
            //   console.log(unique)
            //     // rejected.push(unique)
            // }
            // start++
            // let v =  savePOMaster(pos, start, end, res, createdById, active, createUuid, index,file1, reader, worksheet)
        }
      }) 
  
}

function scanUniquePONumber(ele, start, end, accepted,rejected, res)
{
  
  if(start < end)
  {
    let identifierName = 'po_master'
    let id = 0
    let columnName = ['po_number']
    let columnValue = 
    {
        "po_number" : ele[start]['Purchasing Document']
    }
    uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(unique => 
      {
        if(unique == 0 || unique == 1)
        {

          // console.log(unique)
          if(unique == 0)
          {
          //console.log("444444444")
          vendorSet.setScanFile(ele[start])
          accepted.push(vendorSet.getScanFile())
          }
          else if(unique == 1)
          {
         // console.log("55555555555")

         ele[start]['msg'] = ele[start]['msg'] + `DUPLICATE VENDOR NUMBER`
          vendorSet.setScanFile(ele[start])
          rejected.push(vendorSet.getScanFile())
          const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
          reader.utils.sheet_add_aoa(worksheet, [[ele['msg']]], { origin: remarkAddress });
          }
          start++
         let v =  scanUniqueVendorCode(ele, start, end,accepted,rejected, res)
        }
      }) 
  }
  else
  {
    console.log(new Date())
    res.status(200)
    return res.json({
    "status_code" : 200,
    "message" : "success",
    "status_name" : getCode.getStatus(200),
    "data"     :    {
            "acceptedVendors" : accepted,
            "rejectedVendors" : rejected
          }
    })
  }

}

function scanUniquePOLineItems(ele, start, end, accepted,rejected, res)
{
  
  if(start < end)
  {
    let identifierName = 'vendor'
    let id = 0
    let columnName = ['code']
    let columnValue = 
    {
        "code" : ele[start]['VENDOR NUMBER']
    }
    uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(unique => 
      {
        if(unique == 0 || unique == 1)
        {

          // console.log(unique)
          if(unique == 0)
          {
          //console.log("444444444")
          vendorSet.setScanFile(ele[start])
          accepted.push(vendorSet.getScanFile())
          }
          else if(unique == 1)
          {
         // console.log("55555555555")

         ele[start]['REMARKS'] = `DUPLICATE VENDOR NUMBER`
          vendorSet.setScanFile(ele[start])
          rejected.push(vendorSet.getScanFile())
          }
          start++
         let v =  scanUniqueVendorCode(ele, start, end,accepted,rejected, res)
        }
      }) 
  }
  else
  {
    console.log(new Date())
    res.status(200)
    return res.json({
    "status_code" : 200,
    "message" : "success",
    "status_name" : getCode.getStatus(200),
    "data"     :    {
            "acceptedVendors" : accepted,
            "rejectedVendors" : rejected
          }
    })
  }

}

function scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
{
  
  if(start < end)
  {
      if(Object.keys(pos[start]).length != 0)
        {
          pos[start]['msg'] = ``
          headers.forEach((element, j) => {
            if( element == 'Line ITEMS' || element == 'Net Price')
            {
              if(pos[start][element] != '' || pos[start][element] != null || pos[start][element] != undefined)
              {
                if(element == 'Line ITEMS' && isNaN(parseInt(pos[start][element])) && isNumberObject(pos[start][element]))
                {                        
                  fileReturn = 1
                  pos[start]['msg'] = pos[start]['msg'] + `${element} must be number,`
                }

                if(element == 'Net Price' && isNaN(parseFloat(pos[start][element])))
                {
                  fileReturn = 1
                  pos[start]['msg'] = pos[start]['msg'] + `${element} must be number,`
                }
              }
            }
            if((pos[start][element] == null || pos[start][element] == '' || pos[start][element] == undefined) && element != 'Month or Period' )
            {
              fileReturn = 1
              pos[start]['msg'] = pos[start]['msg'] + `${element} can not be ${pos[start][element] == null ? 'null' : empty},`
            }
          })
          const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex + 1});
          reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
          
          if(pos[start]['msg'].length == 0)
          {
            let code = pos[start]['Name of Supplier'].split(" ")[0]
            pos[start]['vendorCode'] = code
            let flag = 0
            if(poNumberList?.length == 0)
            {
              poNumberList.push(pos[start]['Purchasing Document'])
            }
            if(poNumberList?.length > 0 && poNumberList.includes(pos[start]['Purchasing Document']))
            {
              posList.push(pos[start])
            }
            else
            {
              fileReturn = 1
              pos[start]['msg'] = pos[start]['msg'] + `PO Number mismatch,`
              const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex + 1});
              reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress }); 
            }
          }
          start++
          scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
        }
      else
      {
        // console.log(start, "true", posList.length)
        if(posList.length > 0)
        {
          let identifierName = 'po_master'
          let id = 0
          let columnName = ['po_number']
          let columnValue = 
          {
              "po_number" : posList[0]['Purchasing Document']
          }
          uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(unique => 
            {
              if(unique == 0 || unique == 1)
              {
                if(unique == 0)
                {
                  let poMasterSave = savePOMaster(posList, 0, posList.length, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, start, end, lastCellIndex, poNumberList,amount)
                  // if(poMasterSave?.affectedRows > 0)
                  // {
                  //   posList = []
                  //   poNumberList = []
                  //   amount = 0
                  //   start++
                  //   scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
                  // }
                }
                else if(unique == 1)
                {
                  posList = []
                  poNumberList = []
                  fileReturn = 1
                  index = pos.indexOf(pos[start])
                  pos[index]['msg'] = pos[index]['msg'] + `Duplicate PO Number,`
                  const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex + 1});
                  reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                  start++
                  scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
                }
              }
          }) 
        }
      }
  }
  else
  {
    console.log(new Date())
    if(fileReturn == 1)
    {
      reader.writeFile(file1, './newfile.xlsx') 
      let xlsxFile = fs.readFileSync(filepath, 'base64')
      xlsxFile = `data:${mimeType};base64,` + xlsxFile
      res.status(200)
      return res.json({
        "status_code" : 200,
        "message"     : "success",
        "data"      : {"poFile" : xlsxFile},
        "status_name" : getCode.getStatus(200)
    });
    }
    else
    {
      res.status(200)
      return res.json({
        "status_code" : 200,
        "message"     : "success",
        "data"      : {"poFile" : []},
        "status_name" : getCode.getStatus(200)
    });
    }
  }

}