let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveMaterialGroup = (uuid, code, description, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO material_group (description, created_on, created_by_id, uuid, code, is_active) VALUES ('${description}',  ?, ${createdById}, '${uuid}', '${code}', ${isActive})`
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

db.updateMaterialGroup = (uuid, code, description, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE material_group SET description = '${description}', modify_on = ?, modify_by_id = ${modifyById}, code = '${code}', is_active = ${isActive} WHERE uuid = '${uuid}'`
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

db.getMaterialGroups = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid, description, code, created_on, created_by_id, modify_on, modify_by_id, is_active
            FROM material_group
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

db.deleteMaterialGroup = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE material_group SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM material_group
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