//initialize variables 
function init() {
	window.numCols = 0;
}
window.onload = init;
function addRow() {
	//get title (TODO: make this suck way less)
	var title = prompt("Enter Cell Title");
	
	//add the row to the table
	$('#chi-table tr:last').after('<tr></tr>');

	//get the row index and initialize the col index
	var row = $('#chi-table tr:last').prevAll().length;
	
	//add the cells to the row and label them appropriately.
	var i;
	for (i=1; i <= window.numCols; i++) {
		$('#chi-table tr:last').append("<td class='row"+row+"_col"+i+"' onclick=\"edit('row"+row+"_col"+i+"');\">" + "_"+ '</td>');
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
	var title = prompt("Enter Cell Title");

	//put header in table
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	//add an extra cell to each row
	$('#chi-table tr:not(:first)').each(function(){
		//get the first class attribute of the column before it (the row)
		var rowClass = $(this).children().last().attr('class').split("_")[0];
		
		$(this).append("<td class='"+rowClass+"_col"+window.numCols+ "' onclick=\"edit('row"+row+"_col"+window.numCols+"');\"></td>");
	});
	
	window.numCols++;
}

function edit(identifier) {
	var small = prompt("Enter Small Box Content");
	var large = prompt("Enter Large Box Content");

	$("."+identifier).html("<div class='small-box'>"+small+"</div><div class='large-box'>"+large+"</div>");
}