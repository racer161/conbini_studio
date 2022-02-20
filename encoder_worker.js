importScripts('/encoder/basis_encoder.js');

onmessage = async function(e) {
    console.log('Message received from main script');
    const buffer_data = await encode_etc1s(e.data[0], e.data[1]);
    postMessage(buffer_data);
}


async function encode_etc1s(data, qualityLevel)
{
    const BASIS_MODULE = await new Promise((resolve, reject) => {
        BASIS().then(module => {
            resolve(module);
        }).catch(err => {
            reject(err);
        });
    });


    const { BasisFile, BasisEncoder, initializeBasis, encodeBasisTexture } = BASIS_MODULE;
    
    console.log(BASIS_MODULE);
    
    initializeBasis();
    
    // Create a destination buffer to hold the compressed .basis file data. If this buffer isn't large enough compression will fail.
    var basisFileData = new Uint8Array(1024*1024*10);
            
    var num_output_bytes;
    
    // Compress using the BasisEncoder class.
    console.log('BasisEncoder::encode() started:');

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
    
    console.log('Encoding at ETC1S quality level: ' + qualityLevel);
        
    const startTime = performance.now();
    
    num_output_bytes = basisEncoder.encode(basisFileData);
    
    const elapsed = performance.now() - startTime;
    
    console.log('encoding time', elapsed.toFixed(2));
    
    var actualBasisFileData = new Uint8Array(basisFileData.buffer, 0, num_output_bytes);

    basisEncoder.delete();
    
    if (num_output_bytes == 0)
    {
        console.log('encodeBasisTexture() failed!');
        return null;
    }
    
    console.log('encodeBasisTexture() succeeded, output size ' + num_output_bytes);

    //const data_URL = await arrayBufferToBase64(actualBasisFileData);

    const data_buffer = actualBasisFileData.buffer.slice(actualBasisFileData.byteOffset, actualBasisFileData.byteLength + actualBasisFileData.byteOffset); 
    
    return data_buffer;

}

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
}