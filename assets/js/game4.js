// Typing game 
const cvs_typing = document.getElementById("typingGame");
const ctx_typing = cvs_typing.getContext("2d");

const unit_typing = 32;
let typedText = "";
let score = 0;
let lives = 5;
let currentLevel = 0;
let words = [];

let isDead = true;
// words 
const level1Words = [
    "cat", "dog", "fish", "apple", "ball", "run", "sun", "star", "book", "tree",
    "house", "sky", "moon", "bird", "hat", "shoe", "water", "green", "yellow", "red"
];
const level2Words = [
    "banana", "orange", "computer", "keyboard", "laptop", "camera", "guitar", "pencil", "table", "window",
    "household", "television", "mountain", "ocean", "universe", "airport", "library", "family", "holiday"
];
const level3Words = [
    "photosynthesis", "hippopotamus", "infrastructure", "microscope", "unbelievable", "bicycle", "dictionary", "scientific", "development",
    "architecture", "consciousness", "medication", "circumference", "exploration", "communication", "mathematics", "intelligence", "philosophy"
];

const difficulty = [
    {
        unit_fall: 0.7,
        time_generate: 2000
    },
    {
        unit_fall: 1,
        time_generate: 1500
    },
    {
        unit_fall: 1.3,
        time_generate: 1500
    }
]


let currentLevelWords = level1Words;

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * currentLevelWords.length);
    return currentLevelWords[randomIndex];
}

function levelUp(level) {
    if (level === 0) {
        currentLevelWords = level1Words;
    } else if (level === 1) {
        currentLevelWords = level2Words;
    } else if (level === 2) {
        currentLevelWords = level3Words;
    }
}
// end words 

// enter event 
function EnterWord(word){
    let index = words.findIndex(w => w.text == word);
    
    if(index != -1) {
        words.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
    
}
// end enter event 

// buttons 
const buttonStart = {
    x : 15*unit_typing,
    y : 16.5*unit_typing,
    width : 2*unit_typing,
    height: unit_typing,
    text: "Start Game"
};
const buttonLevelChange = {
    x : 12*unit_typing,
    y : 16.5*unit_typing,
    width : 2*unit_typing,
    height: unit_typing,
    text: `level ${currentLevel + 1}`
}
function drawButton(){
    ctx_typing.fillStyle = "#3498db"; 
    ctx_typing.fillRect(buttonStart.x, buttonStart.y, buttonStart.width, buttonStart.height);
    
    ctx_typing.fillStyle = "#ffffff"; 
    ctx_typing.font = "11px Arial";
    ctx_typing.textAlign = "center";
    ctx_typing.textBaseline = "middle";
    ctx_typing.fillText(buttonStart.text, buttonStart.x + buttonStart.width / 2, buttonStart.y + buttonStart.height / 2);


    ctx_typing.fillStyle = "gray"; 
    ctx_typing.fillRect(buttonLevelChange.x, buttonLevelChange.y, buttonLevelChange.width, buttonLevelChange.height);
    
    ctx_typing.fillStyle = "#ffffff"; 
    ctx_typing.font = "11px Arial";
    ctx_typing.textAlign = "center";
    ctx_typing.textBaseline = "middle";
    ctx_typing.fillText(buttonLevelChange.text, buttonLevelChange.x + buttonLevelChange.width / 2, buttonLevelChange.y + buttonLevelChange.height / 2);
}
// end buttons 
drawButton();

function loseGame(){
    isDead = true;
    clearInterval(game_typing);
    clearInterval(game_generate);
    
}

function draw(){
    ctx_typing.clearRect(0, 0, cvs_typing.width, cvs_typing.height);
    if(lives <= 0) loseGame();
    // draw background 
    ctx_typing.fillStyle = "#fff";
    ctx_typing.fillRect(0,0,32*unit_typing, 18*unit_typing);

    ctx_typing.fillStyle = "#E0E6F1";
    ctx_typing.fillRect(0, 16*unit_typing, 32*unit_typing, 2*unit_typing);

    ctx_typing.strokeStyle = "#ddd";
    ctx_typing.lineWidth = 1;
    ctx_typing.moveTo(0, unit_typing);
    ctx_typing.lineTo(32*unit_typing, unit_typing);
    ctx_typing.stroke();

    ctx_typing.fillStyle = "#000";
    ctx_typing.font = "30px sans-serif";
    ctx_typing.textBaseline = "top";
    ctx_typing.textAlign = "start";
    ctx_typing.fillText(typedText, 0, 5);


    ctx_typing.font = "15px sans-serif";
    ctx_typing.fillText(`Score : ${score}`, 18*unit_typing, 16.8*unit_typing);

    ctx_typing.font = "15px sans-serif";
    ctx_typing.fillText(`Lives : ${lives}`, 21*unit_typing, 16.8*unit_typing);
    // end draw background 

    // draw word in queue 
    words = words.filter((word) => {
        word.y += 1;
        if(word.y > 16*unit_typing){
            lives -= 1;
            if(lives <= 0) loseGame();
            return false;
        } else {
            return true;
        }
    })
    for(let i = 0; i<words.length; i++){
        ctx_typing.textBaseline = "bottom";
        ctx_typing.font = "17px sans-serif";
        ctx_typing.fillText(words[i].text, words[i].x, words[i].y);
    }
    // end draw word in queue 
    if(isDead){
        ctx_typing.fillStyle = "#fff";
        ctx_typing.fillRect(0,0,32*unit_typing, 16*unit_typing);
        drawButton();
    }
}

function generate_word(){
    let word = {
        x : Math.floor(Math.random() * 29 * unit_typing),
        y : 0,
        text: getRandomWord()
    }
    words.push(word);
    
}
// typing event 
document.addEventListener("keydown", getKey);
function getKey(e){
    e.preventDefault();

    let newChar = e.key;

    switch (newChar) {
        case "a": case "b": case "c": case "d": case "e":
        case "f": case "g": case "h": case "i": case "j":
        case "k": case "l": case "m": case "n": case "o":
        case "p": case "q": case "r": case "s": case "t":
        case "u": case "v": case "w": case "x": case "y":
        case "z": case "0": case "1": case "2": case "3":
        case "4": case "5": case "6": case "7": case "8":
        case "9": case " ": 
            typedText += newChar; 
            break;

        case "Backspace": 
            if(typedText.length > 0) typedText = typedText.slice(0, -1); 
            break;
        case "Enter":
            if(!EnterWord(typedText)) lives = Math.max(lives - 1, 0);
            else score += 1;
            typedText = "";
            break;
        default:
            break; 
    }
    
    
}

// click event 
cvs_typing.addEventListener("click", function(event) {
    const rect = cvs_typing.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    if(isDead) {
        if (mouseX >= buttonStart.x && mouseX <= buttonStart.x + buttonStart.width &&
            mouseY >= buttonStart.y && mouseY <= buttonStart.y + buttonStart.height) {
            
            words = [];
            game_typing = setInterval(draw, 50);
            game_generate = setInterval(generate_word,difficulty[currentLevel].time_generate);
            lives = 5;
            score = 0;
            isDead = false;
        }
    
        if (mouseX >= buttonLevelChange.x && mouseX <= buttonLevelChange.x + buttonLevelChange.width &&
            mouseY >= buttonLevelChange.y && mouseY <= buttonLevelChange.y + buttonLevelChange.height) {
            currentLevel = (currentLevel + 1)%3;
            buttonLevelChange.text = `level ${currentLevel + 1}`;
            levelUp(currentLevel);
            drawButton();
            
        }
    }
    
});

// end click event 
var game_generate;
var game_typing;
draw();