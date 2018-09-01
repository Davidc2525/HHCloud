// @ts-check

/**
 * argumentos para @see Upload 
 * contiene la rruta donde se subiran los archivos, los archivos y el tipo
 */
class ItemUpload {
    constructor(path: String, files: Array<File>, type:string = "file") {
        this.path = path;
        this.listItems = files;
        this.type = type;
    }

    /**
     * Ruta donde subira los archivos esta instancia de subida
     * @returns path
     */
    getPath(): string { return this.path; }
    /**
     * archivos a subir
     */
    getListItems(): Array<File>{ return this.listItems; }
    /**
     * Tipo de subida, carpeta o archivos
     */FilePropertyBag
    getType():string{return this.type;}
}

export {ItemUpload};