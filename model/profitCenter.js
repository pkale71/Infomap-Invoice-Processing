class profitCenter {
    uuid
    description
    code
    createdOn
    createdById
    modifyOn
    modifyById
    isActive
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid         =   data.uuid
        this.description  =   data.description
        this.code         =   data.code
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
            description : this.description,
            code  : this.code,
            createdOn : this.createdOn,
            createdById : this.createdById,
            modifyOn : this.modifyOn,
            modifyById : this.modifyById,
            isActive : this.isActive
        }
    }
}
module.exports = profitCenter