let db = require('./dbQueryCommonFuntion')
let uniqueFunction = {}

uniqueFunction.unquieName = (identifierName, columnName, columnValue, id, uuid) => 
{
    return new Promise((resolve, reject) => {
        try
        {
            let condition = ``
            let returnRes = -1
            for(let i = 0; i < columnName.length; i++)
            {
                if(columnName[i] == 'name' || columnName[i] == 'code'|| columnName[i] == 'tax_code'|| columnName[i] == 'description' || columnName[i] == 'gl_account_id' || columnName[i] == 'tax_section' || columnName[i] == 'gst_number' || columnName[i] == 'pan_number' || columnName[i] == 'cin_number' || columnName[i] == 'msme_number')
                {
                    condition = condition + 'UPPER('+ columnName[i] +  ') = ' + 'UPPER(' + `'${columnValue[columnName[i]]}'` + ')'
                }
                else
                {
                    condition = condition + columnName[i] + ' = ' +  `'${columnValue[columnName[i]]}'`
                }
                if(columnName.length != i+1)
                {
                    condition += ' AND '
                }
            }
            if(id)
            {
                condition += ` AND id != ${id}`
            }
            if(uuid.length > 0)
            {
                condition += ` AND uuid != '${uuid}'`
            }
            if(identifierName != '' && condition != '')
            {
                let sql = `SELECT IF(COUNT(id) > 0,1,0) AS isExist FROM ${identifierName} WHERE ${condition}`
                db.getUnique(sql).then(res => 
                {
                    if(res)
                    {
                        if(res[0].isExist == 0)
                        {
                            returnRes = 0
                            return resolve(returnRes)
                        }
                        else
                        {
                            returnRes = 1
                            return resolve(returnRes)
                        }
                    }
                })
            }
            else
            {
                return resolve(returnRes)
            }
        }
        catch(e)
        {
            throw e
        }
    })
}

uniqueFunction.manageSpecialCharacter = (data) => {
    if(data.includes("'"))
    {
        data = data.split("'").join("''")
    }
    return data
}
module.exports = uniqueFunction