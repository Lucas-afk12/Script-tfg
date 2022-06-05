
export class Chapters {
    _id:number
    chapter_id ?:number;
    chapter:Array<any>;
    
    constructor(_id:number,chapter:Array<any>,chapter_id ?:number){
        this._id=_id;
        this.chapter=chapter;
        this.chapter_id=chapter_id
    }
}