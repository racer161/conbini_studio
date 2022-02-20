import { Texture } from "@gltf-transform/core";
import { spawn, Pool, Thread, Transfer } from "threads"
import encoder_worker from './encoder/encoder_worker?worker';

const encoder_pool = Pool(() => spawn(new encoder_worker()), {
    size: 8,
    concurrency: 1
});

//reads the image data from a source texture PNG/JPEG and writes the KTX2 compressed data to the new texture
export async function compress_texture(source:Texture, destination : Texture, settings : TextureCompressionSettings): Promise<void> {

    const image_data = source.getImage();
    if(!image_data) throw new Error(`Texture ${ source.getName() } has no image data`);

    //Queue the image compression task
    const task = await encoder_pool.queue(async encoder => {
        const buffer_data : ArrayBuffer = await encoder(Transfer(image_data), settings.quality);
        destination.setMimeType('image/ktx2');
        destination.setImage(buffer_data);
    });

    
}

export interface TextureCompressionSettings{
    quality: number;
}