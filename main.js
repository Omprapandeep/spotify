console.log("js part")
let songurl;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentsong = new Audio()
async function gethtml() {
    let b = await fetch("change.html")
    let res = await b.text()

    document.getElementById("myplalist").addEventListener("click", async () => {
        let changed = document.getElementById("om")
        changed.innerHTML = `${res}`
        await new Promise((resolve) => setTimeout(resolve, 0));
        img()
        main()
       
    })

}
async function getSongs(folder) {
    let a = await fetch(`./${folder}`)
    currfolder=folder
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let val = []
    let songs = []
    let songname = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            val.push(element.href)
            let a = element.href.split(`/${folder}/`)[1]
            songname.push(a.split(".mp3")[0])
        }
    }
    songs[0] = val
    songs[1] = songname
    let image = await img()
    let songul = document.querySelector(".songsalbum").getElementsByTagName("ul")[0]
    if (!songul) {
        console.error("Element '.songsalbum ul' not found.");
        return;
    }
    songul.innerHTML=""
    songs[1].forEach((item, index) => {
        songul.innerHTML = songul.innerHTML + `<li>
                           
                            <div class="flex">
                            <img src="${image[index]}" alt="">
                            <div class="albuminfo ">
                            
                            <span>${item.split("-")[0].replaceAll("%20", " ")}</span>
                            <span class="greyhover " id="al" >${item.split("-")[1] ? item.split("-")[1].replace(/%20/g, " ") : item.split("-")[1]} </span></div>

                            </div>
                           
                           
                            <img id="" style="cursor: pointer; width: 30px; margin-right:-5px;" class="invert albumsvg" src="mysvgs/play.svg" alt="">
                        </li>`
    })
   
    let songitem = Array.from(document.querySelector(".songsalbum").getElementsByTagName("li"))

    songitem.forEach((item, index) => {
        item.addEventListener("click", () => {
            // Play the corresponding song using its index
            playmusic(songs[0][index], songs[1][index]);
        });
    });
    return songs
}
async function displayAlbums() {
    console.log("display albumbs");
    let a = await fetch(`./songs`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let ancors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".container")
    let array = Array.from(ancors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        console.log(e.href.includes(`\songs`))
        if (e.href.includes(`\songs`)&& !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`./songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="cards  border-radius">
                            <svg class="playbutton" xmlns="http://www.w3.org/2000/svg" width="100" height="100"  
                                viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="#3be477" />
                                <polygon points="35,25 35,75 70,50" fill="black" />
                            </svg>
                            <img class="border-radius"
                                src="./songs/${folder}/cover.jpg" alt="error">
                            <div class="tit hover" > ${response.title}</div>
                            <p class="smallfont hover lightgrey">${response.description}</p>
                        </div>`
        }
    }
   
   
    // Load the playlist whenever card is clicked
   
}
async function img() {

    let a = await fetch("./img")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let images = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".jpg")) {
            images.push(element.href)
        }
    }
    return images
}
displayAlbums()
async function main() {
    let songs= await getSongs(`songs/Aashiqui`);
    console.log("in main()")  
   
  playsongs()
}
document.addEventListener("DOMContentLoaded", async () => {
    await gethtml();
});

let playmusic = async (track, songname, pause = false) => {
    try {
        console.log('playmusic');
        // Ensure track is valid
        if (!track) {
            console.error("Invalid track URL:", track);
            alert("Track is missing or invalid.");
            return;
        }
        // Fetch images and song list
        let images = await img();
        Array.from(document.getElementsByClassName("cards")).forEach(e => { 
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                
            })
        })
        let songs =await getSongs(`${currfolder}`);
        // Get current track index
       
        let index = songs[0].findIndex(song => song === track);
        if (index === -1) {
            console.error("Track not found in song list:", track);
            alert("Track not found.");
            return;
        }
        // Set track source and add error listener
        currentsong.src = track;
        currentsong.addEventListener("error", () => {
            console.error("Failed to load track:", track);
            alert("Unable to play this song.");
        });
        // Play the song if not paused
        if (!pause) {
            currentsong.addEventListener("canplay", () => {
                currentsong.play()
                    .then(() => console.log("Audio playing..."))
                    .catch((error) => console.error("Error playing audio:", error));
            });
            play.src = "mysvgs/pause.svg";
        }

        // Ensure `.info` exists
         let info = document.querySelector(".info");
        if (!info) {
            console.error("Element with class '.info' not found!");
            return;
        }
        let informtion = document.querySelector(".information")
        // Ensure `.song-name` and `.song-artist` exist
        let songdiv = document.querySelector(".song-name");
        let artistdiv = document.querySelector(".song-artist");
        if (!songdiv) {
            songdiv = document.createElement("div");
            songdiv.className = "song-name";
            informtion.appendChild(songdiv);
        }
        if (!artistdiv) {
            artistdiv = document.createElement("div");
            artistdiv.className = "song-artist";
            informtion.appendChild(artistdiv);
        }

        // Ensure an `img` exists in `.info`
        let infoImg = document.querySelector(".info img");
        if (!infoImg) {
            infoImg = document.createElement("img");
            info.appendChild(infoImg);
        }

        // Update elements
        console.log("Songname:", songname);
        if (songname && songname.split) {
            document.querySelector(".timeduration").innerHTML = "00:00/00:00";
            infoImg.src = images[index] || ""; // Handle missing image case
            await new Promise((resolve) => setTimeout(resolve, 0));
            songdiv.innerHTML = songname.split("-")[0]?.replace(/%20/g, " ") || "Unknown Song";
            artistdiv.innerHTML = songname.split("-")[1]?.replace(/%20/g, " ") || "Unknown Artist";
        } else {
            console.error("Invalid songname:", songname);
            songdiv.innerHTML = "NEW ALBUM";
            artistdiv.innerHTML = "Artist";
        }

        
        

    } catch (error) {
        console.error("Error in playmusic function:", error);
    }
};

