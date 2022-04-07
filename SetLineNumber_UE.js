function beforeSubmit(type) {
    if(type == 'edit' || type == 'create' || type == 'copy') {
        setLineLineNumbers('item');
    }
}

function setLineLineNumbers(type) {
    var itemCount = nlapiGetLineItemCount(type);
    var counter = 1;

    for (var a = 1; a <= itemCount; a++) {
        if (nlapiGetLineItemValue(type, SETLINENUMBERCONF.LINE_FIELDS.ITEM_TYPE, a) === 'EndGroup') continue;
        nlapiSetLineItemValue(type, SETLINENUMBERCONF.LINE_FIELDS.LINE_NUMBER, a, counter.toString());
        counter++;
    }
}

function beforeLoad(type, form, request) {
    var sublist = form.getSubList('item');
    
    if(sublist) {
        var field = sublist.getField(SETLINENUMBERCONF.LINE_FIELDS.LINE_NUMBER);
        if(field) field.setDisplaySize(1);
    }
}