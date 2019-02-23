// codetest.js
// version 2 22/02/2019
// author James Davidson

var arrReadArticles = []; // Tracks the articles that the user has read

var arrArticles = [ // Stores current articles
    {"filename" : "article-1.json", "rank" : 1},
    {"filename" : "article-2.json", "rank" : 2},
    {"filename" : "article-3.json", "rank" : 3},
    {"filename" : "article-4.json", "rank" : 4},
    {"filename" : "article-5.json", "rank" : 5}
];



function init() { // Resets the current read articles list when the <body> is loaded
    arrReadArticles = [];
}


function getArticle(filename, showNow=true) { // Gets the json from the server and adds .json attribute to
                                              // arrArticles for that article

    if (ArticleExists(filename)){ // If the article has already been retrieved then show the article
        if (showNow) {
            showArticle(filename);
        }
        return;
    }

    if (filename === undefined){ // If no filename is given return error
        alert("No file name given");
        return false;
    }

    var URL = "http://3.8.136.10/bbccodetest/article/" + filename;

    var httpreq = new XMLHttpRequest();

    httpreq.onreadystatechange = function () { // When the server responds to the GET request
        if (this.readyState == 4) {

            switch (this.status){ // Checks for the response status code
                case 200:
                    var jsonArticle = JSON.parse(this.responseText);

                    for (var i = 0; i < arrArticles.length; i++) { // Looping through all of the articles
                        if (arrArticles[i].filename == filename) {

                            arrArticles[i].json = jsonArticle;
                            if (showNow){
                                showArticle(filename);
                            }
                        }

                    }
                    break;

                default: // If the request was not successful
                    var divArticle = document.getElementById("articleContent");
                    divArticle.innerHTML = ""; // Clears articleContent
                    var divError = document.createElement("div");
                    divError.innerHTML = "Something went wrong";
                    divError.className = "errorbox";
                    divArticle.appendChild(divError);
                    break;
            }



        }
    };
    httpreq.open("GET", URL, true);

    httpreq.send(); // Sends the request
    return;
}

