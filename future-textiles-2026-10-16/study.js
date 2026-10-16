'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const cards=[...document.querySelectorAll('.product')];
 const normalize=s=>s.toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا');
 function filter(){const q=normalize($('product-search').value.trim());let n=0;cards.forEach(c=>{c.hidden=!(($('group-filter').value==='all'||c.dataset.group===$('group-filter').value)&&($('phase-filter').value==='all'||c.dataset.phase===$('phase-filter').value)&&normalize(c.textContent).includes(q));if(!c.hidden)n++;});$('product-count').textContent=`يعرض ${n} من ${cards.length} مرشحًا`;$('empty-products').hidden=n!==0;}
 ['product-search','group-filter','phase-filter'].forEach(id=>$(id).addEventListener('input',filter));filter();
 function revealHash(){const id=decodeURIComponent(location.hash.slice(1));const card=cards.find(c=>c.id===id);if(card&&card.hidden){$('product-search').value='';$('group-filter').value='all';$('phase-filter').value='all';filter();card.scrollIntoView();}}
 window.addEventListener('hashchange',revealHash);revealHash();
 const fields=['calc-price','calc-vat','calc-other','calc-cac','calc-target'];
 function calc(){const raw=fields.map(id=>$(id).value);if(raw.some(x=>x==='')){$('calc-output').textContent='أكمل الحقول؛ المجهول لا يعني صفرًا.';return;}const [price,vat,other,cac,target]=raw.map(Number);if(![price,vat,other,cac,target].every(Number.isFinite)||price<=0||![1,1.15].includes(vat)||other<0||cac<0||target<0||target>100){$('calc-output').textContent='راجع المدخلات: سعر موجب، تكاليف غير سالبة، وهامش بين 0 و100%.';return;}const net=price/vat,ceiling=net*(1-target/100)-other-cac;$('calc-output').textContent=`صافي الإيراد ${net.toFixed(2)} ر.س · سقف تكلفة الوصول ${ceiling.toFixed(2)} ر.س. ${ceiling<=0?'هذا السيناريو لا يترك مساحة موجبة لشراء المنتج.':'سقف حسابي وفق افتراضاتك، وليس عرض مورد.'}`;}
 $('cost-form').addEventListener('submit',e=>e.preventDefault());fields.forEach(id=>$(id).addEventListener('input',calc));
 $('calc-example').addEventListener('click',()=>{[129,1.15,20,25,30].forEach((v,i)=>$(fields[i]).value=v);calc();});
 $('calc-clear').addEventListener('click',()=>{fields.forEach(id=>$(id).value='');calc();});
 $('copy-rfq').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('rfq').textContent);$('copy-status').textContent='تم نسخ مسودة طلب العرض.';}catch{$('copy-status').textContent='النسخ غير متاح هنا؛ حمّل المسودة من الرابط أو حدد النص وانسخه.';}});
 const mobile=matchMedia('(max-width:760px)');if(mobile.matches)$('toc-box').open=false;
 document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',e=>{if(mobile.matches){e.preventDefault();$('toc-box').open=false;location.hash=a.hash;document.getElementById(a.hash.slice(1))?.scrollIntoView({behavior:'instant'});}}));
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'0px 0px -65% 0px'});document.querySelectorAll('main>section').forEach(s=>observer.observe(s));
})();
