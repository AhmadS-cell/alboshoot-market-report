import {asset} from './catalog.js';
export const defaultCustomization = {wrapping:false,nameEnabled:false,embroideredName:'',thread:'',lengthEnabled:false,length:'',approved:false};
export const normalizedName = value => value.trim().replace(/\s+/gu,' ');
export function customizationErrors(options,category) {
 const errors={},name=normalizedName(options.embroideredName);
 if(options.nameEnabled && (!name || [...name].length>24 || !/^[\p{L}\p{M} .’'-]+$/u.test(name)))errors.name='اكتب اسمًا بالعربية أو الإنجليزية، حتى ٢٤ حرفًا، دون رموز أو أرقام.';
 const length=Number(options.length);
 if(options.lengthEnabled && (!options.length.trim() || !Number.isFinite(length) || length<category.length_range[0] || length>category.length_range[1]))errors.length=`أدخل طول القطعة النهائي بين ${category.length_range[0]} و${category.length_range[1]} سم في هذه المعاينة.`;
 if((options.nameEnabled||options.lengthEnabled)&&!options.approved)errors.approved='راجع الاسم والطول ثم أكّد المعاينة قبل الإضافة.';
 return errors;
}
export function CustomizationSummary({options,category}) {
 return <ul className="customization-summary">
  {options.wrapping&&<li>تغليف الهدية · بوكس أبيض بغلاف مُسدل والكيس المعتمد</li>}
  {options.nameEnabled&&<li>الاسم: <bdi>{normalizedName(options.embroideredName)||'لم يُكتب بعد'}</bdi> · {category.threads.find(t=>t.value===options.thread)?.label} · داخل الرقبة</li>}
  {options.lengthEnabled&&<li>طول القطعة النهائي: {options.length||'—'} سم</li>}
 </ul>;
}
export function ProductCustomization({categoryKey,category,options,onChange,errors,guideDialog,detailsRef}) {
 const set=(field,value)=>onChange({...options,[field]:value,approved:field==='approved'?value:false});
 const selected=options.nameEnabled||options.lengthEnabled;
 return <section className="customization-options" ref={detailsRef} aria-labelledby="customization-title">
  <h2 id="customization-title">لمستك الخاصة <span>الاسم وتعديل الطول · اختياري</span></h2>
  <label className="option-toggle"><input type="checkbox" checked={options.nameEnabled} onChange={e=>set('nameEnabled',e.target.checked)}/> أضف اسمًا مطرّزًا</label>
  {options.nameEnabled&&<div className="customization-panel">
   <label htmlFor="embroidered-name">الاسم كما تريد كتابته</label><input id="embroidered-name" type="text" dir="auto" maxLength="24" autoComplete="off" value={options.embroideredName} onChange={e=>set('embroideredName',e.target.value)} placeholder="مثال: أحمد العتيبي" aria-invalid={!!errors.name} aria-describedby={errors.name?'name-help name-error':'name-help'}/>
   <p id="name-help">عربي أو إنجليزي، حتى ٢٤ حرفًا. الاسم داخل الرقبة، مستقل عن الزري.</p>{errors.name&&<p className="field-error" id="name-error" role="alert">{errors.name}</p>}
   <fieldset className="thread-options"><legend>لون الخيط</legend>{category.threads.map(t=><label key={t.value}><input type="radio" name="name-thread" checked={options.thread===t.value} onChange={()=>set('thread',t.value)}/><span className={'thread-dot '+t.value}/>{t.label}</label>)}</fieldset>
   <figure className="name-placement"><img src={asset('photos/collection/name-placement-'+categoryKey+'.webp')} width="560" height="700" alt="مثال توضيحي لموضع تطريز الاسم على التبويب داخل الرقبة" loading="lazy"/><figcaption>موضع الاسم · تبويب عند داخل الرقبة. الصورة مثال من مخطط الفئة؛ يظهر اسمك في المعاينة أدناه.</figcaption></figure>
   <div className={'name-proof '+(categoryKey==='thobe'?'light-tab':'dark-tab')}><span>معاينة اسمك</span><strong dir="auto" className={'thread-text '+options.thread}>{normalizedName(options.embroideredName)||'اسمك هنا'}</strong></div>
  </div>}
  <label className="option-toggle"><input type="checkbox" checked={options.lengthEnabled} onChange={e=>set('lengthEnabled',e.target.checked)}/> عدّل طول القطعة</label>
  {options.lengthEnabled&&<div className="customization-panel">
   <label htmlFor="final-length">طول القطعة النهائي (سم)</label><input id="final-length" type="number" inputMode="decimal" min={category.length_range[0]} max={category.length_range[1]} step="0.1" value={options.length} onChange={e=>set('length',e.target.value)} aria-invalid={!!errors.length} aria-describedby={errors.length?'length-help length-error':'length-help'}/>
   <p id="length-help">قِس من أعلى الكتف إلى الحافة. أدخل طول القطعة، وليس طول الشخص. تغيير الطول لا يغيّر عرض المقاس المختار.</p><button className="inline-link" onClick={()=>guideDialog.current.showModal()}>شاهد طريقة القياس</button>{errors.length&&<p className="field-error" id="length-error" role="alert">{errors.length}</p>}
  </div>}
  {selected&&<div className="customization-review"><h3>راجع لمستك</h3><CustomizationSummary options={{...options,wrapping:false}} category={category}/><label className="option-toggle"><input id="customization-approved" type="checkbox" checked={options.approved} onChange={e=>set('approved',e.target.checked)} aria-invalid={!!errors.approved} aria-describedby={errors.approved?'approval-error':undefined}/> راجعت كتابة الاسم ولون الخيط والموضع والطول المختار.</label>{errors.approved&&<p className="field-error" id="approval-error" role="alert">{errors.approved}</p>}<p>أي تعديل على الاختيارات يحتاج مراجعة المعاينة من جديد.</p></div>}
  <p className="option-note">يمكن تجربة الخيارات وحفظها بالسلة. تكلفة الخدمات والمهلة وشروط استبدال القطعة المخصّصة تُعتمد قبل إتاحة الشراء.</p>
 </section>;
}
