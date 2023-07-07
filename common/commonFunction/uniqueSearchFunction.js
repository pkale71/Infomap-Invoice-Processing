let db = require('./dbQueryCommonFuntion')
let fs = require('fs');
let path = require('path')
const mime = require('mime');
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

uniqueFunction.poMasterMaper = (name) => 
{
    if (name) 
    {
        switch (name) 
        {
            case 'plant_id': return 'Plant Code Not Exist'; 
            case 'vendor_id': return 'Plant Code Not Exist'; 
            case 'material_group_id': return 'Material Group Code Not Exist'; 
            case 'purchasing_group_id': return 'Purchasing Group Code Not Exist'; 
            default:
                return "Something Went Wrong in This Row"
        }
    }
    
}

uniqueFunction.poDetailMaper = (name) => 
{
    if (name) 
    {
        switch (name) 
        {
            case 'sno': return 'Invalid Line ITEMS'; 
            case 'activity_text': return 'Invalid Short Text'; 
            case 'month_period': return 'Invalid Month or Period'; 
            case 'gl_account_id': return 'G/L Account Code Not Exist'; 
            default:
                return "Something Went Wrong in This Row"
        }
    }
    
}

uniqueFunction.isProcessedPO = (id) => 
{
    return new Promise((resolve, reject) => {
        try
        {
           db.verifyPOMaster(id).then(poMaster => {
            if(poMaster[0].posExist == 0)
            {
                db.verifyPODetails(id).then(poDetails => {
                    if(poDetails[0].poExist == 0)
                    {
                        return resolve(1)
                    }
                    else
                    {
                        return resolve(0)
                    }
                })
            }
            else
            {
                return resolve(0)
            }
           })
        }
        catch(e)
        {
            throw e
        }
    })
}

uniqueFunction.singleFileUpload = (fileObject, destinationBaseFolder, fileName, addiFolder) =>
{
    return new Promise((resolve, reject)=>{
        try{
            let addiFolderCreated = 1
            let newpath = destinationBaseFolder
            if(addiFolder != '')
            {
                let folders = addiFolder.split('/')
                let i = 0
                for(; i < folders.length; i++)
                {
                    try 
                    {
                        if (!fs.existsSync(newpath + '/' + folders[i])) 
                        {
                            fs.mkdirSync(newpath + '/' + folders[i]);
                            newpath = newpath + '/' + folders[i]
                        }
                        else
                        {
                            newpath = newpath + '/' + folders[i]
                        }
                    } 
                    catch (err) 
                    {
                        console.error(err);
                    }
                }
                if(parseInt(i) != folders.length)
                {
                    for( ; i < folders.length; i++)
                    {
                        try 
                        {
                            if (!fs.existsSync(folders[i])) 
                            {
                                fs.rmdirSync(folders[i]);
                            }
                        } 
                        catch (err) 
                        {
                            console.error(err);
                        }
                    }
                    addiFolderCreated = 0
                }
            }
            if(addiFolderCreated == 1)
            {
                try
                {
                    let file = fileObject
                        let filepath = file.poFile.filepath;
                        newpath = newpath + '/';
                        newpath += fileName;
                        console.log(newpath,filepath)
                        fs.copyFile(filepath, newpath, function (err) {
                            if(err)
                            {
                                throw err 
                            }
                            fs.unlinkSync(filepath)
                            return  resolve(true)
                        });
                }
                catch(e)
                {
                    throw e
                }
            }
        }
        catch(e)
        { 
            console.log(e)
        }
    });
}

uniqueFunction.deleteUploadedFile = (destinationBaseFolder, fileName, addiFolder) =>
{
    return new Promise((resolve, reject)=>{
        try{
            let newpath = destinationBaseFolder
            if(addiFolder != '')
            {
                let folders = addiFolder.split('/')
                let i = 0
                for(; i < folders.length; i++)
                {
                    try 
                    {
                        if (fs.existsSync(newpath + '/' + folders[i])) 
                        {
                            fs.unlinkSync(newpath + '/' + folders[i] + '/' + fileName)
                            let dir = newpath + '/' + folders[i]
                            fs.readdir(dir, (err, files) => {
                                if(files.length == 0)
                                {
                                    fs.rmdirSync(dir);
                                }
                            });                            
                            newpath = newpath + '/' + folders[i]
                            return resolve(true)
                        }
                        else
                        {
                            return resolve("File not exist")
                        }
                    } 
                    catch (err) 
                    {
                        console.error(err);
                    }
                }
            }
        }
        catch(e)
        { 
            console.log(e)
        }
    });
}

module.exports = uniqueFunction