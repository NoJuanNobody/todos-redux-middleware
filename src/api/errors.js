
class ExtendableError extends Error {
    constructor(...args) {
      super(...args);
      this.name = this.constructor.name;
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      } else { 
        this.stack = (new Error(args.message)).stack; 
      }
    }
}  

export class URLParamsError extends ExtendableError {
   constructor(...args){
       super(...args);
       this.name = this.constructor.name;
       this.message = args[0] + 
       "\n additional details\n"+
       "url in network request "+args[1]
   }
}