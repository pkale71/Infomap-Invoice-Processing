class state {
    id
    name
    createdOn
    createdById
    modifyOn
    modifyById
    country
    constructor(){}
    
    setDataAll(data)
    {
        this.id           =   data.id
        this.name         =   data.name
        this.createdOn    =   data.created_on
        this.createdById  =   data.created_by_id
        this.modifyOn     =   data.modify_on
        this.modifyById   =   data.modify_by_id
        this.country      =   {
                                    "id" : data.countryId,
                                    "name" : data.countryName,
                              }
    }

    getDataAll()
    {
        return {
            id : this.id,
            name : this.name,
            createdOn : this.createdOn,
            createdById : this.createdById,
            modifyOn : this.modifyOn,
            modifyById : this.modifyById,
            country : this.country
        }
    }
}
module.exports = state