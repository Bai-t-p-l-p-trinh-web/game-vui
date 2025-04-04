const cvs_dino = document.getElementById("dino-sakura");
const ctx_dino = cvs_dino.getContext("2d");

// Image 

// run 
const run_1 = new Image();
const run_2 = new Image();
const run_3 = new Image();
const run_4 = new Image();
const run_5 = new Image();
const run_6 = new Image();
const run_7 = new Image();
const run_8 = new Image();
run_1.src = "../assets/images/dino/run_1.png";
run_2.src = "../assets/images/dino/run_2.png";
run_3.src = "../assets/images/dino/run_3.png";
run_4.src = "../assets/images/dino/run_4.png";
run_5.src = "../assets/images/dino/run_5.png";
run_6.src = "../assets/images/dino/run_6.png";
run_7.src = "../assets/images/dino/run_7.png";
run_8.src = "../assets/images/dino/run_8.png";

// jump 
const jump_1 = new Image();
const jump_2 = new Image();
const jump_3 = new Image();
const jump_4 = new Image();
const jump_5 = new Image();
const jump_6 = new Image();
const jump_7 = new Image();
const jump_8 = new Image();
const jump_9 = new Image();
const jump_10 = new Image();
const jump_11 = new Image();
const jump_12 = new Image();
jump_1.src = "../assets/images/dino/jump_1.png";
jump_2.src = "../assets/images/dino/jump_2.png";
jump_3.src = "../assets/images/dino/jump_3.png";
jump_4.src = "../assets/images/dino/jump_4.png";
jump_5.src = "../assets/images/dino/jump_5.png";
jump_6.src = "../assets/images/dino/jump_6.png";
jump_7.src = "../assets/images/dino/jump_7.png";
jump_8.src = "../assets/images/dino/jump_8.png";
jump_9.src = "../assets/images/dino/jump_9.png";
jump_10.src = "../assets/images/dino/jump_10.png";
jump_11.src = "../assets/images/dino/jump_11.png";
jump_12.src = "../assets/images/dino/jump_12.png";

// wait 
const dino_wait_1 = new Image();
const dino_wait_2 = new Image();
const dino_wait_3 = new Image();
const dino_wait_4 = new Image();
const dino_wait_5 = new Image();
const dino_wait_6 = new Image();
const dino_wait_7 = new Image();
const dino_wait_8 = new Image();
const dino_wait_9 = new Image();
const dino_wait_10 = new Image();
dino_wait_1.src = "../assets/images/dino/Idle_1.png";
dino_wait_2.src = "../assets/images/dino/Idle_2.png";
dino_wait_3.src = "../assets/images/dino/Idle_3.png";
dino_wait_4.src = "../assets/images/dino/Idle_4.png";
dino_wait_5.src = "../assets/images/dino/Idle_5.png";
dino_wait_6.src = "../assets/images/dino/Idle_6.png";
dino_wait_7.src = "../assets/images/dino/Idle_7.png";
dino_wait_8.src = "../assets/images/dino/Idle_8.png";
dino_wait_9.src = "../assets/images/dino/Idle_9.png";
dino_wait_10.src = "../assets/images/dino/Idle_10.png";


// hedges 
const hedge_1 = new Image();
const hedge_2 = new Image();
const hedge_3 = new Image();
hedge_1.src = "../assets/images/dino/hedge_1.png";
hedge_2.src = "../assets/images/dino/hedge_2.png";
hedge_3.src = "../assets/images/dino/hedge_3.png";

// end Image 

const unit_dino = 32;
let is_jump = false;
let jump_height = -10;
let gravity = 0.5;
let cur_force = 0;
let cur_height_add = 0;
let cur_level = 0;
let score = 0;
let cur_frame = 0;
let frame_load = 0;
let isDead = true;
const fram_spawns = [50, 45, 45, 45];
const fram_speed = [5, 7, 8, 9];
let frame_will_spawn = 50;

const self = {
    x : 2*unit_dino,
    y : 15*unit_dino,
    width: 2*unit_dino,
    height: 2*unit_dino
};
const hedges_types = [
    {
        x : 32*unit_dino,
        y : 16*unit_dino,
        width: unit_dino,
        height: unit_dino,
        image: 1
    },
    {
        x : 32*unit_dino,
        y : 16*unit_dino,
        width: 1.5*unit_dino,
        height: unit_dino,
        image: 2
    },
    {
        x : 32*unit_dino,
        y : 15*unit_dino,
        width: unit_dino,
        height: 2*unit_dino,
        image: 3
    }
]
let hedges = [];



