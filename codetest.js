// codetest.js
// version 1 17/02/2019
// author James Davidson

var arrReadArticles = [];
//var arrArticles = ["article-1","article-2","article-3","article-4","article-5"];
var arrArticles = [
    {"filename" : "article-1.json", "rank" : 1},
    {"filename" : "article-2.json", "rank" : 2},
    {"filename" : "article-3.json", "rank" : 3},
    {"filename" : "article-4.json", "rank" : 4},
    {"filename" : "article-5.json", "rank" : 5}
];



function init() {
    arrReadArticles = [];
}


function getArticle(filename) {
    var divContent = document.getElementById("articleContent");
    divContent.innerHTML = "";
    if (filename === undefined){
        alert("No file name given");
        return false;
    }
    var URL = "http://3.8.136.10/bbccodetest/article/" + filename;

    var httpreq = new XMLHttpRequest();

    httpreq.onreadystatechange = function () {
        if (this.readyState == 4){

            var jsonArticle = JSON.parse(this.responseText);

            if (arrReadArticles.includes(filename) === false){
                arrReadArticles.push(filename);
                for (var i = 0; i < arrArticles.length; i++){
                    if (arrArticles[i].filename == filename){

                        arrArticles[i].json = jsonArticle;
                    }

                }
            }
            console.log(arrReadArticles);

            var divProgress = document.getElementById("progress");

            if (arrReadArticles.length != 5) {
                divProgress.innerHTML = "<p>You have read " + arrReadArticles.length + " of today's 5 articles.</p>";
            } else {
                divProgress.innerHTML = "<p>You have read all of today's articles, would you like to rank them?</p>" ;
                var lnkRank = document.createElement("a");
                lnkRank.href = "#";
                lnkRank.onclick = function(){
                    getRanking();
                };
                lnkRank.innerText = "Rank articles";
                divProgress.appendChild(lnkRank);
            }



            var divContent = document.getElementById("articleContent");

            //divContent.innerHTML = jsonArticle.title;
            //divContent.innerHTML = "<h1>" + jsonArticle.title + "</h1>";

            var tagTitle = document.createElement("h2");
            tagTitle.className = "article";
            tagTitle.innerHTML = jsonArticle.title;
            divContent.appendChild(tagTitle);


            for (var i = 0; i < jsonArticle.body.length; i++){
                console.log(jsonArticle.body[i].type);
                switch (jsonArticle.body[i].type) {
                    case "heading":
                        var tagHeading = document.createElement("h3");
                        tagHeading.className = "article";
                        tagHeading.innerHTML = jsonArticle.body[i].model.text;
                        divContent.appendChild(tagHeading);
                        break;
                    case "paragraph":
                        var tagParagraph = document.createElement("p");
                        tagParagraph.innerHTML = jsonArticle.body[i].model.text;
                        divContent.appendChild(tagParagraph);
                        break;
                    case "image":
                        var divImage = document.createElement("div");
                        var tagImage = document.createElement("img");
                        tagImage.src = jsonArticle.body[i].model.url;
                        tagImage.alt = jsonArticle.body[i].model.altText;
                        tagImage.height = jsonArticle.body[i].model.height;
                        tagImage.width = jsonArticle.body[i].model.width;

                        divImage.appendChild(tagImage);

                        divContent.appendChild(divImage);
                        break;
                    case "list":
                        switch (jsonArticle.body[i].model.type) {
                            case "unordered":
                                var tagList = document.createElement("ul");
                                for (var j = 0; j < jsonArticle.body[i].model.items.length; j++){
                                    var tagItem = document.createElement("li");
                                    tagItem.innerHTML = jsonArticle.body[i].model.items[j];
                                    tagList.appendChild(tagItem);
                                }
                                console.log(tagList.innerHTML);
                                console.log(tagList.outerHTML);
                                divContent.appendChild(tagList);
                                break;

                            case "ordered":
                                var tagList = document.createElement("ol");
                                for (var j = 0; j < jsonArticle.body[i].model.items.length; j++){
                                    var tagItem = document.createElement("li");
                                    tagItem.innerHTML = jsonArticle.body[i].model.items[j];
                                    tagList.appendChild(tagItem);
                                }
                                console.log(tagList.innerHTML);
                                console.log(tagList.outerHTML);
                                divContent.appendChild(tagList);
                                break;
                        }

                        divContent.appendChild(tagList);
                        break;

                }
            }

            return true;
        }
    }

    httpreq.open("GET", URL, true);
    //httpreq.setRequestHeader("Content-type", "application/json");
    httpreq.send();
    return;
}

