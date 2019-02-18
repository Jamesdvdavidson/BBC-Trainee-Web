// codetest.js
// version 1 17/02/2019
// author James Davidson

var arrReadArticles = [];


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

            divProgress.innerHTML = "You have read " + arrReadArticles.length + " of today's 5 articles.";

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