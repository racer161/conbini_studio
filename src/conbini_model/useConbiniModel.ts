import React, { useState, useEffect } from 'react';
import { ConbiniModel } from './conbiniModel';

import { Document as ModelDocument, Texture } from '@gltf-transform/core';

export function useModelURL() :  [string | undefined, ConbiniModel | undefined, React.Dispatch<React.SetStateAction<File | undefined>>]
{
    const [conbini_model, set_conbini_model] = useState<ConbiniModel>();
    
    const [file, setFile] = useState<File>();

    const [modelURL, setModelURL] = useState<string>();

    //load the model from the file
    useEffect(() => {
        if(file) ConbiniModel.fromFile(file, setModelURL).then(set_conbini_model);
    }, [file]);

    useEffect(() => {
        if(conbini_model){
            const url = conbini_model.getModelDataURL();
            setModelURL(url);
        }
        
    }, [conbini_model]);

    return [modelURL, conbini_model , setFile];
}