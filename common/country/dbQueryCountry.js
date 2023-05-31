let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveCountry = (name, createdOn, createdById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO country (name, created_on, created_by_id) VALUES (?,  ?, ?)`
            pool.query(sql,[name, createdOn, createdById],(error, result) => 
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

db.updateCountry = (name, modifyOn, modifyById, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE country SET name = ?, modify_on = ?, modify_by_id = ? WHERE id = ?`
            pool.query(sql,[name, modifyOn, modifyById, id],(error, result) => 
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

db.getCountries = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id, name, convert_tz(created_on,'+00:00','+05:30') AS created_on, created_by_id, convert_tz(modify_on,'+00:00','+05:30') AS modify_on, modify_by_id 
            FROM country
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

db.deleteCountry = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM country WHERE id = ${id}`
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