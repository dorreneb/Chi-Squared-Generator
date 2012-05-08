function addRow() {
	$('#chi-table tr:last').after('<tr></tr>');

	var row = $('#chi-table tr:last').prevAll().length;
	$('#chi-table tr:first').children().each(function(){
		$('#chi-table tr:last').append("<td class='row"+row+"'>" + row + '</td>');
	});
}

function addColumn(title) {
	//put header in table
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	//get the number of columns that there are
	var col = $('#chi-table th:last').prevAll().size() + 1;
	
	//add an extra cell to each row
	$('#chi-table tr:not(:first)').each(function(){
		//get the first class attribute of the column before it (the row)
		var rowClass = $(this).children().last().attr('class').split(" ")[0];
		
		$(this).append("<td class='"+rowClass+" col" + col + "'></td>");
	});
}