function showArticle(filename) { // Displays the article
    var jsonArticle;

    var divContent = document.getElementById("articleContent");
    divContent.innerHTML = "";
    if (filename === undefined){
        alert("No file name given");
        return false;
    }

    for (var i = 0; i < arrArticles.length; i++) { // Finds the current article
        if (arrArticles[i].filename == filename) {
             jsonArticle = arrArticles[i].json;
        }
    }

    if ( jsonArticle === undefined) { // If the article was not found
        alert("Article not found");
        return false;
    }

    if (arrReadArticles.includes(filename) === false){ // Adds the article to the read list if it is not added already
        arrReadArticles.push(filename);
    }


    //console.log(arrReadArticles);

    var divProgress = document.getElementById("progress");

    if (arrReadArticles.length != 5) { // Updates the list of read articles
        divProgress.innerHTML = "<p>You have read " + arrReadArticles.length + " of today's "+arrArticles.length+" articles.</p>";
    } else { // Creates the ranking button
        divProgress.innerHTML = "<p>You have read all of today's articles, would you like to rank them?</p>" ;
        var lnkRank = document.createElement("a");
        lnkRank.href = "#";
        lnkRank.onclick = function(){
            getRanking();
        };
        lnkRank.innerText = "Rank articles";
        divProgress.appendChild(lnkRank);
    }

    // Starts laying out the article

    var divContent = document.getElementById("articleContent");


    var tagTitle = document.createElement("h2"); // Creates the article title
    tagTitle.className = "article";
    tagTitle.innerHTML = jsonArticle.title;
    divContent.appendChild(tagTitle);


    for (var i = 0; i < jsonArticle.body.length; i++){ // Loops through all of the content in the article
        //console.log(jsonArticle.body[i].type);
        switch (jsonArticle.body[i].type) { // Checks for the type of content
            case "heading": // Creates a h3 tag with the heading
                var tagHeading = document.createElement("h3");
                tagHeading.className = "article";
                tagHeading.innerHTML = jsonArticle.body[i].model.text;
                divContent.appendChild(tagHeading);
                break;
            case "paragraph": // Creates a p tag with the paragraph
                var tagParagraph = document.createElement("p");
                tagParagraph.innerHTML = jsonArticle.body[i].model.text;
                divContent.appendChild(tagParagraph);
                break;
            case "image": // Creates an image with the alt text
                var divImage = document.createElement("div");
                var tagImage = document.createElement("img");
                tagImage.src = jsonArticle.body[i].model.url;
                tagImage.alt = jsonArticle.body[i].model.altText;
                tagImage.height = jsonArticle.body[i].model.height;
                tagImage.width = jsonArticle.body[i].model.width;

                divImage.appendChild(tagImage);

                divContent.appendChild(divImage);
                break;
            case "list": // Creates a list
                switch (jsonArticle.body[i].model.type) { // Checks for ordered or unordered list
                    case "unordered":
                        var tagList = document.createElement("ul");
                        for (var j = 0; j < jsonArticle.body[i].model.items.length; j++){
                            // Loops for each item in the list and creates a list entry
                            var tagItem = document.createElement("li");
                            tagItem.innerHTML = jsonArticle.body[i].model.items[j];
                            tagList.appendChild(tagItem);
                        }
                        //console.log(tagList.innerHTML);
                        //console.log(tagList.outerHTML);
                        divContent.appendChild(tagList);
                        break;

                    case "ordered":
                        var tagList = document.createElement("ol");
                        for (var j = 0; j < jsonArticle.body[i].model.items.length; j++){
                            // Loops for each item in the list and creates a list entry
                            var tagItem = document.createElement("li");
                            tagItem.innerHTML = jsonArticle.body[i].model.items[j];
                            tagList.appendChild(tagItem);
                        }
                        //console.log(tagList.innerHTML);
                        //console.log(tagList.outerHTML);
                        divContent.appendChild(tagList);
                        break;
                }

                divContent.appendChild(tagList);
                break;

        }
    }

    generateNextButton(filename); // Creates a next button and preloads that article

    return true;
}




function ArticleExists(filename) { // Checks if the article has been loaded
    for (var i = 0; i < arrArticles.length -1; i++){
        if (filename == arrArticles[i].filename){ // finds the article in the array
            if (arrArticles[i].hasOwnProperty("json")){
                return true;
            }
        }
    }
    return false;
}

function generateNextButton(filename){ // Generates the button and preloads the next article
    var divContent = document.getElementById("articleContent");
    for (var i = 0; i < arrArticles.length -1; i++){
        if (filename == arrArticles[i].filename){ // Finds the currenly article
            if (i <= arrArticles.length - 1){ // If it is not the last article
                var btnNext = document.createElement("input"); // Create a button
                btnNext.type = "button";
                btnNext.value = "Next";
                btnNext.filename = arrArticles[i+1].filename; // Set the next article as the filename
                getArticle(btnNext.filename, false); // Get the next article but not show it
                btnNext.onclick = function(){
                  showArticle(this.filename);
                };
                divContent.appendChild(btnNext);
            }
        }
    }
}


