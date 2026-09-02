export class ExpressionError extends Error {
    constructor(message){
        super(message);
        this.name = "ExpressionError";
    }
}