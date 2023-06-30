class PO {
    uuid
    poNumber
    vendor
    plant
    purchasingGroup
    materialGroup
    createdBy
    createdOn
    processedOn
    processedBy
    invoicedOn
    invoicedBy
    totalAmount
    isActive
    totalItems
    savedItems
    poStatus
    poDetails

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
                "amount"    :   data.amount
            }
    }

    getPO()
    {
        return this.poDetails
    }


    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.poNumber             =   data.po_number
        this.totalItems           =   data.totalItems
        this.savedItems           =   data.savedItems
        this.totalAmount           =   data.total_amount
        this.poStatus    =      {
                                        "id" : data.poStatusId,
                                        "name" : data.poStatusName
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
        this.invoicedOn       =   data.invoiced_on
        this.invoicedBy     =    {
            "uuid" : data.invoicedUuid,
            "fullName" : data.invoicedName
        }
        this.isActive = data.is_active
        this.vendor        =   {
                                    "uuid" : data.vendorUuid,
                                    "code" : data.vendorCode,
                                    "name" : data.vendorName
                                }
        this.plant        =   {
                                    "uuid" : data.plantUuid,
                                    "code" : data.plantCode,
                                    "name" : data.plantName
                                }
        this.purchasingGroup          =   {
                                                "uuid" : data.purchaseUuid,
                                                "code" : data.purchaseCode,
                                                "description" : data.purchaseDescription
                                }
        this.materialGroup         =   {
                                   
                                        "uuid" : data.materialUuid,
                                        "code" : data.materialCode,
                                        "description" : data.materialDescription
                                }
        this.poDetails       =   data.poDetails
    }

    getDataAll()
    {
        return {
            uuid : this.uuid,
            poNumber : this.poNumber,
            vendor : this.vendor,
            plant : this.plant,
            purchasingGroup : this.purchasingGroup,
            materialGroup : this.materialGroup ? this.materialGroup : null,
            createdBy : this.createdBy,
            createdOn : this.createdOn,
            processedOn : this.processedOn,
            processedBy : this.processedBy,
            invoicedOn : this.invoicedOn,
            invoicedBy : this.invoicedBy,
            totalAmount : this.totalAmount,
            poStatus : this.poStatus,
            isActive : this.isActive,
            totalItems : this.totalItems,
            savedItems : this.savedItems,
            poDetails : this.poDetails
        }
    }
}
module.exports = PO