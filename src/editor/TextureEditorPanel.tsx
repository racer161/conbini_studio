import { Texture } from "@gltf-transform/core";
import { useState } from "react";
import { TextureCompressionSettings } from "../conbini_model/compression";
const MAX_QUALITY = 256;


export default function TextureEditorPanel(props : { texture : Texture, onCompile : (texture : Texture, settings : TextureCompressionSettings) => void }) {
    //TODO: Add a slider for quality
    //TODO: Add the ability to rename
    //TODO: Add the ability to resize the resolution
    //TODO: Add the ability to change the format

    const [quality, setQuality] = useState<number>(128);

    const settings : TextureCompressionSettings = {
        quality: quality,
    }

    
    return(
        <div className="absolute top-0 -left-full p-4 pr-8">
            <div className="w-96 pr-2 ">
                <div className="bg-gray-200 px-2 pb-2 w-full rounded-md flex flex-col">
                    <div className="text-gray-800 font-semibold text-lg">Texture Settings</div>
                    <div className="text-gray-700 font-semibold border-b border-white">{props.texture.getName()} </div>
                    
                    <div className="w-full flex flex-col">
                        <div className="">quality : <span className="font-semibold">{((quality/MAX_QUALITY) * 100).toFixed(0) + "%"}</span></div>
                        <input type={'range'} min={1} max={MAX_QUALITY} step={1} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} />
                    </div>

                    <button className="bg-blue-500 rounded-md text-white p-2 w-full " onClick={() => props.onCompile(props.texture,settings)}>Compile</button>
                </div>
            </div>
            
        </div>
        
    );
}