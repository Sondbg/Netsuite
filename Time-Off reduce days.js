/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define (['N/record'], function(record){
    function onAction(scriptContext){
        var timeLeave=scriptContext.newRecord;
        var employeeID=timeLeave.getValue({fieldId:'custrecord_custbody_employeelist'});
        var daysOff=timeLeave.getValue({fieldId:'custrecordcust_days_leave'});
        reduceEmployeeDays(daysOff,employeeID);
}
    return{
        onAction: onAction
    }
        //load the Employee record and the fields for how many days paidLeave he has left.
        function reduceEmployeeDays(days,employee){
        var employeeRecord= record.load({
        type: 'employee',
        id: employee
        });
        var daysLeft=employeeRecord.getValue({fieldId:'custentity_custbody_hr_days_leave_left'});
        var prevYearDaysLeft=employeeRecord.getValue({fieldId:'custentity_custbody_days_leave_prevyear'});
        // if he has days left from last year, reduce those
        if(prevYearDaysLeft>=days){
            employeeRecord.setValue({
                fieldId:'custentity_custbody_days_leave_prevyear',
                value: prevYearDaysLeft-days,
            });
        }else{ //else reduce the days from the current year.
        employeeRecord.setValue({
            fieldId:'custentity_custbody_hr_days_leave_left',
            value: daysLeft-days+prevYearDaysLeft,
        });
         //null the prevYear if it was not 0.
        prevYearDaysLeft!=0? employeeRecord.setValue({
            fieldId:'custentity_custbody_days_leave_prevyear',
            value: 0,
        }):'';
    }
        employeeRecord.save({
            enableSourcing: false,
     ignoreMandatoryFields: false
        });
        return
    }
})