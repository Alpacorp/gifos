let misgifs = document.getElementById("gifResultSearch");

function showMyGifsLocal() {
    let localDataGifs = localStorage.getItem("History_Gifs");
    localDataJson = localDataGifs ? JSON.parse(localDataGifs) : [];
    console.log(localDataJson.length);

    for (let i = 0; i < localDataJson.length; i++) {
        const element = localDataJson[i];

        console.log(element);

        let showMyGifs = document.createElement("div");
        showMyGifs.classList = "gif__card-canva";
        showMyGifs.innerHTML = `<img src=${element} alt="myGifo">`
        misgifs.appendChild(showMyGifs);

    }
}

showMyGifsLocal();