let pool = require('../../databaseConnection/createconnection')
let db = {}

db.saveTdsMaster = (uuid, description, taxSection, rate, glAccountId, gstMasterId, createdOn, createdById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO tds_master (description, created_on, created_by_id, uuid, tax_section, is_active, rate, gl_account_id, gst_master_id) VALUES ('${description}',  ?, ${createdById}, '${uuid}', '${taxSection}', ${isActive}, ${rate}, ${glAccountId}, ${gstMasterId})`
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

db.updateTdsMaster = (uuid, description, taxSection, rate, glAccountId, gstMasterId, modifyOn, modifyById, isActive) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE tds_master SET description = '${description}', modify_on = ?, modify_by_id = ${modifyById}, tax_section = '${taxSection}', is_active = ${isActive}, rate = ${rate}, gl_account_id = ${glAccountId}, gst_master_id = ${gstMasterId} WHERE uuid = '${uuid}'`
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

db.getTdsMasters = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tm.uuid, tm.description, tm.tax_section, convert_tz(tm.created_on,'+00:00','+05:30') AS created_on, created_by_id,
            convert_tz(tm.modify_on,'+00:00','+05:30') AS modify_on, tm.modify_by_id, tm.is_active, tm.rate, ga.uuid AS glAccUuid, ga.account_number, ga.ledger_description, 
            gm.uuid AS gstUuid, gm.tax_code, gm.description AS gstDescription
                       FROM tds_master tm
                       LEFT JOIN gl_account ga ON ga.id = tm.gl_account_id
                       LEFT JOIN gst_master gm ON gm.id = tm.gst_master_id
                       WHERE tm.is_active = 1
                       ORDER BY tm.id`
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

db.deleteTdsMaster = (uuid, isActive, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE tds_master SET modify_on = ?, modify_by_id = ${modifyById}, is_active = ${isActive} WHERE uuid = '${uuid}'`
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
            FROM tds_master
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

db.getIdsOfAccountAndGst = (gstMasterUuid, glAccountUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT (SELECT id FROM gl_account WHERE uuid = '${glAccountUuid}' ) AS glAccountId, id AS gstMasterId FROM gst_master WHERE uuid = '${gstMasterUuid}'`
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