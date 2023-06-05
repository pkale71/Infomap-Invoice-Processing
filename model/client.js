class Client {
    uuid
    code
    name
    address
    landmark
    gstNumber
    panNumber
    cinNumber
    msmeNumber
    createdOn
    createdById
    modifyOn
    modifyById
    country
    state
    city
    isActive
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.code             =   data.code
        this.name           =   data.name
        this.address           =   data.address
        this.landmark           =   data.landmark
        this.gstNumber           =   data.gstNumber
        this.panNumber           =   data.panNumber
        this.cinNumber           =   data.cinNumber
        this.msmeNumber           =   data.msmeNumber
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
                                }
        this.city          =   {
                                    "id" : data.cityId,
                                    "name" : data.cityName,
                                }
    }

    getDataAll()
    {
        return {
            uuid        :   this.uuid,
            code        :   this.code,
            name        :   this.name,
            address     :   this.address,
            landmark        :   this.landmark,
            gstNumber       :   this.gstNumber,
            panNumber       :   this.panNumber,
            cinNumber       :   this.cinNumber,
            msmeNumber      :   this.msmeNumber,
            createdOn       :   this.createdOn,
            createdById     :   this.createdById,
            modifyOn        :   this.modifyOn,
            modifyById      :   this.modifyById,
            country     :   this.country,
            state       :   this.state,
            city        :   this.city,
            isActive    : this.isActive
        }
    }
}
module.exports = Client