class vendor {
    // uuid
    // name
    // code
    // createdOn
    // createdById
    // modifyOn
    // modifyById
    // isActive

    code
    name
    accountGroup
    addressLine1
    addressLine2
    addressLine3
    addressLine4
    postalCode
    city
    country
    corporateGroup
    contact1
    contact2
    telephoneExchange
    faxNumber
    emailAddress1
    emailAddress2
    emailAddress3
    gstNumber
    panNumber
    industryType
    remarks

    constructor(){}
    
    setDataAll(data)
    {
        // 'VENDOR NUMBER','NAME1', 'ACCOUNT_GROUP', 'STREET', 'STREET2', 'STREET3', 'STREET4', 'POSTAL CODE', 'CITY1', 'COUNTRY', 'Corporate Group', 'TELEPHONE NO. 1', 'TELEPHONE EXCHANGE', 'TELEPHONE NO. 2', 'FAX NUMBER 1', 'EMAIL ADDR1', 'EMAIL ADDR2', 'EMAIL ADDR3', 'GST No.', 'PAN NO', 'TYPE OF INDUSTRY'
        this.code         =   data['VENDOR NUMBER']
        this.name         =   data['NAME1']
        this.accountGroup         =   data['ACCOUNT_GROUP']
        this.addressLine1         =   data['STREET']
        this.addressLine2         =   data['STREET2']
        this.addressLine3         =   data['STREET3']
        this.addressLine4         =   data['STREET4']
        this.postalCode         =   data['POSTAL CODE']
        this.city         =   data['CITY1']
        this.country         =   data['COUNTRY']
        this.corporateGroup         =   data['Corporate Group']
        this.contact1         =   data['TELEPHONE NO. 1']
        this.telephoneExchange      =   data['TELEPHONE EXCHANGE']
        this.contact2         =   data['TELEPHONE NO. 2']
        this.faxNumber         =   data['FAX NUMBER 1']
        this.emailAddress1         =   data['EMAIL ADDR1']
        this.emailAddress2         =   data['EMAIL ADDR2']
        this.emailAddress3         =   data['EMAIL ADDR3']
        this.gstNumber         =   data['GST No.']
        this.panNumber         =   data['PAN NO']
        this.industryType         =   data['TYPE OF INDUSTRY']
        this.remarks        =   data['REMARKS']
    }

    getDataAll()
    {
        return {
            code    :   this.code,
            name    :   this.name,
            accountGroup    :   this.accountGroup,
            addressLine1    :   this.addressLine1,
            addressLine2    :   this.addressLine2,
            addressLine3    :   this.addressLine3,
            addressLine4    :   this.addressLine4,
            postalCode  :   this.postalCode,
            city    :   this.city,
            country :   this.country,
            corporateGroup  :   this.corporateGroup,
            contact1    :   this.contact1,
            contact2    :   this.contact2,
            telephoneExchange   :   this.telephoneExchange,
            faxNumber   :   this.faxNumber,
            email1   :   this.emailAddress1,
            email2   :   this.emailAddress2,
            email3   :   this.emailAddress3,
            gstNumber   :   this.gstNumber,
            panNumber   :   this.panNumber,
            industryType    :   this.industryType,
            remark    :   this.remarks
        }
    }
}
module.exports = vendor