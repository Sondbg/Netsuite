/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
 define (["N/search","N/format","N/record"], function(search,format,record){
    function onAction(scriptContext){
        var timeLeave=scriptContext.newRecord;
        var daysOffStart=timeLeave.getValue({fieldId:'custrecord_custbody_from'});
        var daysOffUntil=timeLeave.getValue({fieldId:'custrecord_custbody_to'});
        var unpaid=timeLeave.getValue({fieldId:'custrecord_custbody_nonpaid_leave'});
        var customerTime;
        var department=timeLeave.getValue({fieldId:'custrecord_mo_department'})
        if(unpaid){
            customerTime='5312';
        }else{
            customerTime='5311';
        }
        var employeeID=timeLeave.getValue({fieldId:'custrecord_custbody_employeelist'});
 var arrResult=[]; // it will contain the days for Time Entry

 //filters the Weekend days 6=Saturday , 0=Sunday
 for (var temp=daysOffStart; temp <= daysOffUntil; temp.setDate(temp.getDate()+1)) {
     var dayOfWeek=temp.getDay();
    if(dayOfWeek!='6' && dayOfWeek!='0'){
        arrResult.push(formatDate(temp)); //pushes the nonWeekend days into array
    }
}
daysOffStart=timeLeave.getValue({fieldId:'custrecord_custbody_from'});
var skipDays=loadSearch(daysOffStart,daysOffUntil);
if(skipDays[0]!=undefined){
    skipDays.forEach(function(x){
       arrResult.splice(arrResult.indexOf(x)-1,1);
    });
}
arrResult.forEach(function(d){
    createTimeEntry(employeeID,d,customerTime,department);
})
    }
    return{
        onAction: onAction
    }
//formats the dateObj to a string
function formatDate(input){
    var formated=format.format({value:input, type:format.Type.DATE});
           return formated
       }

function loadSearch(daysStart,daysUntil){
    //Load the search
var workCalendarSS=search.load({id:"customsearch1460"})

//Prepare my filters
var formatStart=format.format({value:daysStart, type:format.Type.DATE});
var formatUntil=format.format({value:daysUntil, type:format.Type.DATE});            
//Add the filters
var filter= search.createFilter({
name:"exceptiondate",
operator: search.Operator.WITHIN,
values: [formatStart,formatUntil]
});
workCalendarSS.filters.push(filter);

//Run and return 50 results
var holidays=workCalendarSS.run().getRange({
start:0,
end:50})

return holidays	
}
//create Time Entry
function createTimeEntry(employee,day,customer,department){
    var [dd,mm,yy]=day.split('.');
    var newDate= new Date();
    newDate.setDate(dd);
    newDate.setMonth(mm-1);
    newDate.setFullYear(yy);
var time=record.create({
    type: record.Type.TIME_BILL,
});
time.setValue({fieldId:'employee',
  value:employee});
time.setValue({fieldId:'trandate',
  value:newDate});
time.setValue({fieldId:'hours',
  value:'8'});
time.setValue({fieldId:'customer',
    value:customer});
time.setValue({fieldId:'item',
    value:'39'});
time.setValue({fieldId:'approvalstatus',
    value:'3'});
time.setValue({fieldId:'memo',
    value:'Създаден автоматично'});
time.setValue({fieldId:'department',
      value:department});
time.save({
    enableSourcing: true,
    ignoreMandatoryFields: true
});
}

 })
