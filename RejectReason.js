/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord','N/url'], function(currentRecord,url){

function pageInit(context){
       var recordURL=document.location.href;
  var record=context.currentRecord;

  if (recordURL.includes('isItClientScript=true')){
    var temp=prompt('Въведи текст');
  var rejection=record.getValue({
    fieldId:'custrecord_rejection_reason'
  });
    record.setValue({
        fieldId: 'custrecord_rejection_reason',
        value: temp,
        ignoreFieldChange: false
    });
}
}
function fieldChanged(context){
       var recordURL=document.location.href;
  if(context.fieldId=='custrecord_rejection_reason'){
if (recordURL.includes('isItClientScript=true')){
 jQuery('#btn_multibutton_submitter').click()
}
  }
}
return{
  pageInit: pageInit,
  fieldChanged:fieldChanged

}
})