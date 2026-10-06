import {useEffect, useId, useRef, useState} from 'react';
import {asset} from './catalog.js';

const threads = {
 gold: {base:'#ad8235', light:'#f2d99c', shade:'#74501e', edge:'#62431d'},
 ivory: {base:'#dbd1b5', light:'#fff9e5', shade:'#a59a7e', edge:'#8c8067'},
 slate: {base:'#77777a', light:'#bcbcc0', shade:'#454549', edge:'#353539'},
};

function EmbroideryArtwork({name, thread, light, threadLabel, fontSize, textRef}) {
 const id=useId().replace(/:/g,'');
 const palette=threads[thread]||threads.ivory;
 const textProps={x:450,y:305,textAnchor:'middle',dominantBaseline:'middle',fontSize,fontWeight:600,fontFamily:'"Noto Naskh Arabic", serif',direction:/[\u0600-\u06ff]/u.test(name)?'rtl':'ltr'};
 return <svg className="embroidery-artwork" viewBox="0 0 900 600" role="img" aria-label={`معاينة تطريز ${name} بخيط ${threadLabel} على تبويب داخل الرقبة`}>
  <defs>
   <linearGradient id={`${id}-thread`} x1="0" y1="0" x2="0.35" y2="1">
    <stop offset="0" stopColor={palette.light}/><stop offset=".32" stopColor={palette.base}/><stop offset=".52" stopColor={palette.light}/><stop offset=".8" stopColor={palette.base}/><stop offset="1" stopColor={palette.shade}/>
   </linearGradient>
   <pattern id={`${id}-stitches`} patternUnits="userSpaceOnUse" width="4.4" height="4.4" patternTransform="rotate(32)">
    <path d="M1 0V4.4" stroke={palette.light} strokeWidth="1" opacity=".9"/>
    <path d="M2.8 0V4.4" stroke={palette.shade} strokeWidth=".8" opacity=".8"/>
    <path d="M.45 0V4.4" stroke={palette.base} strokeWidth=".35"/>
   </pattern>
   <filter id={`${id}-raised`} x="-10%" y="-20%" width="120%" height="150%" colorInterpolationFilters="sRGB">
    <feDropShadow dx=".4" dy="1.8" stdDeviation=".65" floodColor="#141014" floodOpacity={light?'.5':'.85'}/>
   </filter>
  </defs>
  <image href={asset(`photos/collection/embroidery-tab-${light?'light':'dark'}.webp`)} width="900" height="600"/>
  <g filter={`url(#${id}-raised)`} aria-hidden="true">
   <text {...textProps} ref={textRef} fontSize={fontSize} fill={`url(#${id}-thread)`} stroke={palette.edge} strokeWidth="1.3" paintOrder="stroke fill">{name}</text>
   <text {...textProps} fill={`url(#${id}-stitches)`}>{name}</text>
  </g>
 </svg>;
}

export function EmbroideryPreview({name,thread,threadLabel,categoryKey}) {
 const dialog=useRef(null), textRef=useRef(null), light=categoryKey==='thobe', [fontSize,setFontSize]=useState(96);
 useEffect(()=>{
  let active=true;
  const fit=()=>{
   const text=textRef.current;
   if(!active||!text)return;
   const width=text.getComputedTextLength();
   if(width>0)setFontSize(Math.min(96,Number(text.getAttribute('font-size'))*650/width));
  };
  fit();
  document.fonts?.ready.then(fit);
  return ()=>{active=false;};
 },[name]);
 const artworkProps={name:name||'اسمك هنا',thread,threadLabel,light,fontSize};
 return <figure className="embroidery-preview">
  <div className="embroidery-preview-heading"><span>معاينة تطريز اسمك</span><span className={'embroidery-thread-tag '+thread}>{threadLabel}</span></div>
  <button type="button" className="embroidery-zoom-trigger" onClick={()=>dialog.current.showModal()} aria-label="تكبير معاينة التطريز">
   <EmbroideryArtwork {...artworkProps} textRef={textRef}/><span className="embroidery-zoom-label">شاهد الغرز عن قرب ↗</span>
  </button>
  <figcaption>تطريز بالخيط على تبويب داخل الرقبة. المعاينة توضيحية؛ شكل الغرز النهائي يُراجع مع العينة.</figcaption>
  <dialog ref={dialog} className="embroidery-zoom-dialog" aria-label="معاينة غرز تطريز الاسم" onClick={e=>{if(e.target===e.currentTarget)dialog.current.close();}}>
   <div className="embroidery-zoom-heading"><h3>غرز تطريز الاسم</h3><button type="button" onClick={()=>dialog.current.close()} aria-label="إغلاق معاينة التطريز">×</button></div>
   <EmbroideryArtwork {...artworkProps}/><p><bdi>{name||'اسمك هنا'}</bdi> · {threadLabel} · داخل الرقبة</p>
  </dialog>
 </figure>;
}
