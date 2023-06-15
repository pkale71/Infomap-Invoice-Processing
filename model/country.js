class country {
    id
    name
    code
    createdOn
    createdById
    modifyOn
    modifyById
    constructor(){}
    
    setDataAll(data)
    {
        this.id           =   data.id
        this.name         =   data.name
        this.code         =     data.code
        this.createdOn    =   data.created_on
        this.createdById  =   data.created_by_id
        this.modifyOn     =   data.modify_on
        this.modifyById   =   data.modify_by_id
    }

    getDataAll()
    {
        return {
            id : this.id,
            name : this.name,
            code : this.code,
            createdOn : this.createdOn,
            createdById : this.createdById,
            modifyOn : this.modifyOn,
            modifyById : this.modifyById
        }
    }
}
module.exports = country