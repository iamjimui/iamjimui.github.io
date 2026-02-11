const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const dogImg = document.getElementById("letter-dog");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const song = document.getElementById("song");
const popsound = document.getElementById("popsound");

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});


noBtn.addEventListener("mouseover", () => {
    const min = 400;
    const max = 500;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
});


yesBtn.addEventListener("click", () => {
    dogImg.src = "./assets/images/malteseyay.gif";
    popsound.play();
    title.textContent = "Yippeeee!";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";
});

song.volume=0.05;