function test(){
// show result in popup div

    $('body').append('<div id="shadow"><div id = "closewin">Close</div><p id="testoutput"></p><div id="header"></div></div>');
    $('#closewin').on('click', function(e){
        if($(this).is('#closewin')){
            e.preventDefault();
            $('#shadow').remove();
        }
    });
    
    syllabilize(); 
};

function findRule(queryStr,rules) {
// once a traversal path has been found, find the correct rule to apply	
// returns: 0 if no vowel was found
// returns: -1 if vowel but no subrule was found that matches

	// find first vowel where one could use a rule on
	var findRuleIndex = [/x00/g,/x01/g,/x02/g,/x03/g,/x04/g,/x4./g,/x5[0-3]/g,/x54/g,/x55/g,/x56/g,/x7./g,/x80/g,/x81/g,/x82/g];
	// match any of the patterns
	var ruleI = 0; 
	while (queryStr.match(findRuleIndex[ruleI]) == null){
		ruleI++;
		if (ruleI > findRuleIndex.length-1){
			// there seems to be no vowel, skip character then
			return 0;
		}
	}
		
	// find rule based on query String around vowel
	var subruleI = -1; var pattern = "";		
	// use either rule directly or search for latest subrule 		
	if (rules[ruleI].length>0){
		for (var jj = 0; jj < rules[ruleI].length; jj++){
			if (queryStr.match(rules[ruleI][jj]) != null){
				subruleI = jj;
			}
		}
		
		if (subruleI > -1) {
			// subrule found
			pattern = rules[ruleI][subruleI];
		} else {	
			// no subrule found
			return -1;
		}
		console.log("Rule: " + ruleI + "  Subrule: " + subruleI);
	}
	else
	{
		// no subrule exists
		pattern = rules[ruleI];
		console.log("Rule: " + ruleI);
	}
	return pattern;
}

function query(traverseStr,XChar,bInd) {
// generate query string based on traverse string

	var queryStr = ""; 
	for (var ii = 0; ii < traverseStr.length; ii++){
		// class and position index
		var classI = XChar[bInd + ii][traverseStr[ii]][0];
		var posI = XChar[bInd + ii][traverseStr[ii]][1];
				
		queryStr = queryStr + "x" + classI.toString() + posI.toString();
	}
	return queryStr;
}
		
function traverse(text,XChar,i) {
// traverse tree, generate traversal list

	// at the end of the string
	var traverseStr = [0];

	// number must be increasing
	var cont = 1;
	while (cont == 1 && i < text.length && i < XChar.length-1){
		var j = 0;
		var jlast = traverseStr.length - 1;
		var jlast = traverseStr[jlast];
		
		// move through optional character positions
		while (XChar[i+1][j][0] <= XChar[i][jlast][0]){
			j = j + 1;
			// stopping condition, no more options
			if (j == XChar[i+1].length){
				break;
			}
		}
		if (j == XChar[i+1].length){
			// none found
			cont = 0;
		}
		else
		{
			// found next character
			traverseStr.push(j);
		}
		i = i + 1;
	}
	
	return traverseStr;
}		

