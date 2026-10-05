import {useState} from 'react';
import {garmentDiagrams} from './garment-diagrams.js';
const instructions={
 'الطول':'من أعلى الكتف عند الرقبة إلى الحافة السفلية، بخط مستقيم.',
 'العرض المسطح':'من جانب القطعة إلى الجانب الآخر، بلا شد. للبشت يُفرد اتساعه كاملًا؛ ليس محيط الجسم.',
 'الصدر المسطح':'من جانب إلى جانب عند أسفل الإبطين، والقطعة مغلقة. هذا عرض وليس محيطًا.',
 'فتحة الكم':'افرد فتحة الكم وقِس عرضها أفقيًا من الحافة إلى الحافة. هذا عرض الفتحة، وليس طول الكم أو محيطه.',
 'الكم':'من درزة الكتف إلى نهاية الكم، مع فرده بلا شد.',
 'الكتف':'من درزة الكتف اليمنى إلى اليسرى، والقطعة مسطّحة.',
 'الياقة':'طول الياقة عند فردها من نقطة الإغلاق إلى العروة؛ يُراجع تعريف المورد.'
};
function MeasurementDetail({type,arrow}) {
 const opening=type==='opening';
 return <figure className="measurement-detail"><svg viewBox="0 0 200 134" role="img" aria-label={opening?'تكبير فتحة الكم: سهم أفقي بين حافتي الفتحة المسطّحة':'الياقة مفرودة: قياس من نقطة الإغلاق إلى العروة'}>
  {opening?<><path className="garment-shape" d="M35 19 Q100 12 165 19 L158 85 H42Z"/><path className="garment-seam" d="M42 76 H158 M55 28 L58 67 M145 28 L142 67"/><path className="detail-measure-guide" d="M42 85 V112 M158 85 V112"/><path className="detail-measure-distance" d="M42 105 H158" markerStart={arrow} markerEnd={arrow}/></>:<><path className="garment-shape" d="M21 48 Q100 37 179 48 V78 Q100 68 21 78Z"/><circle className="garment-seam" cx="31" cy="62" r="2.5"/><path className="garment-seam" d="M164 62 H172"/><path className="detail-measure-guide" d="M31 66 V107 M168 66 V107"/><path className="detail-measure-distance" d="M31 100 H168" markerStart={arrow} markerEnd={arrow}/></>}
 </svg><figcaption>{opening?'فتحة الكم وهي مسطّحة · من الحافة إلى الحافة':'الياقة عند فردها · من نقطة الإغلاق إلى العروة'}</figcaption></figure>;
}
export function MeasurementDiagram({category,guide}) {
 const [active,setActive]=useState(guide.headers[1]);
 const garment=garmentDiagrams[category],arrow='url(#measure-arrow-'+category+')';
 const explanation=active==='العرض المسطح'&&category!=='bisht'?'من جانب القطعة إلى الجانب الآخر، والقطعة مسطّحة بلا شد. هذا عرض القطعة، وليس محيط الجسم.':instructions[active];
 return <div className="measurement-guide">
  <p className="measure-intro">افرد قطعة مناسبة لديك على سطح مستوٍ. اختر القياس لتشاهد موضعه.</p>
  <div className="measurement-layout"><figure className="measurement-drawing"><svg className="garment-outline" viewBox="0 0 380 400" role="img" aria-label={'رسم قياس '+garment.name+' من الأمام — '+active}>
   <defs><linearGradient id={'garment-fill-'+category} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset=".55" stopColor="#f4f0ed"/><stop offset="1" stopColor="#faf8f7"/></linearGradient><marker id={'measure-arrow-'+category} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L6 3 L0 6" fill="currentColor"/></marker></defs>
   <path className="garment-shape" style={{fill:'url(#garment-fill-'+category+')'}} d={garment.outline}/>{garment.facing&&<path className="garment-facing" d={garment.facing}/>}
   {garment.seams.map(d=><path key={d} className="garment-seam" d={d}/>)}{garment.trim?.map(d=><path key={d} className="garment-trim" d={d}/>)}{garment.folds.map(d=><path key={d} className="garment-fold" d={d}/>)}{garment.buttons?.map(([cx,cy])=><circle key={cy} className="garment-seam" cx={cx} cy={cy} r="1.5"/>)}
   {guide.headers.slice(1).map((label,i)=>{const m=garment.measures[label];return <g key={label} className={'measure-line '+(active===label?'is-active':'')}>{m.guides&&<path className="measure-extension" d={m.guides}/>} {m.highlight&&<path className="measure-highlight" d={m.highlight}/>} {m.distance&&<path className="measure-distance" d={m.distance} markerStart={arrow} markerEnd={arrow}/>}<circle cx={m.badge[0]} cy={m.badge[1]} r="11"/><text x={m.badge[0]} y={m.badge[1]+5}>{i+1}</text></g>;})}
  </svg><figcaption>{garment.name} · واجهة القطعة</figcaption></figure><div className="measurement-selectors">{guide.headers.slice(1).map((label,i)=><button key={label} aria-pressed={active===label} onClick={()=>setActive(label)}><span>{i+1}</span>{label}</button>)}<p role="status">{explanation}</p>{garment.measures[active].detail&&<MeasurementDetail type={garment.measures[active].detail} arrow={arrow}/>}</div></div>
  <p className="option-note">الرسم يوضح طريقة القياس، ولا يمثل أبعادًا أو قصّة إنتاج معتمدة.</p>
 </div>;
}
