//initialize variables 
function init() {
	window.numCols = 0;
}
window.onload = init;



function addRow() {
	var title = "Row Title"
	//add the row to the table
	$('#chi-table tr:last').after('<tr></tr>');

	//get the row index and initialize the col index
	var row = $('#chi-table tr:last').prevAll().length;
	
	//add the cells to the row and label them appropriately.
	var i;
	for (i=1; i <= window.numCols; i++) {
		$('#chi-table tr:last').append("<td class='row"+row+" col"+i+"'>" + "_"+ '</td>');
	}

	//if this is the first row, then shift all the headers over 1 to make room for the title
	if (row == 1) {
		$("#chi-table tr:first").prepend("<th></th>");
	}
	//prepend the title label
	$('#chi-table tr:last').prepend("<td class='rowtitle'>" + title + '</td>');
	
}

function addColumn() {
	//get title (TODO: make this suck way less)
	var title = "Title";//prompt("Enter Cell Title");

	//put header in table
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	//get the number of columns that there are
	var col = $('#chi-table th:last').prevAll().size() + 1;
	
	//add an extra cell to each row
	$('#chi-table tr:not(:first)').each(function(){
		//get the first class attribute of the column before it (the row)
		var rowClass = $(this).children().last().attr('class').split(" ")[0];
		
		$(this).append("<td class='"+rowClass+" col"+window.numCols+ "'></td>");
	});
	
	window.numCols++;
}