async function playsongs() {

    let songs=await getSongs(`songs/Aashiqui`);
    Array.from(document.getElementsByClassName("cards")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0][0])
            document.querySelector(".left").style.left="0"
        })
    })
    
    
   

    //add event listner to play prev next ..

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "mysvgs/pause.svg"

        } else {
            currentsong.pause()
            play.src = "mysvgs/playbutton.svg"
        }
    })
    //listen to time update 
    currentsong.addEventListener("timeupdate", () => {
        let progress = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".timeduration").innerHTML = `
        ${secondsToMinutesSeconds(currentsong.currentTime)}/ ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = progress
        document.querySelector(".seekbar-progress").style.width = progress;
    })
    //add event to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const seekbar = document.querySelector(".seekbar");
        const circle = document.querySelector(".circle");
        const seekbarRect = seekbar.getBoundingClientRect();
        const clickPosition = e.clientX - seekbarRect.left;
        const percent = (clickPosition / seekbarRect.width) * 100;
        circle.style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });

    // Add an event listener to previous
    prev.addEventListener("click", () => {

        currentsong.pause()
        console.log("Previous clicked")
        let index = songs[0].findIndex(song => song === currentsong.src);

        if ((index - 1) >= 0) {
            playmusic(songs[0][index - 1], songs[1][index - 1])
        }
        else {
            currentsong.currentTime = 0;
            currentsong.pause();
            play.src = "mysvgs/pause.svg";
            console.log("End of playlist. No next song available.");
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")
        let index = songs[0].findIndex(song => song === currentsong.src);
        if ((index + 1) < songs[0].length) {
            playmusic(songs[0][index + 1], songs[1][index + 1])
        }
        else {
            currentsong.currentTime = 0;
            currentsong.pause();
            play.src = "mysvgs/pause.svg";
            console.log("End of playlist. No next song available.");
        }
    })

    //add event listner to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("volume is ", e.target.value, "/ 100");
        currentsong.volume = parseInt(e.target.value) / 100
        volumeIcon = document.querySelector(".volume").getElementsByTagName("img")[0]
        if (currentsong.volume > 0) {
            if (volumeIcon.src.includes("mysvgs/mute.svg")) {
                volumeIcon.src = volumeIcon.src.replace("mysvgs/mute.svg", "mysvgs/volume.svg");
            }
        } else {
            if (volumeIcon.src.includes("mysvgs/volume.svg")) {
                volumeIcon.src = volumeIcon.src.replace("mysvgs/volume.svg", "mysvgs/mute.svg");
            }
        }

    })

    //add event listner to mute track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("mysvgs/volume.svg")) {
            e.target.src = e.target.src.replace("mysvgs/volume.svg", "mysvgs/mute.svg")
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0] = 0
        }
        else {
            e.target.src = e.target.src.replace("mysvgs/mute.svg", "mysvgs/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0] = 10
        }
    })


}
//event listner to hamburgar
function real(params) {
   const hamburgerImg = document.querySelector(".hamburgar > img");
const leftDiv = document.querySelector(".left");
hamburgerImg.addEventListener("click", () => {
    leftDiv.style.left = "0";
    console.log("hamburgar clicked");
}); 

 //add event listner to close
 document.querySelector(".close > img").addEventListener("click",()=>{
    leftDiv.style.left ="-100%"
 })

}


real()