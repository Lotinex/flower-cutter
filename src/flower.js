const $ = (id) => document.getElementById(id);
const Canvas = $('canvas');
class Point {
    constructor(xyObj){
        Object.assign(this, xyObj)
    }
}
/**@type {Point[]} */
const points = [];
const pixelTypeNumber = {
    R: 0,
    G: 1,
    B: 2,
    A: 3
}
/**@type {CanvasRenderingContext2D} */
const Renderer = Canvas.getContext('2d');
let image;
function uploadImage(){
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.onchange = function(e){
        const img = new Image();
        img.onerror = function(){
            console.error('Error Detected.')
        }
        img.onload = () => {
            image = img;
            Renderer.drawImage(img, 0, 0)
            $('process').addEventListener('click', process)
        }
        if(input.files){
            img.src = URL.createObjectURL(input.files[0]);
        }
    }
    input.click()
}
function drawAll(){
    Renderer.clearRect(0, 0, Canvas.width, Canvas.height)
    Renderer.drawImage(image, 0, 0)
    if(points.length == 0) return;
    U.saveCtxState(Renderer, () => {
        U.createCanvasPath(Renderer, () => {
            Renderer.moveTo(points[0].x, points[0].y)
            for(let i=0; i<points.length; i++){
                let targetPoint = points[i + 1];
        
                if(i == points.length - 1){
                    targetPoint = new Point({x: points[0].x, y: points[0].y});
                }
                Renderer.strokeStyle = 'red';
                Renderer.lineTo(targetPoint.x, targetPoint.y)
                Renderer.stroke()
            }
        })
    })
    for(let i=0; i<points.length; i++){
        U.saveCtxState(Renderer, () => {
            U.createCanvasPath(Renderer, () => {
                Renderer.fillStyle = 'red';
                Renderer.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2)
                Renderer.fill()
            })
        })
    }
}
function process(img){
    Renderer.moveTo(points[0].x, points[0].y)
    Renderer.save()
    Renderer.globalCompositeOperation = 'destination-in';
    for(let i=0; i<points.length; i++){
        let targetPoint = points[i + 1];

        if(i == points.length - 1){
            targetPoint = new Point({x: points[0].x, y: points[0].y});
        }
        Renderer.lineTo(targetPoint.x, targetPoint.y)
    }
    Renderer.fill()
    Renderer.restore()
    /*
    Renderer.clearRect(0, 0, Canvas.width, Canvas.height)
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
        if(!(pixel('R') >= 45 && pixel('R') <= 195 && pixel('G') >= 30 && pixel('G') <= 190 && pixel('B') >= 100)){
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
        }
    }
    Renderer.putImageData(imgData, 0, 0)*/
}
function getCursorPosition(e){
    const rect = Canvas.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    return {x, y};
}
function onCanvasClick(e){
    const rect = Canvas.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    points.push(new Point({x, y}))
    drawAll()
}

$('upload').addEventListener('click', uploadImage)
$('canvas').addEventListener('click', onCanvasClick)
