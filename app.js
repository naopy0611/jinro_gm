const ROLE_POOL = [
  "占い師","人狼","人狼","白狼","狂人",
  "騎士","狩人","医者","霊媒師","パン屋",
  "妖狐","てるてる"
];

// 画面
const startScreen = document.getElementById("startScreen");
const revealScreen = document.getElementById("revealScreen");
const gameScreen = document.getElementById("gameScreen");

// ボタン
const startBtn = document.getElementById("startBtn");
const showRoleBtn = document.getElementById("showRoleBtn");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");

// 表示
const playerCount = document.getElementById("playerCount");
const nameArea = document.getElementById("nameArea");
const playerName = document.getElementById("playerName");
const roleCard = document.getElementById("roleCard");

let players = [];
let roles = [];
let revealIndex = 0;

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// 名前入力欄作成
function createInputs(){
  nameArea.innerHTML="";
  const count=Number(playerCount.value);

  for(let i=0;i<count;i++){
    const input=document.createElement("input");
    input.placeholder=`プレイヤー${i+1}`;
    input.value=String.fromCharCode(65+i);
    nameArea.appendChild(input);
  }
}

playerCount.onchange=createInputs;
createInputs();

// ゲーム開始
startBtn.onclick=()=>{
  players=[...nameArea.querySelectorAll("input")].map(i=>i.value);

  let pool=shuffle(ROLE_POOL).slice(0,players.length);
  while(pool.length<players.length) pool.push("村人");

  roles=shuffle(pool);

  revealIndex=0;

  startScreen.classList.add("hidden");
  revealScreen.classList.remove("hidden");

  showCurrent();
};

function showCurrent(){
  playerName.textContent=players[revealIndex];
  roleCard.textContent="????";
  showRoleBtn.classList.remove("hidden");
  nextPlayerBtn.classList.add("hidden");
}

showRoleBtn.onclick=()=>{
  roleCard.textContent=roles[revealIndex];
  showRoleBtn.classList.add("hidden");
  nextPlayerBtn.classList.remove("hidden");
};
// ===== Part4 =====

// ゲーム画面
const phase = document.getElementById("phase");
const aliveCount = document.getElementById("aliveCount");
const dayCount = document.getElementById("dayCount");
const nextPhaseBtn = document.getElementById("nextPhaseBtn");

let alive = [];
let day = 1;
let isNight = true;

nextPlayerBtn.onclick = () => {
  revealIndex++;

  if(revealIndex >= players.length){
    revealScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    alive = Array(players.length).fill(true);
    updateGame();
    return;
  }

  showCurrent();
};

function updateGame(){
  phase.textContent = `${day}日目 ${isNight ? "夜🌙" : "昼☀️"}`;
  dayCount.textContent = day;
  aliveCount.textContent = alive.filter(v=>v).length;

  nextPhaseBtn.textContent =
    isNight ? "朝にする" : "投票へ";
}

nextPhaseBtn.onclick = () => {
  if(isNight){
    isNight = false;
    updateGame();
  }else{
    startVote();
  }
};
// ===== 投票 =====
const voteArea = document.getElementById("voteArea");
const voteSelect = document.getElementById("voteSelect");
const voteBtn = document.getElementById("voteBtn");
const logArea = document.getElementById("logArea");

function startVote(){
  voteArea.classList.remove("hidden");
  voteSelect.innerHTML = "";

  players.forEach((p,i)=>{
    if(alive[i]){
      const op = document.createElement("option");
      op.value = i;
      op.textContent = p;
      voteSelect.appendChild(op);
    }
  });
}

voteBtn.onclick = () => {
  const i = Number(voteSelect.value);

  alive[i] = false;

  addLog(`⚰️ ${players[i]} を処刑（${roles[i]}）`);

  voteArea.classList.add("hidden");

  checkWinner();

  if(!gameOver){
    day++;
    isNight = true;
    updateGame();
  }
};

// ===== ログ =====
function addLog(text){
  const p = document.createElement("div");
  p.textContent = text;
  logArea.prepend(p);
}

// ===== 勝利判定 =====
let gameOver = false;

function checkWinner(){

  const wolves = roles.filter((r,i)=>
    alive[i] && (r==="人狼" || r==="白狼")
  ).length;

  const fox = roles.some((r,i)=>
    alive[i] && r==="妖狐"
  );

  const villagers = roles.filter((r,i)=>
    alive[i] &&
    !["人狼","白狼","狂人","妖狐"].includes(r)
  ).length;

  if(wolves===0 && !fox){
    alert("🏆 村人陣営の勝利！");
    gameOver = true;
    return;
  }

  if(fox && wolves===0){
    alert("🦊 妖狐の勝利！");
    gameOver = true;
    return;
  }

  if(wolves>=villagers && wolves>0){
    alert("🐺 人狼陣営の勝利！");
    gameOver = true;
    return;
  }
}

// ===== PWA =====
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./service-worker.js");
  });
}
