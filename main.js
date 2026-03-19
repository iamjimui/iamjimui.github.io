import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from "three/addons/math/Octree.js";
import { Capsule } from "three/addons/math/Capsule.js";

const sounds = {
  backgroundMusic: new Howl({
    src: ["./assets/musics/maplestory_henesys.mp3"],
    loop: true,
    volume: 0.1,
    preload: true,
  }),
  jumpSFX: new Howl({
    src: ["./assets/sounds/maplestory_jump_sfx.mp3"],
    volume: 0.05,
    preload: true,
  }),
};

let isMuted = false;

function playSound(soundId) {
  if (!isMuted && sounds[soundId]) {
    sounds[soundId].play();
  }
}

function stopSound(soundId) {
  if (sounds[soundId]) {
    sounds[soundId].stop();
  }
}

//Scene
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2;

const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const gravity = 30;
const capsule_radius = 0.35;
const capsule_height = 1;
const jump_height = 30
const move_speed = 15;
let targetRotation = -Math.PI / 2;

let character = {
  instance: null,
  isMoving: false,
}

const colliderOctree = new Octree();
const playerCollider = new Capsule(
  new THREE.Vector3(0, capsule_radius, 0),
  new THREE.Vector3(0, capsule_height, 0),
  capsule_radius
);

let playerVelocity = new THREE.Vector3();
let playerOnFloor = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

const modalContent = {
  "Frame_One": {
    title: "🥮 Patisserie de Choisy (Choisy's pastry)",
    content: "Platform acting as an exhibition of Asian cakes including for special occasions (such as birthday, wedding and lunar new year) for one of the most popular pastry shops in Paris Chinatown.",
    link: "https://patisseriedechoisy.fr/",
    footerTitle: "✨ Technologies used",
    footerContent: "ReactJS ● Django ● Django REST Framework ● Python ● Figma ● Lucidchart ● Trello",
  },
  "Frame_Two": {
    title: "🎮 Project Soul",
    content: "Inspired by Dark Souls, Project soul is 3D Action Horror Wave Survival Game made with Unity. You incarnate into the last remaining person who has the willpower to save the world from the darkness by consuming the enemies soul and turn the table by using special abilities.",
    link: "https://projectsoul269902195.wordpress.com/",
    footerTitle: "✨ Technologies used",
    footerContent: "Wordpress ● Unity ● Blender ● Figma ● Lucidchart ● Trello",
  },
  "Frame_Three": {
    title: "🙏 Ujaï",
    content: "I've participated into a project startup to develop a sports & welness platform across France involving 🏋🏽‍♀️Personal coaches for sports, wellness, nutrition, and ✌🏼Classes at home, online, and on-demand.",
    link: "https://demo-ujai.website/",
    footerTitle: "✨ Technologies used",
    footerContent: "PHP ● JQuery ● Jira ● Lucidchart ● Slack",
  },
  "Chest": {
    title: "📑 About me",
    content: "Greetings, I'm Jimmy ! 👋 I've graduated from a Master of Science in Information Systems Architecture and now heading for new opportunities. I'm somewhat curious and self-taught so I learned to wear multiple hats which means combining coding, design, marketing and project management. My other passion is 3D Modelling pairing with animations and since I've learned about the existence of Three.js, I'm now channeling 3D assets into my website projects.",
    footerTitle: "📻 Kit & Social media",
    footerContent: null,
  }
}

const loadingPage = document.querySelector("#loading-page");
const toggleSound = document.querySelector("#icon-sound");
const toggleTheme = document.querySelector("#icon-theme");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalExitButton = document.querySelector(".modal-exit-button");
const modalProjectDescription = document.querySelector(".modal-project-description");
const modalFooterTitle = document.querySelector(".modal-footer-title");
const modalProjectFooterDescription = document.querySelector(".modal-project-footer-description");
const modalVisitProjectButton = document.querySelector(".modal-project-visit-button");
const modalFooterSocialMedia = document.querySelector(".modal-footer-social-media");

function muteSound() {
  if (!isMuted) {
    toggleSound.classList.remove("fa-volume-up");
    toggleSound.classList.add("fa-volume-off");
    sounds.backgroundMusic.pause();
    isMuted = true;
  } else {
    toggleSound.classList.add("fa-volume-up");
    toggleSound.classList.remove("fa-volume-off");
    sounds.backgroundMusic.play();
    isMuted = false;
  }
}

