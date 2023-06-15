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
                WHERE name = '${ele.city}' AND country_id = (SELECT id FROM country WHERE code = '${ele.country}')), '${ele.postalCode}')`

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

// db.updateClient = (uuid, code, name, address, landmark, gstNumber, panNumber, cinNumber, msmeNumber, countryId, stateId, cityId, modifyOn, modifyById, isActive) => 
// {
//     return new Promise((resolve, reject) => 
//     {
//         try
//         {
//             let sql = `UPDATE client SET code = '${code}', modify_on = ?, modify_by_id = ${modifyById}, name = '${name}', is_active = ${isActive}, address = '${address}', landmark = '${landmark}', gst_number = '${gstNumber}', pan_number = '${panNumber}', cin_number = '${cinNumber}', msme_number = '${msmeNumber}', country_id = ${countryId}, state_id = ${stateId}, city_id = ${cityId} WHERE uuid = '${uuid}'`
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

// db.getClients = () => 
// {
//     return new Promise((resolve, reject) => 
//     {
//         try
//         {
//             let sql = `SELECT c.uuid, convert_tz(c.created_on,'+00:00','+05:30') AS created_on, c.created_by_id, convert_tz(c.modify_on,'+00:00','+05:30') AS modify_on, 
//             c.modify_by_id, c.is_active, c.code, c.name, c.address, c.landmark, c.gst_number, c.pan_number, c.cin_number, c.msme_number,
//             co.id AS countryId, co.name AS countryName, s.id AS stateId, s.name AS stateName, cy.id AS cityId, cy.name AS cityName
//             FROM client c
//             LEFT JOIN country co ON co.id = c.country_id
//             LEFT JOIN state s ON s.id = c.state_id
//             LEFT JOIN city cy ON cy.id = c.city_id
//             WHERE c.is_active = 1
//             ORDER BY c.name`
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