let pool = require('../../databaseConnection/createconnection')
let uniqueFunction = require('../../common/commonFunction/uniqueSearchFunction')
let db = {}

db.savePOs = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_detail (sno, po_master_id, activity_text, month_period, amount, gl_account_id, is_invoiced, created_on, created_by_id, uuid) VALUES ('${ele['Line ITEMS']}','${ele.poId}', '${uniqueFunction.manageSpecialCharacter(ele['Short Text'])}' `
            if(!ele['Month or Period'])
            {
                sql = sql + `, null`
            }
            else
            {
                sql = sql + `, '${ele['Month or Period']}'`
            }
            sql = sql + `, '${ele['Net Price']}',(SELECT id FROM gl_account WHERE account_number = '${ele['G/L Account']}'), 0, ?, '${ele.createdById}', '${ele.uuid}')`
            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
                    console.log(error.sqlMessage)
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went wrong';
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
            let sql = `INSERT into po_master (po_number, vendor_id, is_active, purchasing_group_id, plant_id, po_status_id, created_on, created_by_id, uuid, total_amount, total_items) VALUES ('${ele['Purchasing Document']}', (SELECT id FROM vendor WHERE code = '${ele.vendorCode}'), ${ele.active}, (SELECT id FROM purchasing_group WHERE code = '${ele['Purchasing Group']}'), (SELECT id FROM plant WHERE code = '${ele['Plant']}'), 1, ?, '${ele.createdById}', '${ele.uuid}', 0, ${ele.totalItems})`


            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went wrong';
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
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went wrong';
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

db.getVendorId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM vendor
            WHERE code = '${code}'`
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

db.getPlantId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM plant
            WHERE code = '${code}'`
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

db.getPurchasingGroupId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM purchasing_group
            WHERE code = '${code}'`
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

db.getGlAccountId = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM gl_account
            WHERE account_number = '${code}'`
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

db.getReturnUuid = (poNumber) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uuid
            FROM po_master
            WHERE po_number = ${poNumber}`
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

