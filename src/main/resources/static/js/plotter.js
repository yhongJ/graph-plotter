import { Parser } from "./parser.js";
import tokenizer from "./tokenizer.js";
import calculate from "./calculate.js";
import {ExpressionError} from "./errors.js";


const canvas = document.getElementById("plane");
const ctx = canvas.getContext("2d");
let scale = 50;
const MIN_SCALE = 5;
const MAX_SCALE = 400;
const graphList = document.getElementById("graphList");
const colors = ["#E41A1C", "#377EB8", "#009E73", "#E69F00", "#7B2CBF", "#00A6A6", "#D81B60"];
let color = 0;


//1300 * 500 에서 원점은 (650, 250)
//50px당 1로 -> x (-13 ~ 13) y (-5 ~ 5)
function x_position(x){
    return (x * scale) + canvas.width/2;
}
function y_position(y){
    return (-1 * y * scale) + canvas.height/2;
}


function showError(err, fallback = "Something went wrong. Try again.") {
    let isUserError;
    if (err instanceof ExpressionError) {
        isUserError = true;
    } else {
        isUserError = false;
    }

    if (!isUserError) console.error(err);

    alert(isUserError ? err.message : fallback);
}

function draw(expression) {
    const tree = new Parser(tokenizer(expression)).parse();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors[color];
    color = (color + 1) % colors.length;

    const step = 0.05;
    const margin = canvas.height; // 화면 위아래로 이만큼까지 선을 이어줌
    let started = false;
    let prevPy = 0;

    for (let px = 0; px <= canvas.width; px += step) {
        const x = (px - canvas.width / 2) / scale;
        const y = calculate(tree, x);

        if (!Number.isFinite(y)) {
            started = false;
            continue;
        }

        const py = y_position(y);

        if(py < -margin || py > canvas.height + margin) {
            started = false;
            continue;
        }

        if(started && Math.abs(py - prevPy) > canvas.height) started = false;
        //y값은 저장하되, 값이 튀면 그리지않는다. ex)점근선

        if (started) ctx.lineTo(px, py);
        else {
            ctx.moveTo(px, py);
            started = true; }

        prevPy = py;
    }

    ctx.stroke();
}

function drawAll(){
    drawPlane(scale);
    color = 0;
    for(const item of graphList.querySelectorAll('li')){
        try{
            draw(item.dataset.expression);
        }catch(err){
            console.error(err);
        }

    }
}

let pending = false;

function scheduleDraw() { //drawAll이 꽤 무겁기 떄문에, 실행 횟수를 줄이기 위함
    if (pending) return;          // 이미 예약돼 있으면 무시
    pending = true;
    requestAnimationFrame(() => { //  다음 화면 갱신 직전에 실행 예약 (쓸데없는 실행은 제외하고, 화면 갱신 속도에 맞춤)
        pending = false;
        drawAll();
    });
}


function setScale(nextScale) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    scheduleDraw();
}

drawAll();


async function onAddGraph(e){
    e.preventDefault(); //페이지 이동 막음

    const input = document.getElementById("graph");
    const expression = input.value;
    try {
        draw(expression);
    } catch (err) {
        showError(err, "Couldn't draw that graph. Try again.");
        return;
    }

    try{
        const response = await fetch("/api/graphs", {
            //서버에 요청을 보내고 응답이 올떄까지 기다림
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({expression})
        } );
        if(!response.ok){
            throw new Error(`POST /api/graphs → ${response.status}`);
        }
        const saved = await response.json();

        const item = document.createElement("li");
        item.dataset.id = saved.id;
        item.dataset.expression = saved.graph;
        item.innerHTML = `<span>${saved.graph}</span> <button type="button" class="delete">Delete</button>`;
        //서버 렌더링 +  점진적 향상: 첫 화면만 서버가 만들고 상호작용은 JS가 맡는 방식
        //html코드를 한번 더 쓰기ㅣ 싫으면 <template>태그 사용 가능
        graphList.appendChild(item);
        input.value = "";
    }catch(err){
        showError(err, "Failed to save. Try again.");
        drawAll(); //저장 실패, 방금 그린 선도 되돌림
    }
}

async function onDeleteGraph(e){
    if(!e.target.classList.contains("delete")) return;
    const item =  e.target.closest("li");
    try{
        const response = await fetch("/api/graphs/" + item.dataset.id, {method: "DELETE"});
        if(!response.ok){
            throw new Error(`DELETE /api/graphs → ${response.status}`);
        }
        item.remove();
        drawAll(); //그래프 하나만 지울 수 없어 전부 다시 그림
    }catch(err){
        showError(err, "Failed to delete. Try again.");
    }

}

document.getElementById("zoomIn").onclick = () => setScale(scale * 1.5);
document.getElementById("zoomOut").onclick = () => setScale(scale / 1.5);
document.getElementById("zoomReset").onclick = () => setScale(50);

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();                       // 페이지 스크롤 막기
    setScale(scale * Math.exp(-e.deltaY * 0.001));
}, { passive: false });
document.getElementById("addForm").addEventListener("submit", onAddGraph);
graphList.addEventListener("click", onDeleteGraph);

//form이 제출되면 onAddGraph실행, 목록이 클릭되면 onDeleteGraph실행