const blades = document.getElementById('blades');
const fanToggleBtn = document.getElementById('fanToggle');

const clickOnSound = document.getElementById('clickOn');
const clickOffSound = document.getElementById('clickOff');
const fanRunningSound = document.getElementById('fanRunning');

fanRunningSound.addEventListener('timeupdate', () => {
  const buffer = 0.1; // Adjust based on your audio's gap (try 0.1 - 0.5)
  if (fanRunningSound.currentTime > fanRunningSound.duration - buffer) {
    fanRunningSound.currentTime = 0;
    fanRunningSound.play();
  }
});

let angle = 0;
let speed = 0;
const maxSpeed = 25;
let animationFrame;
let running = false;
let isFanSoundPlaying = false;

function animateFan() {
  angle = (angle + speed) % 360;
  blades.style.transform = `rotate(${angle}deg)`;
  animationFrame = requestAnimationFrame(animateFan);
}

function startFan() {
  if (running) return;
  running = true;
  fanToggleBtn.disabled = true;

  clickOnSound.play();

  // Delay slightly for realism
  setTimeout(() => {
    if (!isFanSoundPlaying) {
      fanRunningSound.volume = 0;
      fanRunningSound.play();
      isFanSoundPlaying = true;

      // Gradually increase volume
      let volume = 0;
      const fadeIn = setInterval(() => {
        if (volume < 0.5) {
          volume += 0.05;
          fanRunningSound.volume = volume;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }
  }, 300); // after click sound

  function accelerate() {
    if (speed < maxSpeed) {
      speed += 0.2;
      setTimeout(accelerate, 30);
    } else {
      fanToggleBtn.textContent = 'OFF';
      fanToggleBtn.disabled = false;
    }
  }

  accelerate();
  animateFan();
}

function stopFan() {
  fanToggleBtn.disabled = true;

  clickOffSound.play();

  // Gradually decrease volume
  const fadeOut = setInterval(() => {
    if (fanRunningSound.volume > 0.05) {
      fanRunningSound.volume -= 0.05;
    } else {
      fanRunningSound.pause();
      fanRunningSound.currentTime = 0;
      clearInterval(fadeOut);
      isFanSoundPlaying = false;
    }
  }, 100);

  function decelerate() {
    if (speed > 0) {
      speed -= 0.2;
      setTimeout(decelerate, 30);
    } else {
      speed = 0;
      cancelAnimationFrame(animationFrame);
      running = false;
      fanToggleBtn.textContent = 'ON';
      fanToggleBtn.disabled = false;
    }
  }

  decelerate();
}

function toggleFan() {
  if (!running) {
    startFan();
  } else {
    stopFan();
  }
}

function toggleMode() {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
  const modeButton = document.querySelector('.mode-toggle');
  modeButton.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

fanToggleBtn.addEventListener('click', toggleFan);