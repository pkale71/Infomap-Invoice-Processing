class invoice {
    uuid
    barCode
    vendor
    invoiceNumber
    invoiceDate
    baseAmount
    discount
    gstAmount
    netAmount
    createdBy
    createdOn
    processedOn
    processedBy
    isActive
    totalItems
    invoiceStatus
    invoiceDetails

    constructor(){}

    setPO(data)
    {
        this.poDetails =    { 
                "uuid"      :   data.poUuid,
                "sno"          :   data.sno,
                "activityText"          :   data.activity_text,
                "monthPeriod"          :   data.month_period,
                "hsnSac"           :   data.hsn_sac,
                "isInvoiced"           :   data.is_invoiced,
                "createdOn  "    :   data.poCreate,
                "createdBy"    :   {
                                            "uuid" : data.poCreateUuid,
                                            "fullName" : data.poCreateName
                },
                "modifyOn"       :   data.modify_on,
                "modifyBy"     :    {
                    "uuid" : data.modifyUuid,
                    "fullName" : data.modifyName
                },
                "glAccount"   :   {
                                            "uuid" : data.glAccountUuid,
                                            "accountNumber" : data.glAccountNumber,
                                            "ledgerDescription" : data.ledger_description
                                        },
                "profitCenter"         :   {
                                                        "uuid" : data.profitUuid,
                                                        "code" : data.profitCode,
                                                        "description" : data.profitDescription
                                        },
                "costCenter"         :   {
                                        
                                                "uuid" : data.costUuid,
                                                "code" : data.costCode,
                                                "description" : data.costDescription
                                        },
                "amount"    :   data.amount,
                "oper"      :   data.oper
            }
    }

    getPO()
    {
        return this.poDetails
    }

    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.barCode             =   data.barcode
        this.totalItems           =   data.totalItems
        this.invoiceDate              =   data.invoice_date
        this.invoiceNumber           =   data.invoice_number
        this.baseAmount           =   data.base_amount
        this.discount           =   data.discount
        this.gstAmount           =   data.gst_amount
        this.netAmount           =   data.net_amount
        this.invoiceStatus    =      {
                                        "id" : data.invoiceStatusId,
                                        "name" : data.invoiceStatusName
                                }
        this.createdOn      =   data.created_on
        this.createdBy    =   {
                                    "uuid" : data.createUuid,
                                    "fullName" : data.createName
        }
        this.processedOn       =   data.processed_on
        this.processedBy     =    {
            "uuid" : data.processedUuid,
            "fullName" : data.processedName
        }
        this.isActive = data.is_active
        this.vendor        =   {
                                    "uuid" : data.vendorUuid,
                                    "code" : data.vendorCode,
                                    "name" : data.vendorName
                                }
        this.invoiceDetails       =   data.invoiceDetails
    }

    getDataAll()
    {
        return {
            uuid : this.uuid,
            barCode : this.barCode,
            vendor : this.vendor,
            invoiceNumber : this.invoiceNumber,
            invoiceDate : this.invoiceDate,
            baseAmount : this.baseAmount,
            createdBy : this.createdBy,
            createdOn : this.createdOn,
            processedOn : this.processedOn,
            processedBy : this.processedBy,
            gstAmount : this.gstAmount,
            netAmount : this.netAmount,
            discount : this.discount,
            invoiceStatus : this.invoiceStatus,
            isActive : this.isActive,
            totalItems : this.totalItems,
            invoiceDetails : this.invoiceDetails
        }
    }
}
module.exports = invoice