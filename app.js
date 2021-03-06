//loading a book from disk

function loadBook(filename, displayName)  {
	let currentBook = "";
	let url = "books/" + filename;

	//reset our ui
	document.getElementById("fileName").innerHTML= displayName
	document.getElementById("searchStat").innerHTML = "" ;
	document.getElementById("keyword").value = "" ;

	//create a server  request to load our book
 	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
    xhr.send(); 	


    xhr.onreadystatechange = function () {
      	if	(xhr.readyState === 4 &&  xhr.status == 200){	//is it complete  
		currentBook = xhr.responseText;


		getDocStats(currentBook); 


		//remove line breaks and carriage returns
          currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

		//loaded the file from disk with the aerver to the current book
		document.getElementById("fileContent").innerHTML = currentBook;		
		
		
		var elmnt = document.getElementById("fileContent");
		//every time i load a document, scroll back  cursor to the top
		elmnt.scrollTop = 0;   
	}
    };
}

//get the stats of the book
function getDocStats(fileContent){

	var docLength = document.getElementById("docLength")
	var wodCount = document.getElementById("wodCount")
	var charCount = document.getElementById("charCount")

	let text  = fileContent.toLowerCase();

	//looks for spaces and spaces between characters 
	let wordArray = text.match(/\b\S+\b/g) 

	let wordDictionary = {};

	//filter out the uncommon words
	uncommonwords = filterStopWords(wordArray)


	//count every wordin the wordArray
	for(let word in uncommonwords){
		let wordValue = uncommonwords[word];
		if(wordDictionary[wordValue] > 0) {
			wordDictionary[wordValue] +=1;
		}
		else {
			wordDictionary[wordValue] = 1;
		}
	}

	 //sort the array
    let wordList = sortProperties(wordDictionary);

    //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //return the least 5 words
    var least5Words = wordList.slice(-6, wordList.length);

	ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));


    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;


}

	function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML;

}
	function sortProperties(obj){
		//first convert obj to array
		let returnArray = Object.entries(obj); //now there an array in the value on different indexes

		//sort the array 
		returnArray.sort(function (first, second){
			return second[1]- first[1]
		})

		return returnArray;
	}

	//filter out stop words

	function filterStopWords(wordArray){
		var commonwords = getStopWords();
		var commonObj= {};
		var uncommonArr = [];

		for (i=0; i<commonwords.length;i++){
			commonObj[commonwords[i].trim()] = true
		}

		for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }

    return uncommonArr;
	}



	//a list of stop words we don't want to include in stats
	function getStopWords() {
    	return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
	}


	//heighlighting the word in search
	function performMark() {
		
		//read the keywords
	    var keyword = document.getElementById("keyword").value;
	    var display = document.getElementById("fileContent");

	    var newContent = "";

		//find all the currently marked items 
    	let spans = document.querySelectorAll('mark');
		//<mark></marks - above line will find this 

		//<mark> muneer </mark>
		//gives inner html i.e muneer in here
    	for (var i = 0; i < spans.length; i++) {
        	spans[i].outerHTML = spans[i].innerHTML;
		}

		var re  = new RegExp(keyword, "gi");
		var replaceText = "<mark id='markme'>$&</mark>";
		var bookContent = display.innerHTML;

		//take re and then replacetext and put re inside html elemnets
		//add the mark to the book content
		newContent = bookContent.replace(re, replaceText) 
	   
	    display.innerHTML = newContent;
	    var count = document.querySelectorAll('mark').length;
	    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

	    if (count > 0) {
	        var element = document.getElementById("markme");
	        element.scrollIntoView();
	    };

	}
