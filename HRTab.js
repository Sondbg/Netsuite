function userEventBeforeLoad(type, form, request) {
	if (type == 'edit' || type == 'create') {
		var expenseForm = nlapiGetFieldValue('customform');


		if (expenseForm == '47') //change this to an internal id of the custom form you want to hide the expense subtab.
		{
			var currentForm = form.getSubList('humanresources');
			currentForm.setDisplayType('hidden');
		}
	}
	if (type == 'view') {
		var expenseForm = nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), 'customform');
		if (expenseForm == '47') //change this to an internal id of the custom form you want to hide the expense subtab.
		{
			var currentForm = form.getSubList('humanresources');
			currentForm.setDisplayType('hidden');
		}
	}
}