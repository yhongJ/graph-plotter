import { ExpresssionError} from "./errors.js";

export default function tokenizer(expression){
    expression = expression.replace(/\s/g, "");
    const len = expression.length;
    let i = 0;
    const operators = ['+', '-', '*', '/', '^'];
    const functions = ["sin", "cos", "tan", "log"];
    const tokenized_expression = [];
    while(i < len){
        if(expression[i] === 'y' && expression[i+1] === '='){
            i += 2;
        }
        else if(expression[i] >= '0' && expression[i] <= '9'){
            let next = i + 1;
            let value = expression[i];
            while(expression[next] >= '0' && expression[next] <= '9'){
                value += expression[next];
                next++;
            }
            tokenized_expression.push(value);
            i = next;
        }
        else if(operators.includes(expression[i])){
            tokenized_expression.push(expression[i]);
            i++;
        }
        else if(functions.includes(expression.slice(i, i + 3))) {
            if(expression[i + 3] !== '('){
                alert("Transcendental functions require parentheses");
                return false;
            }
            else{
                tokenized_expression.push(expression.slice(i, i + 3));
                i += 3;
            }
        }
        else if(expression[i] === '(' || expression[i] === ')' || expression[i] === 'x'){
            tokenized_expression.push(expression[i]);
            i++;
        }
        else{
            throw new ExpresssionError(`Unexpected character'${expression[i]}`);
        }


    }
    return tokenized_expression;

}