let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveGlAccount = (uuid, accountNumber, ledgerDescription, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO gl_account (ledger_description, created_on, created_by_id, uuid, account_number, is_active) VALUES ('${ledgerDescription}',  ?, ${createdById}, '${uuid}', '${accountNumber}', ${isActive})`
            pool.query(sql, [createdOn], (error, result) => 
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

db.updateGlAccount = (uuid, accountNumber, ledgerDescription, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE gl_account SET ledger_description = '${ledgerDescription}', modify_on = ?, modify_by_id = ${modifyById}, account_number = '${accountNumber}', is_active = ${isActive} WHERE uuid = '${uuid}'`
            pool.query(sql, [modifyOn], (error, result) => 
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

db.getGlAccounts = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid, ledger_description, account_number, created_on, created_by_id, modify_on, modify_by_id, is_active
            FROM gl_account
            WHERE is_active = 1
            ORDER BY ledger_description`
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

db.deleteGlAccount = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE gl_account SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
            pool.query(sql, [modifyOn], (error, result) => 
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
            FROM gl_account
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