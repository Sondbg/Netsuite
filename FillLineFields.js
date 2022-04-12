/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'], function (context){
function pageInit(context){
    SetLocationLine(context);
}
function fieldChanged(context){
  traveledKM(context);
}
    function traveledKM(context){
    if (context.fieldId==='custbody_aqt_nanchalen_kilometraj' || context.fieldId==='custbody_aqt_kraen_kilometraj'){
	var currentRecord=context.currentRecord;
var startKM=context.currentRecord.getValue({
      fieldId: 'custbody_aqt_nanchalen_kilometraj'
    });
var endKM=context.currentRecord.getValue({
      fieldId: 'custbody_aqt_kraen_kilometraj'
    });
var travelKM=endKM-startKM;
	context.currentRecord.setValue({
     fieldId:'custbody_aqt_izm_km_kilonetraj',
     value:travelKM
    });
        }
  }
	function LineInit(context){
  SetLocationLine(context);
    }
  function traveledKM(context){
    if (context.fieldId=='custbody_aqt_nanchalen_kilometraj' || context.fieldId=='custbody_aqt_kraen_kilometraj'){
	var currentRecord=context.currentRecord;
var startKM=context.currentRecord.getValue({
      fieldId: 'custbody_aqt_nanchalen_kilometraj'
    });
var endKM=context.currentRecord.getValue({
      fieldId: 'custbody_aqt_kraen_kilometraj'
    });
var travelKM=endKM-startKM;
	currentRecord.setValue({
     fieldId:'custbody_aqt_izm_km_kilonetraj',
     value:travelKM,
    ignoreFieldChange: true
    });
        }
  }
  function SetLocationLine(context){
    var currentRecord=context.currentRecord;
currentRecord.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'location',
    value: 102,
    ignoreFieldChange: true
    });
currentRecord.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: 5060,
    ignoreFieldChange: false
    });
  }
    return{
        fieldChanged: fieldChanged,
        pageInit: pageInit,
      	lineInit: LineInit
    };
});
