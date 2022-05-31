/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/url','N/record','N/redirect'], function(url,record,redirect){
   function onAction(context){
     var currentRecord= context.newRecord;
    var recordID=currentRecord.id;
     var recordType=currentRecord.type;

   var recordURL=url.resolveRecord({
        recordType:recordType,
        recordID: recordID,
       isEditMode: true
    })
   recordURL=recordURL.split('compid');
   var redirectURL=recordURL[0]+'id='+recordID+'&e=T';
 redirect.redirect({
  url:redirectURL,
  parameters: {'isItClientScript':'true'}
 })
}
return{
    onAction:onAction
}
})