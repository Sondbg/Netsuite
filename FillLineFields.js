/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
 define(['N/currentRecord'], function (record,context){

    function pageInit(context){
SetLocationLine(context);
}
function SetLineAmount(context){
var currentRecord=context.currentRecord;
var rate=currentRecord.getCurrentSublistValue({
sublistId:'item',
fieldId:'rate'
});
var km=currentRecord.getCurrentSublistValue({
sublistId:'item',
fieldId:'custcol3'
});
var LineAmount=rate*km;
currentRecord.setCurrentSublistValue({
sublistId: 'item',
fieldId: 'amount',
value: LineAmount,
ignoreFieldChange: true
});
}
function LineInit(context){
SetLocationLine(context);
}
function SetLocationLine(context){
var currentRecord=context.currentRecord;
currentRecord.setCurrentSublistValue({
sublistId: 'item',
fieldId: 'location',
value: 102,
ignoreFieldChange: true
});
}
return{
    fieldChanged: SetLineAmount,
    pageInit: pageInit,
      lineInit: LineInit
};
});
