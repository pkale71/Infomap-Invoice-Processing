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
            let sql = `SELECT user_id AS userId, auth_time AS authTime, auth_token AS authToken FROM auth_data WHERE auth_token = ?`
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
            u.user_type_id, u.last_logged_in, ut.name AS user_type_name, ut.code AS user_type_code
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

db.verifyInvoiceMaster = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT COUNT(barcode) AS invoiceExist FROM invoice_master 
            WHERE ((barcode IS NULL OR (barcode = '')) OR
            (vendor_id IS NULL OR vendor_id = 0) OR 
            (invoice_number IS NULL OR invoice_number = 0) OR (invoice_date IS NULL OR invoice_date = 0) OR 
            (base_amount IS NULL OR base_amount = 0) OR (discount IS NULL OR discount = 0) OR
            (gst_amount IS NULL OR gst_amount = 0) OR (net_amount IS NULL OR net_amount = 0) OR
            (payment_terms IS NULL OR payment_terms = 0) OR (posting_date IS NULL OR posting_date = 0) OR
            (base_line_date IS NULL OR base_line_date = 0) OR (currency IS NULL OR currency = '') OR
            (document_header_text IS NULL OR document_header_text = '') OR (with_tax_amount IS NULL OR with_tax_amount = 0) OR
            (invoice_status_id IS NULL OR invoice_status_id = 0) OR (created_on IS NULL OR created_on = 0) OR
            (created_by_id IS NULL OR created_by_id = 0) OR (verified_by_id IS NULL OR verified_by_id = 0) OR
            (verified_on IS NULL OR verified_on = 0) OR OR (gross_payable_amount IS NULL OR gross_payable_amount = 0)
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

db.verifyInvoiceDetails = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT COUNT(invoice_id) AS invoiceExist FROM invoice_detail 
            WHERE (invoice_id IS NULL OR invoice_id = 0) OR
            (po_master_id IS NULL OR po_master_id = 0) OR
            (po_detail_id IS NULL OR po_detail_id = 0) OR
            (gst_master_id IS NULL OR gst_master_id = 0) OR 
            (base_amount IS NULL OR base_amount = 0) OR (discount IS NULL OR discount = 0) OR 
            (tds_master_id IS NULL OR tds_master_id = 0) OR (gst_rate IS NULL OR gst_rate = 0) OR 
            (cgst_amount IS NULL  OR cgst_amount  = 0) OR (sgst_amount IS NULL OR sgst_amount = 0) OR
            (igst_amount IS NULL  OR igst_amount  = 0) OR (gross_amount IS NULL OR gross_amount = 0) OR
            (tds_rate IS NULL OR tds_rate = 0) OR (with_tax_amount IS NULL OR with_tax_amount = 0) OR
            (invoice_payable_amount IS NULL OR invoice_payable_amount = 0) 
            AND invoice_id = ${id}`
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