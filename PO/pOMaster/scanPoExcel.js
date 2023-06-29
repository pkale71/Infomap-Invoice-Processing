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
let filename;
let totalPos = 0;
let savedPos = 0;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
      console.log(new Date())
      fileReturn = 0;
      totalPos = 0;
      savedPos = 0;
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
            // console.log(fileObject)
            filepath = fileObject.poFile.filepath
            mimeType = fileObject.poFile.mimetype
            filename = fileObject.poFile.originalFilename

            const file1 = reader.readFile(fileObject.poFile.filepath)
            let data = []
          
            const worksheet = file1.Sheets['Sheet1']
            
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
                    // console.log(ele)
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
            const remarkAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex});
            reader.utils.sheet_add_aoa(worksheet, [['REMARKS']], { origin: remarkAddress });
          
           
            let poNumberList = []
            let posList = []
            amount = 0
            authData = await commondb.selectToken(accessToken)

            const pos = reader.utils.sheet_to_json(file1.Sheets['Sheet1'])
            // for(let i = 0; i < pos.length;)
            // {
            //   pos[i]['msg'] = ''
            //   let o = getIds(pos[i]).then(ids=> {
            //       console.log(ids)
            //       if(ids)
            //       {
            //         pos[i]['ids'] = ids
            //         console.log(" **********************    ",pos[i]['ids'])
            //         i++;
            //       }
            //   })
             
            // }

            // await pos.forEach(async(ele) => {
            //   ele['msg'] = ''
            //   ele['ids'] = await getIds(ele)
            //   console.log(" **********************    ",ele['ids'])
            // })
          // totalPos =  pos.length
            jsonWorksheet.forEach((ele, i) => {
              if(ele.length == 0)
              {
                pos.splice(i-1,0,{})
              }
            })

          let scan =   scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, 0, pos.length, res, lastCellIndex, poNumberList, file1,authData[0].userId, 1, createUuid, amount, savedPos, totalPos)
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
          //         const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
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
          //   // const remarkAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex});
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
function savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount, savedPos, totalPos)
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
                            // if(unique.remark.includes('cannot be null'))
                            // {
                            //   let name  = unique.remark.substring(
                            //     unique.remark.indexOf("'") + 1, 
                            //     unique.remark.lastIndexOf("'")
                            //     )
                                
                            //   let msg =  uniqueFunction.poDetailMaper(name)
                            //   pos[index]['msg'] = pos[index]['msg'] + msg + `,`
                            //   const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
                            //   reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                            // }
                            // else
                            // {
                              // pos[index]['msg'] = pos[index]['msg'] + unique.remark + `,`
                              // const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
                              // reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                            
                          }
                          start++
                          let v =  savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount, savedPos, totalPos)
                      }
                    }) 
                }
                else if(uniqueCheck == 1)
                {
                  fileReturn = 1
                  index = pos.indexOf(ele)
                  if(pos[index]['msg'] == "")
                  {
                    pos[index]['msg'] = `Duplicate Line ITEMS`
                  }
                  else
                  {
                    pos[index]['msg'] = pos[index]['msg'] + ', ' + `Duplicate Line ITEMS`
                  }
                  const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
                  reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
                  start++
                  savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount, savedPos, totalPos)
                }
              }
    })

    
  }
  // else if(start == end)
  // {
  //   console.log(posList.length, posList[start-1], start-1, end)
  //   ele = posList[start-1]
  //   ele['active'] = active
  //   ele['uuid'] = createUuid.v1()
  //   ele['createdById'] = createdById
  //   ele['poId'] = poId
  //   ele['createdOn'] = new Date()

  //   let identifierName = 'po_detail'
  //   let id = 0
  //   let columnName = ['sno', 'po_master_id']
  //   let columnValue = 
  //   {
  //       "po_master_id" : poId,
  //       'sno' : ele['Line ITEMS']
  //   }
  //   uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(uniqueCheck => {
  //     if(uniqueCheck == 0 || uniqueCheck == 1)
  //             {
  //               if(uniqueCheck == 0)
  //               {
  //                 db.savePOs(ele).then(unique => 
  //                   {
  //                     if(unique)
  //                     {
  //                         if(unique.affectedRows > 0)
  //                         {
  //                             amount = amount +    ele['Net Price']
  //                         }
  //                         else
  //                         {
  //                           fileReturn = 1
  //                           index = pos.indexOf(ele)
  //                           // if(unique.remark.includes('cannot be null'))
  //                           // {
  //                           //   let name  = unique.remark.substring(
  //                           //     unique.remark.indexOf("'") + 1, 
  //                           //     unique.remark.lastIndexOf("'")
  //                           //     )
                                
  //                           //   let msg =  uniqueFunction.poDetailMaper(name)
  //                           //   pos[index]['msg'] = pos[index]['msg'] + msg + `,`
  //                           //   const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
  //                           //   reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
  //                           // }
  //                           // else
  //                           // {
  //                           //   pos[index]['msg'] = pos[index]['msg'] + unique.remark + `,`
  //                           //   const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
  //                           //   reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
  //                           // }
  //                         }
  //                         start++
  //                         let v =  savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount, savedPos, totalPos)
  //                     }
  //                   }) 
  //               }
  //               else if(uniqueCheck == 1)
  //               {
  //                 fileReturn = 1
                  
  //                 index = pos.indexOf(ele)
  //                 pos[index]['msg'] = pos[index]['msg'] + `Duplicate Line ITEMS,`
  //                 const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
  //                 reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
  //                 start++
  //                 savePOs(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, poId, amount, savedPos, totalPos)
  //               }
  //             }
  //   })

  // }
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
        scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid,amount, savedPos, totalPos) 
      }
      else
      {
        posList = []
        poNumberList = []
        amount = 0
        scanStart++
        scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid,amount, savedPos, totalPos) 
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

