import { Parser, BinaryOP, UnaryOP } from "./parser.js";

export default function calculate(node, x){
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
    else if(typeof node === "number"){
        return Number(node);
    }
    else if(node === 'x'){
        return x;
    }
    throw new Error('Unknown node: ' + node);
}