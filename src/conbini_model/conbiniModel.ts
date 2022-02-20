import { Document as ModelDocument, WebIO, ExtensionProperty, Property, Texture } from '@gltf-transform/core';
import { TextureBasisu } from '@gltf-transform/extensions';
import { v4 as uuidv4 } from 'uuid';

import { EditorSelection, EditorSelectionType } from '../editor/selection/EditorSelection';
import { compress_texture, TextureCompressionSettings } from './compression';

//setup webio
const io = new WebIO({credentials: 'include'});
io.registerExtensions([TextureBasisu]);

export class ConbiniModel{
    new_copy: ModelDocument;
    original: ModelDocument;
    refresh?: (url:string) => void;

    constructor(original : ModelDocument, refresh?: (url:string) => void){
        this.original = original;
        this.new_copy = original.clone();
        this.refresh = refresh;
    }

    static async fromFile(file: File, refresh?: (url : string) => void){
        const new_copy = await parseModelFile(file);

        //Assign Model Name if None
        if(new_copy.getRoot().getName() === "") new_copy.getRoot().setName(file.name);

        //Assign Texture Names if None
        for(const texture of new_copy.getRoot().listTextures()){
            if(texture.getName() === "") texture.setName(uuidv4());
        }

        return new ConbiniModel(new_copy, refresh);
    }

    getName(){
        return this.new_copy.getRoot().getName();
    }

    getTextures(){
        return this.original.getRoot().listTextures();
    }

    getModelDataURL() : string
    {
        const data = io.writeBinary(this.new_copy);
        const data_blob = new Blob([data], {type: 'new_copy/gltf-binary'});
        return URL.createObjectURL(data_blob);
    }

    getTextureFromSelection(selection : EditorSelection) : Texture | undefined
    {
        if(selection.type === EditorSelectionType.Texture){
            
            //find the texture in the new_copy
            const texture = this.original.getRoot().listTextures().find(t => t.getName() === selection.id);
            if(!texture){
                console.error(`Could not find texture in new_copy ${ this.new_copy.getRoot().getName() } from Selection ${selection.id}`);
                return undefined;
            }

            return texture;
        }

        console.error("Cannot get image URL from selectionType: " + selection.type);
    }

    async compressTexture(original : Texture, settings : TextureCompressionSettings){
        const new_texture = this.new_copy.getRoot().listTextures().find(t => t.getName() === original.getName());
        if(!new_texture) throw new Error(`Could not find original texture ${ original.getName() } in new new_copy ${ this.new_copy.getRoot().getName() }`);

        //check if the new_copy already has the TextureBasisu extension
        const extension = this.new_copy.getRoot().listExtensionsRequired().find(ext => ext.extensionName === "KHR_texture_basisu");
        if(!extension) this.new_copy.createExtension(TextureBasisu).setRequired(true);

        await compress_texture(original, new_texture, settings);

        console.log(`Compressed texture ${ original.getName() }`);
        console.log(this.refresh);

        this.refresh!(this.getModelDataURL());
    }

    getImageURLFromSelection(selection : EditorSelection) : string | undefined{
        
        const texture = this.getTextureFromSelection(selection);
        if(!texture) return undefined;

        const image_data = texture.getImage();
        const image_url = URL.createObjectURL(new Blob( [ image_data! ], { type: "image/jpeg" } ));
        return image_url;
    }

    //TODO: Implement getStats
    getStats() : StatsFrame
    {
        
        const texture_size = this.new_copy.getRoot().listTextures().map(t => t.getImage()?.byteLength || 0).reduce((a, b) => a + b, 0);

        console.log(`Model ${this.new_copy.getRoot().getName()} has ${this.new_copy.getRoot().listTextures().length} textures and ${texture_size} bytes of texture data`);

        const mesh_data_size = this.new_copy.getRoot().listAccessors().map(a => a.getByteLength()).reduce((a, b) => a + b, 0); 
 
        return { mesh_size : mesh_data_size, texture_size : texture_size, total_size : mesh_data_size + texture_size };

    }

}

async function parseModelFile(file : File): Promise<ModelDocument>
{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            //read the data into a buffer
            const data : ArrayBuffer = reader.result as ArrayBuffer;
            //parse the buffer into a JSON new_copy and then to a ModelDocument
            const model_document : ModelDocument = io.readJSON(io.binaryToJSON(data));
            resolve(model_document);
        };
      reader.onerror = reject;
    });
}

export interface StatsFrame{
    mesh_size : number;
    texture_size : number;
    total_size : number;
}