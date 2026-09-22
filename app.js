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
