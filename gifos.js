let videoRecorded = document.getElementById("videoRecorded");
let closeMyGifos = document.getElementById("closeMyGifos");
let gifRecorded = document.getElementById("gifRecorded");
let uploadGif = document.getElementById("uploadGif");
let gifVideo = document.getElementById("gifVideo");
let gifContent = document.getElementById("gifContent");
let textCreate = document.getElementById("textCreate")
let misgifs = document.getElementById("gifResultSearch");
let textCheck = document.getElementById("textCheck");
let stopIcon = document.getElementById("stopIcon");
let stopRecord = document.getElementById("stop");
let copyGif = document.getElementById("copyGif");
let downloadGif = document.getElementById("downloadGif")
let captureIcon = document.getElementById("captureIcon");
let copyGifLink = document.getElementById("copyGifLink");
let capture = document.getElementById("capture");
let loadingGif = document.getElementById("loadingGif");
let mygifos = document.getElementById("myGifos");
let cancel = document.getElementById("cancel");
let start = document.getElementById("start");
let uploadUrl = "https://upload.giphy.com/v1/gifs";
let getGifApi = "https://api.giphy.com/v1/gifs"
let apiKeyGif = "4R8VHycCcOCb94z0ZdQu5JKGtNtck9AI";

/*===============================================
GET TAGS FOR HTML PAGE
===============================================*/

gifVideo.style.display = "none";
gifRecorded.style.display = "none";
capture.style.display = "none";
stopRecord.style.display = "none";
uploadGif.style.display = "none";
closeMyGifos.style.display = "none";
textCheck.style.display = "none";
captureIcon.style.display = "none";
stopIcon.style.display = "none";
copyGif.style.display = "none";
downloadGif.style.display = "none";
copyGifLink.style.display = "none";
loadingGif.style.display = "none";

/*===============================================
LET PERMISION OF CAMERA
===============================================*/

var historyGifos = [];

start.addEventListener("click", permisions);
closeMyGifos.addEventListener("click", reload);

function reload() {
    window.location.reload();
}

function permisions() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(function(stream) {
        if (stream.active == true) {
            let recorder = RecordRTC(stream, {
                type: "video",
                frameInterval: 90
            });

            gifVideo.style.display = "block";
            closeMyGifos.style.display = "block"
            textCreate.style.display = "none";
            textCheck.style.display = "block";
            gifContent.style.display = "none";
            captureIcon.style.display = "block";

            alert("Aviso: tu cámara está activa");

            gifVideo.srcObject = stream;

            /*===============================================
            START RECORD CAMERA
            ===============================================*/

            capture.addEventListener("click", function() {
                recorder.startRecording()

                capture.style.display = "none";
            });

            /*===============================================
            STOP RECORD CAMERA
            ===============================================*/

            stopRecord.addEventListener("click", function() {
                recorder.stopRecording(function() {
                    let form = new FormData();
                    form.append('file', recorder.getBlob(), 'myGif.gif');
                    let url = URL.createObjectURL(form.get('file'));
                });
            })

            /*===============================================
            RECORD AND SAVE GIF FROM CAMERA
            ===============================================*/

            function recordGif() {
                let recorderGif = RecordRTC(stream, {
                    type: "gif",
                    frameInterval: 90
                });
                capture.addEventListener("click", function() {
                    recorderGif.startRecording()

                    stopRecord.style.display = "block";
                    stopIcon.style.display = "block";
                    captureIcon.style.display = "none";

                });

                start.style.display = "none";
                gifVideo.style.display = "block";
                capture.style.display = "block";

                stopRecord.addEventListener("click", function() {
                    recorderGif.stopRecording(callback);

                    uploadGif.style.display = "block";
                    gifVideo.style.display = "none";
                    stopRecord.style.display = "none";
                    stopIcon.style.display = "none";

                    function callback() {
                        formGif = new FormData();
                        formGif.append('file', recorderGif.getBlob(), 'myGif.gif');
                        let url = URL.createObjectURL(formGif.get('file'));
                        gifRecorded.style.display = "block";
                        gifRecorded.src = url;
                        gifGenerator(formGif);
                    }
                });
            }
            recordGif();

            /*===============================================
            GENERATE URL GIF AND SEND TO GIPHY
            ===============================================*/

            function gifGenerator(content) {
                var gif_header = new Headers();

                var options = {
                    method: 'POST',
                    mode: "cors",
                    headers: gif_header,
                    body: content
                }

                uploadGif.addEventListener("click", function() {

                    loadingGif.style.display = "block";

                    function sendingGif(url) {
                        fetch(url, options)
                            .then((res) => {
                                return res.json()
                            }).then((getGif) => {
                                if (getGif.meta.status == 200) {
                                    let id = getGif.data.id;

                                    loadingGif.style.display = "none";

                                    copyGif.style.display = "block";
                                    downloadGif.style.display = "block";


                                    function getInnerGif(url) {
                                        fetch(url)
                                            .then((res) => {
                                                return res.json()
                                            }).then((getres) => {
                                                console.log(getres);

                                                copyGifLink.style.display = "block";
                                                downloadGif.style.display = "block";

                                                let urlGif = getres.data[0].images.downsized.url;
                                                // myGifos.src = urlGif;

                                                let localData = localStorage.getItem("History_Gifs");
                                                localGifs = localData ? JSON.parse(localData) : [];
                                                localGifs.push(urlGif);
                                                localStorage.setItem("History_Gifs", JSON.stringify(localGifs));

                                                copyGifLink.value = urlGif;

                                                copyGif.addEventListener("click", function() {
                                                    copyGifLink.select();
                                                    document.execCommand("copy");
                                                    alert("Enlace de Guifo copiado");
                                                })

                                                downloadGif.setAttribute("href", urlGif);
                                            })
                                    };
                                    console.log(id);
                                    getInnerGif(`${getGifApi}?api_key=${apiKeyGif}&ids=${id}`);
                                };
                            });

                    };
                    uploadGif.style.display = "none";
                    cancel.style.display = "none";
                    sendingGif(`${uploadUrl}?api_key=${apiKeyGif}`);
                });
            };
            uploadGif.addEventListener("click", gifGenerator);
        };
    });
};

/*===============================================
SHOW GIFS SAVED IN LOCAL STORAGE | MY GUIFOS AND CREATE GUIFOS
===============================================*/

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