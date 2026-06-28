//Backgroud Fluid movement script

// AI could NEVERRRR

// CONSTANTS //

const scale = 0.8; 
const damping = 0.96;
const cellSize = 10;
const fps = 80;
const thickness = 0.03;
const upperIntensity = 0.6;
const redCoeff = 90;
const blueCoeff = 0;
const greenCoeff = 90;

const canvas = document.getElementById('canva');
const context = canvas.getContext('2d');
let curr, prev;
let cols, rows;
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let prevMx = mx;
let prevMy = my;
let lastTime = 0;
const simulation_ms = 1000 / fps;
let accum = 0;

// FUNCTIONS //

function identity(a, b){
    return b * cols  + a;
}

function resize(){
    canvas.width = window.innerWidth / scale;
    canvas.height = window.innerHeight / scale;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    cols = Math.ceil(canvas.width / cellSize) + 2;
    rows = Math.ceil(canvas.height / cellSize) + 2;
    curr = new Float32Array(rows * cols);
    prev = new Float32Array(rows * cols);
}

function fluidDynamics(px, py, radius, strength){
    const pxNew = Math.floor(px / (cellSize * scale)) + 1;
    const pyNew = Math.floor(py / (cellSize * scale)) + 1;
    const radiusUpdated = Math.ceil(radius / cellSize);
    for(let i = -radiusUpdated; i<=radiusUpdated; i++){
        for(let j = -radiusUpdated; j<=radiusUpdated; j++){
            const distance = Math.abs(i) + Math.abs(j);
            if(distance <= radiusUpdated){
                const dx = pxNew + i;
                const dy = pyNew + j;
                if((dx > 0 && dx < cols-1) && (dy > 0  && dy < rows-1)){
                    const fallOff = (1 - distance / radiusUpdated);
                    curr[identity(dx, dy)] -= strength * fallOff * fallOff;
                }
            }
        }
    }
}

function frame(){
    for(let j=1; j<rows-1; j++){
        for(let i=1; i<cols-1; i++){
            const x = identity(i, j);
            const vector = (curr[identity(i-1, j)] + curr[identity(i+1, j)] + curr[identity(i, j-1)] + curr[identity(i, j+1)]) * 0.48 - prev[x];
            prev[x] = vector * damping;
        }
    }
    const swaptemp = curr;
    curr = prev;
    prev = swaptemp;
}

function fluidColor(vector){
    const t = Math.max(-1, Math.min(1, vector));
    let intensity = Math.min((t+1) * 0.5, upperIntensity);
    intensity = Math.max(intensity, 0.3);
    const r = 255 - redCoeff * intensity;
    const g = 255 - greenCoeff * intensity;
    const b = 255 - blueCoeff * intensity;
    return [r, g, b];
}

function render(){
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(let j=1; j<rows-1; j++){
        for(let i=1; i<cols-1; i++){
            const x = identity(i, j);
            const vector = curr[x];
            const dx = curr[identity(i+1, j)] - curr[identity(i-1, j)];
            const dy = curr[identity(i, j+1)] - curr[identity(i, j-1)];
            const magnitude = Math.abs(dx) + Math.abs(dy);
            const strength = vector * thickness + magnitude * thickness * 0.5;
            const [r, g, b] = fluidColor(strength);
            context.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
            context.fillRect((i-1)*cellSize, (j-1)*cellSize, cellSize, cellSize);
        }
    }
}

function loop(thisTime){
    requestAnimationFrame(loop);
    const dt = thisTime - lastTime;
    lastTime = thisTime;
    accum += dt;
    if(accum > simulation_ms){
        accum -= simulation_ms;
        const dx = mx - prevMx;
        const dy = my - prevMy;
        const speed = Math.abs(dx) + Math.abs(dy);
        if(speed > 2 && speed < 300){
            const frames = Math.ceil(speed / 5);
            for (let i=0; i< frames; i++){
                const t = i / frames;
                const ix = prevMx + dx * t;
                const iy = prevMy + dy * t;
                fluidDynamics(ix, iy, 10 + speed * 0.2, Math.min(speed*0.15, 8));
            }
        }
        prevMx = mx;
        prevMy = my;
        frame();
        render();
    }
}

// Driving Code
resize();
window.addEventListener('resize', resize);
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});
document.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    mx = touch.clientX;
    my = touch.clientY;
}, {passive : true});
document.addEventListener('click', e => {
    fluidDynamics(e.clientX, e.clientY, 32, 256);
});
requestAnimationFrame(loop);
