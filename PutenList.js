/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record'], function (record){
function beforeLoad(context){
	if (context.type === context.UserEventType.CREATE){
    var record=context.newRecord;
	record.setValue({
     fieldId:'entity',
     value:'8830',
    ignoreFieldChange: true
    });
	}
}
function beforeSubmit(context){
  var record=context.newRecord;
  var vehicleCost=Number(record.getValue({
    fieldId:'custbody_vehicle_cost_km'
  }));
  var itemCount= record.getLineCount({
    sublistId: 'item'
  });
  for (var a=0;a<itemCount;a++){
    record.setSublistValue({
      sublistId:'item',
      fieldId:'rate',
      line: a,
      value: 0
    });
   var izminatiKM=record.getSublistValue({
     sublistId:'item',
     fieldId:'custcol3',
     line: a
   });
   var LineQty=(vehicleCost/100)*izminatiKM;
   record.setSublistValue({
     sublistId:'item',
     fieldId:'quantity',
     line:a,
     value: LineQty
   });
  }
}
	    return{
			beforeLoad: beforeLoad,
          	beforeSubmit: beforeSubmit
    };
});