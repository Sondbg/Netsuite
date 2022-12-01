/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */

 define(['N/ui/dialog','N/log','N/currentRecord','N/record'],

 function(dialog,log, currentRecord, record) {

     function updateJournal() {
        debugger;
         try {
            var currRecord = currentRecord.get();
            var invoiceID=currRecord.id
            var allowedItems=[6998,6541];
            var currRecord=record.load({
                type: 'invoice',
                id: invoiceID,
                isDynamic: false,
            })
            var linecount=currRecord.getLineCount({sublistId: 'item' })
            for (var i = 0; i <linecount ; i++) {
                var itemId=currRecord.getSublistValue({
                 sublistId: 'item',
                 fieldId: 'item',
                 line: i
                });
                itemId=parseInt(itemId,10);
                 // log.debug('itemId',itemId)
                if(allowedItems.indexOf(itemId)!==-1){
                 var journalId=currRecord.getSublistValue({
                     sublistId: 'item',
                     fieldId: 'custcol_aqt_related_journal',
                     line: i
                 });
          
                 if(journalId){
                    var amount=currRecord.getSublistValue({
                        sublistId:'item',
                        fieldId: 'amount',
                        line:i 
                    })
          if(editJournal(journalId,invoiceID,amount,itemId)){
            dialog.alert({
                title: 'Успешна операция',
                message: 'Журналите са обновени'
            })
          }
                 }
                
                }
             }

         } catch (e) {

             log.error ({
                 title: e.name,
                 details: e.message
             });
         }
     }



     function editJournal(id,invoiceID,amount,itemID){
        
        var journalRecord=record.load({
            type: 'journalentry',
            id: id,
            isDynamic: false,
        });
        journalRecord.setValue({
            fieldId: 'custbody_aqt_source',
            value: invoiceID,
            ignoreFieldChange: false
        });


        var lineCount=journalRecord.getLineCount({
            sublistId: 'line'
        });

        for (var i = 0; i < lineCount; i++) {
            var account=getsublistValueCust(journalRecord,'account',i);
            var setField;
            //ID 807 - 412 клиенти по аванс
            if(account==807){
                setField='debit';
            }else{
                setField='credit';
                if(itemID==6541){
                    setSublistValueCust(journalRecord,'account',i,54)
                }
            }

            var lineValue=getsublistValueCust(journalRecord,setField,i)
            if(lineValue==0){
                setSublistValueCust(journalRecord,setField,i,amount);
                setSublistValueCust(journalRecord,'memo',i,'Приспадане на аванс по фактура')
            }
            
        }
        journalRecord.setValue({
            fieldId:'memo',
            value: '',
            ignoreFieldChange:true
        })
        journalRecord.save()
return true
     }
     
     function setSublistValueCust(recordCust,fieldId,line,amount){
        recordCust.setSublistValue({
            sublistId: 'line',
            fieldId: fieldId,
            line: line,
            value: amount
        })
     }

     function getsublistValueCust(recordCust,fieldID,line){
        return recordCust.getSublistValue({
            sublistId:'line',
            fieldId: fieldID,
            line: line
        });      
     }
function pageInit(){

}
     return {
        pageInit:pageInit,
        updateJournal: updateJournal,
     };
 });



