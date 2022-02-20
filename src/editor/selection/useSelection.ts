import { useEffect, useState } from 'react';
import { EditorSelectionType, EditorSelection } from './EditorSelection';


//A react hook that re renders if document.activeElement changes
export function useEditorSelection(){

    const [selection, setSelection] = useState(getEditorSelectionFromElement(document.activeElement));

    useEffect(() => {
        const handleActiveElementChange = () => {
            const new_EditorSelection = getEditorSelectionFromElement(document.activeElement);
            if(new_EditorSelection !==  EditorSelection.None) setSelection(getEditorSelectionFromElement(document.activeElement));
        };

        document.addEventListener('focusin', handleActiveElementChange);
        document.addEventListener('focusout', handleActiveElementChange);

        return () => {
            document.removeEventListener('focusin', handleActiveElementChange);
            document.removeEventListener('focusout', handleActiveElementChange);
        };
    }, []);

    return selection;
}

function getEditorSelectionFromElement(element: Element | null) : EditorSelection
{
    if(element instanceof HTMLButtonElement){
        if(element.id.startsWith('Texture_')){
            const texture = element.id.substring('Texture_'.length);
            return new EditorSelection(EditorSelectionType.Texture, texture);
        }
    }

    return EditorSelection.None;
}