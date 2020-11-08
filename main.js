let trending = "https://api.giphy.com/v1/gifs/trending";
let gifSearch = "https://api.giphy.com/v1/gifs/search";
let related = "https://api.giphy.com/v1/tags/related/";
let random = "https://api.giphy.com/v1/gifs/random";
let search = "https://api.giphy.com/v1/gifs/search";
let searchId = "https://api.giphy.com/v1/gifs/";
let apiKey = "4R8VHycCcOCb94z0ZdQu5JKGtNtck9AI";
let outputResults = document.getElementById("results");
let rsb = document.getElementById("resultSearchBar");
let outputSugest = document.getElementById("gif");
let output = document.getElementById("trends");
let limitResultSugest = 4;
let limitSugest = 4;
let limitTrend = 12;
let offsetLimit = Math.floor(Math.random() * 20);
let sesions = document.getElementById("sesions");

/*===============================================
COUNTING NUMBER OF VISITS
===============================================*/

localStorage.setItem("sesions", Number(localStorage.getItem("sesions")) + 1);
var countSesions = localStorage.getItem("sesions");
sesions.innerHTML = `${countSesions}`;

/*===============================================
CHANGE THEME STYLE DARK | LIGHT
===============================================*/

let light = document.getElementById("light").addEventListener("click", lightTheme);
let dark = document.getElementById("dark").addEventListener("click", darkTheme);
let stylesRoute = document.getElementById("stylesRoute");
let gifosLogo = document.getElementById("gifos-logo");

function lightTheme() {
    stylesRoute.setAttribute("href", "sass/styles.css");
    gifosLogo.setAttribute("src", "assets/gifOF_logo.png");
    let day = localStorage.setItem("Style Theme", "day");
}

function darkTheme() {
    stylesRoute.setAttribute("href", "sass/dark-styles.css");
    gifosLogo.setAttribute("src", "assets/gifOF_logo_dark.png");
    localStorage.setItem("Style Theme", "night");
}

let getLocalTheme = localStorage.getItem("Style Theme");

if (getLocalTheme === "day") {
    lightTheme();
} else {
    darkTheme();
}

/*===============================================
SEARCH BAR FUNCTIONS
===============================================*/

let buttonSearch = document.getElementById("buttonSearch").addEventListener("click", getResultsSearch);

async function getResultsSearch(inputSearch) {

    inputSearch = document.getElementById("inputSearch").value;
    let res = await fetch(`${search}?api_key=${apiKey}&q=${inputSearch}&limit=${limitSugest}`);
    let json = await res.json();

    let closeButtonResults = document.createElement("div");
    closeButtonResults.className = "results__button-close";
    closeButtonResults.innerHTML =
        `
            <a href="#top-header"><button>Cerrar Búsqueda</button></a>
            `
    closeButtonResults.addEventListener("click", closeButtonResultsSearch)

    function closeButtonResultsSearch() {
        resultSearchBarSection.remove();
    }

    let resultSearchBarSection = document.createElement("div");
    resultSearchBarSection.className = "resultSearchBarSection";
    resultSearchBarSection.id = "resultSearchBarSection";

    let resultBar = document.createElement("section");
    resultBar.className = "bar";

    let gifResultSearch = document.createElement("div");
    gifResultSearch.className = "gifResultSearch";

    let barText = document.createElement("div");
    barText.className = "bar__text";
    barText.innerHTML = `<input class="bar__text-text" type="text" placeholder="Resultados para búsqueda de '${inputSearch}'" readonly>`;

    resultBar.appendChild(barText);
    resultSearchBarSection.appendChild(closeButtonResults);
    resultSearchBarSection.appendChild(resultBar);
    resultSearchBarSection.appendChild(gifResultSearch);

    for (let index = 0; index < limitSugest; index++) {
        const element = json.data[index].images.downsized.url;

        let gifCanvaResult = document.createElement("div");
        gifCanvaResult.className = "gif__card-canva";
        gifCanvaResult.innerHTML =
            `
                <img src=${element} alt="resultado busqueda"/>
                `
        gifResultSearch.appendChild(gifCanvaResult);
        rsb.appendChild(resultSearchBarSection);
    }
}

/*===============================================
GET TRENDS GIFS
===============================================*/

const getTrends = async() => {

    let res = await fetch(`${trending}?api_key=${apiKey}&limit=${limitTrend}&offset=5`);
    let json = await res.json();

    for (let index = 0; index < limitTrend; index++) {
        const element = json.data[index].images.downsized.url;
        let title = json.data[index].title;
        const titleGif = title.replace(/GIF(.*)/, "");

        let trend = document.createElement("div");
        trend.className = "trend";

        let trendImg = document.createElement("div");
        trendImg.className = "trend__img";
        trendImg.innerHTML = `<img src=${element}/>`;

        let trendHt = document.createElement("div");
        trendHt.className = "trend__ht hide";
        trendHt.innerHTML = `<p>${titleGif}</p>`;

        trend.appendChild(trendImg);
        trend.appendChild(trendHt);
        output.appendChild(trend);
    }
}

