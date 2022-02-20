import * as React from 'react';
import { Document as ModelDocument, WebIO, ExtensionProperty, Property, Texture } from '@gltf-transform/core';

import { ConbiniViewer } from './conbini_model/ConbiniViewer';

import { ConbiniModel, StatsFrame } from './conbini_model/conbiniModel';
import { useModelURL } from './conbini_model/useConbiniModel';

import { TextureManager } from './editor/TextureManager';
import { useEditorSelection } from './editor/selection/useSelection';
import { EditorSelection } from './editor/selection/EditorSelection';
import TextureEditorPanel from './editor/TextureEditorPanel';
import EditorPanel from './editor/EditorPanel';

export default function Studio()
{
  const [modelURL, conbini_model, setFile] = useModelURL();
  const selection : EditorSelection = useEditorSelection();
  
  const onFilechange : React.ChangeEventHandler<HTMLInputElement> = (e) => setFile(e.target.files![0]);

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  return(
    <div className='flex flex-col w-screen h-screen'>
        <div className='flex'>
            <div className='w-screen h-screen pt-7'>
              { modelURL &&  <ConbiniViewer model={ modelURL} />}
            </div>
        </div>
        <div className='flex flex-row text-sm pl-2 border-b border-gray-100 text-tokyo-foreground bg-gray-200 w-screen fixed top-0 left-0 h-7'>
            <OptionButton name='File' options={[
              { name: 'Open', onClick: () => inputFileRef?.current?.click() },
            ]}/>
            <OptionButton name='Optimize' options={[]}/>
            <OptionButton name='View' options={[]}/>
        </div>
        { conbini_model && <EditorPanel conbini_model={conbini_model} selection={selection} /> }
        <input type="file" className='hidden' onChange={onFilechange} ref={inputFileRef}/>
    </div>
  ); 
}

interface Option
{
  name : string;
  onClick : () => void;
}

function OptionButton(props:{ name : string, options : Option[] }){
  
  const [show, setShow] = React.useState(false);
  
  return(
    <div className='relative' onPointerLeave={() => setShow(false) }>
      <button className=' hover:bg-gray-300 hover:text-white p-1 px-4 ' onClick={() => setShow(true) }  >
        {props.name}
        
      </button>
      { show && 
        <div className='flex flex-col absolute -bottom-full w-48 left-0 bg-gray-200'>
            { props.options.map( (option, i) => <OptionButtonItem key={i} option={option} />)}
        </div>
      }
    </div>
  );
}

function OptionButtonItem(props : { option: Option }){
  return(
    <button className='hover:bg-gray-300 hover:text-white p-1 px-4 text-left' onClick={props.option.onClick}>
      {props.option.name}
    </button>
  );
}

