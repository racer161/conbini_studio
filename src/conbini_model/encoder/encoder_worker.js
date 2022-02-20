/*
onmessage = async function(e) {
    console.log('Message received from main script');
    const buffer_data = await encode_etc1s(e.data[0], e.data[1]);
    postMessage(buffer_data);
}*/
import { expose } from "threads/worker"
import { BASIS } from "./basis_encoder.js"

async function encode_etc1s(image_data, qualityLevel)
{
    const img_url = URL.createObjectURL(new Blob( [ image_data ], { type: "image/jpeg" } ));

    const data = await convertToPNG(img_url);

    const BASIS_MODULE = await new Promise((resolve, reject) => {
        BASIS().then(module => {
            //console.log('BASIS module loaded');
            resolve(module);
        }).catch(err => {
            reject(err);
        });
    });


    const { BasisFile, BasisEncoder, initializeBasis, encodeBasisTexture } = BASIS_MODULE;
    
    initializeBasis();
    
    // Create a destination buffer to hold the compressed .basis file data. If this buffer isn't large enough compression will fail.
    var basisFileData = new Uint8Array(1024*1024*10);
            
    var num_output_bytes;
    
    // Compress using the BasisEncoder class.
    //console.log('BasisEncoder::encode() started:');

    const basisEncoder = new BasisEncoder();

    basisEncoder.setCreateKTX2File(true);
    basisEncoder.setKTX2UASTCSupercompression(true);
    basisEncoder.setKTX2SRGBTransferFunc(true);

    basisEncoder.setSliceSourceImage(0, data, 0, 0, true);
    basisEncoder.setDebug(false);
    basisEncoder.setComputeStats(false);
    //sRGB
    const sRGB = true;
    basisEncoder.setPerceptual(sRGB);
    basisEncoder.setMipSRGB(sRGB);
    basisEncoder.setQualityLevel(qualityLevel);
    basisEncoder.setCompressionLevel(3);
    basisEncoder.setUASTC(false);
    basisEncoder.setMipGen(true);
    
    //console.log('Encoding at ETC1S quality level: ' + qualityLevel);
        
    const startTime = performance.now();
    
    num_output_bytes = basisEncoder.encode(basisFileData);
    
    const elapsed = performance.now() - startTime;
    
    //console.log('encoding time', elapsed.toFixed(2));
    
    var actualBasisFileData = new Uint8Array(basisFileData.buffer, 0, num_output_bytes);

    basisEncoder.delete();
    
    if (num_output_bytes == 0)
    {
        //console.log('encodeBasisTexture() failed!');
        return null;
    }
    
    //console.log('encodeBasisTexture() succeeded, output size ' + num_output_bytes);

    //const data_URL = await arrayBufferToBase64(actualBasisFileData);

    const data_buffer = actualBasisFileData.buffer.slice(actualBasisFileData.byteOffset, actualBasisFileData.byteLength + actualBasisFileData.byteOffset); 
    
    return data_buffer;

}

expose(encode_etc1s);

async function convertToPNG(img_url) {

    const imgblob = await fetch(img_url).then(response => response.blob());

    const img = await createImageBitmap(imgblob);
  
    //render the image to canvas
    const offScreenCanvas = new OffscreenCanvas(img.width, img.height);
  
    //console.log(`width: ${img.width} height: ${img.height}`);
  
    //draw it on the canvas
    var context = offScreenCanvas.getContext("2d");
    context?.drawImage(img, 0, 0);

    const blob = await offScreenCanvas.convertToBlob();

    img.close();
  
    //return the render of the canvas as a PNG
    return new Uint8Array(await blob.arrayBuffer());  
}
  
function base64ToUint8Array(string_base64) {
    var binary_string = window.atob(string_base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        var ascii = binary_string.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}


/*
function arrayBufferToBase64( buffer, callback ) {

    return new Promise((resolve, reject) => {
        var blob = new Blob([buffer],{type:'image/ktx2'});
        var reader = new FileReader();
        reader.onload = function(evt){
            var dataurl = evt.target.result;
            resolve(dataurl.substr(dataurl.indexOf(',')+1));
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}*/