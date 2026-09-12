import { Parser } from "./parser.js";
import tokenizer from "./tokenizer.js";
import calculate from "./calculate.js";
import {ExpressionError} from "./errors.js";


const canvas = document.getElementById("plane");
const ctx = canvas.getContext("2d");
const scale = 50;
const graphList = document.getElementById("graphList");

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

    if (!isUserError) console.error(err);   // err.message 아니라 err

    alert(isUserError ? err.message : fallback);
}

function draw(expression) {
    const tree = new Parser(tokenizer(expression)).parse();

    ctx.beginPath();
    ctx.lineWidth = 1;

    const step = 0.01;
    const half = (canvas.width / 2) / scale;
    let started = false;

    for (let i = -half; i <= half; i += step) {
        const y = calculate(tree, i);

        if (!Number.isFinite(y) || Math.abs(y) > (canvas.height / (scale * 2)) * 1.5) {
            started = false;   // tan, log 같은 불연속 지점에서 선 끊기
            continue;
        }

        const px = x_position(i), py = y_position(y);
        if (started) ctx.lineTo(px, py);
        else {
            ctx.moveTo(px, py);
            started = true; }
    }

    ctx.stroke();
}

function drawAll(){
    drawPlane();
    for(const item of graphList.querySelectorAll('li')){
        try{
            draw(item.dataset.expression);
        }catch(err){
            console.error(err);
        }

    }
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
document.getElementById("addForm").addEventListener("submit", onAddGraph);
graphList.addEventListener("click", onDeleteGraph);

//form이 제출되면 onAddGraph실행, 목록이 클릭되면 onDeleteGraph실행