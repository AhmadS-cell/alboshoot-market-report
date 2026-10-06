// Convert a shaped text mask into individual turning satin stitches.
// This is a visual preview, not a digitized production embroidery file.
export function satinStitches(alpha, width, height) {
 const mask=Uint8Array.from(alpha,v=>v>100?1:0), skeleton=mask.slice(), remove=[];
 let changed=true,passes=0;
 while(changed&&passes++<40){
  changed=false;
  for(let step=0;step<2;step++){
   remove.length=0;
   for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
    const i=y*width+x;if(!skeleton[i])continue;
    const p=[skeleton[i-width],skeleton[i-width+1],skeleton[i+1],skeleton[i+width+1],skeleton[i+width],skeleton[i+width-1],skeleton[i-1],skeleton[i-width-1]];
    const count=p.reduce((a,b)=>a+b,0);if(count<2||count>6)continue;
    let transitions=0;for(let k=0;k<8;k++)if(!p[k]&&p[(k+1)%8])transitions++;
    if(transitions!==1)continue;
    if(step===0?(p[0]*p[2]*p[4]||p[2]*p[4]*p[6]):(p[0]*p[2]*p[6]||p[0]*p[4]*p[6]))continue;
    remove.push(i);
   }
   for(const i of remove)skeleton[i]=0;
   if(remove.length)changed=true;
  }
 }
 const inside=(x,y)=>x>=0&&x<width&&y>=0&&y<height&&mask[Math.round(y)*width+Math.round(x)]===1;
 const selected=[], occupancy=new Map(),visited=new Uint8Array(mask.length),small=new Uint8Array(mask.length);
 // Detached dots and accents need filled stitch rows; thinning them to a single
 // centre point would erase Arabic dots and change the spelling visually.
 for(let seed=0;seed<mask.length;seed++){
  if(!mask[seed]||visited[seed])continue;
  const component=[seed];visited[seed]=1;
  let minX=width,maxX=0,minY=height,maxY=0;
  for(let k=0;k<component.length;k++){
   const i=component[k],x=i%width,y=Math.floor(i/width);
   minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   for(const delta of [-width-1,-width,-width+1,-1,1,width-1,width,width+1]){
    const j=i+delta;if(j>=0&&j<mask.length&&mask[j]&&!visited[j]){visited[j]=1;component.push(j);}
   }
  }
  if(maxX-minX>28||maxY-minY>28||component.length>550)continue;
  for(const i of component)small[i]=1;
  for(let y=minY;y<=maxY;y++){
   let a=-1;
   for(let x=minX;x<=maxX+1;x++){
    if(x<=maxX&&small[y*width+x]){if(a<0)a=x;}
    else if(a>=0){selected.push([a-.2,y,x-1+.2,y,(a+x-1)/2,y,Math.PI/2]);a=-1;}
   }
  }
 }
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
  if(!skeleton[y*width+x]||small[y*width+x])continue;
  const cellX=Math.floor(x/3),cellY=Math.floor(y/3);let near=false;
  for(let gy=cellY-1;gy<=cellY+1;gy++)for(let gx=cellX-1;gx<=cellX+1;gx++){
   for(const p of occupancy.get(gx+','+gy)||[])if((p[0]-x)**2+(p[1]-y)**2<2.05)near=true;
  }
  if(near)continue;
  const key=cellX+','+cellY;if(!occupancy.has(key))occupancy.set(key,[]);occupancy.get(key).push([x,y]);
  let xx=0,yy=0,xy=0,n=0;
  for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){
   if(dx*dx+dy*dy>36||(!dx&&!dy))continue;
   if(skeleton[(y+dy)*width+x+dx]){xx+=dx*dx;yy+=dy*dy;xy+=dx*dy;n++;}
  }
  const angle=n?Math.atan2(2*xy,xx-yy)/2:Math.PI/2;
  const nx=-Math.sin(angle),ny=Math.cos(angle);
  const end=sign=>{
   let d=.4;while(d<70&&inside(x+nx*d*sign,y+ny*d*sign))d+=.4;
   d=Math.max(.4,d-.35);return [x+nx*d*sign,y+ny*d*sign];
  };
  const a=end(-1),b=end(1);
  selected.push([a[0],a[1],b[0],b[1],x,y,angle]);
 }
 return selected;
}

export const stitchPalettes={
 gold:{base:'#b98d39',light:'#eed29a',shade:'#795521',edge:'#4f381b'},
 ivory:{base:'#ded3b7',light:'#fff9e9',shade:'#a0967b',edge:'#625b4e'},
 slate:{base:'#727277',light:'#c0c0c5',shade:'#4b4b50',edge:'#303035'},
};

export function paintStitches(ctx, stitches, thread) {
 const palette=stitchPalettes[thread]||stitchPalettes.ivory;
 const noise=i=>{const a=Math.sin(i*127.1+311.7)*43758.5453;return a-Math.floor(a);};
 ctx.lineCap='round';ctx.lineJoin='round';
 const path=(s,i,offset=0)=>{
  const [ax,ay,bx,by,x,y,angle]=s,tx=Math.cos(angle),ty=Math.sin(angle);
  const bow=(noise(i)-.5)*.9;
  ctx.beginPath();ctx.moveTo(ax+tx*offset,ay+ty*offset);
  ctx.quadraticCurveTo(x+tx*bow+tx*offset,y+ty*bow+ty*offset,bx+tx*offset,by+ty*offset);
 };
 // Entry points and a soft contact shadow sink the stitch ends into the cloth.
 ctx.fillStyle='#100d1040';
 for(const [ax,ay,bx,by] of stitches){for(const [x,y] of [[ax,ay],[bx,by]]){ctx.beginPath();ctx.ellipse(x,y+1,1.65,1.15,0,0,Math.PI*2);ctx.fill();}}
 ctx.shadowColor='#100c1099';ctx.shadowBlur=1.05;ctx.shadowOffsetY=1.55;
 ctx.strokeStyle=palette.edge;ctx.lineWidth=2.3;
 stitches.forEach((s,i)=>{path(s,i);ctx.stroke();});
 ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 stitches.forEach((s,i)=>{
  const [ax,ay,bx,by]=s;
  const gradient=ctx.createLinearGradient(ax,ay,bx,by);
  gradient.addColorStop(0,palette.shade);gradient.addColorStop(.18,palette.base);gradient.addColorStop(.5,palette.light);gradient.addColorStop(.8,palette.base);gradient.addColorStop(1,palette.shade);
  ctx.strokeStyle=gradient;ctx.lineWidth=1.65+noise(i+4)*.2;path(s,i);ctx.stroke();
  ctx.globalAlpha=.38+noise(i+7)*.3;ctx.strokeStyle=palette.light;ctx.lineWidth=.45;path(s,i,-.35);ctx.stroke();ctx.globalAlpha=1;
  // A few fine filaments avoid perfectly cut vector edges.
  if(i%20===0){ctx.globalAlpha=.12;ctx.lineWidth=.25;path(s,i,.35);ctx.stroke();ctx.globalAlpha=1;}
 });
}