db.getPOs = (vendorUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT mg.uuid AS materialUuid, mg.description AS materialDescription, mg.code AS materialCode, v.uuid AS vendorUuid, v.code AS vendorCode, v.name AS vendorName,
            pm.uuid, pm.po_number, pm.total_amount, pm.total_items AS totalItems, ps.id AS poStatusId, ps.name AS poStatusName, 
            (SELECT COUNT(id) FROM po_detail WHERE po_master_id = pm.id) AS savedItems,
             pm.created_on, pm.po_file_name AS poFileName, 
                        pm.created_by_id, pm.processed_on, pm.processed_by_id, pm.invoiced_on, pm.invoiced_by_id, pm.is_active,
                         pg.uuid AS purchaseUuid, pg.description AS purchaseDescription, pg.code AS purchaseCode,
                         p.uuid AS plantUuid, p.code AS plantCode, p.name AS plantName, cb.fullname AS createName, cb.uuid AS createUuid, pb.fullname AS processedName, pb.uuid AS processedUuid, ib.fullname AS invoicedName, ib.uuid AS invoicedUuid 
                                   FROM po_master pm
                                   LEFT JOIN purchasing_group pg ON pg.id = pm.purchasing_group_id
                                   LEFT JOIN vendor v ON v.id = pm.vendor_id
                                   LEFT JOIN plant p ON p.id = pm.plant_id
                                   LEFT JOIN po_status ps ON ps.id = pm.po_status_id
                                   LEFT JOIN material_group mg ON mg.id = pm.material_group_id
                                   LEFT JOIN user cb ON cb.id = pm.created_by_id
                                   LEFT JOIN user pb ON pb.id = pm.processed_by_id
                                   LEFT JOIN user ib ON ib.id = pm.invoiced_by_id
                                   WHERE pm.is_active = 1
                                   `

            if(vendorUuid?.length > 4)
            {
                sql = sql + ` AND v.uuid = '${vendorUuid}'`
            }

            sql = sql + ` ORDER BY pm.created_on desc`
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

db.getProcessedPOs = (vendorUuid, invoiceUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT mg.uuid AS materialUuid, mg.description AS materialDescription, mg.code AS materialCode, v.uuid AS vendorUuid, v.code AS vendorCode, v.name AS vendorName,
            pm.uuid, pm.po_number, pm.total_amount, pm.total_items AS totalItems, ps.id AS poStatusId, ps.name AS poStatusName, 
            (SELECT COUNT(id) FROM po_detail WHERE po_master_id = pm.id) AS savedItems,
             pm.created_on, pm.po_file_name AS poFileName, 
                        pm.created_by_id, pm.processed_on, pm.processed_by_id, pm.invoiced_on, pm.invoiced_by_id, pm.is_active,
                         pg.uuid AS purchaseUuid, pg.description AS purchaseDescription, pg.code AS purchaseCode,
                         p.uuid AS plantUuid, p.code AS plantCode, p.name AS plantName, cb.fullname AS createName, cb.uuid AS createUuid, pb.fullname AS processedName, pb.uuid AS processedUuid, ib.fullname AS invoicedName, ib.uuid AS invoicedUuid 
                                   FROM po_master pm
                                   LEFT JOIN purchasing_group pg ON pg.id = pm.purchasing_group_id
                                   LEFT JOIN vendor v ON v.id = pm.vendor_id
                                   LEFT JOIN plant p ON p.id = pm.plant_id
                                   LEFT JOIN po_status ps ON ps.id = pm.po_status_id
                                   LEFT JOIN material_group mg ON mg.id = pm.material_group_id
                                   LEFT JOIN user cb ON cb.id = pm.created_by_id
                                   LEFT JOIN user pb ON pb.id = pm.processed_by_id
                                   LEFT JOIN user ib ON ib.id = pm.invoiced_by_id
                                   WHERE pm.is_active = 1 AND (pm.po_status_id IN (SELECT id FROM po_status WHERE (name = 'Processed' OR  name = 'Partially-Invoiced')) `
                                   
            if(invoiceUuid?.length > 0)
            {
                sql = sql + ` OR pm.id IN (SELECT po_master_id FROM invoice_detail WHERE invoice_id = (SELECT id FROM invoice_master WHERE uuid = '${invoiceUuid}')))`
            }
            else
            {
                sql = sql + ')'
            }

            if(vendorUuid?.length > 4)
            {
                sql = sql + ` AND v.uuid = '${vendorUuid}'`
            }
            sql = sql + ` ORDER BY pm.processed_on desc`
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

db.getPO = (poUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT mg.uuid AS materialUuid, mg.description AS materialDescription, mg.code AS materialCode, v.uuid AS vendorUuid, v.code AS vendorCode, v.name AS vendorName,
            pm.uuid, pm.po_number, pm.total_amount, pm.total_items AS totalItems, ps.id AS poStatusId, ps.name AS poStatusName, 'Old' AS oper,
            (SELECT COUNT(id) FROM po_detail WHERE po_master_id = pm.id) AS savedItems,
             pm.created_on, pm.po_file_name AS poFileName, 
                        pm.created_by_id, pm.processed_on, pm.processed_by_id,
                        pm.invoiced_on, pm.invoiced_by_id, pm.is_active,
                         pg.uuid AS purchaseUuid, pg.description AS purchaseDescription, pg.code AS purchaseCode,
                         p.uuid AS plantUuid, p.code AS plantCode, p.name AS plantName, cb.fullname AS createName, cb.uuid AS createUuid, 
                         pb.fullname AS processedName, pb.uuid AS processedUuid, ib.fullname AS invoicedName, ib.uuid AS invoicedUuid,
                         pd.uuid AS poUuid, pd.sno, pd.amount, pd.is_invoiced, DATE_FORMAT(pd.month_period, '%m-%d-%Y') AS month_period, pd.activity_text, pd.hsn_sac, 
                         pc.uuid AS profitUuid, pc.description AS profitDescription, pc.code AS profitCode,
                         cc.uuid AS costUuid, cc.description AS costDescription, cc.code AS costCode,
                         ga.uuid AS glAccountUuid, ga.ledger_description, ga.account_number AS glAccountNumber,
                         pd.created_on AS poCreate, pcb.fullname AS poCreateName, pcb.uuid AS poCreateUuid, pd.modify_on AS modify_on, mb.fullname AS modifyName, mb.uuid AS modifyUuid
                                   FROM po_detail pd
                                   LEFT JOIN profit_center pc ON pc.id = pd.profit_center_id
                                   LEFT JOIN cost_center cc ON cc.id = pd.cost_center_id
                                   LEFT JOIN gl_account ga ON ga.id = pd.gl_account_id
								   LEFT JOIN po_master pm ON pm.id = pd.po_master_id
                                   LEFT JOIN purchasing_group pg ON pg.id = pm.purchasing_group_id
                                   LEFT JOIN vendor v ON v.id = pm.vendor_id
                                   LEFT JOIN plant p ON p.id = pm.plant_id
                                   LEFT JOIN po_status ps ON ps.id = pm.po_status_id
                                   LEFT JOIN material_group mg ON mg.id = pm.material_group_id
                                   LEFT JOIN user cb ON cb.id = pm.created_by_id
                                   LEFT JOIN user pb ON pb.id = pm.processed_by_id
                                   LEFT JOIN user ib ON ib.id = pm.invoiced_by_id
                                   LEFT JOIN user pcb ON pcb.id = pd.created_by_id
                                   LEFT JOIN user mb ON mb.id = pd.modify_by_id
                                   WHERE pm.uuid = '${poUuid}'
                                   ORDER BY pd.sno
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

db.getNonInvoicedPODetails = (poUuid, invoiceUuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT pd.uuid AS poUuid, pd.sno, pd.amount, pd.is_invoiced, DATE_FORMAT(pd.month_period, '%m-%d-%Y') AS month_period, pd.activity_text, pd.hsn_sac, 
            pc.uuid AS profitUuid, pc.description AS profitDescription, pc.code AS profitCode,
            cc.uuid AS costUuid, cc.description AS costDescription, cc.code AS costCode,
            ga.uuid AS glAccountUuid, ga.ledger_description, ga.account_number AS glAccountNumber,
            pd.created_on AS poCreate, pcb.fullname AS poCreateName, pcb.uuid AS poCreateUuid, 
            pd.modify_on AS modify_on, mb.fullname AS modifyName, mb.uuid AS modifyUuid
                      FROM po_detail pd
                      LEFT JOIN profit_center pc ON pc.id = pd.profit_center_id
                      LEFT JOIN cost_center cc ON cc.id = pd.cost_center_id
                      LEFT JOIN gl_account ga ON ga.id = pd.gl_account_id
                      LEFT JOIN user pcb ON pcb.id = pd.created_by_id
                      LEFT JOIN user mb ON mb.id = pd.modify_by_id
                      WHERE pd.po_master_id = (SELECT id FROM po_master WHERE uuid = '${poUuid}')  AND (pd.is_invoiced = 0 `
            if(invoiceUuid?.length > 0)
            {
                sql = sql + ` OR pd.id IN (SELECT po_detail_id FROM invoice_detail WHERE invoice_id = (SELECT id FROM invoice_master WHERE uuid = '${invoiceUuid}') AND 
                po_master_id = (SELECT id FROM po_master WHERE uuid = '${poUuid}')))`
            }
            else
            {
                sql = sql + ')'
            }

            sql = sql + ` ORDER BY pd.sno`
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

db.getPoMasterId = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM po_master
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

db.savePO = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT into po_detail (sno, po_master_id, activity_text, month_period, amount, gl_account_id, is_invoiced, created_on, created_by_id, uuid, hsn_sac, profit_center_id, cost_center_id) VALUES ('${ele.sno}','${ele.poMasterId}', '${uniqueFunction.manageSpecialCharacter(ele.activityText)}','${ele.monthPeriod ? ele.monthPeriod : '' }', '${ele.amount}',(SELECT id FROM gl_account WHERE uuid = '${ele.glAccountUuid}'), 0, ?, '${ele.createdById}', '${ele.uuid}', '${ele.hsnSac}', (SELECT id FROM profit_center WHERE uuid = '${ele.profitCenter?.uuid}'), (SELECT id FROM cost_center WHERE uuid = '${ele.costCenter?.uuid}'))`

            pool.query(sql, [ele.createdOn], (error, result) => 
            {
                if(error)
                {
                    console.log(error.sqlMessage)
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went wrong';
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

db.updatePO = (ele) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `Update po_detail SET sno = '${ele.sno}' , po_master_id = '${ele.poMasterId}', activity_text = '${uniqueFunction.manageSpecialCharacter(ele.activityText)}', month_period = '${ele.monthPeriod ? ele.monthPeriod : '' }', amount = '${ele.amount}', gl_account_id = (SELECT id FROM gl_account WHERE uuid = '${ele.glAccountUuid}'), is_invoiced = 0, modify_on = ?, modify_by_id = '${ele.modifyById}', hsn_sac = '${ele.hsnSac}', profit_center_id = (SELECT id FROM profit_center WHERE uuid = '${ele.profitCenter?.uuid}'), cost_center_id =  (SELECT id FROM cost_center WHERE uuid = '${ele.costCenter?.uuid}') 
            WHERE uuid =  '${ele.uuid}';`

            pool.query(sql, [ele.modifyOn], (error, result) => 
            {
                if(error)
                {
                    console.log(error.sqlMessage)
                    ele['remark'] = error?.sqlMessage?.length > 2 ? error?.sqlMessage : 'Something went wrong';
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

db.updatePOMaster = (uuid, plantUuid, purchasingGroupUuid, materialGroupUuid, totalAmount, isActive, totalItems) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET is_active = ${isActive}, purchasing_group_id = (SELECT id FROM purchasing_group WHERE uuid = '${purchasingGroupUuid}'), plant_id = (SELECT id FROM plant WHERE uuid = '${plantUuid}'), total_amount = '${totalAmount}', total_items = '${totalItems}', material_group_id = (SELECT id FROM material_group WHERE uuid = '${materialGroupUuid}')
            WHERE uuid = '${uuid}'`


            pool.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject();
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

db.updatePOMasterStatus = (uuid, processedOn, processedById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET processed_on = ?, processed_by_id = ?, po_status_id = (SELECT id FROM po_status WHERE name = 'Processed')
            WHERE uuid = '${uuid}'`
            pool.query(sql, [processedOn, processedById], (error, result) => 
            {
                if(error)
                {
                    return reject();
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

db.updatePOMasterFile = (poNumber, poFileName) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE po_master SET po_file_name = '${poFileName}'
            WHERE po_number = '${poNumber}'`


            pool.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject();
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

db.getFileName = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
              let  sql = `SELECT po_file_name AS fileName FROM po_master WHERE uuid = '${uuid}'`;
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

module.exports = db