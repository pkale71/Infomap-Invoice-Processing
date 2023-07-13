let uniqueFunction = require('../common/commonFunction/uniqueSearchFunction')
class invoice {
    uuid
    barCode
    vendor
    invoiceNumber
    invoiceDate
    baseAmount
    discount
    gstAmount
    netAmount
    createdBy
    createdOn
    processedOn
    processedBy
    verifiedOn
    verifiedBy
    isActive
    totalItems
    invoiceStatus
    invoiceDetails
    paymentTerms
    postingDate
    baseLineDate
    currency
    documentHeaderText
    withTaxAmount
    grossPayableAmount

    constructor(){}

    setInvoice(data)
    {
        this.invoiceDetails =    { 
                "uuid"      :   data.invoiceUuid,
                "baseAmount"          :   data.invoiceBaseAmount,
                "gstRate"          :   data.gst_rate,
                "sgstAmount"           :   data.sgst_amount,
                "cgstAmount"           :   data.cgst_amount,
                "igstAmount"           :   data.igst_amount,
                "grossAmount"           :   data.gross_amount,
                "discount"           :   data.invoiceDiscount,
                "gstMaster"    :   {
                                            "uuid" : data.gstUuid,
                                            "description" : data.gstDescription,
                                            "taxCode" : data.tax_code,
                                            "cgst" : data.cgst,
                                            "sgst" : data.sgst,
                                            "igst" : data.igst,
                                            "ugst" : data.ugst
                },
                "poMaster"   :  {
                                    "uuid" : data.poMasterUuid,
                                    "poNumber" : data.po_number
                                },
                "poDetail" :    { 
                    "uuid"      :   data.poDetailUuid,
                    "sno"          :   data.sno,
                    "activityText"          :   data.activity_text,
                    "monthPeriod"          :   uniqueFunction.changeDateToSqlDate(data.month_period),
                    "hsnSac"           :   data.hsn_sac,
                    "glAccount"   : {
                                        "uuid" : data.glAccountUuid,
                                        "accountNumber" : data.glAccountNumber,
                                        "ledgerDescription" : data.ledger_description
                                    }                    
                },
                "tdsMaster"   :   {
                    "uuid" : data.tdsMasterUuid,
                    "description" : data.tdsMasterDescription,
                    "rate" : data.tdsMasterRate,
                    "taxSection" : data.tdsMasterTaxSection
                },
                "tdsRate" : data.tds_rate,
                "withTaxAmount" : data.invoiceWithTaxAmount,
                "invoicePayableAmount" : data.invoice_payable_amount
            }
    }

    getInvoice()
    {
        return this.invoiceDetails
    }

    setDataAll(data)
    {
        this.uuid             =   data.uuid
        this.barCode             =   data.barcode
        this.totalItems           =   data.totalItems
        this.invoiceDate              =  uniqueFunction.changeDateToSqlDate(data.invoice_date) 
        this.invoiceNumber           =   data.invoice_number
        this.baseAmount           =   data.base_amount
        this.discount           =   data.discount
        this.gstAmount           =   data.gst_amount
        this.netAmount           =   data.net_amount
        this.invoiceStatus    =      {
                                        "id" : data.invoiceStatusId,
                                        "name" : data.invoiceStatusName
                                }
        this.createdOn      =   data.created_on
        this.createdBy    =   {
                                    "uuid" : data.createUuid,
                                    "fullName" : data.createName
        }
        this.processedOn       =   data.processed_on
        this.processedBy     =    {
            "uuid" : data.processedUuid,
            "fullName" : data.processedName
        }
        this.verifiedOn       =   data.verified_on
        this.verifiedBy     =    {
            "uuid" : data.verifiedUuid,
            "fullName" : data.verifiedName
        }
        this.isActive = data.is_active
        this.vendor        =   {
                                    "uuid" : data.vendorUuid,
                                    "code" : data.vendorCode,
                                    "name" : data.vendorName
                                }
        this.invoiceDetails       =   data.invoiceDetails,
        this.paymentTerms        =   data.payment_terms,
        this.postingDate        =   uniqueFunction.changeDateToSqlDate(data.posting_date),
        this.baseLineDate        =   uniqueFunction.changeDateToSqlDate(data.base_line_date),
        this.currency            =   data.currency,
        this.documentHeaderText  =   data.document_header_text,
        this.withTaxAmount      =   data.with_tax_amount,
        this.grossPayableAmount =   data.gross_payable_amount
    }

    getDataAll()
    {
        return {
            uuid : this.uuid,
            barCode : this.barCode,
            vendor : this.vendor,
            invoiceNumber : this.invoiceNumber,
            invoiceDate : this.invoiceDate,
            baseAmount : this.baseAmount,
            createdBy : this.createdBy,
            createdOn : this.createdOn,
            verifiedOn : this.verifiedOn,
            verifiedBy : this.verifiedBy,
            processedOn : this.processedOn,
            processedBy : this.processedBy,
            gstAmount : this.gstAmount,
            netAmount : this.netAmount,
            discount : this.discount,
            invoiceStatus : this.invoiceStatus,
            isActive : this.isActive,
            totalItems : this.totalItems,
            invoiceDetails : this.invoiceDetails,
            paymentTerms : this.paymentTerms,
            postingDate : this.postingDate,
            baselineDate : this.baseLineDate,
            currency : this.currency,
            documentHeaderText : this.documentHeaderText,
            withTaxAmount : this.withTaxAmount,
            grossPayableAmount : this.grossPayableAmount
        }
    }
}
module.exports = invoice