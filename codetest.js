// codetest.js
// version 1 17/02/2019
// author James Davidson

var arrReadArticles = [];
var arrArticles = ["article-1","article-2","article-3","article-4","article-5"];


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

            if (arrReadArticles.includes(filename) === false){
                arrReadArticles.push(filename);
            }
            console.log(arrReadArticles);

            var divProgress = document.getElementById("progress");

            if (arrReadArticles.length != 5) {
                divProgress.innerHTML = "<p>You have read " + arrReadArticles.length + " of today's 5 articles.</p>";
            } else {
                divProgress.innerHTML = "<p>You have read all of today's articles, would you like to rank them?</p>" ;
                var lnkRank = document.createElement("a");
                lnkRank.href = "javascraft:void(0)";
                lnkRank.onclick = function(){
                    getRanking();
                };
                lnkRank.innerText = "Rank articles";
                divProgress.appendChild(lnkRank);
            }

            var jsonArticle = JSON.parse(this.responseText);

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

    var tblRanking = document.createElement("table");
    divContent.appendChild(tblRanking);

    var rowHeading = tblRanking.insertRow(-1);
    rowHeading.insertCell(0).innerHTML = "<b>Rank</b>";
    rowHeading.insertCell(1).innerHTML = "<b>Article</b>";

    for (var i = 0; i < arrArticles.length; i++){
        var rowRanking = tblRanking.insertRow(-1);
        rowRanking.insertCell(0).innerHTML = i+1;
        rowRanking.insertCell(1).innerHTML = arrArticles[i];

        var cellUp = rowRanking.insertCell(2);

        if (i >= 1) {
            var btnUp = document.createElement("input");
            btnUp.type = "button";
            btnUp.value = "Up";
            btnUp.rank = i+1;
            btnUp.row = rowRanking;
            btnUp.tbl = tblRanking;
            btnUp.onclick = function () {
                alert(this.rank);
                this.row.parentNode.insertBefore(this.row,this.row.parentNode.rows[this.rank-1]);
            };
            cellUp.appendChild(btnUp);
        }


    }


}