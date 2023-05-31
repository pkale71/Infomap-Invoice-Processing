let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveProfitCenter = (uuid, code, description, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO profit_center (description, created_on, created_by_id, uuid, code, is_active) VALUES ('${description}',  ?, ${createdById}, '${uuid}', '${code}', ${isActive})`
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

db.updateProfitCenter = (uuid, code, description, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE profit_center SET description = '${description}', modify_on = ?, modify_by_id = ${modifyById}, code = '${code}', is_active = ${isActive} WHERE uuid = '${uuid}'`
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

db.getProfitCenters = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid, description, code, convert_tz(created_on,'+00:00','+05:30') AS created_on, created_by_id, convert_tz(modify_on,'+00:00','+05:30') AS modify_on, modify_by_id, is_active
            FROM profit_center
            WHERE is_active = 1
            ORDER BY description`
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

db.deleteProfitCenter = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE profit_center SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM profit_center
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