let pool = require('../databaseConnection/createconnection')
let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
let db = {}

db.saveVendors = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into vendor (code, name, is_active, email1, email2, email3, account_group, corporate_group, address_line1, address_line2, address_line3, address_line4, contact1, contact2, gst_number, pan_number, fax_number, industry_type, created_on, created_by_id, uuid, telephone_exchange, country_id, city_id, postal_code) VALUES ('${ele.code}', '${uniqueFunction.manageSpecialCharacter(ele.name)}', ${ele.active}, '${ele.email1}', '${ele.email2}', '${ele.email3}', '${ele.accountGroup}', '${ele.corporateGroup}', '${uniqueFunction.manageSpecialCharacter(ele.addressLine1)}', '${uniqueFunction.manageSpecialCharacter(ele.addressLine2)}', '${uniqueFunction.manageSpecialCharacter(ele.addressLine3)}', '${uniqueFunction.manageSpecialCharacter(ele.addressLine4)}', '${ele.contact1}', '${ele.contact2}', '${ele.gstNumber}', '${ele.panNumber}', '${ele.faxNumber}', '${ele.industryType}', ?, '${ele.createdById}', '${ele.uuid}', '${ele.telephoneExchange}', (SELECT id FROM country WHERE code = '${ele.country}'), 
            (SELECT id
                FROM city
                WHERE name = '${uniqueFunction.manageSpecialCharacter(ele.city)}' AND country_id = (SELECT id FROM country WHERE code = '${ele.country}')), '${ele.postalCode}')`

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

db.getCityId = (name, code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM city
            WHERE name = '${name}' AND country_id = (SELECT id FROM country WHERE code = '${code}')`
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

db.getVendors = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.uuid AS clientUuid, c.name AS clientName, c.code AS clientCode, v.uuid, v.code, v.name, convert_tz(v.created_on,'+00:00','+05:30') AS created_on,
            v.created_by_id, convert_tz(v.modify_on,'+00:00','+05:30') AS modify_on, v.modify_by_id, v.is_active, v.gst_number, v.pan_number, v.msme_number, v.account_group, v.corporate_group,
            v.address_line1, v.address_line2, v.address_line3, v.address_line4, v.contact1, v.contact2, v.email1, v.email2, v.email3, v.fax_number, v.industry_type, v.postal_code, v.telephone_exchange,
                       co.id AS countryId, co.name AS countryName, co.code AS countryCode, s.id AS stateId, s.name AS stateName, cy.id AS cityId, cy.name AS cityName
                       FROM vendor v
                       LEFT JOIN country co ON co.id = v.country_id
                       LEFT JOIN state s ON s.id = v.state_id
                       LEFT JOIN city cy ON cy.id = v.city_id
                       LEFT JOIN client c ON c.id = v.client_id
                       WHERE v.is_active = 1
                       ORDER BY v.name`
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

db.updateVendor = (uuid, name, addressLine1, addressLine2, addressLine3, addressLine4, email1, email2, email3, gstNumber, panNumber, faxNumber, msmeNumber, countryId, stateId, cityId, clientId, modifyOn, postalCode, corporateGroup, contact1, contact2, telephoneExchange, industryType, accountGroup, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE vendor SET  modify_on = ?, modify_by_id = ${modifyById}, name = '${name}', is_active = ${isActive}, address_line1 = '${addressLine1}', address_line2 = '${addressLine2}', address_line3 = '${addressLine3}', address_line4 = '${addressLine4}', email1 = '${email1}', email2 = '${email2}', email3 = '${email3}', gst_number = '${gstNumber}', pan_number = '${panNumber}', fax_number = '${faxNumber}', msme_number = '${msmeNumber}', country_id = ${countryId}, state_id = ${stateId}, city_id = ${cityId}, client_id = ${clientId}, account_group = '${accountGroup}', corporate_group = '${corporateGroup}', postal_code = '${postalCode}', industry_type = '${industryType}', contact1 = '${contact1}', contact2 = '${contact2}', telephone_exchange = '${telephoneExchange}' WHERE uuid = '${uuid}'`
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

// db.deleteClient = (uuid, isActive, modifyOn, modifyById) => 
// {
//     return new Promise((resolve, reject) => 
//     {
//         try
//         {
//             let sql = `UPDATE client SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
//             pool.query(sql, [modifyOn], (error, result) => 
//             {
//                 if(error)
//                 {
//                     return reject(error);
//                 }          
//                 return resolve(result);
//             });
//         }
//         catch(e)
//         {
//             throw e
//         }
//     })
// }

// db.getReturnUuid = (id) => 
// {
//     return new Promise((resolve, reject) => 
//     {
//         try
//         {
//             let sql = `SELECT uuid
//             FROM client
//             WHERE id = ${id}`
//             pool.query(sql,(error, result) => 
//             {
//                 if(error)
//                 {
//                     return reject(error);
//                 }          
//                 return resolve(result);
//             });
//         }
//         catch(e)
//         {
//             throw e
//         }
//     })
// }
module.exports = db