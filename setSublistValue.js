/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/runtime'],
/**
 * @param{currentRecord} currentRecord
 */
function(currentRecord,runtime) {
      var script = runtime.getCurrentScript();
    var sublistPar = script.getParameter({
        name: 'custscript_sublist'
    });
    var triggerField = script.getParameter({
        name: 'custscript_trigger_field'
    });
    var setField = script.getParameter({
        name: 'custscript_set_field'
    });
    var setValue = script.getParameter({
        name: 'custscript_set_value'
    });
    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

        var record=scriptContext.currentRecord;
 var sublist= scriptContext.sublistId;

      if(sublist==sublistPar){

 if(scriptContext.fieldId==triggerField){
    debugger;
    record.setCurrentSublistValue({
        sublistId: sublistPar,
        fieldId: setField,
        value: setValue,
        ignoreFieldChange: false
    })
 }
      }


    }

    return {
       postSourcing: fieldChanged
    };

});