function showModal(id) {
  const content = modalContent[id];
  if (content) {
    if (!modal.classList.contains("hidden")) {
      return hideModal();
    }
    modalTitle.textContent = content.title;
    modalProjectDescription.textContent = content.content;
    modalFooterTitle.textContent = content.footerTitle;
    if (content.footerContent) {
      modalProjectFooterDescription.textContent = content.footerContent;
      modalFooterSocialMedia.classList.add("hidden");
    } else {
      modalProjectFooterDescription.textContent = "";
      modalFooterSocialMedia.classList.remove("hidden");
    }
    modal.classList.toggle("hidden");
    if (content.link) {
      modalVisitProjectButton.href = content.link;
      modalVisitProjectButton.classList.remove("hidden");
    } else {
      modalVisitProjectButton.classList.add("hidden");
    }
  }
}

function hideLoadingPage() {
  sounds.backgroundMusic.play();
  loadingPage.style.transform = "scale(0)";
  loadingPage.addEventListener('transitionend', function(){
    loadingPage.classList.add("hidden");
  }, { once: true });
}

function hideModal() {
  modal.style.animation = "smooth-disappear 0.5s ease forwards";
  modal.addEventListener('animationend', function(){
    modal.classList.toggle("hidden");
    modal.style.animation = "smooth-appear 0.5s ease forwards";
    intersectObjectsNames.push(["Frame_One", "Frame_Two", "Frame_Three"]);
  }, { once: true });
}

let intersectObject = "";
const intersectObjects = [];
let intersectObjectsNames = [
  "Frame_One",
  "Frame_Two",
  "Frame_Three",
  "Chest",
  "Bulbasaur",
  "Charmander",
  "Chicken",
  "Pikachu",
  "Squirtle"
]

const loader = new GLTFLoader();
loader.load( './portfoliov4.glb',
  function ( gltf ) {
    scene.add( gltf.scene );
    gltf.scene.traverse((child) => {
      if (intersectObjectsNames.includes(child.name)) {
        intersectObjects.push(child);
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (child.name === "Character") {
        character.instance = child;
        playerCollider.start
        .copy(child.position)
        .add(new THREE.Vector3(0, capsule_radius, 0));
        playerCollider.end
        .copy(child.position)
        .add(new THREE.Vector3(0, capsule_height, 0));
      }
      if (child.name === "Ground_Collider") {
        colliderOctree.fromGraphNode(child);
        child.visible = false;
      }
    })
    console.log(intersectObjects);
}, undefined, function ( error ) {
  console.error( error );
} );

const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 2 );
directionalLight.castShadow = true;
directionalLight.position.set(180, 320, 250);
directionalLight.target.position.set(70, 30, 10);
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.left = -200;
directionalLight.shadow.camera.right = 200;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.normalBias = 1; //Remove shadow acnes
scene.add(directionalLight);

const shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera);
scene.add(shadowHelper);

const ambientLight = new THREE.AmbientLight( 0x404040, 3 ); // soft white light
scene.add( ambientLight );

let isDarkTheme = false;