document.addEventListener("DOMContentLoaded", getTrends);


/*===============================================
GET SUGESTIONS GIFS
===============================================*/

const getSugestions = async() => {

    for (let index = 0; index < limitSugest; index++) {
        let res = await fetch(`${trending}?api_key=${apiKey}&limit=${limitSugest}`);
        let json = await res.json();
        const element = json.data[index].images.downsized.url;

        const titleGet = json.data[index].title;
        let titleGetModified = titleGet.replace(/ GIF(.*)/, "");
        let titleFinal = titleGetModified.replace(/ /g, "");
        let idMain = json.data[index].id;

        let gifCard = document.createElement("div");
        gifCard.className = "gif__card";

        let gifTitle = document.createElement("div");
        gifTitle.className = "gif__card-title";
        gifTitle.innerHTML =
            `<p>#${titleFinal}</p>`

        let gifCloseX = document.createElement("div");
        gifCloseX.innerHTML =
            `<img src="assets/button3.svg" class="closeXButton" alt="close button"/>
        `
        let gifCanva = document.createElement("div");
        gifCanva.className = "gif__card-canva";
        gifCanva.innerHTML =
            `
        <img src=${element} alt="git img sugestions"/>
        `
        let gifButton = document.createElement("div");
        gifButton.className = "canva-button";
        gifButton.id = ""
        gifButton.innerHTML =
            `
            <a href="#results"><button>Ver más...</button></a>
            `
        gifButton.addEventListener("click", function getMatch() {
            numid = idMain;
            getMatchSugestions(numid);
        });
        gifCloseX.addEventListener("click", gifClose);

        gifTitle.appendChild(gifCloseX);
        gifCard.appendChild(gifTitle);
        gifCard.appendChild(gifCanva);
        gifCanva.appendChild(gifButton);
        outputSugest.appendChild(gifCard);

        /*===============================================
        CLOSE TO BUTTON "X" AND SHOW NEW GIF
        ===============================================*/

        async function gifClose() {
            let offsetLimit = Math.floor(Math.random() * 30);
            gifCard.remove();

            for (let index = 0; index < 1; index++) {
                let res = await fetch(`${trending}?api_key=${apiKey}&limit=${limitSugest}&offset=${offsetLimit}`);
                let json = await res.json();
                const elementInner = json.data[index].images.downsized.url;

                const titleGet = json.data[index].title;
                let titleGetModified = titleGet.replace(/ GIF(.*)/, "");
                let titleFinal = titleGetModified.replace(/ /g, "");
                let idInner = json.data[index].id;

                let gifCard = document.createElement("div");
                gifCard.className = "gif__card";

                let gifTitle = document.createElement("div");
                gifTitle.className = "gif__card-title";
                gifTitle.innerHTML =
                    `<p>#${titleFinal}</p>`

                let gifCloseX = document.createElement("div");
                gifCloseX.innerHTML =
                    `<img src="assets/button3.svg" class="closeXButton" alt="close button"/>
                `
                let gifCanva = document.createElement("div");
                gifCanva.className = "gif__card-canva";
                gifCanva.innerHTML =
                    `
                <img src=${elementInner} alt="git img replace"/>
                `
                let gifButton = document.createElement("div");
                gifButton.className = "canva-button";
                gifButton.id = ""
                gifButton.innerHTML =
                    `
                    <a href="#results"><button>Ver más...</button></a>
                    `
                gifButton.addEventListener("click", function getMatchInner() {
                    numidInner = idInner;
                    getMatchSugestions(numidInner);
                });
                gifCloseX.addEventListener("click", function closeInner() {
                    gifCard.remove();
                    gifClose();
                });

                gifTitle.appendChild(gifCloseX);
                gifCard.appendChild(gifTitle);
                gifCard.appendChild(gifCanva);
                gifCanva.appendChild(gifButton);
                outputSugest.appendChild(gifCard);
            }
        }

        /*===============================================
        GET SUGESTIONS GIFS / CLICK TO "VER MÁS"
        ===============================================*/

        async function getMatchSugestions(id) {

            let gifSectionResult = document.createElement("div");
            gifSectionResult.className = "resultSection";

            let res = await fetch(`${searchId}${id}?api_key=${apiKey}`);
            let json = await res.json();

            let titleId = json.data.title;
            let nameTitle = titleId.replace(/ GIF(.*)/, "");
            let titleGif = nameTitle.replace(/ /g, "+");

            let resRelated = `${related}${titleGif}?api_key=${apiKey}`;
            let resRelatedShow = await fetch(resRelated);
            let jsonResults = await resRelatedShow.json();
            let jsonResultsKeyword = jsonResults.data[Math.floor(Math.random() * 4)].name;

            let resSearch = `${search}?api_key=${apiKey}&q=${jsonResultsKeyword}&limit=${limitSugest}`;
            let resSearchShow = await fetch(resSearch);
            let jsonresSearch = await resSearchShow.json();

            let divClose = document.createElement("div");
            divClose.className = "results__button-close";

            let close = document.createElement("div");
            close.className = "closeButton";
            close.innerHTML = `<a href="#top-header"><button>Cerrar</button></a>`;

            let gifCardResult = document.createElement("div");
            gifCardResult.className = "results__cards";

            divClose.appendChild(close);
            gifSectionResult.appendChild(divClose);

            close.addEventListener("click", closeButton);

            function closeButton() {
                gifSectionResult.remove();
            }

            for (let index = 0; index < 4; index++) {
                const elementMatch = jsonresSearch.data[index].images.downsized.url;

                let gifCanvaResult = document.createElement("div");
                gifCanvaResult.className = "gif__card-canva";
                gifCanvaResult.innerHTML =
                    `
            <img src=${elementMatch} alt="resultado sugerencia"/>
            `
                gifCardResult.appendChild(gifCanvaResult);
                gifSectionResult.appendChild(gifCardResult);
                outputResults.appendChild(gifSectionResult);
            }

        }
    }
}

