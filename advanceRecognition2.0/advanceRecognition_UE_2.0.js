/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record','N/runtime'],
    /**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 */
    (log, recordN,runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
             if(scriptContext.type!== scriptContext.UserEventType.VIEW) return;

            var record= scriptContext.newRecord;

var allowedItems=advanceItems()
if(isAllowed(allowedItems,record)){
addButton(scriptContext)
}



function advanceItems(){
    try{
var script=runtime.getCurrentScript();
var items=script.getParameter({
    name: 'custscript_allowed_advance_items'
})
    }catch(e){
        log.debug(e)
    }
    var allowedItems=JSON.parse(items)

    return allowedItems
}

function isAllowed(allowedItems,record){
    var itemCount=record.getLineCount({
        sublistId: 'item'
    });

    for (var i = 0; i < itemCount; i++) {
       var itemId=record.getSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        line: i
       });
       itemId=parseInt(itemId,10);
        // log.debug('itemId',itemId)
       if(allowedItems.indexOf(itemId)!==-1){
        var journalId=record.getSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_aqt_related_journal',
            line: i
        });
 log.debug('jounralID',journalId)
        if(journalId){
            var journalRecord=recordN.load({
                type: 'journalentry',
                id: journalId,
                isDynamic: true,
            });
       var debit=journalRecord.getSublistValue({
            sublistId:'line',
            fieldId: 'debit',
            line:0
        });
        var credit=journalRecord.getSublistValue({
            sublistId:'line',
            fieldId: 'credit',
            line:0
        });
        log.debug('debit // credit',debit +' // '+credit)
        if(debit==0 && credit ==0){
            return true
        }
        }
       
       }
    }
}

function addButton(context){

    try{
        var form=context.form;

        form.addButton({
            id: 'custpage_updateJournals',
            label:'Признай аванс 2.0',
            functionName:'updateJournal'
        })
    
        form.clientScriptModulePath='./advanceRecognition_CS_2.js'
    }catch(e){
        log.debug('error adding button "Признай Аванс"',e)
    }

}
        }

     


        return {beforeLoad: beforeLoad}

    });
