let now_playing = document.querySelector('.now-playing');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = true;
let updateTimer;

const music_list = [];
let prev_list = [];

for(let l=0; l< 20; l++){
    music_list.push({music : `./src/BTS${Number(l+1)}.mp3`});
}
console.log(music_list);
loadTrack(getRandom());

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    // checkPrev();
    if(prev_list.indexOf(track_index) == '-1' || prev_list[0] == undefined){
        curr_track.src = music_list[track_index].music;
        curr_track.load();
        updateTimer = setInterval(setUpdate, 1000);
        prev_list.push(track_index);
        curr_track.addEventListener('ended', nextTrack);
        random_bg_color();
    }else{
        if(prev_list.length <= music_list.length){
            prev_list = [];
            track_index = getRandom();
            curr_track.addEventListener('ended',loadTrack(track_index));
        }else{
            console.log('Playlist End');
            nextTrack();
        }
    }
}

curr_track.addEventListener('timeupdate',()=>{
    console.log("Currency song "+curr_track.src);
})

function checkPrev(index){
    console.log(prev_list);
    return false;
    if(music_list.length >= prev_list.length){
        if(prev_list.indexOf(index) != -1){
            prev_list.push(index);
        }else{
            nextTrack();
        }
    }else{
        prev_list = [];
    }
}

function random_bg_color(){
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a){
        for(let i=0; i<6; i++){
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";
    // document.body.style.background = gradient;
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function getRandom(){
    let li = Number.parseInt(Math.random() * music_list.length);
    return li;
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(prev_list.indexOf(track_index) == -1){
        prev_list.push(track_index);
    }
    let random_index = Number.parseInt(Math.random() * music_list.length);
    if(track_index == random_index){
        if(random_index + 1 >= music_list.length){
            track_index = 0;
        }else{
            track_index = random_index + 1;
        }
    }else{
        if(random_index >= music_list.length){
            track_index = 0;
        }else{
            track_index = random_index;
        }
    }
    console.log(track_index);
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
    console.log(track_index);
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    setVolume();
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
