let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveCity = (name, createdOn, createdById, countryId, stateId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO city (name, created_on, created_by_id, country_id, state_id) VALUES ('${name}', ?, ${createdById}, ${countryId}, ${stateId})`
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

db.updateCity = (name, modifyOn, modifyById, id, countryId, stateId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE city SET name = '${name}', modify_on = ?, modify_by_id = ${modifyById} WHERE id = ${id} AND country_id = ${countryId} AND state_id = ${stateId}`
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

db.getCities = (countryId, stateId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.name, convert_tz(c.created_on,'+00:00','+05:30') AS created_on, c.created_by_id, 
            convert_tz(c.modify_on,'+00:00','+05:30') AS modify_on, c.modify_by_id,
            s.name AS stateName, s.id AS stateId,
            cn.name AS countryName, cn.id AS countryId
            FROM city c 
            LEFT JOIN state s ON s.id = c.state_id
            LEFT JOIN country cn ON cn.id = c.country_id
            WHERE c.country_id = ${countryId} AND c.state_id = ${stateId} 
            ORDER BY c.name`
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

db.deleteCity = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM city WHERE id = ${id}`
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
            let sql = `SELECT name FROM country WHERE id = ${countryId};`
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

db.stateIsExist = (stateId, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT name FROM state WHERE id = ${stateId} 
            AND country_id = ${countryId};`
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
module.exports = db