/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */
define(["N/currentRecord","N/ui/dialog","N/runtime"], function(currentRecord,dialog,runtime){
function fieldChanged(scriptContext){
if(scriptContext.fieldId=='transferlocation'){
var record=currentRecord.get();
var transferLocation=record.getValue({fieldId:'transferlocation'});
var script=runtime.getCurrentScript();
var parameters=script.getParameter({name:'custscript_deny_locations'});
var parArr=parameters.split(',');
if(parArr.includes(transferLocation)){
    record.setValue({
        fieldId:'transferlocation',
        value: ''
    });
    dialog.alert({
        title:'Моля изберете друг склад',
        message:'С този документ НЕ МОЖЕ да сe прехвърля стока към основните складове'});
}
}
}
return{
fieldChanged: fieldChanged
}

})