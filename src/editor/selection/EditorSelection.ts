import { Document as ModelDocument, Texture } from '@gltf-transform/core';

export enum EditorSelectionType {
    Texture = "Texture", 
    Material = "Material",
    None = "None"
}

export class EditorSelection {
    type : EditorSelectionType;
    id : string;
    
    public static None: EditorSelection = new EditorSelection(EditorSelectionType.None, "");

    constructor(type : EditorSelectionType, id : string){
        this.type = type;
        this.id = id;
    }

}