function getRanking() {
    var divContent = document.getElementById("articleContent");
    divContent.innerHTML = "";

    var divRankHelp = document.createElement("div");
    var divHelp = document.createElement("div");
    divHelp.innerHTML = "<h3>Ranking</h3><p>You can give your rankings by using the up and down arrows to move the " +
        "read articles. The higher the rank the better you thought the article was </p><p>After you have given" +
        " your ranking you can submit them.</p>";
    divRankHelp.appendChild(divHelp);
    divContent.appendChild(divRankHelp);

    var tblRanking = document.createElement("table");
    divContent.appendChild(tblRanking);

    var rowHeading = tblRanking.insertRow(-1);
    rowHeading.insertCell(0).innerHTML = "<b>Rank</b>";
    rowHeading.insertCell(1).innerHTML = "<b>Article</b>";

    for (var n = 0; n < arrArticles.length; n++){
        for (var i = 0; i < arrArticles.length; i++) {
            if (arrArticles[i].rank == (n + 1)) {

                var rowRanking = tblRanking.insertRow(-1);
                rowRanking.insertCell(0).innerHTML = arrArticles[i].rank;
                rowRanking.insertCell(1).innerHTML = arrArticles[i].json.title;

                var cellUp = rowRanking.insertCell(2);
                var cellDown = rowRanking.insertCell(3);

                if (arrArticles[i].rank >= 2) {
                    var btnUp = document.createElement("input");
                    btnUp.type = "button";
                    btnUp.value = "Up";
                    btnUp.rank = arrArticles[i].rank;
                    btnUp.row = rowRanking;
                    btnUp.tbl = tblRanking;
                    btnUp.onclick = function () {
                        for (var j = arrArticles.length - 1; j >= 0; j--) {
                            if (arrArticles[j].rank == this.rank) {
                                arrArticles[j].rank = (this.rank - 1);
                            } else if (arrArticles[j].rank == (this.rank - 1)) {
                                arrArticles[j].rank = (this.rank);
                            }
                        }
                        getRanking();
                        return;
                    };
                    cellUp.appendChild(btnUp);

                }

                if (arrArticles[i].rank <= (arrArticles.length - 1)) {
                    var btnDown = document.createElement("input");
                    btnDown.type = "button";
                    btnDown.value = 'Down';
                    btnDown.rank = arrArticles[i].rank;
                    btnDown.row = rowRanking;
                    btnDown.tbl = tblRanking;
                    btnDown.onclick = function () {
                        for (var j = 0; j < arrArticles.length ; j++) {
                            if (arrArticles[j].rank == this.rank) {
                                arrArticles[j].rank = (this.rank + 1);
                            } else if (arrArticles[j].rank == (this.rank + 1)) {
                                arrArticles[j].rank = (this.rank);
                            }
                        }
                        getRanking();
                        return;
                    };
                    cellDown.appendChild(btnDown);
                }
            }
        }
    }

    var btnSubmit = document.createElement("input");
    btnSubmit.type = "button";
    btnSubmit.value = "Submit my rankings";
    btnSubmit.onclick = function(){
        submitRankings("http://3.8.136.10/bbccodetest/setranking.php");
    };

    var btnSubmitFake = document.createElement("input");
    btnSubmitFake.type = "button";
    btnSubmitFake.value = "Submit my rankings to a site that doesn't exist";
    btnSubmitFake.onclick = function(){
        submitRankings("http://madeupsite.com");
    };

    divContent.appendChild(btnSubmit);
    divContent.appendChild(document.createElement("br"));
    divContent.appendChild(btnSubmitFake);
    var divSubmitResponse = document.createElement("div");
    divSubmitResponse.id = "SubmitResponse";
    divContent.appendChild(divSubmitResponse);
}

function submitRankings(URL) {
    var httpreq = new XMLHttpRequest();

    httpreq.onreadystatechange = function () {
        if (this.readyState == 4){
            var divSubmitResponse = document.getElementById("SubmitResponse");
            switch (this.status){
                case 200:
                    divSubmitResponse.innerHTML = this.responseText;
                    divSubmitResponse.className = "successbox";
                    break;
                default:
                    divSubmitResponse.innerHTML = "Something went wrong";
                    divSubmitResponse.className = "errorbox";
                    break;
            }
        }



    };

    httpreq.open("POST", URL, true);
    httpreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpreq.send(JSON.stringify(arrArticles));
}