import { Parser } from "./parser.js";
import tokenizer from "./tokenizer.js";
import calculate from "./calculate.js";


const canvas = document.getElementById("plane");
const ctx = canvas.getContext("2d");
const scale = 10;
const errorBox = document.getElementById("errorMessage");
const graphList = document.getElementById("graphList");

//800 * 500 에서 원점은 (400, 250)
//100px당 10으로 -> x (-40 ~ 40) y (-25 ~ 25)
function x_position(x){
    return (x * scale) + canvas.width/2;
}
function y_position(y){
    return (-1 * y * scale) + canvas.height/2;
}

function draw(expression) {
    const tree = new Parser(tokenizer(expression)).parse();

    ctx.beginPath();
    ctx.lineWidth = 1;

    const step = 0.03;
    const half = (canvas.width / 2) / scale;
    let started = false;

    for (let i = -half; i <= half; i += step) {
        const y = calculate(tree, i);

        if (!Number.isFinite(y) || Math.abs(y) > canvas.height / scale * 2) {
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
        draw(item.dataset.expression);
    }
}

drawAll();

async function onAddGraph(e){
    e.preventDefault(); //페이지 이동 막음

    const input = document.getElementById("graph");
    const expression = input.value;
    try{
        draw(expression);
        errorBox.textContent = "";
    }catch(err){
        errorBox.textContent = err.message;
        return;
    }

    const response = await fetch("/api/graphs", {
        //서버에 요청을 보내고 응답이 올떄까지 기다림
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({expression})
    } );
    const saved = await response.json();

    const item = document.createElement("li");
    item.dataset.id = saved.id;
    item.dataset.expression = saved.graph;
    item.innerHTML = `<span>${saved.graph}</span> <button type="button" class="delete">Delete</button>`;
    //서버 렌더링 +  점진적 향상: 첫 화면만 서버가 만들고 상호작용은 JS가 맡는 방식
    //html코드를 한번 더 쓰기ㅣ 싫으면 <template>태그 사용 가능
    graphList.appendChild(item);
    input.value = "";
}

async function onDeleteGraph(e){
    if(!e.target.classList.contains("delete")) return;
    const item =  e.target.closest("li");
    await fetch("/api/graphs/" + item.dataset.id, {method: "DELETE"});
    item.remove();
    drawAll(); //그래프 하나만 지울 수 없어 전부 다시 그림
}

document.getElementById("addForm").addEventListener("submit", onAddGraph);
graphList.addEventListener("click", onDeleteGraph);

//form이 제출되면 onAddGraph실행, 목록이 클릭되면 onDeleteGraph실행