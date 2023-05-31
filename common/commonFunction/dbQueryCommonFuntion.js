let pool = require('../../databaseConnection/createconnection')
let db = {}

db.getUnique = (sql) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
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
module.exports = db