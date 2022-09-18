class FilledRectangle{
  constructor(x1, y1, x2, y2){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    this.width = this.x2 - this.x1;
    this.height = this.y2 - this.y1;

    this.color = "black";
    this.nLines = 15;

    this.spacing = (this.height)/(this.nLines-1);
  }

  set nLines(n){
    this._nLines = n;
    this.spacing = (this.height)/(this.nLines-1);
  }

  get nLines(){
    return this._nLines;
  }

  printEdges(){
    print("("+this.x1+","+this.x2+") "+this.color.toString());
  }

  draw(){
    for(let i = 0; i<this.nLines; i++){
      let ycoord = this.y1 + i*this.spacing;
      let pd = 1;
      let lw = 1;
      pen_line(this.x1,ycoord, this.x2, ycoord, pd, lw, this.color);
    }
  }
}

class Spectrograph{
  constructor(x1, y1, x2, y2, nEmission){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.nEmission=nEmission;
    this.blocks = new Array();
    this.edges = new Array(this.nEmission);
    this.hue = 0;
    colorMode(HSB, 100);

    //let 
  }

  makeBlocks(){
    for(let i =0; i<this.nEmission; i++){
      let center = random(this.x1, this.x2);
      let lineWidth = random(10, 30);
      let blockEdges = new Array(2);
      let shift = 65;
      this.hue = (center/(this.x2-this.x1)*100+shift)%100;
      blockEdges[0]= center - lineWidth/2.;
      blockEdges[1] = center + lineWidth/2.;
      if(blockEdges[1] > canvasWidth - border){
        blockEdges[1] = canvasWidth - border;
      }
      if(blockEdges[0] < border){
        blockEdges[0] = border;
      }
      this.edges[i] = blockEdges;
      let Rec = new FilledRectangle(blockEdges[0], this.y1, blockEdges[1], this.y2);
      Rec.color= color(this.hue, 50, 100);
      this.blocks.push(Rec);
    }
    this.blocks.sort(this.sortBlocks);
    this.edges.sort((a,b) => a[0] - b[0]); // b - a for reverse sort
    //sorts according to left edge
    for(let i = 0; i<this.nEmission-1; i++){
      if(this.edges[i][1] < this.edges[i+1][0]){
        let Rec = new FilledRectangle(this.edges[i][1], this.y1, this.edges[i+1][0], this.y2);
        this.blocks.push(Rec);
      }
    }

    this.blocks.sort(this.sortBlocks);

 

    if(this.blocks[0].x1 > this.x1){
      let Rec = new FilledRectangle(this.x1, this.y1, this.blocks[0].x1, this.y2);
      this.blocks.unshift(Rec);
    }
    if(this.blocks[this.blocks.length-1].x2 < this.x2){
      let Rec = new FilledRectangle(this.blocks[this.blocks.length-1].x2, this.y1, this.x2, this.y2);
      this.blocks.push(Rec)
    }

    for(let i=0; i<this.blocks.length-1;i++){
      this.blocks[i].printEdges();
    }

    //maybe sort again?
  }

  sortBlocks(a,b){
    if(a.x1 < b.x1){
      return -1;
    }
    if(a.x1>b.x1){
      return 1;
    }
    return 0;
  }

  draw(){
    for(let i=0; i<this.blocks.length; i++){
      this.blocks[i].draw();
    }
  }
}

/////globals
let border = 100;
let canvasWidth = 500;
let canvasHeight = 750;

let N_lines = 25;
let N_spec = 10;
let spec_height=30;

let maxNEmission = 8;
let stop = true;
function setup() {
  //frameRate(0.5);
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
}

function draw(){
  background('#E9DFAC');
  let specArray = new Array();
  let dy = (canvasHeight-border-spec_height)/N_spec;
  for(let i=0; i<N_spec; i++){
    print("Spec "+i)
    let spec = new Spectrograph(border, border+i*dy, canvasWidth-border, border+i*dy+spec_height, int(random(1, maxNEmission)));
    spec.makeBlocks();
    specArray.push(spec)
  }
  for(let i = 0; i<N_spec-1; i++){
    specArray[i].draw()
  }
}

function mouseClicked(){
	redraw()
}

function pen_line(x1, y1, x2, y2, pd, lw, lcolor){
  let v1 = createVector(x1, y1);
  let v2 = createVector(x2, y2);
  let mag = p5.Vector.mag(p5.Vector.sub(v2, v1))
  let point_pos = []
  let N = int(mag*pd*lw);
  for(let i = 0; i<N; i++){
    point_pos[i]= (i+1)/N; 
  }
  stroke(lcolor);
  let dir = p5.Vector.sub(v2, v1).normalize();
  for(let i = 0; i<N; i++){
    let ad = p5.Vector.mult(dir, point_pos[i]*mag);
    let base = p5.Vector.add(v1, ad);
    for(let j = 0; j<int(random(1,8)); j++){
      let pos = p5.Vector.add(base, p5.Vector.mult(p5.Vector.random2D(), random(0, lw)));
      strokeWeight(int(random(1, 2)));

      point(pos.x, pos.y);
    }
  }
  strokeWeight(1);
  stroke("black")
}

function compare(a,b) {
  if (a.x1 < b)
     return -1;
  if (a.attr > b.attr)
    return 1;
  return 0;
}
