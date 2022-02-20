import { Document as ModelDocument, Texture } from '@gltf-transform/core';

import { HiChevronDoubleLeft, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { FaChevronCircleRight, FaChevronCircleLeft, FaChevronCircleDown } from 'react-icons/fa';
import { useState } from 'react';
import { ConbiniModel } from '../conbini_model/conbiniModel';


export function TextureManager(props: { conbini_model : ConbiniModel})
{
    const [show, setShow] = useState(true);

    return(
        <div >
            <button className='flex w-full border-b border-white items-center pl-2 cursor-default' onClick={() => setShow(!show)}>
                {show ? <FaChevronCircleDown className='w-6'/> : <FaChevronCircleRight className='w-6'/>}
                <div className='font-semibold  bg-gray-200 text-gray-700 pl-2 select-none'>Textures</div>
            </button>
            <div className='flex flex-col'>
                { show &&  props.conbini_model.getTextures().map( (texture, i) => <TextureListItem key={i} texture={texture} />)}
            </div>
        </div>
    )

}

function TextureListItem(props : { texture : Texture } ){
    //TODO: On double click swap to edit mode
    //TODO: On Press Enter in edit mode save changes

    return(
        <div>
            <div className='flex'>
                <button className='focus:bg-blue-400 pl-4 focus:text-white w-full m-0 h-6 truncate flex items-center' id={"Texture_" + props.texture.getName() }>{ props.texture.getName() }</button>
            </div>
        </div>
    );
}


//edit mode
//<input className='m-0 p-0.5 pl-4 w-full block text-gray-700 bg-transparent border-none ' type="text" defaultValue={props.texture.getName()} onChange={(e) => props.texture.setName(e.target.value) } />