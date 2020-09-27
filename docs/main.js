let songIndex = 0;
let songs = [];
const audio = document.getElementById('audio');
const records = document.querySelectorAll('.record');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let current = document.querySelector('.current');
let liveUpdate = true;
let metaLoaded = false;

records.forEach(cur => {
  songs.push(cur.id);
});

records.forEach(cur => {
  cur.addEventListener('click', e => {

    // new current selected
    if (!cur.classList.contains('current')) {
      selectCurrent(cur);
    }
  });
});

playBtn.addEventListener('click', e => {
  if (document.querySelector('.current') !== null) {
    if (!audio.paused) {
      audio.pause();
      playBtn.className = 'music-play';
    } else {
      audio.play();
      playBtn.className = 'music-pause';
    }
  }
});

// Prev Song
prevBtn.addEventListener('click', e => {
  // new song index
  songIndex !== 0 ? songIndex-- : songIndex = songs.length - 1;

  selectCurrent(document.getElementById(`${songs[songIndex]}`));
});

// Next Song
nextBtn.addEventListener('click', e => {
  // new song index
  songIndex !== songs.length - 1 ? songIndex++ : songIndex = 0;

  selectCurrent(document.getElementById(`${songs[songIndex]}`));
});



function selectCurrent(cur) {
  metaLoaded = false;
  // pause audio
  audio.pause();

  if (document.querySelector('.current') !== null) {
    document.querySelector('.current').classList.remove('current');
  }

  // add new current
  cur.classList.add('current');

  songIndex = songs.indexOf(cur.id);

  // play new song
  playSong(cur);

  // update ui song name
  document.querySelector('.song-name').textContent = `${songIndex}`;
  let songName = document.querySelector('.current').querySelectorAll('p');

  document.querySelector('.song-name').textContent = `${songName.item(0).textContent} - ${songName.item(1).textContent}`;
}

function playSong(cur) {
  audio.src = `${songs[songIndex]}.mp3`;
  audio.play();
  playBtn.className = 'music-pause';

}

audio.addEventListener('timeupdate', e => {
  if (metaLoaded) {
    if (liveUpdate) {
      document.getElementById('progress').value = audio.currentTime / audio.duration;
    }

    let minutes = (Math.floor(audio.currentTime / 60)).toString();
    let seconds = (Math.round(audio.currentTime % 60)).toString();
    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    document.getElementById('current-time').innerText = `${minutes}:${seconds}`;
  }

});

audio.addEventListener('loadedmetadata', e => {
  const duration = audio.duration;

  let minutes = (Math.floor(duration / 60)).toString();
  let seconds = (Math.round(duration % 60)).toString();
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }

  if (document.querySelector('.current') !== null) {
    document.getElementById('duration').innerText = `${minutes}:${seconds}`;
    metaLoaded = true;
  }
});

document.getElementById('progress').addEventListener('change', e => {
  audio.currentTime = audio.duration * document.getElementById('progress').value;
  liveUpdate = true;
});

document.getElementById('progress').addEventListener('input', e => {
  liveUpdate = false;
});