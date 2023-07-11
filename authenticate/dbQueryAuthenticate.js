let pool = require('../databaseConnection/createconnection')
let db = {}

db.getUserByEmail = (email) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT u.id, u.password, u.uuid, u.fullName, 
            u.user_type_id, ut.name AS user_type_name, ut.code AS user_type_code, convert_tz(u.last_logged_in,'+00:00','+05:30') AS last_logged_in, u.is_active
            FROM user u
            LEFT JOIN user_type ut ON ut.id = u.user_type_id
            WHERE u.email = '${email}' AND u.is_active =1`
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

db.insertLastLogin = (authTime, userId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `UPDATE user SET last_logged_in = ? WHERE id = ${userId}`
            pool.query(sql, [authTime], (error, result) => 
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
            console.log(e)
        }
    });
};

db.insertToken = (authtoken, userId, authTime) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `INSERT INTO auth_data (auth_token, user_id, auth_time) VALUES ('${authtoken}',  ${userId}, ?)`
            pool.query(sql, [authTime], (error, result) =>
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
            console.log(e)
        }
    });
};

db.deleteToken = (token) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `DELETE FROM auth_data WHERE auth_token = '${token}'`
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
            console.log(e)
        }
    });
};

db.updateUser = (userId,password) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            pool.query('UPDATE user SET password = ? WHERE id = ?', [password,userId], (error, result) => 
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
            console.log(e)
        }            
    });
};

module.exports = db