function switchTheme() {
  if (!isDarkTheme) {
    toggleTheme.classList.remove("fa-moon-o");
    toggleTheme.classList.add("fa-sun-o");
    isDarkTheme = true;
  } else {
    toggleTheme.classList.add("fa-moon-o");
    toggleTheme.classList.remove("fa-sun-o");
    isDarkTheme = false;
  }

  gsap.to(ambientLight.color, {
    r: isDarkTheme ? 0.25 : 1.0,
    g: isDarkTheme ? 0.31 : 1.0,
    b: isDarkTheme ? 0.78 : 1.0,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(ambientLight, {
    intensity: isDarkTheme ? 0.9 : 0.8,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(directionalLight, {
    intensity: isDarkTheme ? 0.8 : 1.0,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(directionalLight.color, {
    r: isDarkTheme ? 0.25 : 1.0,
    g: isDarkTheme ? 0.41 : 1.0,
    b: isDarkTheme ? 0.88 : 1.0,
    duration: 1,
    ease: "power2.inOut",
  });
}

// Camera
const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -aspect * 50,
  aspect * 50,
  50,
  -50,
  1,
  1000
);
camera.zoom = 1.5;
camera.updateProjectionMatrix();
camera.position.set(166, 70, -171);

const cameraOffset = new THREE.Vector3(172, 70, -171);

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspect = sizes.width / sizes.height;
  camera.left = -aspect * 50;
  camera.right = aspect * 50;
  camera.top = 50;
  camera.bottom = -50;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

let isCharacterReady = true;
function jumpCharacter(meshID) {
  if (!isCharacterReady) return;

  const mesh = scene.getObjectByName(meshID);
  const jumpHeight = 2;
  const jumpDuration = 0.5;

  const t1 = gsap.timeline();

  t1.to(mesh.scale, {
    x: 1.2,
    y: 0.8,
    z: 1.2,
    duration: jumpDuration * 0.2,
    ease: "power2.out",
  });

  t1.to(mesh.scale, {
    x: 0.8,
    y: 1.3,
    z: 0.8,
    duration: jumpDuration * 0.3,
    ease: "power2.out",
  });

  t1.to(
    mesh.position,
    {
      y: mesh.position.y + jumpHeight,
      duration: jumpDuration * 0.5,
      ease: "power2.out",
    },
    "<"
  );

  t1.to(mesh.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: jumpDuration * 0.3,
    ease: "power1.inOut",
  });

  t1.to(
    mesh.position,
    {
      y: mesh.position.y,
      duration: jumpDuration * 0.5,
      ease: "bounce.out",
      onComplete: () => {
        isCharacterReady = true;
      },
    },
    ">"
  );

  t1.to(mesh.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: jumpDuration * 0.2,
    ease: "elastic.out(1, 0.3)",
  });
}

function onClick() {
  if (intersectObject !== "") {
    // When clicking Pokemons
    if (["Bulbasaur", "Chicken", "Pikachu", "Charmander", "Squirtle"].includes(intersectObject)) {
      jumpCharacter(intersectObject);
    // When clicking Frames
    } else if (modal.classList.contains("hidden")) {
      showModal(intersectObject);
    }
  }
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function playerCollisions() {
  const result = colliderOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;
  if (result) {
    playerOnFloor = result.normal.y > 0;
    playerCollider.translate(result.normal.multiplyScalar(result.depth));
    if (playerOnFloor) {
      character.isMoving = false;
      playerVelocity.x = 0;
      playerVelocity.z = 0;
    }
  }
}

function updatePlayer() {
  if (!character.instance) return;

  if (!playerOnFloor) {
    playerVelocity.y -= gravity * 0.05;
  }

  playerCollider.translate(playerVelocity.clone().multiplyScalar(0.01));

  playerCollisions();

  character.instance.position.copy(playerCollider.start);
  character.instance.position.y -= capsule_radius;

  let rotationDiff =
    ((((targetRotation - character.instance.rotation.y) % (2 * Math.PI)) +
      3 * Math.PI) %
      (2 * Math.PI)) -
    Math.PI;
  let finalRotation = character.instance.rotation.y + rotationDiff;

  character.instance.rotation.y = THREE.MathUtils.lerp(
    character.instance.rotation.y,
    finalRotation,
    0.4
  )
}

/* function moveCharacter (targetPosition, targetRotation) {
  character.isMoving = true;

  let rotationDiff =
    ((((targetRotation - character.instance.rotation.y) % (2 * Math.PI)) +
      3 * Math.PI) %
      (2 * Math.PI)) -
    Math.PI;
  let finalRotation = character.instance.rotation.y + rotationDiff;

  const t1 = gsap.timeline({
    onComplete: () => {
      character.isMoving = false;
    }
  });

  t1.to(character.instance.position,
    {
      x: targetPosition.x,
      z:targetPosition.z,
      duration: character.moveDuration
    }
  );

  t1.to(character.instance.rotation, 
    {
      y: finalRotation,
      duration: character.moveDuration
    },
    0
  );

  t1.to(character.instance.position, 
    {
      y: character.instance.position.y + character.jumpHeight,
      duration: character.moveDuration/2,
      yoyo: true,
      repeat: 1,
    },
    0
  );
} */

function onKeyDown(event) {
  if (character.isMoving) return;

  playSound("jumpSFX");

  switch(event.key.toLowerCase()) {
    case "w":
    case "arrowup":
      playerVelocity.x -= move_speed;
      targetRotation = -Math.PI;
      break;
    case "s":
    case "arrowdown":
      playerVelocity.x += move_speed;
      targetRotation = -0;
      break;
    case "a":
    case "arrowleft":
      playerVelocity.z += move_speed;
      targetRotation = -Math.PI/2;
      break;
    case "d":
    case "arrowright":
      playerVelocity.z -= move_speed;
      targetRotation = -Math.PI*3/2;
      break;
    default:
      return;
  }
  playerVelocity.y = jump_height;
  character.isMoving = true;
}

loadingPage.addEventListener("click", hideLoadingPage);
toggleSound.addEventListener("click", muteSound);
toggleTheme.addEventListener("click", switchTheme);
modalExitButton.addEventListener("click", hideModal);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("keydown", onKeyDown);

function animate() {
  updatePlayer();

  raycaster.setFromCamera(pointer, camera);

  if (character.instance) {
    const targetCameraPosition = new THREE.Vector3(
      character.instance.position.x + cameraOffset.x,
      cameraOffset.y + 80,
      character.instance.position.z + cameraOffset.z
    );
    camera.position.copy(targetCameraPosition);
    camera.lookAt(
      character.instance.position.x + 30,
      camera.position.y - 120,
      character.instance.position.z - 25
    );
  }

  const intersects = raycaster.intersectObjects(intersectObjects);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
    intersectObject = "";
  }

  for (let i = 0; i < intersects.length; i++) {
    intersectObject = intersects[0].object.parent.name;
  }
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );