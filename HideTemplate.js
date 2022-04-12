/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function (currentRecord) {

    function pageInit(context){
        if(context.mode=='create'){
         var record=currentRecord.get();
         record.getField({
             fieldId: 'projecttemplate'}).isDisplay=false;
        }
    }
    return{
        pageInit: pageInit
    }
})