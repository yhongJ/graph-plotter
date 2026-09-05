import { Parser } from "./parser.js";
import tokenizer from "./tokenizer.js";
import calculate from "./calculate.js";

//800 * 500 에서 원점은 (400, 250)
//100px당 10으로 -> x (-40 ~ 40) y (-25 ~ 25)
function x_position(x){
    return (x * scale) + canvas.width/2;
}
function y_position(y){
    return (-1 * y * scale) + canvas.height/2;
}

function draw(){
    const input = document.getElementById("graph");
    const errorBox = document.getElementById("errorMessage");
    errorBox.textContent = "";


    let tree;
    try {
        const tokens = tokenizer(input.value);
        tree = new Parser(tokens).parse();
    } catch (e) {
        if (e instanceof ExpressionError) {
            errorBox.textContent = e.message;   // 사용자 잘못 → 메시지 표시
            return;
        }
        throw e;                                // 내 버그 → 콘솔에 그대로 노출
    }

    for(let i = -(canvas.width/2)/scale; i <= (canvas.width/2)/scale; i+= 0.001){
        ctx.beginPath();
        ctx.arc(x_position(i), y_position(calculate(tree, i)), 1, 0, Math.PI * 2);
        ctx.fill();
    }
}
document.querySelector("form[action='/addGraph']")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        draw();
    }); //새로 좌표평면만 남는걸 막기위해

