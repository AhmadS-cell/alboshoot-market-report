import {useState} from 'react';
const outlines={
 bisht:'M172 48 Q190 75 208 48 L277 64 Q325 90 330 145 L316 240 L284 234 L282 358 Q190 378 98 358 L96 234 L64 240 L50 145 Q55 90 103 64 Z',
 abaya:'M165 48 Q190 78 215 48 L245 62 L304 152 L279 172 L245 121 L272 362 Q190 377 108 362 L135 121 L101 172 L76 152 L135 62 Z',
 thobe:'M168 48 L168 36 L212 36 L212 48 L246 64 L297 158 L270 174 L241 120 L252 362 L128 362 L139 120 L110 174 L83 158 L134 64 Z',
 farwa:'M161 46 Q190 24 219 46 L252 60 L304 155 L278 174 L247 118 L264 360 Q190 374 116 360 L133 118 L102 174 L76 155 L128 60 Z'
};
const instructions={
 'الطول':'من أعلى الكتف عند الرقبة إلى الحافة السفلية، بخط مستقيم.',
 'العرض المسطح':'من جانب القطعة إلى الجانب الآخر، بلا شد. للبشت يُفرد اتساعه كاملًا؛ ليس محيط الجسم.',
 'الصدر المسطح':'من جانب إلى جانب عند أسفل الإبطين، والقطعة مغلقة. هذا عرض وليس محيطًا.',
 'فتحة الكم':'من طرف فتحة اليد إلى الطرف الآخر وهي مسطّحة. يُعتمد موضعها بحسب قصّة البشت.',
 'الكم':'من درزة الكتف إلى نهاية الكم، مع فرده بلا شد.',
 'الكتف':'من درزة الكتف اليمنى إلى اليسرى، والقطعة مسطّحة.',
 'الياقة':'طول الياقة عند فردها من نقطة الإغلاق إلى العروة؛ يُراجع تعريف المورد.'
};
const paths={
 'الطول':'M226 58 V361','العرض المسطح':'M100 208 H280','الصدر المسطح':'M138 135 H242',
 'فتحة الكم':'M314 176 L305 228','الكم':'M246 69 L291 154','الكتف':'M136 64 H244','الياقة':'M170 37 H210'
};
const numbers={ 'الطول':[244,270], 'العرض المسطح':[190,225], 'الصدر المسطح':[190,154], 'فتحة الكم':[326,195], 'الكم':[300,115], 'الكتف':[190,84], 'الياقة':[190,21] };
export function MeasurementDiagram({category,guide}) {
 const [active,setActive]=useState(guide.headers[1]);
 return <div className="measurement-guide">
  <p className="measure-intro">افرد قطعة مناسبة لديك على سطح مستوٍ. اختر القياس لتشاهد موضعه.</p>
  <div className="measurement-layout"><svg className="garment-outline" viewBox="0 0 380 400" role="img" aria-label={'رسم قياس '+({bisht:'البشت',abaya:'العباية',thobe:'الثوب',farwa:'الفروة'}[category])+' — '+active}>
   <defs><marker id={'measure-arrow-'+category} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto-start-reverse"><path d="M0 0 L5 2.5 L0 5" fill="currentColor"/></marker></defs>
   <path className="garment-shape" d={outlines[category]}/><path className="garment-seam" d={category==='bisht'?'M172 48 Q166 170 172 362 M208 48 Q214 170 208 362':category==='farwa'?'M174 47 L166 362 M206 47 L214 362':'M190 63 V361'}/>
   {guide.headers.slice(1).map((label,i)=><g key={label} className={'measure-line '+(active===label?'is-active':'')}><path d={label==='العرض المسطح'?(category==='bisht'?'M68 208 H312':'M125 208 H255'):paths[label]} markerStart={'url(#measure-arrow-'+category+')'} markerEnd={'url(#measure-arrow-'+category+')'}/><circle cx={numbers[label][0]} cy={numbers[label][1]} r="12"/><text x={numbers[label][0]} y={numbers[label][1]+5}>{i+1}</text></g>)}
  </svg><div className="measurement-selectors">{guide.headers.slice(1).map((label,i)=><button key={label} aria-pressed={active===label} onClick={()=>setActive(label)}><span>{i+1}</span>{label}</button>)}<p role="status">{instructions[active]}</p></div></div>
  <p className="option-note">الرسم يوضح طريقة القياس، ولا يمثل أبعادًا أو قصّة إنتاج معتمدة.</p>
 </div>;
}
