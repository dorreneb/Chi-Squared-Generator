//initialize variables 
function init() {
	window.numCols = 0;
	window.numRows = 0;
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
	for (var i=1; i <= window.numCols; i++) {
		$('#chi-table tr:last').append("<td class='row"+row+" col"+i+"' onclick=\"edit('row"+row+" col"+i+"');\">" + " "+ '</td>');
	}

	//if this is the first row, then shift all the headers over 1 to make room for the title
	if (row == 1) {
		$("#chi-table tr:first").prepend("<th></th>");
	}
	
	//update number of rows
	window.numRows++;
	
	//update row marginals
	$("#row-marginals").append("<li id='marginalrow"+window.numRows+"'>" + title+ ": " + "<span class='marginal'></span></li>");
	
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
		var rowClass = $(this).children().last().attr('class').split(" ")[0];
		
		$(this).append("<td class='"+rowClass+" col"+window.numCols+ "' onclick=\"edit('row"+row+" col"+window.numCols+"');\"></td>");
	});
	
	window.numCols++;
	
	//update Column marginals
	$("#column-marginals").append("<li class='marginalcol"+window.numCols+"'>" + title+ ": <span class='marginal'></span></li>");
	
	
}

function edit(identifier) {
	//get small and large box information
	var small = prompt("Enter Small Box Content");
	var large = prompt("Enter Large Box Content");
	var rowCol = identifier.split(" ");
	
	if (is_int(small) && is_int(large)){
		//add information to the box
		$("."+rowCol[0]+"."+rowCol[1]).html("<div class='small-box'>"+small+"</div><div class='large-box'>"+large+"</div>");
		
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
	
	//get all elements in a row and add up the large box part
	$("."+rowId).each(function() {
		var text = $(this).find(".large-box").text();
		if (is_int(text)) {
			marginal += parseInt(text);
		}
	});
	//update UI
	$("#row-marginals > #marginal"+rowId+" > .marginal").text(marginal);
}

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
	$("#column-marginals > .marginal"+colId+" > .marginal").text(marginal);
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