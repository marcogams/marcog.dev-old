let maxl = 100;
let minl = 50;
let rectlist = [];

class Rectangle {
    constructor(i, h, l, x ,y){
        this.i = i;
        this.h = h;
        this.l = l;
        this.x = x;
        this.y = y;
    }
}

class Transition {
    constructor(y, x){
        this.y = y;
        this.x = x;
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function generaterect(n, minl, maxl, rectlist){
    for (let i = 0; i < n+1; i++){
        let h = randomInteger(minl, maxl);
        let l = randomInteger(minl, maxl);
        rectlist.push(new Rectangle(i, h, l, 0, 0));
    }
}

function sortrectlist(rectlist){
    rectlist.sort((a, b) => b.l - a.l).sort((a, b) => b.h - a.h);
}

function calclmax(rectlist, n, lfactor){
    let area = 0;
    for (let i = 0; i < n; i++){
        area += rectlist[i].h*rectlist[i].l;
    }
    let l = lfactor*Math.sqrt(area);
    return l | 0;
}

function construct(rectlist, lmax, n){
    let i = 0;
    let current_x = 0;
    let current_y = 0;
    let current_y_plusheight = 0;
    let leftright = true;

    var thisrowtranpoints = [];
    var nextrowtranpoints = [];

    while (i < n){
        if (leftright == true){
            if (current_x + rectlist[i].l <= lmax){
                let selectedtranpoints = [];
                
                if (thisrowtranpoints.length != 0){ //copyif function
                    for (let j = 0; j < thisrowtranpoints.length; j++){
                        if (thisrowtranpoints[j].x < current_x + rectlist[i].l){                          
                            if (current_x <= thisrowtranpoints[j].x){
                                selectedtranpoints.push(thisrowtranpoints[j]);
                            }
                        }
                    }
                }

                if (selectedtranpoints.length != 0){
                    let selectedtranpointsmax_y = 0;
                    for (let j = 0; j < selectedtranpoints.length; j++){
                        if (selectedtranpoints[j].y > selectedtranpointsmax_y){
                            selectedtranpointsmax_y = selectedtranpoints[j].y;
                        }
                    }

                    if (selectedtranpointsmax_y > current_y){
                        nextrowtranpoints.push(new Transition(current_y + rectlist[i].h, current_x));
                        current_y = selectedtranpointsmax_y;
                    }
                    selectedtranpoints = [];
                    selectedtranpointsmax_y = 0;
                }

                if(rectlist[i].h != rectlist[i+1].h && current_x != lmax){
                    nextrowtranpoints.push(new Transition(current_y + rectlist[i].h, current_x + rectlist[i].l));
                }

                rectlist[i].x = current_x;
                rectlist[i].y = current_y;

                current_x = current_x + rectlist[i].l;
                current_y_plusheight = current_y + rectlist[i].h;
                
                i += 1;
            }
            if (current_x + rectlist[i].l > lmax){
                current_x = lmax;
                current_y = current_y_plusheight;
                thisrowtranpoints = nextrowtranpoints;
                nextrowtranpoints = [];

                leftright = !leftright;
            }
        }
        if (leftright == false){
            if (current_x - rectlist[i].l >= 0){
                let selectedtranpoints = [];
                
                if (thisrowtranpoints.length != 0){ //copyif function
                    for (let k = 0; k < thisrowtranpoints.length; k++){
                        if (thisrowtranpoints[k].x > current_x - rectlist[i].l){                          
                            if (current_x >= thisrowtranpoints[k].x){
                                selectedtranpoints.push(thisrowtranpoints[k]);
                            }
                        }
                    }
                }
                if (selectedtranpoints.length != 0){
                    let selectedtranpointsmax_y = 0;
                    for (let j = 0; j < selectedtranpoints.length; j++){
                        if (selectedtranpoints[j].y > selectedtranpointsmax_y){
                            selectedtranpointsmax_y = selectedtranpoints[j].y;
                        }
                    }
                    
                    if (selectedtranpointsmax_y > current_y){
                        nextrowtranpoints.push(new Transition(current_y + rectlist[i].h, current_x));
                        current_y = selectedtranpointsmax_y;
                    }
                    selectedtranpoints = [];
                    selectedtranpointsmax_y = 0;
                }
                if(rectlist[i].h != rectlist[i+1].h && current_x != 0){
                    nextrowtranpoints.push(new Transition(current_y + rectlist[i].h, current_x - rectlist[i].l));
                }

                rectlist[i].y = current_y;

                current_x = current_x - rectlist[i].l;
                current_y_plusheight = current_y + rectlist[i].h;

                rectlist[i].x = current_x;
                
                i += 1;
            }
            if (current_x - rectlist[i].l < 0){
                current_x = 0;
                current_y = current_y_plusheight;
                thisrowtranpoints = nextrowtranpoints;
                nextrowtranpoints = [];

                leftright = !leftright;
                
            }
        }
    }
}

function drawRect(x, y, h, l, color) {
    return new Konva.Rect({
        x: x,
        y: y,
        width: l,
        height: h,
        stroke: color,
    });
}

function draw(n, rectlist){
    var color;
    for (let i = 0; i < n; i++){
        if (i%2 == 0){
            color = 'black';
        }
        else {
            color = 'black';
        }
        layer.add(drawRect(rectlist[i].x, rectlist[i].y, rectlist[i].h, rectlist[i].l, color));
    }
}

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'drawbox',
    width: width,
    height: height,
    draggable: true,
  });

var layer = new Konva.Layer();

function main(){
    stage.destroyChildren();
    stage.add(layer);
    const n = parseInt(document.getElementById('nbox').value);
    const lfactor = parseFloat(document.getElementById('lbox').value);
    if (lfactor < 0.5){
        alert('lfactor has to be >= 0.5');
        throw new Error('lfactor has to be >= 0.5');
    }
    if (n < 10){
        alert('n has to be >= 10');
        throw new Error('n has to be >= 10');
    }
    generaterect(n, minl, maxl, rectlist);
    sortrectlist(rectlist);
    construct(rectlist, calclmax(rectlist, n, lfactor), n);
    draw(n, rectlist);
    rectlist = [];
}

let scale1 = 1;
let zoomStep = 0.1;

function zoomin(){
    zoomStage1(zoomStep);
}
function zoomout(){
    zoomStage1(-zoomStep);
}

function zoomStage1(inc) {
  scale1 = scale1 + inc;
  stage.setAttrs({ scaleX: scale1, scaleY: scale1 });
}