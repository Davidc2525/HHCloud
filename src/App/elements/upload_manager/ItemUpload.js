// @ts-check

class ItemUpload {
    constructor(path: String, files: Array, type:string = "file") {
        this.path = path;
        this.listItems = files;
        this.type = type;
    }

    getPath(): String { return this.path; }
    getListItems(): Array { return this.listItems; }
    getType():string{return this.type;}
}

export {ItemUpload};