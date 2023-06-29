class PO {
    uuid
    poNumber
    vendor
    plant
    purchasingGroup
    materialGroup
    createdById
    createdOn
    modifyOn
    modifyById
    totalAmount
    isActive
    totalItems

    constructor(){}

    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.poNumber             =   data.po_number
        this.totalItems           =   data.totalItems
        this.totalAmount           =   data.total_amount
        this.createdOn      =   data.created_on
        this.createdById    =   {
                                    "uuid" : data.createUuid,
                                    "fullName" : data.createName
        }
        this.modifyOn       =   data.modify_on
        this.modifyById     =    {
            "uuid" : data.modifyUuid,
            "fullName" : data.modifyName
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
            modifyOn : this.modifyOn,
            modifyById : this.modifyById,
            totalAmount : this.totalAmount,
            isActive : this.isActive,
            totalItems : this.totalItems
        }
    }
}
module.exports = PO