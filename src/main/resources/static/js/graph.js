//800 * 500 에서 원점은 (400, 250)
//100px당 10으로 -> x (-40 ~ 40) y (-25 ~ 25)
function x_position(x){
    return (x * scale) + canvas.width/2;
}
function y_position(y){
    return (-1 * y * scale) + canvas.height/2;
}

function tokenizer(expression){
    expression = expression.replace(/\s/g, "");
    const len = expression.length;
    let i = 0;
    const operators = ['+', '-', '*', '/', '^'];
    const functions = ["sin", "cos", "tan", "log"];
    const parsed_expression = [];
    while(i < len){
        if(expression[i] >= '0' && expression[i] <= '9'){
            let next = i + 1;
            let value = expression[i];
            while(expression[next] >= '0' && expression[next] <= '9'){
                value += expression[next];
                next++;
            }
            parsed_expression.push(value);
            i = next;
        }
        else if(operators.includes(expression[i])){
            parsed_expression.push(expression[i]);
            i++;
        }
        else if(functions.includes(expression.slice(i, i + 3))) {
            if(expression[i + 3] !== '('){
                alert("Transcendental functions require parentheses");
                return false;
            }
            else{
                parsed_expression.push(expression.slice(i, i + 3));
                i += 3;
            }
        }
        else if(expression[i] === '(' || expression[i] === ')'){
            parsed_expression.push(expression[i]);
            i++;
        }
        else{
            alert("Invalid expression");
            return false;
        }


    }
    return parsed_expression;

}