document.addEventListener("DOMContentLoaded", getSugestions);

/*===============================================
SHOW RECENTS KEYWORDS SEARCH TO BUTTON | SAVE KEYWORDS SEARCHING BAR ON LOCAL STORAGE
===============================================*/

let keyWords = document.getElementById("inputSearch");
let action = document.getElementById("buttonSearch");
let keyWordsButtons = document.getElementById("keyWords__buttons");

var historyWords = [];

action.addEventListener("click", function() {
    let wordsValue = keyWords.value;

    historyWords.push(wordsValue);

    localStorage.setItem("Keywords", JSON.stringify(historyWords));

    let wordsValueEnd = wordsValue.replace(/ /g, "");

    let buttonsWords = document.createElement("div");
    buttonsWords.innerHTML = `<button class="buttonWords">#${wordsValueEnd}</button>`

    keyWordsButtons.appendChild(buttonsWords);

    buttonsWords.addEventListener("click", function textInputInner() {
        textInner = wordsValue;
        textInput(textInner);
    })
})

/*===============================================
REPLACE TEXT TO INPUT SEARCH BAR
===============================================*/

async function textInput(textKw) {
    let str = textKw;
    let inputValue = keyWords.value
    inputValue = inputValue.replace(/(.*)/, str);
    keyWords.value = inputValue;
}

/*===============================================
SHOW KEYWORDS RELATED WITH SEARCH MAIN TEXT
===============================================*/

let keywordSugestion__buttons = document.getElementById("keywordSugestion__buttons");
let keywordSugestionF = document.createElement("div");
let keywordSugestionS = document.createElement("div");
let keywordSugestionT = document.createElement("div");

keyWords.addEventListener("input", async function() {

    let listening = keyWords.value;
    listeninglarge = listening.length;

    if (listening == "") {
        keywordSugestion__buttons.style.display = "none";
    } else {

        keywordSugestion__buttons.style.display = "block";

        let res = await fetch(`${related}${listening}?api_key=${apiKey}&limit=3`);
        let json = await res.json();

        var suggested_words = [].json;
        suggested_words = json.data;

        let suggested_searchF = suggested_words[0].name;
        let suggested_searchS = suggested_words[1].name;
        let suggested_searchT = suggested_words[2].name;

        keywordSugestionF.innerHTML = `<button>${suggested_searchF}</button>`;
        keywordSugestionS.innerHTML = `<button>${suggested_searchS}</button>`;
        keywordSugestionT.innerHTML = `<button>${suggested_searchT}</button>`;

        keywordSugestion__buttons.appendChild(keywordSugestionF);
        keywordSugestion__buttons.appendChild(keywordSugestionS);
        keywordSugestion__buttons.appendChild(keywordSugestionT);

        keywordSugestionF.addEventListener("click", function textInputInner() {
            textInner = suggested_searchF;
            textInput(textInner);
        })

        keywordSugestionS.addEventListener("click", function textInputInner() {
            textInner = suggested_searchS;
            textInput(textInner);
        })

        keywordSugestionT.addEventListener("click", function textInputInner() {
            textInner = suggested_searchT;
            textInput(textInner);
        })
    }
})