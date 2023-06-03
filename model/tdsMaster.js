class tdsMaster {
    uuid
    description
    createdOn
    createdById
    modifyOn
    modifyById
    isActive
    rate
    taxSection
    glAccount
    gstMaster
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid           =   data.uuid
        this.description    =   data.name
        this.createdOn      =   data.created_on
        this.createdById    =   data.created_by_id
        this.modifyOn       =   data.modify_on
        this.modifyById     =   data.modify_by_id
        this.glAccount      =   {
                                    "uuid" : data.glAccUuid,
                                    "ledgerDescription" : data.ledger_description,
                                    "accountNumber":account_number
                                }
        this.gstMaster      =   {
                                    "uuid" : data.gstUuid,
                                    "taxCode" : data.tax_code,
                                    "description":data.gstDescription
                                }
        this.isActive       =   data.is_active
        this.rate           =   data.rate
        this.taxSection     =   data.tax_section
    }

    getDataAll()
    {
        return {
            uuid            :   this.uuid,
            description     :   this.description,
            createdOn       :   this.createdOn,
            createdById     :   this.createdOn,
            modifyOn        :   this.modifyOn,
            modifyById      :   this.modifyById,
            isActive        :   this.isActive,
            rate            :   this.rate,
            taxSection      :   this.taxSection,
            glAccount       :   this.glAccount,
            gstMaster       :   this.gstMaster
        }
    }
}
module.exports = tdsMaster