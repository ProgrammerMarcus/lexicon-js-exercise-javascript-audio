const state = {
    repeat: false,
    shuffle: false,
    current: 0,
    playlistNumber: 0,
    playlists: [],
    songs: [
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
    ].sort((a, b) => a.title.localeCompare(b.title)),
    constructor() {
        this.playlists.push(this.songs)
    }
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
    } else if (e.target.classList.contains("shuffle")) {
        toggleShuffle();
        shuffle();
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
    document.querySelector("#progress").style["background-size"] = `${(audio.currentTime / audio.duration) * 100}% 100%`
});
document.querySelector("#progress").addEventListener("change", (e) => {
    audio.currentTime = Math.round(
        (document.querySelector("#progress").value / 100) * audio.duration
    );
    document.querySelector("#progress").style["background-size"] = `${(audio.currentTime / audio.duration) * 100}% 100%`
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
}

function previous() {
    if (state.current === 0 && state.repeat) {
        state.current = state.songs.length - 1;
    } else if (state.current !== 0) {
        state.current = state.current - 1;
    }
    play();
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
    generatePlaylist();
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
}

function play() {
    audio.src = state.songs[state.current].track;
    document.querySelector(".info .cover").src = state.songs[state.current].cover;
    highlight()
    audio.play();
}

function playPause() {
    if (audio.paused) {
        let temp = audio.currentTime;
        audio.play();
        audio.currentTime = temp;
    } else {
        audio.pause();
    }
}

function generatePlaylist() {
    const list = document.querySelector(".playlist");
    list.replaceChildren();
    for (let t in state.songs) {
        let clone = document.querySelector("#template-track").cloneNode(true).content;
        clone.querySelector(".title").innerText = state.songs[t].title;
        clone.querySelector(".artist").innerText = `Artist: ${state.songs[t].artist}`;
        clone.querySelector(".album").innerText =  `Album: ${state.songs[t].album}`;
        clone.querySelector(".track").addEventListener("click", (e) => {
            if (state.current === t) {
                playPause();
            } else {
                state.current = t;
                play();
            }
        });
        list.appendChild(clone);
    }
    state.current = 0
    highlight()
}

function highlight() {
    let playing = document.querySelector(".playing")
    if (playing) {
        playing.classList.remove("playing")
    }
    document.querySelectorAll(".playlist .track")[state.current].classList.add("playing")
}

function init() {
    generatePlaylist();
    document.querySelector(".cover").src = state.songs[state.current].cover;
}

init();
