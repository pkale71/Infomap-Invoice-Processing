let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveClient = (uuid, code, name, address, landmark, gstNumber, panNumber, cinNumber, msmeNumber, countryId, stateId, cityId, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO client (code, created_on, created_by_id, uuid, name, is_active, address, landmark, gst_number, pan_number, cin_number, msme_number, country_id, state_id, city_id) VALUES ('${code}',  ?, ${createdById}, '${uuid}', '${name}', ${isActive}, '${address}', '${landmark}', '${gstNumber}', '${panNumber}', '${cinNumber}', '${msmeNumber}', ${countryId}, ${stateId}, ${cityId})`
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

db.updateClient = (uuid, code, name, address, landmark, gstNumber, panNumber, cinNumber, msmeNumber, countryId, stateId, cityId, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE client SET code = '${code}', modify_on = ?, modify_by_id = ${modifyById}, name = '${name}', is_active = ${isActive}, address = '${address}', landmark = '${landmark}', gst_number = '${gstNumber}', pan_number = '${panNumber}', cin_number = '${cinNumber}', msme_number = '${msmeNumber}', country_id = ${countryId}, state_id = ${stateId}, city_id = ${cityId} WHERE uuid = '${uuid}'`
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

db.getClients = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.uuid, convert_tz(c.created_on,'+00:00','+05:30') AS created_on, c.created_by_id, convert_tz(c.modify_on,'+00:00','+05:30') AS modify_on, 
            c.modify_by_id, c.is_active, c.code, c.name, c.address, c.landmark, c.gst_number, c.pan_number, c.cin_number, c.msme_number,
            co.id AS countryId, co.name AS countryName, s.id AS stateId, s.name AS stateName, cy.id AS cityId, cy.name AS cityName
            FROM client c
            LEFT JOIN country co ON co.id = c.country_id
            LEFT JOIN state s ON s.id = c.state_id
            LEFT JOIN city cy ON cy.id = c.city_id
            WHERE c.is_active = 1
            ORDER BY c.name`
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

db.deleteClient = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE client SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM client
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