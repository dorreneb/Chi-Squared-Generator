function addRow() {
	$('#chi-table tr:last').after('<tr></tr>');

	$('#chi-table tr:first').children().each(function(){
		$('#chi-table tr:last').append('<td></td>');
	});
}

function addColumn(title) {
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	$('#chi-table tr:not(:first)').each(function(){
		$(this).append("<td></td>");
	});
}