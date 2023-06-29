let pool = require('../../databaseConnection/createconnection')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let db = {}

db.savePOs = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_detail (sno, po_master_id, activity_text, month_period, amount, gl_account_id, is_invoiced, created_on, created_by_id, uuid) VALUES ('${ele['Line ITEMS']}','${ele.poId}', '${uniqueFunction.manageSpecialCharacter(ele['Short Text'])}','${ele['Month or Period'] ? ele['Month or Period'] : null }', '${ele['Net Price']}',(SELECT id FROM gl_account WHERE account_number = '${ele['G/L Account']}'), 0, ?, '${ele.createdById}', '${ele.uuid}')`

            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
                    console.log(error.sqlMessage)
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went worng';
                    return resolve(ele);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.savePOMaster = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_master (po_number, vendor_id, is_active, purchasing_group_id, plant_id, po_status_id, created_on, created_by_id, uuid, total_amount) VALUES ('${ele['Purchasing Document']}', (SELECT id FROM vendor WHERE code = '${ele.vendorCode}'), ${ele.active}, (SELECT id FROM purchasing_group WHERE code = '${ele['Purchasing Group']}'), (SELECT id FROM plant WHERE code = '${ele['Plant']}'), 1, ?, '${ele.createdById}', '${ele.uuid}', 0)`

            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went worng';
                    return resolve(ele);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.updatePOMasterAmount = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET total_amount = '${ele.amount}' WHERE id = '${ele.poId}'`

            pool.query(sql, (error, result) => 
            {
                if(error)
                {
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went worng';
                    return resolve(ele);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getIds = (name, code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id AS vendorId, (SELECT id FROM purchasing_group WHERE code = '${ele['Purchasing Group']}') AS purchasingGroupId, (SELECT id FROM plant WHERE code = '${ele['Plant']}') AS plantId, (SELECT id FROM gl_account WHERE code = '${ele['G/L Account']}') AS glAccountId
            FROM vendor
            WHERE code = '${ele.vendorCode}'`
            pool.query(sql,(error, result) => 
            {
                if(error)
                { 
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getVendorId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM vendor
            WHERE code = '${code}'`
            pool.query(sql,(error, result) => 
            {
                if(error)
                { 
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getPlantId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM plant
            WHERE code = '${code}'`
            pool.query(sql,(error, result) => 
            {
                if(error)
                { 
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getPurchasingGroupId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM purchasing_group
            WHERE code = '${code}'`
            pool.query(sql,(error, result) => 
            {
                if(error)
                { 
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getGlAccountId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM gl_account
            WHERE account_number = '${code}'`
            pool.query(sql,(error, result) => 
            {
                if(error)
                { 
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.getReturnUuid = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid
            FROM vendor
            WHERE id = ${id}`
            pool.query(sql,(error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

module.exports = db