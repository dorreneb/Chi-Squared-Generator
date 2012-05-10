//initialize variables when page loads
window.onload = function() {
	window.numCols = 0;
	window.numRows = 0;
};

//add a row to the table
function addRow() {
	//get title
	var title = prompt("Enter Cell Title");
	
	//add the row to the table
	$('#chi-table tr:last').after('<tr></tr>');
	
	//update number of rows
	window.numRows++;
	
	//add as many cells as there are columns and label them appropriately.
	for (var i=1; i <= window.numCols; i++) {
		$('#chi-table tr:last').append(
			"<td class='row" + window.numRows + " col" + i +
			"' onclick=\"edit('row" + window.numRows + " col" + i + "');\">" +
			"</td>");
	}

	//if this is the first row, then shift all the column headers over one 
	//to make room for the row titles. Also add the row marginal column
	if (window.numRows == 1) {
		$("#chi-table tr:first").prepend("<th></th>");
	}
	
	
	//create row marginal cell
	$("#chi-table tr:last").append(
		"<td id='marginalrow" + window.numRows + "' class='marginal'></td>");
	
	//prepend the title label
	$('#chi-table tr:last').prepend("<td class='rowtitle'>" + title + '</td>');
	
}

function addColumn() {
	//get title
	var title = prompt("Enter Cell Title");

	//put header in table
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	//update number of columns
	window.numCols++;
	
	//add an extra cell to each row that is not a column header row
	var rowIndex = 1;
	$('#chi-table tr:not(:first)').each(function(){
		//TODO: make this less messy -- it's hacky as all hell.
		//remove the row marginal to add the column to the end
		var marginal = $(this).find("td:last-child");
		marginal.remove();
		
		//add the column and then re-add the row marginal
		$(this).append(
			"<td class='row" + rowIndex + " col" + window.numCols + "'" +
			"onclick=\"edit('row" + rowIndex + " col" + window.numCols +
			"');\"></td>");
		$(this).append(marginal);
		rowIndex++;
	});
	
	//update Column marginals
	$("#column-marginals").append(
		"<li class='marginalcol" + window.numCols + "'>" + title + ": " +
		"<span class='col-marginal'></span></li>");
	
	
}

//gets what should go into the small and large boxes from the user and then 
//updates the chi squared box, the column marginals, and chi-squared totals
function edit(identifier) {
	//get small and large box information
	var small = prompt("Enter Small Box Content");
	var large = prompt("Enter Large Box Content");
	
	//get the row and column of the box that is being edited
	//row is rowCol[0], col is rowCol[1].
	var rowCol = identifier.split(" ");
	
	//if the inputs are valid, update!
	if (is_int(small) && is_int(large)){
		//add information to the box
		$("." + rowCol[0] + "." + rowCol[1]).html(
			"<div class='small-box'>" + small + "</div>" +
			"<div class='large-box'>" + large + "</div>");
		
		//update the chi squared information
		calculateRowMarginal(rowCol[0]);
		calculateColMarginal(rowCol[1]);
		updateChiSquared(identifier);
	} else {
		alert("Inputs are invalid :(");
	}
}

function updateChiSquared(identifier) {
	var rowCol = identifier.split(" ");
	var boxId = "chi-squared"+rowCol[0]+rowCol[1];
	
	//add the chi-squared bulletpoint if it doesn't exist
	if (!$("#"+boxId).length){
		$("#chi-squared-numbers").append("<li id='"+boxId+"'></li>");
	}
	
	var big = parseInt($("."+rowCol[0]+"."+rowCol[1]+" > .large-box").text());
	var small = parseInt($("."+rowCol[0]+"."+rowCol[1]+" > .small-box").text());
	var chisquare = Math.pow((big-small), 2) / small;
	
	$("#"+boxId).html(identifier+": <span class='result'>"+chisquare+"</span>");
	calculateChiTotal();
}

function calculateRowMarginal(rowId) {
	var marginal = 0;
	var marginal_id = "marginal" + rowId;
	
	//get all elements in a row and add up the large box part
	$("."+rowId).each(function() {
		var text = $(this).find(".large-box").text();
		if (is_int(text)) {
			marginal += parseInt(text);
		}
	});
	
	//update UI
	$("#" + marginal_id).text(marginal);
}

//TODO: fix the 
function calculateColMarginal(colId) {
	var marginal = 0;
	
	
	//get all elements in a row and add up the large box part
	$("."+colId).each(function() {
		var text = $(this).find(".large-box").text();
		if (is_int(text)) {
			marginal += parseInt(text);
		}
	});
	
	//update UI
	$("#column-marginals > .marginal" + colId + " > .col-marginal").text(marginal);
}

function calculateChiTotal() {
	var total = 0;
	//get all chi results
	$(".result").each(function() {
		total +=  parseFloat($(this).text());
	});
	
	//put the chi results on the screen
	$("#chi-squared-result").html("<div class='final-result'>"+total+"</div>");
}

//Source: http://www.inventpartners.com/content/javascript_is_int
function is_int(value){ 
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  } else { 
      return false;
  } 
}