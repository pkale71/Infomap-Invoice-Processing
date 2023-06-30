class PO {
    uuid
    poNumber
    vendor
    plant
    purchasingGroup
    materialGroup
    createdById
    createdOn
    processedOn
    processedById
    invoicedOn
    invoicedById
    totalAmount
    isActive
    totalItems
    savedItems
    poStatus

    constructor(){}

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
        this.createdById    =   {
                                    "uuid" : data.createUuid,
                                    "fullName" : data.createName
        }
        this.processedOn       =   data.processed_on
        this.processedById     =    {
            "uuid" : data.processedUuid,
            "fullName" : data.processedName
        }
        this.invoicedOn       =   data.invoiced_on
        this.invoicedById     =    {
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
            createdById : this.createdById,
            createdOn : this.createdOn,
            processedOn : this.processedOn,
            processedById : this.processedById,
            invoicedOn : this.invoicedOn,
            invoicedById : this.invoicedById,
            totalAmount : this.totalAmount,
            poStatus : this.poStatus,
            isActive : this.isActive,
            totalItems : this.totalItems,
            savedItems : this.savedItems
        }
    }
}
module.exports = PO