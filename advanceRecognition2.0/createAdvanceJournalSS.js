/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/log', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 */
    (log, record, runtime, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {

            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["item", "anyof", "36"],
                        "AND",
                        ["datecreated", "within", "thisyear"],
                        "AND",
                        ["custcol_aqt_related_journal", "anyof", "@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "trandate", label: "Date" }),
                        search.createColumn({ name: "line", label: "Line ID" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "memo", label: "Memo" }),
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({ name: "location", label: "Location" }),
                        search.createColumn({ name: "department", label: "Department" }),
                        search.createColumn({ name: "class", label: "Class" })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            log.debug("invoiceSearchObj result count", searchResultCount);
            var result = invoiceSearchObj.run().getRange({
                start: 0,
                end: 1000
            });
            return result


        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {


                var searchRow = JSON.parse(mapContext.value);
                var recordID = searchRow.id;
                var rowLine = searchRow.values.line;
                var memoLine = searchRow.values.memo;
                var amountLine = searchRow.values.amount;
                var location = searchRow.values.location;
                var department = searchRow.values.department;
                var classLine = searchRow.values.class;
                var entity = searchRow.values.entity;
                var tranID = searchRow.values.tranid;
                var tranDate = searchRow.values.trandate;

                var returnObj = {
                    rowLine,
                    memoLine,
                    amountLine,
                    location,
                    department,
                    classLine,
                    entity,
                    tranID,
                    tranDate
                }
                // log.debug('return obj',returnObj)
                // log.debug('mapContext value',searchRow);
                mapContext.write({
                    key: recordID,
                    value: returnObj
                })
            } catch (e) {
                log.error('error Map stage', e)
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            var recordID = JSON.parse(reduceContext.key);
            var lineValues = JSON.parse(reduceContext.values);

            log.debug('reduceContext key', recordID);
            log.debug('reduceContext values', lineValues);
            try {
                var journalRecord = record.create({
                    type: 'journalentry',
                    isDynamic: true
                });
                var date = new Date();
                date.setMonth(11);
                date.setDate(31);
                var user = "8" //Daniel Petkov

                journalRecord.setValue({
                    fieldId: "trandate",
                    value: date,
                    ignoreFieldChange: false
                });

                // journalRecord.setValue({
                //     fieldId: "custbody_aqt_source",
                //     value: recordID,
                //     ignoreFieldChange: false
                // });

                journalRecord.setValue({
                    fieldId: "memo",
                    value: `Ще се приспадне аванс`,  //TODO Invoice  date
                    ignoreFieldChange: false
                });

                journalRecord.setValue({
                    fieldId: "custbody_aqt_created_by",
                    value: user,
                    ignoreFieldChange: false
                });



                setLine("debit");

                setLine('credit');

                function setLine(type) {
                    var account;
                    if (type == 'debit') {
                        account = '807';
                    } else {
                        account = '388'
                    }
                    //412 account field "debit" line - 0
                    // 703 account field "credit" line - 1
                    // sublist is LINE

                    setCurrSublistValue("account", account);
                    setCurrSublistValue(type, "0");
                    setCurrSublistValue("memo", `Ще се приспадне аванс`);
                    setCurrSublistValue("entity", lineValues.entity[0].value);
                    setCurrSublistValue("department", lineValues.department[0].value);
                    setCurrSublistValue("class", lineValues.classLine[0].value);
                    setCurrSublistValue("location", lineValues.location[0].value);
                    setCurrSublistValue("custcol5", recordID)

                    journalRecord.commitLine({
                        sublistId: 'line',
                        ignoreRecalc: false
                    });

                    function setCurrSublistValue(fieldID, value) {
                        journalRecord.setCurrentSublistValue({
                            sublistId: "line",
                            fieldId: fieldID,
                            value: value,
                            ignoreFieldChange: false
                        })
                    }
                }
                journalRecord.save();

                log.debug('journalID', journalRecord.id);
                var journalID=journalRecord.id;

                var invoiceRecord= record.load({
                    type: record.Type.INVOICE,
                    id: recordID,
                    isDynamic: true,
                });
                var linenum=Number(lineValues.rowLine)-1
log.debug('line num',linenum)
                invoiceRecord.selectLine({
                    sublistId: 'item',
                    line: linenum
                });

                invoiceRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_aqt_related_journal',
                    value: journalID,
                    ignoreFieldChange: false
                });
                invoiceRecord.commitLine({
                    sublistId: 'item',
                    ignoreRecalc: false
                });
                invoiceRecord.save();

            } catch (err) {
                log.error('ReduceContext Error', err)
            }


        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return { getInputData, map, reduce, summarize }

    });
