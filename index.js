let db = [
    {
        title: "Boys, Girls, Toys & Words",
        artist: "Modern Pitch",
        cover: "tracks/Boys,_Girls,_Toys_&_Words_-_Modern_Pitch.jpg",
        track: "tracks/Boys,_Girls,_Toys_&_Words_-_Modern_Pitch.mp3",
        album: "Eye Of The Storm",
    },
    {
        album: "Inception",
        title: "Higher And Higher",
        artist: "Scream Inc",
        cover: "tracks/Higher_And_Higher_-_Scream_Inc._(3).jpg",
        track: "tracks/Higher_And_Higher_-_Scream_Inc._(3).mp3",
    },
    {
        album: "Not My Problem (Single)",
        title: "Not My Problem",
        artist: "All My Friends Hate Me",
        cover: "tracks/Not_My_Problem_-_All_My_Friends_Hate_Me.jpg",
        track: "tracks/Not_My_Problem_-_All_My_Friends_Hate_Me.mp3",
    },
    {
        album: "Apply Within",
        title: "Old News",
        artist: "Hot Fiction",
        cover: "tracks/Old_News_-_Hot_Fiction.jpg",
        track: "tracks/Old_News_-_Hot_Fiction.mp3",
    },
    {
        album: "Kites",
        title: "Peyote",
        artist: "Kinematic",
        cover: "tracks/Peyote_-_Kinematic.jpg",
        track: "tracks/Peyote_-_Kinematic.mp3",
    },
    {
        album: "Jupiter",
        title: "Say Goodbye",
        artist: "VITNE",
        cover: "tracks/Say_Goodbye_-_VITNE.jpg",
        track: "tracks/Say_Goodbye_-_VITNE.mp3",
    },
].sort((a, b) => a.title.localeCompare(b.title));

for (let i = 0; i < 5; i++) {
    db = db.concat(db);
}

const state = {
    repeat: false,
    shuffle: false,
    current: 0,
    playlist: 0,
    songs: db,
    playlists: [],
};

document.querySelector(".buttons").addEventListener("click", (e) => {
    if (e.target.classList.contains("next")) {
        next();
    } else if (e.target.classList.contains("previous")) {
        previous();
    } else if (e.target.classList.contains("pause")) {
        playPause();
    } else if (e.target.classList.contains("repeat")) {
        state.repeat = !state.repeat;
        if (state.repeat) {
            e.target.classList.add("active");
        } else {
            e.target.classList.remove("active");
        }
    } else if (e.target.classList.contains("shuffle")) {
        toggleShuffle();
        shuffle();
        if (state.shuffle) {
            e.target.classList.add("active");
        } else {
            e.target.classList.remove("active");
        }
    } else if (e.target.classList.contains("play")) {
        playPause();
    }
});

const audio = new Audio(state.songs[state.current].track);
audio.addEventListener("ended", () => {
    if (state.repeat || state.current !== state.songs.length - 1) {
        next();
    }
});
audio.addEventListener("timeupdate", () => {
    document.querySelector("#progress").value = Math.round(
        (audio.currentTime / audio.duration) * 100
    );
    document.querySelector("#progress").style["background-size"] = `${
        (audio.currentTime / audio.duration) * 100
    }% 100%`;
});
document.querySelector("#progress").addEventListener("change", (e) => {
    audio.currentTime = Math.round(
        (document.querySelector("#progress").value / 100) * audio.duration
    );
    document.querySelector("#progress").style["background-size"] = `${
        (audio.currentTime / audio.duration) * 100
    }% 100%`;
});

function next() {
    if (state.shuffle && state.current === state.songs.length - 1) {
        shuffle();
        return;
    }
    if (state.repeat) {
        state.current = (state.current + 1) % state.songs.length;
    } else if (state.current !== state.songs.length - 1) {
        state.current += 1;
    }
    play();
    playPause(true);
}

function previous() {
    if (state.current === 0 && state.repeat) {
        state.current = state.songs.length - 1;
    } else if (state.current !== 0) {
        state.current = state.current - 1;
    }
    play();
    playPause(true);
}

function shuffle() {
    // maybe it should add to the list instead?
    for (var i = state.songs.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = state.songs[i];
        state.songs[i] = state.songs[j];
        state.songs[j] = temp;
        state.current = 0;
    }
    play();
    playPause(true);
    generatePlaylist();
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
}

function play() {
    audio.src = state.songs[state.current].track;
    document.querySelector(".info .cover").src = state.songs[state.current].cover;
    document.querySelector(".info .title").innerText = state.songs[state.current].title;
    highlight();
}

function playPause(bypass = false) {
    if (state.songs.length !== 0) {
        if (bypass) {
            play();
            audio.play();
            document.querySelector(".pause").innerText = " pause_circle ";
        } else if (audio.paused) {
            let temp = audio.currentTime;
            audio.src = state.songs[state.current].track;
            audio.play();
            audio.currentTime = temp;
            document.querySelector(".pause").innerText = " pause_circle ";
        } else {
            audio.pause();
            document.querySelector(".pause").innerText = " play_circle ";
        }
    } else {
        audio.src = "";
    }
}

