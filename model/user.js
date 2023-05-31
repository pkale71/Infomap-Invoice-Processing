class user {
    uuid 
    fullName
    userType
    email
    lastLoggedIn
    accessToken
    mobile
    active
    createdBy
    deletedBy
    gender
    userTypeExist

    constructor(){}

    setData(data)
    {
        this.uuid           =   data.uuid
        this.fullName       =   data.fullName?.trim()
        this.userType       =   {
                                    id     :   data.user_type_id,
                                    name    :   data.user_type_name?.trim(),
                                    code    :   data.user_type_code
                                }
        this.email          =   data.email
        this.lastLoggedIn   =   data.last_logged_in
        this.accessToken    =   data.access_token
        this.mobile         =   data.mobile
    }

    getData()
    {
       return {
            user    :   {
                            uuid           :   this.uuid,
                            fullName       :   this.fullName,
                            userType       :   this.userType,
                            mobile         :   this.mobile,
                            email          :   this.email,
                            lastLoggedIn   :   this.lastLoggedIn,
                            accessToken    :   this.accessToken
                        },
            "status_code" : 200,
            "message" : "success",
            "status_name" : 'ok'
        }
    }
}
module.exports = user