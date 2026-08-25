import Parser from "/parser.js";
import BinaryOP from "/parser.js";
import UnaryOP from "/parser.js";
import tokenizer from "/tokenizer.js";

//800 * 500 에서 원점은 (400, 250)
//100px당 10으로 -> x (-40 ~ 40) y (-25 ~ 25)
function x_position(x){
    return (x * scale) + canvas.width/2;
}
function y_position(y){
    return (-1 * y * scale) + canvas.height/2;
}

let tokenized_expression = tokenizer(expression);
let parser = new Parser(tokenized_expression);

function calculate(node, x){
    if(node instanceof BinaryOP){
        let op = node.op;
        if(op === "+"){
            return calculate(node.left, x) + calculate(node.right, x);
        }
        else if(op === "-"){
            return calculate(node.left, x) - calculate(node.right, x);
        }
        else if(op === "*"){
            return calculate(node.left, x) * calculate(node.right, x);
        }
        else if(op === "/"){
            return calculate(node.left, x) / calculate(node.right, x);
        }
        else if(op === "^"){
            return calculate(node.left, x) ** calculate(node.right, x);
        }
    }
    else if(node instanceof UnaryOP){
        let op = node.op;
        if(op === "-"){
            return -1 * calculate(node.operand, x);
        }
        else if(op === "sin"){
            return Math.sin(calculate(node.operand, x));
        }
        else if(op === "cos"){
            return Math.cos(calculate(node.operand, x));
        }
        else if(op === "tan"){
            return Math.tan(calculate(node.operand, x));
        }
        else if(op === "log"){
            return Math.log(calculate(node.operand, x));
        }
    }
    else if(Number.isInteger(Number(node))){
        return Number(node);
    }
    else if(node === 'x'){
        return x;
    }
}