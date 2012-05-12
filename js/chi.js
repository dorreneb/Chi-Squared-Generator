//initialize variables when page loads
window.onload = function() {
	window.numCols = 0;
	window.numRows = 0;
};

//add a row to the table
function addRow() {
	//get title
	var title = prompt("Enter Cell Title");
	
	//temporarily remove the column marginals if it exists
	var colmarginals = $('#chi-table tr.colmarginals');
	if (colmarginals.length) {
		colmarginals.remove();
	} 
	
	//add the new row to the table
	$("#chi-table tr:last").after('<tr></tr>');
	
	//update number of rows
	window.numRows++;
	
	//add as many cells as there are columns and label them appropriately.
	for (var i=1; i <= window.numCols; i++) {
		$('#chi-table tr:last').append(
			"<td class='row" + window.numRows + " col" + i +
			"' onclick=\"edit('row" + window.numRows + " col" + i + "');\">" +
			"</td>");
	}
	
	//create row marginal cell
	$("#chi-table tr:last").append(
		"<td id='row-marginalrow" + window.numRows + "' class='marginal'></td>");
	
	//prepend the title label
	$('#chi-table tr:last').prepend("<td class='rowtitle'>" + title + '</td>');
	
	//re-add the column marginal row
	$("#chi-table tr:last").after(colmarginals);
}

function addColumn() {
	var populationBox = null;
	
	//get title
	var title = prompt("Enter Cell Title");

	//put header in table
	$("#chi-table tr:first").append("<th>" + title + "</th>");
	
	//if this is the first column, then shift all the column headers over one 
	//to make room for the row titles. Also, create the column marginal row.
	if (window.numCols == 0) {
		$("#chi-table tr:first").prepend("<th></th>");
	//if it is not the first row, remove the column marginal row temporarily
	} else {
		var columnMarginals = $("#chi-table tr.colmarginals");
		
		//if the population box exists, temporarily remove it
		if ($("#chi-table tr.colmarginals > td.population").length) {
			populationBox = $("#chi-table tr.colmarginals > td.population");
			populationBox.remove();
		}
		
		columnMarginals.remove();
	}
	
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
	
	//if the column marginal row does not exist, make it
	//otherwise, it has been removed earlier -- put it back in
	if (window.numCols == 1) {
		$("#chi-table tr:last").after(
			'<tr class="colmarginals"><td class="marginal"></td></tr>');
		var columnMarginals = $("#chi-table tr.colmarginals");
	} else {
		$("#chi-table tr:last").after(columnMarginals);
	}
	

	//update Column marginals
	columnMarginals.append(
		"<td class='marginal'><span id='col-marginalcol" + window.numCols + 
		"'></span></td>");
		
	//if the population box was removed, re-add it.
	if (populationBox != null) {
		columnMarginals.append(populationBox);
	}
	
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
		calculatePopulation();
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
	var chisquare = (Math.pow((big-small), 2) / small).toFixed(3);
	
	$("#"+boxId).html(identifier+": <span class='result'>"+chisquare+"</span>");
	calculateChiTotal();
}

function calculateRowMarginal(rowId) {
	var marginal = 0;
	var marginal_id = "row-marginal" + rowId;
	
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

function calculateColMarginal(colId) {
	var marginal = 0;
	var marginal_id = "col-marginal" + colId;

	//get all elements in a row and add up the large box part
	$("."+colId).each(function() {
		var text = $(this).find(".large-box").text();
		if (is_int(text)) {
			marginal += parseInt(text);
		}
	});
	
	//update UI
	$("#" + marginal_id).text(marginal);
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

function calculatePopulation() {
	//calculate population based on column marginals
	var population = 0;
	$("#chi-table tr.colmarginals > td.marginal").each(function() {
		if (is_int($(this).text())){
			population += parseInt($(this).text());
		}
	});
	
	//check if population box is in there, and if not, create one.
	if ($("#chi-table tr.colmarginals > td.population").length == 0) {
		$("#chi-table tr.colmarginals").append("<td class='population'></td>");
	}
	
	//update the population
	$("#chi-table tr.colmarginals > td.population").text(population);
}

//Source: http://www.inventpartners.com/content/javascript_is_int
function is_int(value){ 
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  } else { 
      return false;
  } 
}