function collision_1d(ver_1, ver_2){
    if(
        ver_1[0] <= ver_2[0] && ver_2[0] <= ver_1[1] || 
        ver_1[0] <= ver_2[1] && ver_2[1] <= ver_1[1] || 
        ver_2[0] <= ver_1[0] && ver_1[0] <= ver_2[1] ||
        ver_2[0] <= ver_1[1] && ver_1[1] <= ver_2[1] 
    ) {
        return true;
    }
    return false;
}
function collision(dino, walls){
    for(let i = 0; i<walls.length; i++){
        let dino_x_0 = dino.x;
        let dino_x_1 = dino.x + dino.width;
        let dino_y_0 = dino.y;
        let dino_y_1 = dino.y + dino.height;
        

        let wall_x_0 = walls[i].x ;
        let wall_x_1 = walls[i].x + walls[i].width;
        let wall_y_0 = walls[i].y ;
        let wall_y_1 = walls[i].y + walls[i].height;


        if(
            collision_1d([dino_x_0, dino_x_1], [wall_x_0, wall_x_1]) && 
            collision_1d([dino_y_0, dino_y_1], [wall_y_0, wall_y_1])
        ){
            return true;
        }
    }
    return false;
}
function AddRandomHedge(){
    const index = Math.floor(Math.random() * 3);
    let newHedge = {...hedges_types[index]};
    hedges.push(newHedge);
}
function draw_background(){
    frame_load = (frame_load + 1)%40;
    ctx_dino.fillStyle = "#fff";
    ctx_dino.fillRect(0,0,32*unit_dino, 17*unit_dino);

    ctx_dino.fillStyle = "#A55B4B";
    ctx_dino.fillRect(0,17*unit_dino, 32*unit_dino, unit_dino);
    
    ctx_dino.fillStyle = "#000";
    ctx_dino.font = "20px sans-serif";
    ctx_dino.textBaseline = "top";
    ctx_dino.textAlign = "start";
    ctx_dino.fillText("Nhấn w, arrowUp hoặc space để bắt đầu", 9*unit_dino, 3*unit_dino);

    let cur_wait_frame = Math.floor(frame_load/10);
    switch(cur_wait_frame){
        case 0:
            ctx_dino.drawImage(dino_wait_1, self.x, self.y, self.width, self.height);
            break;
        case 1:
            ctx_dino.drawImage(dino_wait_2, self.x, self.y, self.width, self.height);
            break;
        case 2:
            ctx_dino.drawImage(dino_wait_3, self.x, self.y, self.width, self.height);
            break;
        case 3:
            ctx_dino.drawImage(dino_wait_4, self.x, self.y, self.width, self.height);
            break;
        case 4:
            ctx_dino.drawImage(dino_wait_5, self.x, self.y, self.width, self.height);
            break;
        case 5:
            ctx_dino.drawImage(dino_wait_6, self.x, self.y, self.width, self.height);
            break;
        case 6:
            ctx_dino.drawImage(dino_wait_7, self.x, self.y, self.width, self.height);
            break;
        case 7:
            ctx_dino.drawImage(dino_wait_8, self.x, self.y, self.width, self.height);
            break;
        case 8:
            ctx_dino.drawImage(dino_wait_9, self.x, self.y, self.width, self.height);
            break;
        case 9:
            ctx_dino.drawImage(dino_wait_10, self.x, self.y, self.width, self.height);
            break;
    }
    
}
function draw(){
    cur_frame += 1;
    frame_load = (frame_load + 1)%40;

    if(cur_frame >= frame_will_spawn){
        AddRandomHedge();
        cur_frame = 0;
        frame_will_spawn = fram_spawns[cur_level] + Math.floor(Math.random()*20);
    }
    ctx_dino.fillStyle = "#fff";
    ctx_dino.fillRect(0,0,32*unit_dino, 17*unit_dino);

    ctx_dino.fillStyle = "#A55B4B";
    ctx_dino.fillRect(0,17*unit_dino, 32*unit_dino, unit_dino);
    
    if(is_jump){
        cur_height_add += cur_force;
        cur_force += gravity;
        // console.log(cur_height_add);
        if(cur_height_add >= 0){
            cur_height_add = 0;
            cur_force = 0;
            is_jump = false;
        }

        if(frame_load <= 3){
            ctx_dino.drawImage(jump_1, self.x, self.y + cur_height_add, self.width, self.height);
        } else if(frame_load <= 6) {
            ctx_dino.drawImage(jump_2, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 9) {
            ctx_dino.drawImage(jump_3, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 12) {
            ctx_dino.drawImage(jump_4, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 16) {
            ctx_dino.drawImage(jump_5, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 20) {
            ctx_dino.drawImage(jump_6, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 23) {
            ctx_dino.drawImage(jump_7, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 26) {
            ctx_dino.drawImage(jump_8, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 30) {
            ctx_dino.drawImage(jump_9, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 33) {
            ctx_dino.drawImage(jump_10, self.x, self.y + cur_height_add, self.width, self.height);
        }else if(frame_load <= 36) {
            ctx_dino.drawImage(jump_11, self.x, self.y + cur_height_add, self.width, self.height);
        }else {
            ctx_dino.drawImage(jump_12, self.x, self.y + cur_height_add, self.width, self.height);
        }
    } else {
        let run_level = Math.floor(frame_load / 8);
        switch(run_level){
            case 0:
                ctx_dino.drawImage(run_1, self.x, self.y, self.width, self.height);
                break;
            case 1:
                ctx_dino.drawImage(run_2, self.x, self.y, self.width, self.height);
                break;
            case 2:
                ctx_dino.drawImage(run_3, self.x, self.y, self.width, self.height);
                break;
            case 3:
                ctx_dino.drawImage(run_4, self.x, self.y, self.width, self.height);
                break;
            case 4:
                ctx_dino.drawImage(run_5, self.x, self.y, self.width, self.height);
                break;
            case 5:
                ctx_dino.drawImage(run_6, self.x, self.y, self.width, self.height);
                break;
            case 6:
                ctx_dino.drawImage(run_7, self.x, self.y, self.width, self.height);
                break;
            case 7:
                ctx_dino.drawImage(run_8, self.x, self.y, self.width, self.height);
                break;
        } 
        
    }
    for(let i = 0; i<hedges.length; i++){
        hedges[i].x -= fram_speed[cur_level];
        // ctx_dino.fillStyle = "red";
        // ctx_dino.fillRect(hedges[i].x, hedges[i].y, hedges[i].width, hedges[i].height);
        if(hedges[i].image == 1){
            ctx_dino.drawImage(hedge_1, hedges[i].x, hedges[i].y, hedges[i].width, hedges[i].height)
        } else if(hedges[i].image == 2){
            ctx_dino.drawImage(hedge_2, hedges[i].x, hedges[i].y, hedges[i].width, hedges[i].height)
        } else {
            ctx_dino.drawImage(hedge_3, hedges[i].x, hedges[i].y, hedges[i].width, hedges[i].height)
        }
       
    }
    let length_hedges = hedges.length;
    hedges = hedges.filter(hedge => hedge.x >= 0);
    let length_new_hedges = hedges.length;
    if(length_hedges - length_new_hedges > 0){
        score += (length_hedges - length_new_hedges);
        if(score <= 10){
            cur_level = 0;
        } else if(score <= 20){
            cur_level = 1;
        } else if(score <= 30){
            cur_level = 2;
        } else if(score <= 40){
            cur_level = 3;
        }
    } 
    // ctx_dino.fillStyle = "red";
    // ctx_dino.fillRect(self.x, self.y + cur_height_add, self.width, self.height);
    
    ctx_dino.fillStyle = "#000";
    ctx_dino.font = "20px sans-serif";
    ctx_dino.textBaseline = "top";
    ctx_dino.textAlign = "start";
    ctx_dino.fillText(`score : ${score}`, 25*unit_dino, 3*unit_dino);
    
    if(collision(
        {
            x : self.x,
            y : self.y + cur_height_add,
            width : self.width,
            height : self.height
        },
        hedges
    )){
        ctx_dino.fillStyle = "#000";
        ctx_dino.font = "20px sans-serif";
        ctx_dino.textBaseline = "top";
        ctx_dino.textAlign = "start";
        ctx_dino.fillText("Nhấn w, arrowUp hoặc space để bắt đầu lại", 9*unit_dino, 3*unit_dino);
        clearInterval(game_dino);
        isDead = true;
    }
    
}


// keydown event 
document.addEventListener("keydown", getKey);
function getKey(e){
    e.preventDefault();

    let newChar = e.key;

    switch (newChar) {
        case " ": case "ArrowUp" : case "w":
            if (isDead){
                isDead  = false;
                hedges = [];
                frame_load = 0;
                score = 0;
                game_dino = setInterval(draw, 25);
                clearInterval(game_bg);
            }
            else if(!is_jump){
                is_jump = true;
                cur_force = jump_height;
            }
            
            break;
        default:
            break; 
    } 
    
}
// render 
var game_dino;
var game_bg;
setTimeout(() => {
    game_bg = setInterval(draw_background, 25);
}, 100);
// end render 