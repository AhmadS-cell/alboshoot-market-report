import {useEffect,useRef,useState} from 'react';
import {asset} from './catalog.js';
import {satinStitches,paintStitches} from './embroidery-stitches.js';

function useNameStitches(name,thread,enabled) {
 const [artwork,setArtwork]=useState(null),[pending,setPending]=useState(true);
 useEffect(()=>{
  let active=true,worker=null;
  setArtwork(null);setPending(true);
  if(!enabled)return;
  const timer=setTimeout(async()=>{
   await document.fonts.ready;
   if(!active)return;
   const width=1536,height=280,mask=document.createElement('canvas');mask.width=width;mask.height=height;
   const ctx=mask.getContext('2d',{willReadFrequently:true});ctx.direction=/[\u0600-\u06ff]/u.test(name)?'rtl':'ltr';ctx.textAlign='center';
   ctx.font='600 158px "Noto Naskh Arabic"';
   const fontSize=Math.min(158,158*1080/Math.max(1,ctx.measureText(name).width));ctx.font=`600 ${fontSize}px "Noto Naskh Arabic"`;
   const metrics=ctx.measureText(name);ctx.fillStyle='#fff';ctx.fillText(name,width/2,(height+metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2);
   const pixels=ctx.getImageData(0,0,width,height).data,alpha=new Uint8Array(width*height);
   for(let i=0;i<alpha.length;i++)alpha[i]=pixels[i*4+3];
   const finish=(surface,count,elapsed)=>{
    if(!active)return;
    const overlay=document.createElement('canvas');overlay.width=1536;overlay.height=1024;
    overlay.getContext('2d').drawImage(surface,0,340);surface.close?.();
    overlay.toBlob(blob=>{
     if(!active||!blob)return;
     setArtwork({url:URL.createObjectURL(blob),count,elapsed});setPending(false);
    },'image/png');
   };
   const fallback=()=>{
    if(!active)return;
    const started=performance.now(),stitches=satinStitches(alpha,width,height),surface=document.createElement('canvas');surface.width=width;surface.height=height;
    paintStitches(surface.getContext('2d'),stitches,thread);finish(surface,stitches.length,performance.now()-started);
   };
   if(typeof Worker==='undefined'||typeof OffscreenCanvas==='undefined'){fallback();return;}
   worker=new Worker(new URL('./embroidery-worker.js',import.meta.url),{type:'module'});
   worker.onmessage=({data})=>{
    if(data.error){worker?.terminate();fallback();return;}
    if(!active){data.bitmap?.close();return;}
    finish(data.bitmap,data.count,data.elapsed);worker?.terminate();
   };
   worker.onerror=()=>{worker?.terminate();fallback();};
   worker.postMessage({alpha,width,height,thread});
  },130);
  return ()=>{active=false;clearTimeout(timer);worker?.terminate();};
 },[name,thread,enabled]);
 useEffect(()=>()=>{if(artwork?.url)URL.revokeObjectURL(artwork.url);},[artwork]);
 return {artwork,pending};
}

function EmbroideryArtwork({name,thread,threadLabel,light,view,artwork,pending}) {
 const surface=light?'light':'dark';
 if(view==='stitches')return <img className="embroidery-artwork embroidery-example" src={asset(`photos/collection/stitch-example-${surface}-${thread}.webp`)} width="1200" height="800" alt={`مثال توضيحي لشكل غرز تطريز أحمد العتيبي بخيط ${threadLabel}؛ الاسم في الصورة مثال ثابت`} loading="lazy"/>;
 return <div className="embroidery-artwork embroidery-composite" role="img" aria-label={`معاينة توزيع اسم ${name} بخيط ${threadLabel} على تبويب داخل الرقبة`} aria-busy={pending} data-stitch-count={artwork?.count} data-render-ms={artwork?.elapsed?.toFixed(1)}>
  <img className="embroidery-cloth" src={asset(`photos/collection/embroidery-tab-${surface}.webp`)} width="1200" height="800" alt="" aria-hidden="true"/>
  {artwork&&<img className="embroidery-name-threads" src={artwork.url} width="1536" height="1024" alt="" aria-hidden="true"/>}
  {pending&&<span className="embroidery-render-pending" role="status">تجهيز معاينة الاسم…</span>}
 </div>;
}

export function EmbroideryPreview({name,thread,threadLabel,categoryKey}) {
 const dialog=useRef(null),light=categoryKey==='thobe',[view,setView]=useState('stitches');
 const displayName=name||'اسمك هنا',{artwork,pending}=useNameStitches(displayName,thread,view==='name');
 const artworkProps={name:displayName,thread,threadLabel,light,view,artwork,pending};
 const views=<div className="embroidery-view-options" aria-label="عرض التطريز">
  <button type="button" aria-pressed={view==='stitches'} onClick={()=>setView('stitches')}>شكل الغرز</button>
  <button type="button" aria-pressed={view==='name'} onClick={()=>setView('name')}>معاينة اسمك</button>
 </div>;
 const caption=view==='stitches'?'صورة مولّدة لتوضيح الغرز باسم «أحمد العتيبي». اسم طلبك هو المكتوب أدناه.':'معاينة لتوزيع اسمك واتجاه الغرز. التنفيذ النهائي يُراجع مع العينة.';
 return <figure className="embroidery-preview">
  <div className="embroidery-preview-heading"><span>تطريز الاسم بالخيط</span><span className={'embroidery-thread-tag '+thread}>{threadLabel}</span></div>
  {views}
  <button type="button" className="embroidery-zoom-trigger" onClick={()=>dialog.current.showModal()} aria-label="تكبير معاينة التطريز">
   <EmbroideryArtwork {...artworkProps}/><span className="embroidery-zoom-label">شاهد الغرز عن قرب ↗</span>
  </button>
  <figcaption>{caption}<span className="embroidery-requested-name">الاسم للتطريز: <bdi>{name||'اكتب اسمك أعلاه'}</bdi> · {threadLabel}</span></figcaption>
  <dialog ref={dialog} className="embroidery-zoom-dialog" aria-label="معاينة غرز تطريز الاسم" onClick={e=>{if(e.target===e.currentTarget)dialog.current.close();}}>
   <div className="embroidery-zoom-heading"><h3>تطريز الاسم بالخيط</h3><button type="button" onClick={()=>dialog.current.close()} aria-label="إغلاق معاينة التطريز">×</button></div>
   {views}<EmbroideryArtwork {...artworkProps}/><p>{caption}</p><p>الاسم للتطريز: <bdi>{name||'اكتب اسمك أعلاه'}</bdi> · {threadLabel} · داخل الرقبة</p>
  </dialog>
 </figure>;
}
