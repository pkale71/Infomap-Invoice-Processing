class glAccount {
    uuid
    ledgerDescription
    accountNumber
    createdOn
    createdById
    modifyOn
    modifyById
    isActive
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid           =   data.uuid
        this.ledgerDescription         =   data.ledger_description
        this.accountNumber         =   data.account_number
        this.createdOn    =   data.created_on
        this.createdById  =   data.created_by_id
        this.modifyOn     =   data.modify_on
        this.modifyById   =   data.modify_by_id
        this.isActive     =   data.is_active
    }

    getDataAll()
    {
        return {
            uuid : this.uuid,
            ledgerDescription : this.ledgerDescription,
            accountNumber  : this.accountNumber,
            createdOn : this.createdOn,
            createdById : this.createdById,
            modifyOn : this.modifyOn,
            modifyById : this.modifyById,
            isActive : this.isActive
        }
    }
}
module.exports = glAccount