export class ExpresssionError extends Error {
    constructor(message){
        super(message);
        this.name = "ExpresssionError";
    }
}