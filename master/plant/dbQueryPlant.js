let pool = require('../../databaseConnection/createconnection')
let db = {}

db.savePlant = (uuid, code, name, address, postalCode, shortCode, clientId, plantTypeId, countryId, stateId, cityId, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO plant (code, created_on, created_by_id, uuid, name, is_active, address, postal_code, short_code, country_id, state_id, city_id, client_id, plant_type_id) VALUES ('${code}',  ?, ${createdById}, '${uuid}', '${name}', ${isActive}, '${address}', '${postalCode}', '${shortCode}', ${countryId}, ${stateId}, ${cityId}, ${clientId}, ${plantTypeId})`
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

db.updatePlant = (uuid, code, name, address, postalCode, shortCode, clientId, plantTypeId, countryId, stateId, cityId, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE plant SET code = '${code}', modify_on = ?, modify_by_id = ${modifyById}, name = '${name}', is_active = ${isActive}, address = '${address}', postal_code = '${postalCode}', short_code = '${shortCode}', client_id = ${clientId}, plant_type_id = '${plantTypeId}', country_id = ${countryId}, state_id = ${stateId}, city_id = ${cityId} WHERE uuid = '${uuid}'`
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

db.getPlants = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.uuid AS clientUuid, c.name AS clientName, c.code AS clientCode, p.uuid, convert_tz(p.created_on,'+00:00','+05:30') AS created_on, p.created_by_id,
            convert_tz(p.modify_on,'+00:00','+05:30') AS modify_on, p.modify_by_id, p.is_active, p.code, p.name, p.address, p.short_code, p.postal_code,
            pt.id AS plantTypeId, pt.name AS plantTypeName, co.id AS countryId, co.name AS countryName, s.id AS stateId, s.name AS stateName, cy.id AS cityId, cy.name AS cityName
                       FROM plant p
                       LEFT JOIN country co ON co.id = p.country_id
                       LEFT JOIN state s ON s.id = p.state_id
                       LEFT JOIN city cy ON cy.id = p.city_id
                       LEFT JOIN client c ON c.id = p.client_id
                       LEFT JOIN plant_type pt ON pt.id = p.plant_type_id
                       WHERE p.is_active = 1
                       ORDER BY p.name`
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

db.deletePlant = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE plant SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM plant
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

db.getClientId = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM client
            WHERE uuid = '${uuid}'`
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