function generateRules(){
// rule definitions based on regular expressions

	var rules = new Array(26);
	rules[0] = new Array(8);
	rules[0][0] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?(x6.?)?(x9.?)?(x10.(?=x11.?))?/g;
	rules[0][1] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?x5[01](x9.?)?(x10.(?=x11.?))?/g;
	rules[0][2] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?x5[23](x6.?)?x71(x9.?)?(x10.(?=x11.?))?/g;
	rules[0][3] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?(x81)?x80/g;
	rules[0][4] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?x55(x6.?)?x81/g;
	rules[0][5] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?x56(x6.?)?x9.(x10.(?=x11.?))?/g;
	rules[0][6] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?x56(x6.?)?x9.(x10.(?=x11.?))?/g;
	rules[0][7] = /x00(x1.?)?x2[0-9][0-9]?(x3.?)?(x56)?(x6.?)?x72/g;
	rules[1] = new Array(3);	
	rules[1][0] = /x01(x1.)?x2[0-9][0-9]?(x3.?)?(x6.?)?(x9.?)?(x10.(?=x11.?))?/g;
	rules[1][1] = /x01(x1.)?x2[0-9][0-9]?(x3.?)?x80/g;
	rules[1][2] = /x01(x1.)?x2[0-9][0-9]?(x3.?)?x56(x6.?)?x9.(x10.(?=x11.?))?/g;
	rules[2] = new Array(3);
	rules[2][0] = /x02(x1.)?x2[0-9][0-9]?(x3.?)?(x6.?)?(x9.?)?(x10.(?=x11.?))?/g;
	rules[2][1] = /x02(x1.)?x2[0-9][0-9]?(x3.?)?x80/g;
	rules[2][2] = /x02(x1.)?x2[0-9][0-9]?(x3.?)?x56(x6.?)?x9[2-7]/g;
	rules[3] = /x03(x1.)?x2[0-9][0-9]?(x3.?)?(x6.?)?(x10.(?=x11.?))?/g;
	rules[4] = /x04(x1.)?x2[0-9][0-9]?(x3.?)?(x6.?)?/g;
	rules[5] = /(x1.)?x2[0-9][0-9]?(x3.?)?x4.(x6.?)?(x9.?)?(x10.(?=x11.?))?/g;
	rules[6] = /(x1.)?x2[0-9][0-9]?(x3.?)?x5[0-3](x6.?)?(x9.?)?(x10.(?=x11.?))?/g;
	rules[7] = /(x1.)?x2[0-9][0-9]?(x3.?)?x54(x6.?)?(x81)?(x10.(?=x11.?))?/g;
	rules[8] = new Array(2);
	rules[8][0] = /(x1.?)?x2[0-9][0-9]?(x3.?)?x55(x6.?)?x9.(x10.(?=x11.?))?/g;
	rules[8][1] = /(x1.?)?x2[0-9][0-9]?(x3.?)?x55(x6.?)?x70x80/g;
	rules[9] = /(x1.?)?x2[0-9][0-9]?(x3.?)?x56(x6.?)?(x70)?x9.(x10.(?=x11.?))?/g;
	rules[10] = /(x1.?)?x2[0-9][0-9]?(x3.?)?(x6.?)?x7[0-2]x9.(x10.(?=x11.?))?/g;
	rules[11] = /(x1.?)?x2[0-9][0-9]?(x3.?)?(x6.?)?x80/g;
	rules[12] = /(x1.?)?x2[0-9][0-9]?(x3.?)?(x6.?)?x81(x9.?)?(x10.(?=x11.?))?/g;
	rules[13] = /(x1.?)?x2[0-9][0-9]?(x3.?)?(x6.?)?x82(x10.(?=x11.?))?/g;
	return rules;
}

function charMapping(str) {
// X represents character codes per character position in syllable
// XChar collects position in X array (i,j)

	// place characters into categories
	var X = new Array(12);
	X[0] = [3776,3777,3778,3779,3780];
	X[1] = [3755];
	X[2] = [3713,3714,3716,3719,3720,3754,3722,3725,3732,3733,3734,3735,3737,3738,3739,3740,3741,3742,3743,3745,3746,3747,3749,3751,3755,3757,3758,3804,3805];
	X[3] = [3772,3747,3751,3749];
	X[4] = [3768,3769];
	X[5] = [3764,3765,3766,3767,3789,3771,3761];
	X[6] = [3784,3785,3786,3787];
	X[7] = [3751,3757,3773];
	X[8] = [3760,3762,3763];
	X[9] = [3713,3719,3725,3732,3737,3745,3738,3751];
	X[10] = [3720,3754,3722,3742,3743,3749];
	X[11] = [3759,3782,3788];

	// each character gets its own array
	var XChar = new Array(str.length);
	for	(index = 0; index < XChar.length; index++) {
		XChar[index]=[];
	} 
	
	// check entire string
	for (var i = 0, n = str.length; i < n; i++) {
		// search each character in the table
		for (var k = 0, m = X.length; k < m; k++) {
			var matchChar = X[k].indexOf(str.charCodeAt(i));
			if  (matchChar != -1){
				// found it
				var temp = [k,matchChar];
				XChar[i].push(temp);
			}
		}
	}

	return [X,XChar];
}