function generatePlaylist() {
    const list = document.querySelector(".playlist");
    list.replaceChildren();
    for (let t in state.songs) {
        let clone = document.querySelector("#template-track").cloneNode(true).content;
        clone.querySelector(".title").innerText = state.songs[t].title;
        clone.querySelector(".artist").innerText = `Artist: ${state.songs[t].artist}`;
        clone.querySelector(".album").innerText = `Album: ${state.songs[t].album}`;
        clone.querySelector(".track").addEventListener("click", (e) => {
            if (state.current === t) {
                playPause();
            } else {
                state.current = t;
                play();
                playPause(true);
            }
        });
        list.appendChild(clone);
    }
    state.current = 0;
    if (state.songs.length !== 0) {
        document.querySelector(".cover").src = state.songs[state.current].cover;
        document.querySelector(".info .title").innerText = state.songs[state.current].title;
    } else {
        document.querySelector(".cover").src = "assets/cover.jpg";
        document.querySelector(".info .title").innerText = "None";
    }
    highlight();
}

function highlight() {
    if (state.songs.length !== 0) {
        let playing = document.querySelector(".playing");
        if (playing) {
            playing.classList.remove("playing");
        }
        document.querySelectorAll(".playlist .track")[state.current].classList.add("playing");
    }
}

document.querySelectorAll(".switch").forEach((s) => {
    s.addEventListener("click", (e) => {
        if (getComputedStyle(document.querySelector(".pop-up"))["display"] === "block") {
            document.querySelector(".pop-up").style.display = "none";
            return;
        }
        document.querySelector(".pop-up").style.display = "block";
        for (c of document.querySelectorAll("#select .container")) {
            c.remove();
        }
        if (e.currentTarget.classList.contains("tracks")) {
            for (t of db) {
                let clone = document.querySelector("#template-selector").cloneNode(true).content;
                clone.querySelector("label span").insertAdjacentText("beforeend", t.title);
                document.querySelector("#select .flex").appendChild(clone);
            }
            document.querySelector("#select h2").innerText = "Tracks";
        } else if (e.currentTarget.classList.contains("albums")) {
            for (t of new Set(db.map((x) => x.album))) {
                let clone = document.querySelector("#template-selector").cloneNode(true).content;
                clone.querySelector("label span").insertAdjacentText("beforeend", t);
                document.querySelector("#select .flex").appendChild(clone);
            }
            document.querySelector("#select h2").innerText = "Albums";
        } else if (e.currentTarget.classList.contains("artists")) {
            for (t of new Set(db.map((x) => x.artist))) {
                let clone = document.querySelector("#template-selector").cloneNode(true).content;
                clone.querySelector("label span").insertAdjacentText("beforeend", t);
                document.querySelector("#select .flex").appendChild(clone);
            }
            document.querySelector("#select h2").innerText = "Artists";
        }
    });
});

/** Need to add proper filtering */
document.querySelector("#select").addEventListener("submit", (e) => {
    e.preventDefault();
    let accepted = Array.from(e.currentTarget.querySelectorAll("input:checked")).map(
        (c) => c.nextElementSibling.innerText
    );
    let type = document.querySelector("#select h2").innerText;
    if (type === "Tracks") {
        state.songs = Array.from(db).filter((a) => accepted.includes(a.title));
    } else if (type === "Artists") {
        state.songs = Array.from(db).filter((a) => accepted.includes(a.artist));
    } else if (type === "Albums") {
        state.songs = Array.from(db).filter((a) => accepted.includes(a.album));
    }
    generatePlaylist();
    playPause(true);
    document.querySelector(".pop-up").style.display = "none";
});

function newTab(name = "") {
    if (state.playlists.length >= 9) {
        return;
    }
    let clone = document.querySelector("#template-tab").cloneNode(true).content.firstElementChild;
    let newPlaylist = [];
    state.playlists.push(newPlaylist);
    if (name !== "") {
        clone.innerText = name;
    } else {
        clone.innerText = state.playlists.length;
    }
    clone.setAttribute("num", state.playlists.length - 1);
    clone.addEventListener("click", (e) => {
        document.querySelector(".tabs .selected").classList.remove("selected");
        e.currentTarget.classList.add("selected");
        state.playlists[state.playlist] = state.songs;
        state.playlist = e.currentTarget.getAttribute("num");
        state.songs = state.playlists[e.currentTarget.getAttribute("num")];
        generatePlaylist();
        playPause(true);
    });
    document.querySelector(".tabs > .tab.new").insertAdjacentElement("beforebegin", clone);
    return clone;
}

document.querySelector(".tabs > .tab.new").addEventListener("click", () => {
    newTab();
});

function init() {
    newTab("Auto").classList.add("selected");
    generatePlaylist();
}

init();
