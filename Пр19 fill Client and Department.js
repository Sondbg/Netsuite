/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/log'], function (currentRecord, log) {


    function validateLine(context) {
        var record = context.currentRecord;
        var currentLine = Number(record.getCurrentSublistIndex({ sublistId: 'item' }));

        if (currentLine === 0) {
            return true
        }
        var [previousCustomer, previousDepartment] = getCustomerAndDepartment(currentLine - 1)

        log.debug({
            'previousDep': previousDepartment,
            'record': record
        })
        var [lineCustomer, lineDepartment] = getCurrentCustomerAndDepartment(currentLine);

        if (lineCustomer == '') {
            try {
                record.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'customer',
                    value: previousCustomer,
                    ignoreFieldChange: true
                });
            } catch (e) {
                log.debug({
                    'setCustomer': previousCustomer,
                    'error': e
                });
            }
        }

        if (lineDepartment == '') {
            try {
                record.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'department',
                    value: previousDepartment,
                    ignoreFieldChange: true
                });
            } catch (e) {
                log.debug({
                    'setDepartment': previousDepartment,
                    'error': e
                })
            }
        }


        return true

        function getCustomerAndDepartment(line) {
            var currCustomer = record.getSublistValue({
                sublistId: 'item',
                fieldId: 'customer',
                line: line
            });
            var currDepartment = record.getSublistValue({
                sublistId: 'item',
                fieldId: 'department',
                line: line
            });
            return [currCustomer, currDepartment];
        }
        function getCurrentCustomerAndDepartment(line) {
            var currCustomer = record.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'customer',
            });
            var currDepartment = record.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'department',
            });
            return [currCustomer, currDepartment];
        }
    }
    return {
        validateLine: validateLine,
    }

})