function getRanking() { // Draws the ranking page
    var divContent = document.getElementById("articleContent");
    divContent.innerHTML = "";

    var divRankHelp = document.createElement("div"); // Shows explanation
    divRankHelp.innerHTML = "<h3>Ranking</h3><p>Please put the articles into the order you liked them, " +
        "with the best at the top.</p><p>Please use the submit button to send your rankings to us.</p>";
    divContent.appendChild(divRankHelp);

    var tblRanking = document.createElement("table"); // Creates a table
    divContent.appendChild(tblRanking);

    var rowHeading = tblRanking.insertRow(-1); // Adds the  headings
    rowHeading.insertCell(0).innerHTML = "<b>Rank</b>";
    rowHeading.insertCell(1).innerHTML = "<b>Article</b>";

    for (var n = 0; n < arrArticles.length; n++){ // Loops for each article
        for (var i = 0; i < arrArticles.length; i++) { // finds the article with the correct rank
            if (arrArticles[i].rank == (n + 1)) {

                var rowRanking = tblRanking.insertRow(-1);
                rowRanking.insertCell(0).innerHTML = arrArticles[i].rank;
                rowRanking.insertCell(1).innerHTML = arrArticles[i].json.title;

                var cellUp = rowRanking.insertCell(2);
                var cellDown = rowRanking.insertCell(3);

                if (arrArticles[i].rank >= 2) { // Creates Up button unless it is the top article
                    var btnUp = document.createElement("input");
                    btnUp.type = "button";
                    btnUp.value = "Up";
                    btnUp.rank = arrArticles[i].rank;
                    btnUp.row = rowRanking;
                    btnUp.tbl = tblRanking;
                    btnUp.onclick = function () {
                        for (var j = arrArticles.length - 1; j >= 0; j--) {
                            if (arrArticles[j].rank == this.rank) { // Finds current article and decrements the rank
                                arrArticles[j].rank = (this.rank - 1);
                            } else if (arrArticles[j].rank == (this.rank - 1)) { // Finds article above it and sets it
                                arrArticles[j].rank = (this.rank);               // to the current rank
                            }
                        }
                        getRanking(); // recalls getRanking to update the display
                        return;
                    };
                    cellUp.appendChild(btnUp);

                }

                if (arrArticles[i].rank <= (arrArticles.length - 1)) {
                    // Creates Down button unless it is the bottom article
                    var btnDown = document.createElement("input");
                    btnDown.type = "button";
                    btnDown.value = 'Down';
                    btnDown.rank = arrArticles[i].rank;
                    btnDown.row = rowRanking;
                    btnDown.tbl = tblRanking;
                    btnDown.onclick = function () {
                        for (var j = 0; j < arrArticles.length ; j++) {
                            if (arrArticles[j].rank == this.rank) { // Finds current article and increments the rank
                                arrArticles[j].rank = (this.rank + 1);
                            } else if (arrArticles[j].rank == (this.rank + 1)) { // Finds article below it and sets it
                                arrArticles[j].rank = (this.rank);               // to the current rank
                            }
                        }
                        getRanking(); // recalls getRanking to update the display
                        return;
                    };
                    cellDown.appendChild(btnDown);
                }
            }
        }
    }

    var btnSubmit = document.createElement("input"); // Creates a submit button
    btnSubmit.type = "button";
    btnSubmit.value = "Submit my rankings";
    btnSubmit.onclick = function(){
        submitRankings("http://3.8.136.10/bbccodetest/setranking.php");
    };

    var btnSubmitFake = document.createElement("input"); // Creates a submit button to a site that does not exist
    btnSubmitFake.type = "button";
    btnSubmitFake.value = "Submit my rankings to a site that doesn't exist";
    btnSubmitFake.onclick = function(){
        submitRankings("http://madeupsite.com"); // Does not exist
    };

    divContent.appendChild(btnSubmit); // Layouts the submit buttons
    divContent.appendChild(document.createElement("br"));
    divContent.appendChild(btnSubmitFake);
    var divSubmitResponse = document.createElement("div");
    divSubmitResponse.id = "SubmitResponse";
    divContent.appendChild(divSubmitResponse);
}

function submitRankings(URL) { // POSTs the rankings to a server
    var httpreq = new XMLHttpRequest();

    httpreq.onreadystatechange = function () {
        if (this.readyState == 4){ //  When the server responds
            var divSubmitResponse = document.getElementById("SubmitResponse");
            switch (this.status){
                case 200: // Successful response
                    divSubmitResponse.innerHTML = this.responseText;
                    divSubmitResponse.className = "successbox"; // Success box
                    break;
                default: // Failed response
                    divSubmitResponse.innerHTML = "Something went wrong";
                    divSubmitResponse.className = "errorbox"; // Error box
                    break;
            }
        }



    };

    httpreq.open("POST", URL, true);
    httpreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpreq.send(JSON.stringify(arrArticles)); // Sends POST request
}