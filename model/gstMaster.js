class gstMaster {
    uuid
    description
    taxCode
    createdOn
    createdById
    modifyOn
    modifyById
    cgst
    sgst
    igst
    ugst
    isActive
    constructor(){}
    
    setDataAll(data)
    {
        this.uuid         =   data.uuid
        this.description  =   data.description
        this.taxCode      =   data.taxCode
        this.createdOn    =   data.created_on
        this.createdById  =   data.created_by_id
        this.modifyOn     =   data.modify_on
        this.modifyById   =   data.modify_by_id
        this.isActive     =   data.is_active
        this.cgst          =    data.cgst
        this.sgst          =    data.sgst
        this.igst          =    data.igst
        this.ugst          =    data.ugst
    }

    getDataAll()
    {
        return {
            uuid : this.uuid,
            description : this.description,
            taxCode  : this.taxCode,
            createdOn : this.createdOn,
            createdById : this.createdById,
            modifyOn : this.modifyOn,
            modifyById : this.modifyById,
            isActive : this.isActive,
            cgst    :   this.cgst,
            sgst    :   this.sgst,
            igst    :   this.igst,
            ugst    :   this.ugst
        }
    }
}
module.exports = gstMaster