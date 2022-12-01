/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'],
/**
 * @param{log} log
 * @param{record} record
 */
function(log, record) {
    
    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {
        var currentField=scriptContext.fieldId;
        if(currentField==='custcol5'){
    var currentRecord=scriptContext.currentRecord;
    var currLineInvoice=currentRecord.getCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'custcol5'
    })
    var currLineJournal=currentRecord.getCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'custcol_aqt_related_journal'
    })

    if(currLineInvoice && !currLineJournal) {
        try{
            currentRecord.setCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'custcol_aqt_related_journal',
              value: getJournalId(currLineInvoice),
              ignoreFieldChange: false,
              forceSyncSourcing: true
            })  ;

        }catch(e){
            log.audit({
                title: 'Error setting the Journal on the line. ',
                details: e
            })
        }
    }
}
    }

    function getJournalId(recordId){
var invoiceRecord=record.load({
    type: record.Type.INVOICE,
    id: recordId,
    isDynamic: true
});
var lineCount=invoice.getLineCount({
    sublistId: 'item'
});
for (var i = 0; i < lineCount; i++) {
    var item=invoiceRecord.getSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        line: i
    })

if(item!='36') continue;
   
return invoiceRecord.getSublistValue({
    sublistId:'item',
    fieldId:'custcol_aqt_related_journal',
    line:i
})

}
}


    return {
        postSourcing: postSourcing
    };
    
});
