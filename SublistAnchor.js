/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/error',],function(error){
  function pageInit(scriptContext) {
    var windowHeight = jQuery(window).height();

  jQuery('.uir-machine-table-container')
        .css('height', '70vh')
        .bind('scroll', function(event) {
            var headerElem = jQuery('.uir-machine-headerrow');
            var adjustedHeader = event.target.scrollTop - 2;
            headerElem.css({'transform': 'translate(0,'+adjustedHeader+'px)'})
        })
        .bind('scroll', function(event) {
            var headerElem = jQuery('.uir-list-headerrow');
            headerElem.css('transform',
 'translate(0, '+event.target.scrollTop+'px)');
        })

    };
	return {
		pageInit:pageInit
	}
})
