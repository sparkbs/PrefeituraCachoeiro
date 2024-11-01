export class GenericResultResponse<T>{
    constructor(object: any){
        this.success = object.success;
        this.message = object.message;
        this.data = object.data;
    }

    success: boolean = false;
    message: string = "";
    data?: T;

    static unwrap<U>(response: GenericResultResponse<U>):U{
        if(response.success && response.data !== undefined){
            return response.data;
        } else{
            throw new Error(response.message);
        }
    }
}