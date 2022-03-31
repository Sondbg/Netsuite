/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define (['N/record'], function (record,context) {
    function afterSubmit(context){
        //return if it's not an Edit or Copy
        if(context.type!= context.UserEventType.CREATE && context.type!= context.UserEventType.EDIT){
   return;
        }
        // get both records and recordID
        var taskRecord=context.newRecord;
        var EstimateRequestID=taskRecord.getValue({
           fieldId: 'custevent_aqt_related_request_offer'
       });
        var relatedEstimateRequest= record.load({
           type: 'customrecord_aqt_offer_request',
           id: EstimateRequestID,
           isDynamic: true,
        });
        //get the fields to populate
       var company=taskRecord.getValue({
           fieldId: 'company'
       });
       var opportunity=taskRecord.getValue({
           fieldId: 'transaction'
       });
       //poopulate the fields if there's information
       if(company!= null && opportunity!=null && relatedEstimateRequest!=null){
           relatedEstimateRequest.setValue({
               fieldId: 'custrecord_opp_customer',
               value: company,
               ignoreFieldChange: true,
           });
           relatedEstimateRequest.setValue({
               fieldId: 'custrecord_aqt_opportunity',
               value: opportunity,
               ignoreFieldChange: true,
           });
   relatedEstimateRequest.save({
    enableSourcing: true,
    ignoreMandatoryFields: true
   });
       }
    }
   return{
       afterSubmit: afterSubmit
   };
    });