let formidable = require('formidable');
let path = require('path')
let fs = require('fs');
let vendorObj = require('../model/vendor')
let vendorSet = new vendorObj()
let errorCode = require('../common/errorCode/errorCode');
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let getCode = new errorCode()
const reader = require('xlsx');
const { rejects } = require('assert');
let headers = ['VENDOR NUMBER','NAME1', 'ACCOUNT_GROUP', 'STREET', 'STREET2', 'STREET3', 'STREET4', 'POSTAL CODE', 'CITY1', 'COUNTRY', 'Corporate Group', 'TELEPHONE NO. 1', 'TELEPHONE EXCHANGE', 'TELEPHONE NO. 2', 'FAX NUMBER 1', 'EMAIL ADDR1', 'EMAIL ADDR2', 'EMAIL ADDR3', 'GST No.', 'PAN NO', 'TYPE OF INDUSTRY']


module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
      console.log(new Date())
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
            
            const file1 = reader.readFile(fileObject.vendorFile.filepath)
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
                    console.log(ele)
                    headerFlag = 1
                    res.status(400)
                    return res.json({
                        "status_code" : 400,
                        "message" : "Excel Format Not Matched",
                        "status_name" : getCode.getStatus(400),
                       // "data"     :    fs.readFileSync(file.excel.filepath, 'base64')
                    }) 
                }
            })

            let accepted = []
            let rejected = []
            let values = []
            let vendorsList = []

            const vendors = reader.utils.sheet_to_json(file1.Sheets['Sheet1'])
            // let dupList =  findDuplicatesInColumn(vendors);
            // return res.json({data : dupList})
            vendors.forEach(ele => {
                if(ele['VENDOR NUMBER'] != '' && ele['VENDOR NUMBER'] != null)
                {
                  // console.log("1111111111111")
                  if(!values.includes(ele['VENDOR NUMBER'].toString()))
                  {
                    // console.log("22222222222222")

                   
                    if(ele['NAME1'] != '' && ele['NAME1'] != null )
                    {
                      // console.log("33333333333")
                      values.push(ele['VENDOR NUMBER'].toString())
                      vendorsList.push(ele)
                    }
                    else
                    {
                  // console.log("6666666666")

                      ele['REMARKS'] = `NAME IS EMPTY`
                      vendorSet.setDataAll(ele)
                      rejected.push(vendorSet.getDataAll())
                    }
                  }
                  else
                  {
                  // console.log("777777777777777")

                    ele['REMARKS'] = `DUPLICATE VENDOR NUMBER`
                      vendorSet.setDataAll(ele)
                      rejected.push(vendorSet.getDataAll())
                  }

                }
                else
                {
                  //console.log("88888888888888")

                  ele['REMARKS'] = `VENDOR NUMBER IS NULL`
                  vendorSet.setDataAll(ele)
                  rejected.push(vendorSet.getDataAll())
                }
            })


            console.log("999999999999999")
            let s = scanUniqueVendorCode(vendorsList, 0, values.length,accepted,rejected, res)
            console.log(s)
            // const statusAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex});
            // const remarkAddress = reader.utils.encode_cell({ r: 0, c: lastCellIndex + 1});
            // reader.utils.sheet_add_aoa(worksheet, [['STATUS']], { origin: statusAddress });
            // reader.utils.sheet_add_aoa(worksheet, [['REMARKS']], { origin: remarkAddress });

            // reader.writeFile(file1, './newfile.xlsx');

            // const file2 = reader.readFile(fileObject.excel.filepath)

            // const sheets = file2.SheetNames[0]

            // const temp = reader.utils.sheet_to_json(
            //         file2.Sheets[sheets])
            //       //  console.log(temp)
            
            // temp.forEach((res) => {
            //     data.push(res)
            // })
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

function scanUniqueVendorCode(ele, start, end, accepted,rejected, res)
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
          vendorSet.setDataAll(ele[start])
          accepted.push(vendorSet.getDataAll())
          }
          else if(unique == 1)
          {
         // console.log("55555555555")

         ele[start]['REMARKS'] = `DUPLICATE VENDOR NUMBER`
          vendorSet.setDataAll(ele[start])
          rejected.push(vendorSet.getDataAll())
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