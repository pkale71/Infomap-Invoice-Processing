class Plant {
    uuid
    code
    name
    address
    shortCode
    createdOn
    createdById
    modifyOn
    modifyById
    country
    state
    city
    client
    plantType
    isActive
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.code             =   data.code
        this.name           =   data.name
        this.address           =   data.address
        this.shortCode           =   data.short_code
        this.createdOn      =   data.created_on
        this.createdById    =   data.created_by_id
        this.modifyOn       =   data.modify_on
        this.modifyById     =   data.modify_by_id
        this.isActive = data.is_active
        this.state        =   {
                                    "id" : data.stateId,
                                    "name" : data.stateName,
                                }
        this.country        =   {
                                    "id" : data.countryId,
                                    "name" : data.countryName,
                                    "code" : data.countryCode
                                }
        this.city          =   {
                                    "id" : data.cityId,
                                    "name" : data.cityName,
                                }
        this.client          =   {
                                    "uuid" : data.clientUuid,
                                    "name" : data.clientName,
                                    "code" : data.clientCode
                                }
        this.plantType          =   {
                                    "id" : data.plantTypeId,
                                    "name" : data.plantTypeName,
                                }
    }

    getDataAll()
    {
        return {
            uuid        :   this.uuid,
            code        :   this.code,
            name        :   this.name,
            address     :   this.address,
            shortCode        :   this.shortCode,
            createdOn       :   this.createdOn,
            createdById     :   this.createdById,
            modifyOn        :   this.modifyOn,
            modifyById      :   this.modifyById,
            country     :   this.country,
            state       :   this.state,
            city        :   this.city,
            client    :   this.client,
            plantType : this.plantType,
            isActive    : this.isActive
        }
    }
}
module.exports = Plant