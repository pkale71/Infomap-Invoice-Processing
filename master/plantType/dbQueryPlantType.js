let pool = require('../../databaseConnection/createconnection')
let db = {}

db.savePlantType = (name, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO plant_type (name, created_on, created_by_id, is_active) VALUES (?,  ?, ?, ?)`
            pool.query(sql,[name, createdOn, createdById, isActive],(error, result) => 
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

db.updatePlantType = (name, modifyOn, modifyById, id, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE plant_type SET name = ?, modify_on = ?, modify_by_id = ?, is_active = ? WHERE id = ?`
            pool.query(sql,[name, modifyOn, modifyById, isActive, id],(error, result) => 
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

db.getPlantTypes = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name, convert_tz(created_on,'+00:00','+05:30') AS created_on, created_by_id, convert_tz(modify_on,'+00:00','+05:30') AS modify_on, modify_by_id, is_active AS isActive 
            FROM plant_type
            WHERE is_active = 1
            ORDER BY name`
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

db.deletePlantType = (id, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE plant_type SET is_active = ${isActive} WHERE id = ${id}`
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