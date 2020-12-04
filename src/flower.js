const $ = (id) => document.getElementById(id);
const Canvas = $('canvas');

const pixelTypeNumber = {
    R: 0,
    G: 1,
    B: 2,
    A: 3
}
/**@type {CanvasRenderingContext2D} */
const Renderer = Canvas.getContext('2d');

function uploadImage(){
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.onchange = function(e){
        const img = new Image();
        img.onerror = function(){
            console.error('Error Detected.')
        }
        img.onload = () => process(img);
        if(input.files){
            img.src = URL.createObjectURL(input.files[0]);
        }
    }
    input.click()
}
function process(img){
    Renderer.drawImage(
        img,
        160, 230,
        200, 170,
        190, 200,
        200, 170
    )
    const imgData = Renderer.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for(let i=0; i<data.length; i += 4){
        const pixel = (pixelType) => data[i + pixelTypeNumber[pixelType]];
        if(!(pixel('R') >= 45 && pixel('R') <= 195 && pixel('G') >= 20 && pixel('G') <= 190 && pixel('B') >= 96)){
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
        }
    }
    console.log(data)
    Renderer.putImageData(imgData, 0, 0)
}



$('upload').addEventListener('click', uploadImage)


