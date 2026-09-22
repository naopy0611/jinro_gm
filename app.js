
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

const gameArea = document.getElementById("gameArea");
const phaseText = document.getElementById("phase");
const aliveText = document.getElementById("alive");
const dayText = document.getElementById("day");
const revealArea = document.getElementById("revealArea");
const playerName = document.getElementById("playerName");
const roleText = document.getElementById("roleText");

const showRoleBtn = document.getElementById("showRoleBtn");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");

let revealIndex = 0;
const ROLE_POOL = [
  "占い師","人狼","人狼","白狼","狂人",
  "騎士","狩人","医者","霊媒師","パン屋",
  "妖狐","てるてる"
];

let day = 1;
let isNight = true;
let alive = 9;

let players = [
  "A","B","C","D","E","F","G","H","I"
];

let roles = [];

function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function createRoles(){
  let pool=shuffle(ROLE_POOL).slice(0,players.length);

  while(pool.length<players.length){
    pool.push("村人");
  }

  roles=shuffle(pool);
}

startBtn.onclick = () => {
  createRoles();

  revealIndex = 0;
  startBtn.parentElement.classList.add("hidden");
  revealArea.classList.remove("hidden");

  showCurrentPlayer();
};

  gameArea.classList.remove("hidden");
  startBtn.parentElement.classList.add("hidden");

  updateScreen();

  alert(
    "配役完了！\n\n" +
    players.map((p,i)=>`${p}：${roles[i]}`).join("\n")
  );
};

nextBtn.onclick=()=>{
  if(isNight){
    isNight=false;
  }else{
    isNight=true;
    day++;
  }
  updateScreen();
};

function updateScreen(){
  phaseText.textContent =
    `${day}日目・${isNight ? "夜🌙" : "昼☀️"}`;

  dayText.textContent = day;
  aliveText.textContent = alive;

  nextBtn.textContent =
    isNight ? "朝にする" : "夜にする";
}

updateScreen();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./service-worker.js");
  });
}
function showCurrentPlayer(){
  playerName.textContent = players[revealIndex];
  roleText.textContent = "????";

  showRoleBtn.classList.remove("hidden");
  nextPlayerBtn.classList.add("hidden");
}

showRoleBtn.onclick = () => {
  roleText.textContent = roles[revealIndex];
  showRoleBtn.classList.add("hidden");
  nextPlayerBtn.classList.remove("hidden");
};

nextPlayerBtn.onclick = () => {
  revealIndex++;

  if(revealIndex >= players.length){
    revealArea.classList.add("hidden");
    gameArea.classList.remove("hidden");
    updateScreen();
    return;
  }

  showCurrentPlayer();
};
