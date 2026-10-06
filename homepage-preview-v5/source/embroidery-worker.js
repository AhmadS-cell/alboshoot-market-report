import {satinStitches,paintStitches} from './embroidery-stitches.js';
self.onmessage=({data})=>{
 try{
  const {alpha,width,height,thread}=data;
  const started=performance.now(), stitches=satinStitches(alpha,width,height);
  const surface=new OffscreenCanvas(width,height),ctx=surface.getContext('2d');
  paintStitches(ctx,stitches,thread);
  const bitmap=surface.transferToImageBitmap();
  self.postMessage({bitmap,count:stitches.length,elapsed:performance.now()-started},[bitmap]);
 }catch(error){self.postMessage({error:error.message});}
};
