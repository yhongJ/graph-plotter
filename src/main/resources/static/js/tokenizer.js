import { ExpressionError} from "./errors.js";

const operators = ['+', '-', '*', '/', '^'];
const functions = ["sin", "cos", "tan", "log"];

function isDigit(c){
    if( c >= '0' && c <= '9' ) return true;
    else return false;
}

export default function tokenizer(expression){
    expression = expression.replace(/\s/g, "");

    if(expression === ""){
        throw new ExpressionError("Enter an expression");
    }

    const len = expression.length;
    let i = 0;

    if(expression[0] === 'y' && expression[1] === '='){
        i += 2;
        if(i >= len){
            throw new ExpressionError("Enter an expression after 'y='");
        }
    }

    const tokenized_expression = [];

    while(i < len){

        if(isDigit(expression[i])){
            let value = "";
            while(isDigit(expression[i])){
                value += expression[i];
                i++;
            }
            if(expression[i] === '.'){ //소수 지원
                value += '.';
                i++;
                if(!isDigit(expression[i])){
                    throw new ExpressionError("Add a digit after '.'");
                }
                while(isDigit(expression[i])){
                    value += expression[i];
                    i++;
                }
            }
            tokenized_expression.push(value);
        }
        else if(operators.includes(expression[i])){
            tokenized_expression.push(expression[i]);
            i++;
        }
        else if(functions.includes(expression.slice(i, i + 3))) {
            if(expression[i + 3] !== '('){
                throw new ExpressionError("Transcendental functions require parentheses");
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
            throw new ExpressionError(`Unexpected character'${expression[i]}'`);
        }


    }
    return tokenized_expression;

}