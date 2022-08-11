/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
 define(['N/log', 'N/record', 'N/search', 'N/runtime', 'N/format'],

 (log, record, search, runtime,format) => {

var checkedJiraKeys={};
     const getInputData = (inputContext) => {
        var scriptObj = runtime.getCurrentScript();
        var savedSearchID=scriptObj.getParameter({
            name: "custscript_saved_search_id"
         });
         var savedSearch = search.load({
             id: savedSearchID
         });
         return savedSearch;

     }

     // Map  stage
     const map = (mapContext) => {
         var searchResult = JSON.parse(mapContext.value);
         var scriptObj = runtime.getCurrentScript();
         var mustBeStatus=scriptObj.getParameter({
             name: "custscript_project_status"
          });
          var avoidRevenueType=scriptObj.getParameter({
             name: "custscript_project_revenue_type"
          });
          var finalInvoiceFieldID=scriptObj.getParameter({
            name: "custscript_project_final_invoice_field"
         });
         var jiraKeyFieldID=scriptObj.getParameter({
            name: "custscript_project_field_jirakey"
         });
         var projectStatusFieldID=scriptObj.getParameter({
            name: "custscript_project_status_field"
         });
         var revenueTypeFieldID=scriptObj.getParameter({
            name: "custscript_project_revenue_type_field"
         });
        /*  
        log.debug({
              title: 'savedSearch',
              details: searchResult
          }); 
          */
try{
         var date = searchResult.values[finalInvoiceFieldID];
         var jiraKey = searchResult.values[jiraKeyFieldID];
         var id = searchResult.id;
         var debugMsg=`${id} `;
        var flagged=false;
         //must be Closed
         var projectStatus = searchResult.values[projectStatusFieldID];
         if (projectStatus.hasOwnProperty('value')) {
             projectStatus = projectStatus.value;
         };

         //NOT equal to Percent Complete
         var revenueType = searchResult.values[revenueTypeFieldID];
         if (revenueType.hasOwnProperty('value')) {
             revenueType = revenueType.value;
         };

         if(date==""){
            debugMsg+=' =>Date is empty!';
            flagged=true;
         }else{
            date= format.parse({
                value:date,
                type: format.Type.DATE});
            var halfYearAgo = new Date();
            halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);

            if(date >halfYearAgo){
             debugMsg+= ` =>Date is not 6 months or older! ${date}`
              flagged=true; 
            } 
         }
         if(projectStatus!=mustBeStatus){
            debugMsg+= ` =>Status is not 'Closed'! ${searchResult.values[projectStatusFieldID].text}`
            flagged=true;
         };
         if(revenueType ==avoidRevenueType){
            debugMsg+= ` =>Using wrong Revenue Type'! ${searchResult.values[revenueTypeFieldID].text}`
            flagged=true;
         }
         
         if(flagged==true){
            // log.debug({
            //     title: `Did not pass: `,
            //     details: debugMsg
            // })
         }else{
            log.debug({
                title: "Can pass",
                details: `Project ID: ${id} Status: ${projectStatus} || Date: ${date} || Revenue Type: ${revenueType} || Jira Key: ${jiraKey}`
            })
            mapContext.write({'id':id,
            'jiraKey':jiraKey})    
         }
                    }catch(e){
                        log.audit({
                            title: 'error',
                            details: e
                        })
                    }

     }
     //reduce Stage
     const reduce = (reduceContext) => {
         var reduceKey = JSON.parse(reduceContext.key);
         var scriptObj = runtime.getCurrentScript();
         var mustBeStatus=scriptObj.getParameter({
            name: "custscript_project_status"
         });
         var avoidRevenueType=scriptObj.getParameter({
            name: "custscript_project_revenue_type"
         });
         var finalInvoiceFieldID=scriptObj.getParameter({
            name: "custscript_project_final_invoice_field"
         });
         var jiraKeyFieldID=scriptObj.getParameter({
            name: "custscript_project_field_jirakey"
         });
         var projectStatusFieldID=scriptObj.getParameter({
            name: "custscript_project_status_field"
         });
         var revenueTypeFieldID=scriptObj.getParameter({
            name: "custscript_project_revenue_type_field"
         });
         
  try{      
        var projectId= reduceKey.id;
        var jiraKey=reduceKey.jiraKey;
        var halfYearAgo = new Date();
        halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
        var filterDate=format.format({
            value:halfYearAgo,
            type: format.Type.DATE});

        log.debug({
            title: "passed id:key + date 6 months ago",
            details: "ProjectID: "+projectId+' || JiraKey:'+jiraKey+' || Date 6 months ago: '+filterDate
        });
        if(checkedJiraKeys[jiraKey]==undefined){
            var savedSearch = search.create({
                type: "job",
                filters:
                [
                   ["isinactive","is","F"], 
                   "AND", 
                   [[projectStatusFieldID,"noneof",mustBeStatus],"OR",[revenueTypeFieldID,"anyof",avoidRevenueType],"OR",[finalInvoiceFieldID,"after",filterDate]], 
                   "AND", 
                   [jiraKeyFieldID,"is",jiraKey]
                ],
                columns:
                [
                   search.createColumn({name: "customer", label: "Customer"})
                ]
             });
    
            var searchResult=savedSearch.run().getRange({
                start: '0',
                end: '5'
            });
    
            //  log.debug({
            //      title: 'Search Result',
            //      details: searchResult
            //  });
            //  log.debug({
            //     title: 'Search length',
            //     details: searchResult.length
            // });
            if(searchResult.length>0){
                checkedJiraKeys[jiraKey]="failed";
                return
            }else{
                checkedJiraKeys[jiraKey]="passed";
            }
        }
        // if the group passes the check
        if(checkedJiraKeys[jiraKey]="passed"){

        
            var recordType = 'job';
            record.submitFields({
    type: recordType,
    id: projectId,
    values: {
        isinactive: true
    },
    options: {
        enableSourcing: false,
        ignoreMandatoryFields : true
    }
});
   
            log.debug({
                title: 'To Deactivate',
                details: `ProjectID: ${projectId} || Jira Key: ${jiraKey}`
            });
        
        }

        }catch(e){
            log.audit({
                     title: 'error in Reduce stage',
                     details: e
                 }); 
        }
     }

     //Summarize stage
     const summarize = (summaryContext) => {
         // log.audit({
         //     title: 'input Summary',
         //     details: summaryContext.inputSummary
         // });
         // log.audit({
         //     title: 'Map Summary',
         //     details: summaryContext.mapSummary
         // });
         // log.audit({
         //     title: 'Reduce Summary',
         //     details: summaryContext.reduceSummary
         // });
         log.audit({
             title: 'usage',
             details: summaryContext.usage
         })
     }

     return { getInputData, map, reduce, summarize }

 });