function tocharacters(text, XChar, CharCodes) {
// function reads a character mapping and outputs the clear letter
	
	// seperate string into components
	var temp = text.toLowerCase().split("x");
	temp.shift();

	var clearText = "";
	for (var jj = 0; jj < temp.length; jj++){
		// remove first number but if three numbers, remove first 2 numbers to obtain character codes
		var nr = temp[jj];
		if (nr.length > 2 && nr[0] != 2)
			{posI = nr.substring(2);classI = nr.substring(0,2);}
		else {posI = nr.substring(1);classI = nr.substring(0,1);};
		
		clearText = clearText + String.fromCharCode(CharCodes[classI][posI]);
	}
	// save syllable in clear text characters
	return clearText;
}

function translate(e) {
	
	var queryStr = e.getAttribute("data-attribute");
	var textfield = document.getElementById("text1");
	textfield.innerHTML = queryStr;
	return false;
}

function toClearText(pattern, XChar, CharCodes) {
	// transforms eg. x01x22x34 into lao characters for console output
	
	// transform to characters
	clearText = tocharacters(pattern.toString(), XChar, CharCodes);
	
	return clearText;
}

function syllabilize() {
	// queryStr: composed of x's and numbers to match to regex
	// traverseStr: composed of numbers that specify the index of optional characters
	
	// clean up any leftovers	
	var testoutput = document.getElementById("testoutput");
	testoutput.innerHTML = "";
  	var x = document.forms["frm1"];
 	var text = "";
   text += x.elements[0].value;

	// for counting the numbers of 'x'
	var regEx = /x/g;

	// save syllables into array
	var syllables = [];
	
	// set first boundary to zero
	var boundaries = [0];

	// remove any non-lao characters
	var texttmp = "";
	for (var jj = 0; jj < text.length; jj++){
			if (text.charCodeAt(jj) < 3713 || text.charCodeAt(jj) > 3805){	
			}
			else {
				texttmp = texttmp + text.charAt(jj);
			}
	}	
	text = texttmp;
	
	// get character to positions mapping
	var temp = charMapping(text);
	var XChar = temp[1];
	var CharCodes = temp[0];

	// generate rules/reg. expressions
	var rules = generateRules();

	var bInd = 0; 	// set first boundary as beginning of string
	var skip = 0;	// skip "wrong" characters
	var count = 1;	// initialize iteration count
	while (bInd < text.length-1 && count < 1000){ // -1 because if there is one character remaining, it cannot be a syllable
		count++;
		  
		console.log("#######################################################");

		console.log("Current syllable stack: " + syllables);
 		console.log("Current Boundary: " + bInd);
 		if (bInd < text.length - 5){
			 		console.log("Position in string: " + text.substring(bInd-4,bInd) + "`´" + text.substring(bInd,bInd + 4));
		} else {	console.log("Position in string: " + text.substring(bInd-4,bInd) + "`´" + text.substring(bInd,text.length-1));}
		
		// store boundary position				
		lastBoundary = bInd;
				
		// generate string to verify
		var traverseStr = traverse(text,XChar,bInd);

		// generate query string based on traverseStr
		var queryStr = query(traverseStr,XChar,bInd);
 
		// find suitable rule
		var pattern = findRule(queryStr,rules);				
		if (pattern != 0){		
			// if matched correctly you now have to match regEx
			var temp = queryStr.match(pattern);
		}
		else {
			// could not find a suitable rule => Character has to be a mistake, continue with next character
			skip = 1;
			bInd += 1;
		}
		
		if (skip != 1) { 		// found a rule, now ensure check was positive 
		if (temp != null){ 	// matched to pattern
		
			// transform match to characters
			syllableClear = toClearText(temp, XChar, CharCodes);
			
			console.log("Matching " + queryStr + " to " + pattern);
			console.log("Matched: " + syllableClear);

			// save syllable
			syllables.push(syllableClear);
			
			// save new boundary
			var smallX = (temp.toString().match(regEx) || []).length;
			bInd = smallX + bInd;
			console.log("New boundary index: " + bInd);
			boundaries.push(bInd);	
		}
		else { // queryStr did not match pattern, include last character from previous syllable
			console.log("Could not match string, include last character from previous syllable");
			var prevValid = 1; var currInvalid = 1; // stopping rule
			while (prevValid && currInvalid){
				
				// go one character back
				bInd = bInd - 1;
				
				// save and remove last syllable (clear text)
				var lastSyllable = syllables[syllables.length-1];
				syllables.pop();				
				
				if (lastSyllable.length >= 3){
					// syllable needs to consist of at least 3 symbols, because we cut one off
					
					//// verify previous variable

					// remove last character from syllable and create mapping
					var texttmp = 	lastSyllable.substring(0,lastSyllable.length-1);
					var temp = 		charMapping(texttmp);
					var XChartmp = temp[1];
					
					console.log("***Verify previous syllable: " + texttmp);
							
					// generate string to verify
					var traverseStr = traverse(texttmp,XChartmp,0);

					// generate query string based on traverseStr
					var queryStrPrev = query(traverseStr,XChartmp,0);

					// match to pattern
					var pattern = findRule(queryStrPrev,rules);
					if (queryStrPrev.match(pattern)!=null) {
						
						var tmp = queryStrPrev.match(pattern).toString();
						
						// clear text
						var temp1 = tocharacters(tmp, XChar, CharCodes);	
						
						// be careful, now the syllable has to be accurately matched in length
						length1 = (queryStrPrev.match(regEx) || []).length;
						length2 = (tmp.match(regEx) || []).length;

						console.log("String: " + queryStrPrev + "   Matching with: " + pattern);
						console.log("Result: " + queryStrPrev.match(pattern));
					}			
					
					// starting from the loop condition that previous syllable is valid, toggle that
					if (queryStrPrev.match(pattern) == null || (length1!=length2) || pattern == -1 ){prevValid = 0;}
				
					//// verify current syllable

					// generate string to verify (bInd is now -1)
					var traverseStr = traverse(text,XChar,bInd);

					console.log("***Verify current syllable: " + text.substring(bInd,bInd+traverseStr.length));
	
					// generate query string based on traverseStr
					var queryStr = query(traverseStr,XChar,bInd);
	
					// match with pattern
					var pattern = findRule(queryStr,rules);
			
					console.log("String: " + queryStr + "   Matching with: " + pattern);
					console.log("Result: " + queryStr.match(pattern));

					if (queryStr.match(pattern) != null) {
						// clear text				
						var temp2 = tocharacters(queryStr.match(pattern).toString(), XChar, CharCodes); 
					}
					
					// update flag
					if (queryStr.match(pattern) != null && pattern!=-1){currInvalid = 0;} 
				}
				else {
					// syllable contains of only two characters
					// update flag
					currInvalid = 1;
					prevValid = 0;
				}
				console.log("prevValid: " + prevValid + " currInvalid: " + currInvalid);
			}
			if (prevValid) {
				// now, since prev is still valid and current is now also valid
				// save syllables
				syllables.push(temp1);
				syllables.push(temp2);
				// replace last boundary
				boundaries.pop();
				boundaries.push(bInd);
				// found new boundary
				var temp = queryStr.match(pattern);
				var smallX = (temp.toString().match(regEx) || []).length;
				bInd = smallX + bInd;
				console.log("New boundary index: " + bInd);
				boundaries.push(bInd);	
			}
			else {
				// now, since prev is not valid anymore, restore last working syllable and skip character
				// restore syllable
				syllables.push(lastSyllable);
				// restore boundary and increase by one to skip character that we originally started with
				bInd = lastBoundary + 1;
				skip = 1;
			}			
		} // end of else condition
		} // end of skip
		skip = 0;
	}
	
	// now that you are done with string you only need to transform your syllables back into characters and append
	console.log("Boundaries: " + boundaries);
	console.log("Stringified matched pattern: " + syllables);
	
	if (count != 1000){
	for (var i = 0, n = syllables.length; i < n; i++) {	

		var x = document.createElement("P");
		var y = document.createElement("div");
		y.className = "divcontainer";
		x.id = "pcontainer";  
		var t = document.createTextNode(syllables[i]);
		

		
		// insert text into p-tag and wrap div around p tag, attach div		
		x.appendChild(t); 
		y.appendChild(x);
    	testoutput.appendChild(y);
    	
    	
    	// add events and set draggable option		
		y.addEventListener("click",getTranslationOnline, false);
		x.setAttribute("draggable","true");
		x.addEventListener("dragstart",handleDragStart);
		y.addEventListener('dragenter', handleDragEnter, false);
  		y.addEventListener('dragover', handleDragOver, false);
  		y.addEventListener('dragleave', handleDragLeave, false);
  		y.addEventListener('drop', handleDrop, false);
	}	
	}
	else {
		// display error message
		var t = document.createTextNode("An error occurred, please check your text for mistakes. You may also check for errors in the console output or directly consult the source code.");
		var x = document.getElementById("header");
		x.appendChild(t);
	}
}


