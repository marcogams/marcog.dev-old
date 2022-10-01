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
    return lfactor*Math.sqrt(area) | 0;
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

function draw(n, rectlist, scale){
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    for (let i = 0; i < n; i++){
        ctx.strokeRect(rectlist[i].x, rectlist[i].y, rectlist[i].h, rectlist[i].l);
    }
}

function clearcanvas(){
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function printCAD(n, rectlist){
    for (let i = 0; i < n; i++){
        console.log('_pline ' + rectlist[i].x + ',' + rectlist[i].y + ' ' + (rectlist[i].x + rectlist[i].l) + ',' + rectlist[i].y + ' ' + (rectlist[i].x + rectlist[i].l) + ',' + (rectlist[i].y + rectlist[i].h) + ' ' + rectlist[i].x + ',' + (rectlist[i].y + rectlist[i].h) + ' _c');
    }
}

function main(){
    clearcanvas();
    const n = parseInt(document.getElementById('nbox').value);
    const lfactor = parseInt(document.getElementById('lbox').value);

    generaterect(n, minl, maxl, rectlist);
    sortrectlist(rectlist);
    construct(rectlist, calclmax(rectlist, n, lfactor), n);
    console.log(rectlist);
    //printCAD(n, rectlist);
    draw(n, rectlist);
    rectlist = [];
}