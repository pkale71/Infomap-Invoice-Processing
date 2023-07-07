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
                        convert_tz(im.verified_on,'+00:00','+05:30') AS verified_on, im.verified_by_id, vb.fullname AS verifiedName, vb.uuid AS verifiedUuid,
                        cb.fullname AS createName, cb.uuid AS createUuid, pb.fullname AS processedName, pb.uuid AS processedUuid
                        FROM invoice_master im
                                   LEFT JOIN vendor v ON v.id = im.vendor_id
                                   LEFT JOIN invoice_status s ON s.id = im.invoice_status_id
                                   LEFT JOIN user cb ON cb.id = im.created_by_id
                                   LEFT JOIN user pb ON pb.id = im.processed_by_id
                                   LEFT JOIN user vb ON vb.id = im.verified_by_id
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

db.getInvoice = (invoiceUuid) => 
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
            convert_tz(im.verified_on,'+00:00','+05:30') AS verified_on, im.verified_by_id,
            cb.fullname AS createName, cb.uuid AS createUuid, pb.fullname AS processedName, pb.uuid AS processedUuid, vb.fullname AS verifiedName, vb.uuid AS verifiedUuid,
                         id.uuid AS invoiceUuid, id.discount AS invoiceDiscount, id.cgst_amount, id.sgst_amount, id.igst_amount, 
                         id.gross_amount, id.gst_rate, id.base_amount AS invoiceBaseAmount, 
                         gm.tax_code, gm.description AS gstDescription, gm.uuid AS gstUuid,
                         pm.uuid AS poMasterUuid, pm.po_number, 
                         pd.uuid AS poDetailUuid, pd.sno, pd.month_period, pd.activity_text, pd.hsn_sac, 
                         ga.uuid AS glAccountUuid, ga.ledger_description, ga.account_number AS glAccountNumber
                                   FROM invoice_detail id
                                   LEFT JOIN gst_master gm ON gm.id = id.gst_master_id
								   LEFT JOIN po_master pm ON pm.id = id.po_master_id
                                   LEFT JOIN po_detail pd ON pd.id = id.po_detail_id
                                   LEFT JOIN gl_account ga ON ga.id = pd.gl_account_id
                                   LEFT JOIN invoice_master im ON im.id = id.invoice_id
                                   LEFT JOIN vendor v ON v.id = pm.vendor_id
                                   LEFT JOIN invoice_status s ON s.id = im.invoice_status_id
                                   LEFT JOIN user cb ON cb.id = im.created_by_id
                                   LEFT JOIN user pb ON pb.id = im.processed_by_id
                                   LEFT JOIN user vb ON vb.id = im.verified_by_id
                                   WHERE im.uuid = '${invoiceUuid}'
                                   ORDER BY id.id
                                   `
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

db.getIdAndStatus = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT im.id, s.name
            FROM invoice_master im
            LEFT JOIN invoice_status s ON s.id = im.invoice_status_id
            WHERE im.uuid = '${uuid}'`
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

db.deleteInvoiceDetails = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM invoice_detail WHERE invoice_id = ${id}`
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

db.updateInvoiceMaster = (uuid,vendorUuid, barCode, invoiceNumber, invoiceDate, isActive,baseAmount, discount, gstAmount, netAmount) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE invoice_master SET barcode = '${barCode}', vendor_id = (SELECT id FROM vendor WHERE uuid = '${vendorUuid}'), invoice_number = '${invoiceNumber}', invoice_date = '${invoiceDate}', base_amount = '${baseAmount}', discount = '${discount}', gst_amount = '${gstAmount}', net_amount = '${netAmount}', is_active = '${isActive}', invoice_status_id = (SELECT id FROM invoice_status WHERE name = 'Registered') WHERE uuid = '${uuid}'`

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

db.checkStatus = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
              let  sql = `SELECT is_active, created_on, verified_on, processed_on, invoice_status_id FROM invoice_master WHERE uuid = '${uuid}'`;
            pool.query(sql,(error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e){ console.log(e)}
        
    });
}

db.changeStatus = (sql, date) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            pool.query(sql, [date], (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }          
                return resolve(result);
            });
        }
        catch(e){ console.log(e)}
        
    });
}

module.exports = db