function getTranslation(e) {
// Translations are obtained from html files for the examples listed.	
	
	// query String is collected from each entry in div.
	var queryStr = "";
	var els = this.childNodes;
	[].forEach.call(els, function(el) {
		console.log(el.innerHTML);
		queryStr += el.innerHTML;
	}); 
	
	console.log("Querying: " + queryStr);
	
	var head = document.getElementById("header");
	head.innerHTML = "";
	var fetchFile = "";
	
	// choose translation with respect to queryStr
	switch(queryStr) {
		case "ຄົນ":
			fetchFile = "translations/0_1.html";
			break;	
		case "ລາວ":
			fetchFile = "translations/0_2.html";
			break;
		case "ມັນ":
			fetchFile = "translations/1_1.html";
			break;
		case "ບໍ່":
			fetchFile = "translations/1_2.html";
			break;
		case "ແມ່ນ":
			fetchFile = "translations/1_3.html";
			break;
		case "ຢ່າງ":
			fetchFile = "translations/1_4.html";
			break;
		case "ທີ":
			fetchFile = "translations/1_5.html";
			break;
		case "ເຈົ້າ":
			fetchFile = "translations/1_6.html";
			break;
		case "ຄິດ":
			fetchFile = "translations/1_7.html";
			break;
		case "ເອົາ":
			fetchFile = "translations/2_1.html";
			break;
		case "ເຫມິດ":
			fetchFile = "translations/2_2.html";
			break;
		case "ເດີ":
			fetchFile = "translations/2_3.html";
			break;
	}	

	// get request for .html files
	if (fetchFile != "") {
		$.get( fetchFile , function( data ) {	
  			head.innerHTML = data;
		});
	} else {
		head.innerHTML = "Not found!";	
	}
}

function getTranslationOnline(e) {
// sends a request to lao.php and outputs the result
// Since cross-site get requests are not allowed in javascript, using lao.php
// circumvents this problem
	
	var queryStr = "";
	var els = this.childNodes;
	[].forEach.call(els, function(el) {
		console.log(el.innerHTML);
		queryStr += el.innerHTML;
	}); 
	
	console.log("Querying: " + queryStr);	
	
	
//	var queryStr = this.innerHTML;
	var head = document.getElementById("header");
	head.innerHTML = "";

	// get translations
	$.post("lao.php",{query : queryStr},function(data, textStatus, jqXHR){
		// split response
		var test = data.split("<hr>");
		for (var i = 1, n = test.length; i < n; i++){
			var x = document.createElement("DIV"); 
			var head = document.getElementById("header");
			x.innerHTML = test[i];
			head.appendChild(x);
		}
	});
}