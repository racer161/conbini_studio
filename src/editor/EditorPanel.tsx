import { Texture } from "@gltf-transform/core";
import { TextureCompressionSettings } from "../conbini_model/compression";
import { ConbiniModel, StatsFrame } from "../conbini_model/conbiniModel";
import { EditorSelection } from "./selection/EditorSelection";
import TextureEditorPanel from "./TextureEditorPanel";
import { TextureManager } from "./TextureManager";

export default function EditorPanel(props :{ conbini_model : ConbiniModel, selection : EditorSelection }) {

    const selected_texture = props.conbini_model.getTextureFromSelection(props.selection)

    const stats = props.conbini_model.getStats();

    const onCompile = (texture : Texture, settings : TextureCompressionSettings) => {
        props.conbini_model.compressTexture(texture, settings);
    }
    
    return (
    <div className='fixed right-0 top-7 p-4 pb-10 h-screen w-96 '>
          { selected_texture && <TextureEditorPanel texture={selected_texture} onCompile={onCompile}/>}
          <div className='bg-gray-200 text-tokyo-foreground overflow-y-scroll scrollbar-hide rounded-md flex flex-col h-full relative'>
            <TitlePanel conbini_model={ props.conbini_model } />
            <TextureManager conbini_model={props.conbini_model} />
            <div className='absolute bottom-4 left-0 '>
              {props.selection != EditorSelection.None && <Preview image_url={ props.conbini_model.getImageURLFromSelection(props.selection) }/>}
              <StatsMeter stats={stats} />
            </div>
          </div>
        </div>
    );
}

function TitlePanel(props: { conbini_model : ConbiniModel }){
    const stats = props.conbini_model.getStats();
    const total_size_string = (stats.total_size/1000000).toFixed(2).toString() + "MB";
  
    return(
      <div className='flex items-center'>
        <button className='text-lg text-gray-800 pl-2 font-semibold truncate text-left'>{ props.conbini_model && props.conbini_model.getName() }</button>
        <div className='w-16 text-gray-600 pl-4 '>{ total_size_string }</div>
      </div>
    );
  }
  
  function StatsMeter(props : { stats : StatsFrame}){
    const texture_size_string = (props.stats.texture_size/1000000).toFixed(2).toString() + "MB";
    const mesh_size_string = (props.stats.mesh_size/1000000).toFixed(2).toString() + "MB";
  
    const texture_percent = props.stats.texture_size / props.stats.total_size * 100;
    const texture_percent_str = texture_percent.toFixed(2);
  
    const mesh_percent = (props.stats.mesh_size / props.stats.total_size) * 100;
    const mesh_percent_str = mesh_percent.toFixed(2);
  
    return(
      <div className='mt-1 px-2'>
        <div className="w-full flex bg-white h-2">
          <div className="bg-blue-500 h-full " style={{width: texture_percent_str + "%"}}></div>
          <div className="bg-yellow-500 h-full " style={{width: mesh_percent_str + "%"}}></div>
        </div>
        <div className=''>
          <div className='flex items-center'>
            <div className='bg-blue-500 w-2 h-2 mr-2 font-light text-gray-500'/> 
            <div className='pr-2'>Textures</div>
            <div className='text-sm text-gray-400'>({ texture_size_string })</div>
          </div>
          <div className='flex items-center'>
            <div className='bg-yellow-500 w-2 h-2 mr-2 font-light text-gray-500'/> 
            <div className='pr-2'>Meshes, Animations, etc.</div>
            <div className='text-sm text-gray-400'>({ mesh_size_string })</div>
          </div>
        </div>
      </div>
    );
  }
  
  function Preview(props : { image_url : string | undefined })
  {
    return(
      <div className='relative'>
        <div className='font-semibold text-white text-lg px-2 absolute bottom-0 left-0 filter backdrop-blur-lg drop-shadow-md'>Preview</div>
        <div className='w-full border-t border-gray-100'>
          <img src={props.image_url} />
        </div>
        
      </div>
    );
  }