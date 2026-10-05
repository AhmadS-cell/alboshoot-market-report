import {useRef,useState} from 'react';
import {asset} from './catalog.js';
import {galleryFor} from './product-utils.js';
export function ProductGallery({product}) {
 const photos=galleryFor(product),[index,setIndex]=useState(0),zoom=useRef(null),current=photos[index];
 return <div className="product-gallery">
  <button className="product-gallery-main" onClick={()=>zoom.current.showModal()} aria-label={'تكبير صورة '+current.label+' — '+product.name}><img src={asset(current.src)} alt={current.alt} width="800" height="1000" fetchPriority="high"/><span>تكبير الصورة <img className="icon" src={asset('icons/search.svg')} alt=""/></span></button>
  <div className="gallery-controls"><span>{index+1} / {photos.length} · {current.label}</span>{photos.length>1 && <div><button aria-label="الصورة السابقة" onClick={()=>setIndex((index+photos.length-1)%photos.length)}>السابق</button><button aria-label="الصورة التالية" onClick={()=>setIndex((index+1)%photos.length)}>التالي</button></div>}</div>
  {photos.length>1 && <div className="gallery-thumbnails" aria-label="صور القطعة">{photos.map((p,i)=><button key={p.src} onClick={()=>setIndex(i)} aria-pressed={index===i} aria-label={'صورة '+p.label}><img src={asset(p.src)} alt="" width="80" height="100" loading="lazy"/><span>{p.label}</span></button>)}</div>}
  <p className="gallery-caption">صور توضيحية؛ الملابس والإكسسوارات في التنسيق غير مشمولة.</p>
  <dialog ref={zoom} className="product-dialog image-dialog" aria-label="تكبير صورة القطعة" onClick={e=>{if(e.target===zoom.current)zoom.current.close();}}><button className="icon-button dialog-close" aria-label="إغلاق تكبير الصورة" onClick={()=>zoom.current.close()}><img className="icon" src={asset('icons/x.svg')} alt=""/></button><img src={asset(current.src)} alt={current.alt}/><p>{current.label} · {product.name}</p></dialog>
 </div>;
}
export function SizeGuide({guide,dialog}) {
 const [unit,setUnit]=useState('cm');
 return <dialog ref={dialog} className="product-dialog size-dialog" aria-labelledby="size-guide-title" onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}>
  <button className="icon-button dialog-close" aria-label="إغلاق دليل المقاسات" onClick={()=>dialog.current.close()}><img className="icon" src={asset('icons/x.svg')} alt=""/></button>
  <h2 id="size-guide-title">دليل قياس القطعة</h2><p className="preview-note">جدول توضيحي من مخطط مُسدل. القياسات الفعلية تُعتمد مع عينة كل موديل.</p>
  <div className="size-units" aria-label="وحدة القياس"><button aria-pressed={unit==='cm'} onClick={()=>setUnit('cm')}>سم</button><button aria-pressed={unit==='in'} onClick={()=>setUnit('in')}>إنش</button></div>
  <div className="size-table"><table><caption>قياسات القطعة المسطّحة، وليست قياسات الجسم — {unit==='cm'?'سم':'إنش'}</caption><thead><tr>{guide.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{guide.sizes.map(s=><tr key={s.id}><th scope="row">{s.id}</th>{s.values.map((v,i)=><td key={i}>{new Intl.NumberFormat('ar-SA',{maximumFractionDigits:1}).format(unit==='cm'?v:v/2.54)}</td>)}</tr>)}</tbody></table></div>
  <h3>كيف تقيس؟</h3><p>{guide.measure}</p><p>{guide.fit}</p><p className="preview-note">{guide.size_note}</p>
 </dialog>;
}
