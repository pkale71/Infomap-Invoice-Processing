let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveState = (name, createdOn, createdById, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO state (name, created_on, created_by_id, country_id) VALUES (?,  ?, ?, ?)`
            pool.query(sql,[name, createdOn, createdById, countryId],(error, result) => 
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

db.updateState = (name, modifyOn, modifyById, id, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE state SET name = ?, modify_on = ?, modify_by_id = ? WHERE id = ? AND country_id = ?`
            pool.query(sql,[name, modifyOn, modifyById, id, countryId],(error, result) => 
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

db.getStates = (countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id, s.name, convert_tz(s.created_on,'+00:00','+05:30') AS created_on, s.created_by_id, 
            convert_tz(s.modify_on,'+00:00','+05:30') AS modify_on, s.modify_by_id,
            c.name AS countryName, c.id AS countryId
            FROM state s 
            LEFT JOIN country c ON c.id = s.country_id
            WHERE s.country_id = ?
            ORDER BY s.name`
            pool.query(sql, [countryId], (error, result) => 
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

db.deleteState = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM state WHERE id = ${id}`
            pool.query(sql, (error, result) => 
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

db.countryIsExist = (countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT name FROM country WHERE id = ?;`
            pool.query(sql,[countryId],(error, result) => 
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