function savePOMaster(posList, start, end, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, amount, savedPos, totalPos)
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
              savedPos++
              savePOs(posList, 0, posList.length, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, scanStart, scanEnd, lastCellIndex, poNumberList, unique.insertId, amount, savedPos, totalPos)
            }
            else
            {
              fileReturn = 1
              index = pos.indexOf(ele)
              // if(unique.remark.includes('cannot be null'))
              // {
              //   let name  = unique.remark.substring(
              //     unique.remark.indexOf("'") + 1, 
              //     unique.remark.lastIndexOf("'")
              //     )
                  
              //   let msg =  uniqueFunction.poMasterMaper(name)
              //   pos[index]['msg'] = pos[index]['msg'] + msg + `,`
              //   const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
              //   reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
              // }
              // else
              // {
              //   pos[index]['msg'] = pos[index]['msg'] + unique.remark + `,`
              //   const remarkAddress = reader.utils.encode_cell({ r: index + 1, c: lastCellIndex});
              //   reader.utils.sheet_add_aoa(worksheet, [[pos[index]['msg']]], { origin: remarkAddress });
              // }
              posList = []
              poNumberList = []
              amount = 0
              scanStart++
              scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, scanStart, scanEnd, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
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


function scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
{
  if(start < end)
  {
      if(Object.keys(pos[start]).length != 0)
        {
          // console.log("start",start,end)

          pos[start]['msg'] = ``
          let code = pos[start]['Name of Supplier'].split(" ")[0]
          pos[start]['vendorCode'] = code
          // console.log(start)
          getIds(pos[start]).then(ids1 => {
            // console.log("ids",ids1)
            if(ids1)
            {
            //  console.log("id", ids1.vendorId?.length, start)
              pos[start]['ids'] = ids1
              if(ids1.vendorId?.length == 0)
              {
                fileReturn = 1
                if(pos[start]['msg'] == "")
                {
                  pos[start]['msg'] = `Vendor Code Not Exist`
                }
                else
                {
                  pos[start]['msg'] = pos[start]['msg'] + ', ' + `Vendor Code Not Exist`
                }
                //pos[start]['msg'] = pos[start]['msg'] + `Vendor Code Not Exist,`
                const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
                reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
              }
              if(ids1.plantId?.length == 0)
              {
                fileReturn = 1
                if(pos[start]['msg'] == "")
                {
                  pos[start]['msg'] = `Plant Code Not Exist`
                }
                else
                {
                  pos[start]['msg'] = pos[start]['msg'] + ', ' + `Plant Code Not Exist`
                }
                //pos[start]['msg'] = pos[start]['msg'] + `Plant Code Not Exist,`
                const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
                reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
              }
              if(ids1.purchaseGroupId?.length == 0)
              {
                fileReturn = 1
                if(pos[start]['msg'] == "")
                {
                  pos[start]['msg'] = `Purchasing Group Code Not Exist`
                }
                else
                {
                  pos[start]['msg'] = pos[start]['msg'] + ', ' + `Purchasing Group Code Not Exist`
                }
                //pos[start]['msg'] = pos[start]['msg'] + `Purchasing Group Code Not Exist,`
                const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
                reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
              }
              if(ids1.glAccountId?.length == 0)
              {
               
                fileReturn = 1
                if(pos[start]['msg'] == "")
                {
                  pos[start]['msg'] = `Gl Account Number Not Exist`
                }
                else
                {
                  pos[start]['msg'] = pos[start]['msg'] + ', ' + `Gl Account Number Not Exist`
                }
                //pos[start]['msg'] = pos[start]['msg'] + `Gl Account Number Not Exist,`
                const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
                reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
              }
              headers.forEach((element, j) => {
                if( element == 'Line ITEMS' || element == 'Net Price')
                {
                  if(pos[start][element] != '' || pos[start][element] != null || pos[start][element] != undefined)
                  {
                    if(element == 'Line ITEMS' && isNaN(parseInt(pos[start][element])) && isNumberObject(pos[start][element]))
                    {                        
                      fileReturn = 1
                      if(pos[start]['msg'] == "")
                      {
                        pos[start]['msg'] = `${element} must be number`
                      }
                      else
                      {
                        pos[start]['msg'] = pos[start]['msg'] + ', ' + `${element} must be number`
                      }
                      //pos[start]['msg'] = pos[start]['msg'] + `${element} must be number,`
                    }
    
                    if(element == 'Net Price' && isNaN(parseFloat(pos[start][element])))
                    {
                      fileReturn = 1
                      if(pos[start]['msg'] == "")
                      {
                        pos[start]['msg'] = `${element} must be number`
                      }
                      else
                      {
                        pos[start]['msg'] = pos[start]['msg'] + ', ' + `${element} must be number`
                      }
                      //pos[start]['msg'] = pos[start]['msg'] + `${element} must be number,`
                    }
                  }
                }
                if((pos[start][element] == null || pos[start][element] == '' || pos[start][element] == undefined) && element != 'Month or Period' )
                {
                  fileReturn = 1
                  if(pos[start]['msg'] == "")
                  {
                    pos[start]['msg'] = `${element} can not be ${pos[start][element] == null ? 'null' : empty}`
                  }
                  else
                  {
                    pos[start]['msg'] = pos[start]['msg'] + ', ' + `${element} can not be ${pos[start][element] == null ? 'null' : empty}`
                  }
                  //pos[start]['msg'] = pos[start]['msg'] + `${element} can not be ${pos[start][element] == null ? 'null' : empty},`
                }
              })
              const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
              reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
              if(pos[start]['msg'].length == 0)
              {
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
                  if(pos[start]['msg'] == "")
                  {
                    pos[start]['msg'] = `PO Number mismatch`
                  }
                  else
                  {
                    pos[start]['msg'] = pos[start]['msg'] + ', ' + `PO Number mismatch`
                  }
                  //pos[start]['msg'] = pos[start]['msg'] + `PO Number mismatch,`
                  const remarkAddress = reader.utils.encode_cell({ r: start + 1, c: lastCellIndex});
                  reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress }); 
                }
              }
              start++
              // console.log("cal", start, posList.length)
              scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
            }
          })
        }
      else
      {
        totalPos++
        // console.log(start, "true", posList.length)
        if(posList.length > 0)
        {
          posList.forEach((ele, i) => {
            flag1 = 0
            if(ele['Purchasing Document'] != posList[0]['Purchasing Document'])
            {
              flag1 = 1
              fileReturn = 1
              //index = pos.indexOf(pos[start])
              if(pos[start-1]['msg'] == "")
              {
                pos[start-1]['msg'] = `Purchasing Document Number Mismatch`
              }
              else
              {
                pos[start-1]['msg'] = pos[start-1]['msg'] + ', ' + `Purchasing Document Number Mismatch`
              }
              //pos[start-1]['msg'] = pos[start-1]['msg'] + `Purchasing Document Number Mismatch,`
              const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
              reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
            }
            if(ele['Plant'] != posList[0]['Plant'])
            {
              flag1 = 1
              fileReturn = 1
              if(pos[start-1]['msg'] == "")
              {
                pos[start-1]['msg'] = `Plant Code Mismatch`
              }
              else
              {
                pos[start-1]['msg'] = pos[start-1]['msg'] + ', ' + `Plant Code Mismatch`
              }
              //pos[start-1]['msg'] = pos[start-1]['msg'] + `Plant Code Mismatch,`
              const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
              reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
            }
            if(ele['Purchasing Group'] != posList[0]['Purchasing Group'])
            {
              flag1 = 1
              fileReturn = 1
              if(pos[start-1]['msg'] == "")
              {
                pos[start-1]['msg'] = `Purchasing Group Code Mismatch`
              }
              else
              {
                pos[start-1]['msg'] = pos[start-1]['msg'] + ', ' + `Purchasing Group Code Mismatch`
              }
              //pos[start-1]['msg'] = pos[start-1]['msg'] + `Purchasing Group Code Mismatch,`
              const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
              reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
            }
            if(flag1 == 1)
            {
              posList.splice(1,1)
            }
          })
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
                  let poMasterSave = savePOMaster(posList, 0, posList.length, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, start, end, lastCellIndex, poNumberList,amount, savedPos, totalPos)
                
                }
                else if(unique == 1)
                {
                  
                  
                  posList = []
                  poNumberList = []
                  fileReturn = 1
                  //index = pos.indexOf(pos[start])
                  if(pos[start-1]['msg'] == "")
                  {
                    pos[start-1]['msg'] = `Duplicate PO Number`
                  }
                  else
                  {
                    pos[start-1]['msg'] = pos[start-1]['msg'] + ', ' + `Duplicate PO Number`
                  }
                  //pos[start-1]['msg'] = pos[start-1]['msg'] + `Duplicate PO Number,`
                  const remarkAddress = reader.utils.encode_cell({ r: start, c: lastCellIndex});
                  reader.utils.sheet_add_aoa(worksheet, [[pos[start-1]['msg']]], { origin: remarkAddress });
                  console.log(unique, remarkAddress)

                  start++
                  scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount,savedPos, totalPos)
                }
              }
          }) 
        }
        else
        {
          start++
          scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
        }
      }
  }
  // else if(start == end)
  // {
  //   if(posList.length > 0)
  //   {
  //     posList.forEach(ele => {
  //       if(ele['Purchasing Document'] != posList[0]['Purchasing Document'])
  //       {
  //         fileReturn = 1
  //         //index = pos.indexOf(pos[start])
  //         pos[start-1]['msg'] = pos[start-1]['msg'] + `Purchasing Document Number Mismatch,`
  //         const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
  //         reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
  //       }
  //       if(ele['Plant'] != posList[0]['Plant'])
  //       {
  //         fileReturn = 1
  //         pos[start-1]['msg'] = pos[start-1]['msg'] + `Plant Code Mismatch,`
  //         const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
  //         reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
  //       }
  //       if(ele['Purchasing Group'] != posList[0]['Purchasing Group'])
  //       {
  //         fileReturn = 1
  //         pos[start-1]['msg'] = pos[start-1]['msg'] + `Purchasing Group Code Mismatch,`
  //         const remarkAddress = reader.utils.encode_cell({ r: start - 1, c: lastCellIndex});
  //         reader.utils.sheet_add_aoa(worksheet, [[pos[start]['msg']]], { origin: remarkAddress });
  //       }
  //     })
  //     let identifierName = 'po_master'
  //     let id = 0
  //     let columnName = ['po_number']
  //     let columnValue = 
  //     {
  //         "po_number" : posList[0]['Purchasing Document']
  //     }
  //     uniqueFunction.unquieName(identifierName, columnName, columnValue, id, 0).then(unique => 
  //       {
  //         if(unique == 0 || unique == 1)
  //         {
  //           if(unique == 0)
  //           {
  //             let poMasterSave = savePOMaster(posList, 0, posList.length, res, createdById, active, createUuid,file1, reader, worksheet, pos,fileReturn,headers, start, end, lastCellIndex, poNumberList,amount, savedPos, totalPos)
  //             // if(poMasterSave?.affectedRows > 0)
  //             // {
  //             //   posList = []
  //             //   poNumberList = []
  //             //   amount = 0
  //             //   start++
  //             //   scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount)
  //             // }
  //           }
  //           else if(unique == 1)
  //           {
  //             posList = []
  //             poNumberList = []
  //             fileReturn = 1
  //             //index = pos.indexOf(pos[start])
  //             pos[start-1]['msg'] = pos[start-1]['msg'] + `Duplicate PO Number,`
  //             const remarkAddress = reader.utils.encode_cell({ r: start, c: lastCellIndex});
  //             reader.utils.sheet_add_aoa(worksheet, [[pos[start-1]['msg']]], { origin: remarkAddress });
  //             start++
  //             scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
  //           }
  //         }
  //     }) 
  //   }
  //   else
  //       {
  //         start++
  //         scanPOExcel(pos,posList,fileReturn,headers,reader,worksheet, start, end, res, lastCellIndex, poNumberList, file1,createdById, active, createUuid, amount, savedPos, totalPos)
  //       }
  // }
  else
  {
    console.log(new Date())
    if(fileReturn == 1)
    {
      reader.writeFile(file1, './'+filename) 
      let xlsxFile = fs.readFileSync('./'+filename, 'base64')
      xlsxFile = `data:${mimeType};base64,` + xlsxFile
      res.status(200)
      return res.json({
        "status_code" : 200,
        "message"     : "success",
        "data"      : {"poFile" : xlsxFile,
        "savedPos"  : savedPos? savedPos : 0,
        "totalPos"  : totalPos? totalPos : 0,
        },
        "status_name" : getCode.getStatus(200)
    });
    }
    else
    {
      res.status(200)
      return res.json({
        "status_code" : 200,
        "message"     : "success",
        "data"      : {"poFile" : [],
        "savedPos"  : savedPos? savedPos : 0,
        "totalPos"  : totalPos? totalPos : 0
        },
        "status_name" : getCode.getStatus(200)
    });
    }
  }

}

async function getIds(ele)
{
  // console.log("called")
  return new Promise((resolve, reject) => {
    // console.log("enter")
    try{
      db.getVendorId(ele.vendorCode).then(vendorId => {
        // console.log("vender")
        if(vendorId)
        {
          db.getPlantId(ele['Plant']).then(plantId => {
        // console.log("plant")

            if(plantId)
            {
              db.getPurchasingGroupId(ele['Purchasing Group']).then(purchaseGroupId => {
        // console.log("group")

                if(purchaseGroupId)
                {
                  db.getGlAccountId(ele['G/L Account']).then(glAccountId => {
        // console.log("account")

                    if(glAccountId)
                    {
                        // console.log("retun  ")
                      resolve({vendorId : vendorId, plantId : plantId, purchaseGroupId : purchaseGroupId, glAccountId: glAccountId}) 
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
    catch(e)
    {
      console.log(e)
      throw e
    }
  })
  
}