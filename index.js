import { html, render } from "lit-html";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, onSnapshot, limit } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi9NEeZf1Lk-xEO_s-MofPp7ZiAJJ2UEg",
  authDomain: "space-kitty-fp.firebaseapp.com",
  projectId: "space-kitty-fp",
  storageBucket: "space-kitty-fp.appspot.com",
  messagingSenderId: "721235516487",
  appId: "1:721235516487:web:93cb87e4a5be54143e2562"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
let scoreboard = [];
const scoreboardRef = collection(db, "scoreboard");

async function sendName(name) {
  // Add some data to the messages collection
  try {
    const docRef = await addDoc(collection(db, "scoreboard"), {
      time: Date.now(),
      nickname: name,
      score: score, //replace with score
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
 /*
function handleInput(e) {
  sendName(e.target.value);
  e.target.value = "";
}
*/

function view() {
  return html`
    <div id="name-container">
      <h1>Nickname</h1>
      <p>Your Survival Score: ${score}</p>
      <input type="text" value="PLAYER" id="username"/>
      <input type="button" value="Submit" @click=${getHighScores} />
    </div>`;
}
//${scoreboard.map((s) => html`<div="scores>${s.nickname}: ${s.score}</div>`)}
function scoreView() {
  let rank = 0;
  return html`
    <div id="scoreboard-container">
      <h1>Leaderboard</h1>
      <table id="leaderboard">
        <tr>
          <th>Rank</th>
          <th>Nickname</th>
          <th>Score</th>
        </tr>
        ${scoreboard.map((s) => html`
          <tr>
            <td>${rank+=1}</td>
            <td>${s.nickname}</td>
            <td>${s.score}</td>
          </tr>
        `)}
      </table>

      <input type="button" value="Play Again" @click=${resetGame} />
    </div>`;
}

function nameView() {
  document.getElementById("scoreboard").style.display = "block";
  render(view(), document.getElementById("scoreboard"));
}

async function getHighScores() {
  sendName(document.getElementById("username").value);
  scoreboard = [];

  const querySnapshot = await getDocs(
    query(scoreboardRef, orderBy("score", "desc"), orderBy("time"), limit(5)) //order by time ascending
  );
  querySnapshot.forEach((doc) => {
    let scoreData = doc.data();
    scoreboard.push(scoreData);
  });

  console.log(scoreboard);
  render(scoreView(), document.getElementById("scoreboard"));
}

/*
onSnapshot(
  collection(db, "scoreboard"),
  (snapshot) => {
    console.log("snap", snapshot);
    getHighScores();
  },
  (error) => {
    console.error(error);
  }
);
*/

//the game
let kitty, kittyImg, asteroids, asteroidImg, survivalTime, score, alive=true;

window.preload = () => {
//function preload() {
  kittyImg = loadImage('https://cdn-icons-png.flaticon.com/64/763/763763.png');
  asteroidImg = loadImage('https://cdn-icons-png.flaticon.com/64/7480/7480279.png');
  kitty = new Sprite(width/2, height/2); //spawns in center
  kitty.addImage(kittyImg);
  asteroids = new Group();
  asteroids.addImage(asteroidImg);
}

window.setup = () => {
//function setup() {
  new Canvas(windowWidth, windowHeight);
  survivalTime = 0;
  setInterval(timer,1000);
  createAsteroids();
}

window.draw = () => {
//function draw() {
  background(color(11, 11, 70)); // fixes kitty image trail

  fill(255); //white
  textSize(20);
  textAlign(CENTER);
  text('Guide space kitty away from the asteroids!', width / 2, height / 16);

  //kitty.position.x = mouseX;
  //kitty.position.y = mouseY;
  kitty.moveTowards(mouse);
  if (alive) {
    text('Time: ' + survivalTime + ' seconds', width / 2, height*2 / 16);
  } else {
    text('Submit your scores below to play again!', width / 2, height / 2);
  }

  // from p5play.org demos
  for (let a of asteroids) {
		if (a.x < -32) a.x = width + 32;
		if (a.x > width + 32) a.x = -32;
		if (a.y < -32) a.y = height + 32;
		if (a.y > height + 32) a.y = -32;
    a.addSpeed(0.01);
	}

  if (kitty.collides(asteroids)) {
    score = survivalTime;
    asteroids.remove();
    alive = false;
    console.log("cool this game workds");
    nameView();
  }
}

//window.createAsteroids = () => {
function createAsteroids() {
  for (let i = 0; i < 10; i++) {
    let a = new asteroids.Sprite(random(width), height, 64);
    a.speed = 2;
    a.mass = 2
    a.rotationSpeed = random(-1, 1);
    a.direction = random(360);
  }
}

//window.resetGame = () => {
function resetGame() {
  survivalTime = 0;
  alive = true;
  document.getElementById("scoreboard").style.display = "none";
  createAsteroids();
}

//window.timer = () => {
function timer() {
  survivalTime += 1;
}

window.windowResized = () => {
//function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}