import {seasons} from './catalog.js';

// Original lightweight outlines, sized to match the existing storefront icons.
const outlines={
 color:<><path d="M12 3c-2.5 3.5-6 7.2-6 11a6 6 0 0 0 12 0c0-3.8-3.5-7.5-6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/></>,
 zari:<><path d="m6 17 9-12a2 2 0 0 1 3 2L7 19l-3 2 2-4Z"/><path d="m15 8 1.5-2M7 18c3 0 3-5 7-5s5 3 3 5-5 1-5 3"/></>,
 season:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2m-8 3h2"/></>,
 fabric:<><path d="M5 4c4 2 10-2 14 0v16c-4-2-10 2-14 0Z"/><path d="M9 7v10m6-10v10M8 10h8m-8 4h8"/></>,
 lining:<><path d="m4 9 8-5 8 5-8 5-8-5Zm0 5 8 5 8-5M4 18l8 5 8-5"/></>,
 closure:<><circle cx="13" cy="12" r="7"/><path d="M3 7v10m0-5h3m14 0h1"/><circle cx="11" cy="10" r=".6"/><circle cx="15" cy="10" r=".6"/><circle cx="11" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></>,
 included:<><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m12 12 8-4.5M12 12v9m0-9L4 7.5m12-2.25-8 4.5"/></>
};

export function ProductSpecifications({product,category}) {
 const rows=[
  ['color','اللون',product.color],
  ...(product.trim?[['zari','الزري',product.trim]]:[]),
  ['season','الموسم',product.seasons.map(s=>seasons[s]).join(' / ')],
  ['fabric','القماش',product.categoryKey==='bisht'?'نسب الألياف والوزن تُعتمد من عينة كل نسخة.':category.fabric],
  ['lining','البطانة',product.id==='bisht'||product.categoryKey!=='bisht'?category.lining:'تُعتمد من عينة النسخة؛ لا يُستنتج الداخل من الصورة.'],
  ['closure','الإغلاق',category.closure],
  ['included','المشمول',category.included]
 ];
 return <dl className="product-specifications" aria-label="مواصفات القطعة">{rows.map(([key,label,value])=><div key={key}><dt><svg className="specification-icon" aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{outlines[key]}</svg><span>{label}</span></dt><dd>{value}</dd></div>)}</dl>;
}
