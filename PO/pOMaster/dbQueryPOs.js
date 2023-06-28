let pool = require('../../databaseConnection/createconnection')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let db = {}

db.savePOs = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_detail (sno, po_master_id, activity_text, month_period, amount, gl_account_id, is_invoiced, created_on, created_by_id, uuid) VALUES ('${ele['Line ITEMS']}','${ele.poId}', '${uniqueFunction.manageSpecialCharacter(ele['Short Text'])}','${ele['Month or Period']}', '${ele['Net Price']}',(SELECT id FROM gl_account WHERE account_number = '${ele['G/L Account']}'), 0, ?, '${ele.createdById}', '${ele.uuid}')`

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

db.savePOMaster = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_master (po_number, vendor_id, is_active, purchasing_group_id, plant_id, po_status_id, created_on, created_by_id, uuid, total_amount) VALUES ('${ele['Purchasing Document']}', (SELECT id FROM vendor WHERE code = '${ele.vendorCode}'), ${ele.active}, (SELECT id FROM purchasing_group WHERE code = '${ele['Purchasing Group']}'), (SELECT id FROM plant WHERE code = '${ele['Plant']}'), 1, ?, '${ele.createdById}', '${ele.uuid}', 0)`

            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
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

db.updatePOMasterAmount = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET total_amount = '${ele.amount}' WHERE id = '${ele.poId}'`

            pool.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getIds = (name, code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id AS vendorId, (SELECT id FROM purchasing_group WHERE code = '${ele['Purchasing Group']}') AS purchasingGroupId, (SELECT id FROM plant WHERE code = '${ele['Plant']}') AS plantId, (SELECT id FROM gl_account WHERE code = '${ele['G/L Account']}') AS glAccountId
            FROM vendor
            WHERE code = '${ele.vendorCode}'`
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

db.saveVendor = (uuid, code, name, addressLine1, addressLine2, addressLine3, addressLine4, email1, email2, email3, gstNumber, panNumber, faxNumber, msmeNumber, countryId, stateId, cityId, clientId, createdOn, postalCode, corporateGroup, contact1, contact2, telephoneExchange, industryType, accountGroup, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into vendor (code, name, is_active, email1, email2, email3, account_group, corporate_group, address_line1, address_line2, address_line3, address_line4, contact1, contact2, gst_number, pan_number, fax_number, industry_type, created_on, created_by_id, uuid, telephone_exchange, country_id, city_id, postal_code, msme_number, state_id, client_id) VALUES ('${code}', '${uniqueFunction.manageSpecialCharacter(name)}', ${isActive}, '${email1}', '${email2}', '${email3}', '${accountGroup}', '${corporateGroup}', '${uniqueFunction.manageSpecialCharacter(addressLine1)}', '${uniqueFunction.manageSpecialCharacter(addressLine2)}', '${uniqueFunction.manageSpecialCharacter(addressLine3)}', '${uniqueFunction.manageSpecialCharacter(addressLine4)}', '${contact1}', '${contact2}', '${gstNumber}', '${panNumber}', '${faxNumber}', '${industryType}', ?, '${createdById}', '${uuid}', '${telephoneExchange}', ${countryId}, 
            ${cityId}, '${postalCode}', '${msmeNumber}', ${stateId}, ${clientId} )`

            pool.query(sql, [createdOn], (error, result) => 
            {
                if(error)
                {
                    //console.log(sql)
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
            let sql = `UPDATE vendor SET  modify_on = ?, modify_by_id = ${modifyById}, name = '${uniqueFunction.manageSpecialCharacter(name)}', is_active = ${isActive}, address_line1 = '${uniqueFunction.manageSpecialCharacter(addressLine1)}', address_line2 = '${uniqueFunction.manageSpecialCharacter(addressLine2)}', address_line3 = '${uniqueFunction.manageSpecialCharacter(addressLine3)}', address_line4 = '${uniqueFunction.manageSpecialCharacter(addressLine4)}', email1 = '${email1}', email2 = '${email2}', email3 = '${email3}', gst_number = '${gstNumber}', pan_number = '${panNumber}', fax_number = '${faxNumber}', msme_number = '${msmeNumber}', country_id = ${countryId}, state_id = ${stateId}, city_id = ${cityId}, client_id = ${clientId}, account_group = '${accountGroup}', corporate_group = '${corporateGroup}', postal_code = '${postalCode}', industry_type = '${industryType}', contact1 = '${uniqueFunction.manageSpecialCharacter(contact1)}', contact2 = '${uniqueFunction.manageSpecialCharacter(contact2)}', telephone_exchange = '${telephoneExchange}' WHERE uuid = '${uuid}'`
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

db.deleteVendor = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE vendor SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM vendor
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

db.getMappedVendors = (clientUuid) => 
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
                       WHERE v.is_active = 1 `

            if(clientUuid?.length > 4)
            {
                sql = sql + ` AND c.uuid = '${clientUuid}'`
            }
            else
            {
                sql = sql + ` AND v.client_id IS NOT NULL`
            }

            sql = sql + ` ORDER BY v.name`

            // console.log(sql)

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