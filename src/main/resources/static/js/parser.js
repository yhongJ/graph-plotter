import { ExpressionError } from "./errors.js";


const functions = ["sin", "cos", "tan", "log"];
const NUMBER = /^\d+(\.\d+)?$/;
// 정수와 소수를 포함하는 정규 표혆식

export class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.pos = 0;
    }

    parse(){
        const tree = this.expr();
        if(this.pos !== this.tokens.length){
            throw new ExpressionError(`Unexpected token '${this.tokens[this.pos]}'`);
        }
        return tree;
    }


    expr(){
        let left = this.term();
        while(['+', '-'].includes(this.tokens[this.pos])){
            const op = this.tokens[this.pos];
            this.pos++;
            const right = this.term();
            left = new BinaryOP(left, op, right);
        }
        return left;
    }
    term(){
        let left = this.unary();
        while(['*', '/'].includes(this.tokens[this.pos])){
            const op = this.tokens[this.pos];
            this.pos++;
            const right = this.unary();
            left = new BinaryOP(left, op, right);
        }
        return left;
    }
    //unary는 다른 함수들과 달리 -가 연이어 나올수있으며 operand가 right 하나 뿐임. -> 재귀적으로 계속 검사해야함
    unary(){

        if(this.tokens[this.pos] ==='-'){
            const op = this.tokens[this.pos];
            this.pos ++;
            return new UnaryOP(op, this.unary());
        }
        else{
            return this.power();
        }
    }
    power(){ //만약 2^3^4가 주어진 경우, 2^(3^4)로 동작하도록 해야함
        let left = this.primary();
        if(this.tokens[this.pos] ==='^'){
            const op = this.tokens[this.pos];
            this.pos++;
            const right = this.power();
            left = new BinaryOP(left, op, right);
        }
        return left;
    }



    primary(){ //case1: 숫자, case2: x, case3: (expr), case4: 초월함수
        let left = this.tokens[this.pos];
        if(left === 'x'){
            this.pos ++;
            return left;
        }
        else if(NUMBER.test(left)){
            this.pos++;
            return Number(left);
        }
        else if(left === '('){
            this.pos++;
            left = this.expr();
            if(this.tokens[this.pos] === ')'){
                this.pos ++;
                return left;
            }
            else{
                throw new ExpressionError("Close the parenthesis with ')'");
            }
        }
        else if(functions.includes(left)){
            let op = this.tokens[this.pos];
            this.pos++;
            let operand = this.primary();
            return new UnaryOP(op, operand);
        }
        else{
            throw new ExpressionError("Invalid expression");
        }

    }

}

export class BinaryOP{
    constructor(left, op, right){
        this.left = left;
        this.op = op;
        this.right = right;
    }
}

export class UnaryOP{
    constructor(op, operand){
        this.op = op;
        this.operand = operand;
    }
}