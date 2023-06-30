let pool = require('../../databaseConnection/createconnection')
let db = {}

db.getUnique = (sql) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            //console.log(sql)
            pool.query(sql,(error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                //console.log(sql)
                //pool.release()       
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e
        }
    })
}

db.selectToken = (token) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT user_id AS userId, convert_tz(auth_time,'+00:00','+05:30') AS authTime, auth_token AS authToken FROM auth_data WHERE auth_token = ?`
            pool.query(sql,[token],(error, result) => 
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

db.getUserById = (userId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            pool.query(`SELECT u.uuid, u.password, u.id, u.fullName,
            u.user_type_id, convert_tz(u.last_logged_in,'+00:00','+05:30') AS last_logged_in, ut.name AS user_type_name, ut.code AS user_type_code
            FROM user u
            LEFT JOIN user_type ut ON ut.id = u.user_type_id
            WHERE u.id = ? AND u.is_active = 1`, [userId], (error, users) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(users);
            });
        }
        catch(e)
        { 
            console.log(e)
        }
    });
};

db.verifyPODetails = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT COUNT(sno) AS poExist FROM po_detail 
            WHERE ((sno IS NULL OR (sno = 0)) OR
            (activity_text IS NULL OR activity_text = '') OR 
            (month_period IS NULL OR month_period = '') OR (hsn_sac IS NULL OR hsn_sac = '') OR (gl_account_id IS NULL OR gl_account_id = 0) OR (profit_center_id IS NULL OR profit_center_id = 0) OR (cost_center_id IS NULL  OR cost_center_id  = 0) OR (amount IS NULL OR amount = 0))
            AND po_master_id = ${id}`
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

db.verifyPOMaster = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT COUNT(po_number) AS posExist FROM po_master 
            WHERE ((po_number IS NULL OR (po_number = '')) OR
            (vendor_id IS NULL OR vendor_id = 0) OR 
            (plant_id IS NULL OR plant_id = 0) OR (material_group_id IS NULL OR material_group_id = 0) OR 
            (purchasing_group_id IS NULL OR purchasing_group_id = 0) OR (total_amount IS NULL OR total_amount = 0) OR
            (is_active IS NULL  OR is_active  = 0))
            AND id = ${id}`
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