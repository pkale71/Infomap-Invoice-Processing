let pool = require('../databaseConnection/createconnection')
let db = {}

db.saveInvoiceDetail = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into invoice_detail (invoice_id, po_master_id, po_detail_id, gst_master_id, base_amount, discount, gst_rate, cgst_amount, sgst_amount, igst_amount, gross_amount, uuid) VALUES ('${ele.invoiceId}','${ele.poMasterId}','${ele.poDetailId}', (SELECT id FROM gst_master WHERE uuid = '${ele.gstMaster?.uuid}'),(SELECT amount FROM po_detail WHERE uuid = '${ele.poDetail?.uuid}'), '${ele.discount}', '${ele.gstRate}', '${ele.cgstAmount}','${ele.sgstAmount}','${ele.igstAmount}','${ele.grossAmount}', '${ele.uuid}')`

            pool.query(sql, (error, result) => 
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
// uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, createdOn, createdById
db.saveInvoiceMaster = (uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount, createdOn, createdById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into invoice_master (barcode, vendor_id, invoice_number, invoice_date, base_amount, discount, gst_amount, net_amount, created_on, created_by_id, is_active, invoice_status_id, uuid) VALUES ('${barCode}',(SELECT id FROM vendor WHERE uuid = '${vendorUuid}'),'${invoiceNumber}', '${invoiceDate}','${baseAmount}', '${discount}', '${gstAmount}', '${netAmount}',?,'${createdById}','${isActive}',(SELECT id FROM invoice_status WHERE name = 'Registered'), '${uuid}')`

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

db.getReturnUuid = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid
            FROM invoice_master
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

db.getPOIds = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id AS poMasterId, (SELECT id 
                FROM po_detail
                WHERE uuid = '${ele.poDetail?.uuid}') AS poDetailId
            FROM po_master
            WHERE uuid = '${ele.po?.uuid}'`
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

db.deleteInvoiceMaster = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM invoice_master WHERE id = ${id}`
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

db.poDetailsUpdate = (ids, modifyOn, modifyById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_detail SET modify_on = ?, modify_by_id = ${modifyById}, is_invoiced = 1 WHERE id IN (${ids})`
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

db.poStatusUpdate = (id, invoicedOn, invoicedById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET invoiced_on = ?, invoiced_by_id = ${invoicedById}, po_status_id = (SELECT IF(COUNT(id) = 0,(SELECT id FROM po_status WHERE name = 'Invoiced'),(SELECT id FROM po_status WHERE name = 'Partially-Invoiced')) 
            FROM po_detail WHERE po_master_id = ${id} AND is_invoiced = 0) WHERE id = ${id};`
            pool.query(sql, [invoicedOn], (error, result) => 
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

db.getInvoices = (vendorUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT  v.uuid AS vendorUuid, v.code AS vendorCode, v.name AS vendorName,
            im.uuid, im.barcode, im.base_amount, im.invoice_number, im.invoice_date, im.discount, im.gst_amount, im.net_amount, im.is_active,
            s.id AS invoiceStatusId, s.name AS invoiceStatusName, 
            (SELECT COUNT(id) FROM invoice_detail WHERE invoice_id = im.id) AS totalItems,
             convert_tz(im.created_on,'+00:00','+05:30') AS created_on,  
                        im.created_by_id, convert_tz(im.processed_on,'+00:00','+05:30') AS processed_on, im.processed_by_id,
                        cb.fullname AS createName, cb.uuid AS createUuid, pb.fullname AS processedName, pb.uuid AS processedUuid
                        FROM invoice_master im
                                   LEFT JOIN vendor v ON v.id = im.vendor_id
                                   LEFT JOIN invoice_status s ON s.id = im.invoice_status_id
                                   LEFT JOIN user cb ON cb.id = im.created_by_id
                                   LEFT JOIN user pb ON pb.id = im.processed_by_id
                                   WHERE im.is_active = 1
                                   `

            if(vendorUuid?.length > 4)
            {
                sql = sql + ` AND v.uuid = '${vendorUuid}'`
            }

            sql = sql + ` ORDER BY im.created_on desc`
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