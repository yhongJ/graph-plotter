import { BinaryOP, UnaryOP } from "./parser.js";

export default function calculate(node, x){
    if(node instanceof BinaryOP){
        let op = node.op;
        const left =  calculate(node.left, x);
        const right =  calculate(node.right, x);

        if(op === "+"){
            return left + right;
        }
        else if(op === "-"){
            return left - right;
        }
        else if(op === "*"){
            return left * right;
        }
        else if(op === "/"){
            return left / right;
        }
        else if(op === "^"){
            return left ** right;
        }
    }
    else if(node instanceof UnaryOP){
        let op = node.op;
        const value =  calculate(node.operand, x);
        if(op === "-"){
            return -1 * value;
        }
        else if(op === "sin"){
            return Math.sin(value);
        }
        else if(op === "cos"){
            return Math.cos(value);
        }
        else if(op === "tan"){
            return Math.tan(value);
        }
        else if(op === "log"){
            return Math.log(value);
        }
    }
    else if(typeof node === "number"){
        return node;
    }
    else if(node === 'x'){
        return x;
    }
    throw new Error('Unknown node: ' + node);
}