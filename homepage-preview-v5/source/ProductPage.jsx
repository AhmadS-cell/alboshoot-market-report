import {useEffect,useRef,useState} from 'react';
import {asset,homeUrl,collectionUrl,productUrl,collectionProducts,seasons} from './catalog.js';
import {ProductImage,ProductName} from './Collection.jsx';
import {productGuides} from './product-data.js';
import {ProductGallery,SizeGuide} from './ProductGallery.jsx';
import {ProductSpecifications} from './ProductSpecifications.jsx';
import {productOptions} from './product-options-data.js';
import {ProductCustomization,CustomizationSummary,defaultCustomization,customizationErrors,normalizedName} from './ProductCustomization.jsx';
const descriptions={bisht:'حضور من تراثنا، بانسدال هادئ وتفاصيل زري تليق بلحظاتك.',abaya:'انسياب هادئ وحضور يشبهك، ليومك ولحظاتك.',thobe:'قطعة تشبه يومك، بلون أبيض وروح من تراثنا.',farwa:'لون فحمي هادئ، وحضور من إرثنا لأيامك الباردة.'};
const shortDescriptions={bisht:'لمناسبة لها مكانة، أو هدية تعبّر عنك. اختر مقاسك وأضف اسمًا يجعل القطعة أقرب لصاحبها.',abaya:'قطعة تكمّل ذوقك، من يومك العادي إلى لحظاتك الخاصة. اختاري أبعادها وأضيفي لمستك باسمك.',thobe:'حضور مرتب في كل يوم. اختر ما يناسب قياسات قطعتك المفضّلة، واجعل له لمسة باسمك.',farwa:'حضور من تراثنا للأيام الباردة. اختر مقاسها مع طبقاتك المعتادة، وأضف لمسة شخصية لك أو لمن تهديها.'};
export function ProductPage({productId,onAdd,cart=[]}) {
 const product=collectionProducts.find(p=>p.id===productId),guide=productGuides[product.categoryKey];
 const category=productOptions[product.categoryKey];
 const [options,setOptions]=useState({...defaultCustomization,thread:category.threads[0].value}),[optionErrors,setOptionErrors]=useState({});
 const [size,setSize]=useState(''),[purpose,setPurpose]=useState('self'),[message,setMessage]=useState(''),[city,setCity]=useState(''),[error,setError]=useState(''),[added,setAdded]=useState(false),[sticky,setSticky]=useState(false),[returnUrl,setReturnUrl]=useState(collectionUrl(product.categoryKey));
 const sizeDialog=useRef(null),decision=useRef(null),sizesRef=useRef(null),addButton=useRef(null),customizationRef=useRef(null);
 const editingLoaded=useRef(false);
 useEffect(()=>{
  const requested=new URLSearchParams(location.search).get('edit');
  if(requested!==null && /^\d+$/.test(requested) && !editingLoaded.current){const item=cart[Number(requested)];if(item?.id===productId){if(guide.sizes.some(s=>s.id===item.size))setSize(item.size);setPurpose(item.purpose==='gift'?'gift':'self');setMessage(item.message||'');setOptions({...defaultCustomization,...Object.fromEntries(Object.keys(defaultCustomization).filter(k=>item[k]!==undefined).map(k=>[k,item[k]])),thread:item.thread||category.threads[0].value,approved:false});editingLoaded.current=true;}}
 },[cart]);
 useEffect(()=>{
  let frame=0;const update=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;setSticky(decision.current.getBoundingClientRect().bottom<0);});};
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
  try{const ref=new URL(document.referrer);if(ref.origin===location.origin && /\/collections\/(?:index|bisht|thobe|abaya|farwa)(?:-(?:winter|summer|spring))?(?:-\d+)?\.html$/.test(ref.pathname))setReturnUrl(ref.pathname);}catch{}
  const requested=new URLSearchParams(location.search).get('size');if(guide.sizes.some(s=>s.id===requested))setSize(requested);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);cancelAnimationFrame(frame);};
 },[]);
 const change=(set,value)=>{set(value);setAdded(false);setError('');setOptionErrors({});setOptions(o=>({...o,approved:false,...(set===setPurpose&&value==='self'?{wrapping:false}:{})}));};
 const changeOptions=value=>{setOptions(value);setAdded(false);setOptionErrors({});};
 const add=()=>{
  if(!size){setError('اختر المقاس أولًا. ويمكنك مراجعة دليل القياس بجانبه.');sizesRef.current.querySelector('.size-options button').focus();return;}
  const errors=customizationErrors(options,category);setOptionErrors(errors);
  if(Object.keys(errors).length){requestAnimationFrame(()=>document.getElementById(errors.name?'embroidered-name':errors.length?'final-length':'customization-approved')?.focus());return;}
  if(added)return;
  const requested=new URLSearchParams(location.search).get('edit'),editIndex=requested!==null&&/^\d+$/.test(requested)&&cart[Number(requested)]?.id===productId?Number(requested):undefined;
  onAdd({id:product.id,name:product.name,price:product.price,imageStem:product.imageStem,color:product.color,trim:product.trim,size,purpose,message:purpose==='gift'?message.trim():'',...options,wrapping:purpose==='gift'&&options.wrapping,embroideredName:options.nameEnabled?normalizedName(options.embroideredName):'',length:options.lengthEnabled?options.length:'',quantity:1,editIndex});setAdded(true);
 };
 const siblings=collectionProducts.filter(p=>p.categoryKey===product.categoryKey),related=siblings.filter(p=>p.id!==product.id).slice(0,3);
 return <>
  <section className="product-page container">
   <nav className="breadcrumbs" aria-label="مسار التنقل"><a href={homeUrl}>الرئيسية</a><span aria-hidden="true">/</span><a href={returnUrl}>{product.category}</a><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
   <div className="product-layout">
    <div className="product-heading"><span className="eyebrow">{product.category} · مُسدل</span><h1><ProductName name={product.name}/></h1><p className="price">{product.price} <span>ر.س</span></p><p className="product-use">{shortDescriptions[product.categoryKey]}</p></div>
    <ProductGallery product={product}/>
    <div className="product-decision" ref={decision}>
     <ul className="product-highlights" aria-label="مواصفات اختيارك"><li className="product-tag">{product.color}</li>{product.trim&&<li className="product-tag">زري {product.trim}</li>}{product.weightLabel&&<li className="product-tag">{product.weightLabel}</li>}{product.seasons.map(s=><li className="product-tag" key={s}>{seasons[s]}</li>)}</ul>
     <fieldset className="product-option"><legend>اللون والنسخة <span className="variant-selection"><span className="product-tag">{product.color}</span>{product.trim&&<span className="product-tag">زري {product.trim}</span>}</span></legend><div className="variant-options">{siblings.map(p=><a key={p.id} href={productUrl(p.id)} aria-current={p.id===product.id?'page':undefined} aria-label={p.name}><img src={asset('photos/collection/'+p.imageStem+'-400.webp')} alt="" width="48" height="60"/><span>{p.color}{p.weightLabel&&' · '+p.weightLabel}</span></a>)}</div></fieldset>
     <fieldset id="product-options" className="product-option" ref={sizesRef} aria-describedby={error?'size-error':'size-note'}><legend>المقاس <button className="inline-link" onClick={()=>sizeDialog.current.showModal()}>دليل المقاسات</button></legend><div className="size-options">{guide.sizes.map(s=><button key={s.id} aria-pressed={size===s.id} onClick={()=>change(setSize,s.id)}>{s.id}</button>)}</div><p id="size-note" className="option-note">قارن طول القطعة وعرضها بقطعة مناسبة لديك. المقاس مطلوب قبل الإضافة للسلة.</p>{error&&<p id="size-error" className="field-error" role="alert">{error}</p>}</fieldset>
     <fieldset className="product-option"><legend>لك، أو لمن له مكانة؟</legend><div className="purpose-options"><label><input type="radio" name="purpose" value="self" checked={purpose==='self'} onChange={()=>change(setPurpose,'self')}/> لي</label><label><input type="radio" name="purpose" value="gift" checked={purpose==='gift'} onChange={()=>change(setPurpose,'gift')}/> هدية</label></div>{purpose==='gift'&&<div className="gift-choice"><img src={asset('photos/gifting-approved-sleeve-daylight.png')} alt="تغليف مُسدل المعتمد: بوكس أبيض بغلاف ورقي برغندي والكيس المعتمد" width="1827" height="861" loading="lazy"/><label htmlFor="gift-message">رسالة الهدية <span>اختياري</span></label><textarea id="gift-message" rows="2" maxLength="180" value={message} onChange={e=>change(setMessage,e.target.value)} placeholder="كلماتك، لمن له مكانة…"/><label className="option-toggle"><input type="checkbox" checked={options.wrapping} onChange={e=>changeOptions({...options,wrapping:e.target.checked,approved:false})}/> أضف تغليف الهدية</label><p className="option-note">بوكس أبيض بغلاف مُسدل والكيس المعتمد. اختيارك يُحفظ بالسلة؛ رسوم التغليف تُعتمد قبل الشراء.</p></div>}</fieldset>
     <ProductCustomization categoryKey={product.categoryKey} category={category} options={options} onChange={changeOptions} errors={optionErrors} guideDialog={sizeDialog} detailsRef={customizationRef}/>
     <div className="delivery-summary"><h2>قبل اختيارك</h2><label htmlFor="delivery-city">مدينة التوصيل</label><select id="delivery-city" value={city} onChange={e=>setCity(e.target.value)}><option value="">اختر المدينة</option><option>الرياض</option><option>جدة</option><option>الدمام</option><option>مدينة أخرى</option></select><p role="status">{city?'لا يتوفر تقدير تجهيز أو توصيل إلى '+city+' حاليًا.':'مدة التجهيز ورسوم الشحن تُعلن مع افتتاح المتجر.'}</p><a className="inline-link" href="#product-service">التوصيل والاستبدال</a></div>
     <div className="selection-summary" aria-live="polite"><div className="selection-tags"><span className="product-tag">{product.color}</span>{product.trim&&<span className="product-tag">زري {product.trim}</span>}{size&&<span className="product-tag">المقاس {size}</span>}{purpose==='gift'&&<span className="product-tag">هدية</span>}</div><span>{product.price} ر.س</span></div>
     {!size&&<p className="size-required-note">لم تختَر المقاس بعد. حدّده أعلاه لإضافة القطعة إلى السلة.</p>}
     <CustomizationSummary options={options} category={category}/>{(options.wrapping||options.nameEnabled||options.lengthEnabled)&&<p className="option-note">السعر أعلاه للقطعة. رسوم الخيارات المختارة ومدة تنفيذها تُعتمد قبل الشراء.</p>}
     <button ref={addButton} className="primary-button product-add" onClick={add} disabled={added}>{added?'تم حفظ الاختيارات بالسلة':'أضف للسلة'}<img className="icon" src={asset('icons/shopping-bag.svg')} alt=""/></button><p className="option-note cart-notice" role="status">{added?'يمكنك مراجعة القطعة وخياراتها من أيقونة السلة أعلى الصفحة.':'تجربة للواجهة فقط؛ لا يتم شراء أو حجز القطعة.'}</p>
    </div>
   </div>
   <SizeGuide guide={guide} dialog={sizeDialog} category={product.categoryKey}/>
  </section>
  <section className="product-details container" id="product-details"><span className="eyebrow">الجمال في التفاصيل</span><h2>عن {product.name}</h2><p>{descriptions[product.categoryKey]} تأمّل صور القطعة وقارن القياسات بقطعة مناسبة لديك، واختر ما يشبه ذوقك.</p><ProductSpecifications product={product} category={category}/><details open><summary>القياس والملاءمة</summary><p>{guide.fit}</p><p>{guide.measure}</p></details><details><summary>العناية بالقطعة</summary><p>{category.care}</p></details></section>
  <section className="product-service container" id="product-service"><h2>نحن معك</h2><div className="product-service-grid"><div><h3>التجهيز والتوصيل</h3><p>المتجر في مرحلة المعاينة. حالة الجاهزية، مدة التجهيز وتكلفة الشحن ستظهر قبل الشراء عند الافتتاح.</p></div><div><h3>الاستبدال والضمان</h3><p>مدة الاستبدال، الرسوم واستثناءات التخصيص تُعلن في السياسة المعتمدة قبل تفعيل الطلبات.</p></div></div></section>
  <section className="product-questions container"><h2>أسئلة عن القطعة</h2>{guide.faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<details><summary>هل تصل قبل مناسبتي؟</summary><p>لا يتوفر تقدير وصول في المعاينة الحالية. يعتمد الموعد على الجاهزية والمدينة وأي خدمة إضافية عند تشغيل المتجر.</p></details><div className="review-empty"><h3>تجاربكم مع مُسدل</h3><p>لا توجد تقييمات بعد. ستظهر هنا مراجعات العملاء بعد افتتاح المتجر.</p></div></section>
  {related.length>0 && <section className="product-related container"><div className="section-heading"><h2>حضور آخر، يشبهك.</h2><a className="inline-link" href={returnUrl}>كل {product.category}</a></div><ul className="collection-grid">{related.map(p=><li className="collection-card" key={p.id}><a className="collection-card-link" href={productUrl(p.id)}><div className="collection-photo"><ProductImage product={p}/></div><div className="collection-product-info"><h2><ProductName name={p.name}/></h2><p className="product-color"><span className="product-tag">{p.color}</span>{p.trim&&<span className="product-tag">زري {p.trim}</span>}</p><p className="price">{p.price} <span>ر.س</span></p></div></a></li>)}</ul></section>}
  {sticky&&<div className="product-sticky"><span>{product.price} ر.س <small>{size?'المقاس '+size:'اختر مقاسك'}</small></span><button className="primary-button" onClick={()=>{decision.current.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});addButton.current.focus({preventScroll:true});}}>راجع اختيارك</button></div>}
 </>;
}
