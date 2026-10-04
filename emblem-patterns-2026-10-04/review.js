(() => {
  const root='emblem-patterns-2026-10-04/';
  const names={'06-wordmark-lam':'اللام بساق طويلة','01-mim':'الميم · مقارنة ثانوية','02-upright':'اللام المستقيمة','03-extended':'اللام الممتدة','05-lam':'اللام الأصلية'};
  let pattern='flow',scheme='pack';
  function updatePattern(){
    document.getElementById('web-pattern').style.backgroundImage=`url('${root}patterns/${pattern}-web.svg')`;
    document.getElementById('pack-pattern').style.backgroundImage=`url('${root}patterns/${pattern}-${scheme}.svg')`;
    document.getElementById('pack-demo').classList.toggle('inverse',scheme==='inverse');
  }
  updatePattern();
  document.querySelectorAll('[data-pattern]').forEach(b=>b.addEventListener('click',()=>{
    pattern=b.dataset.pattern;
    document.querySelectorAll('[data-pattern]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    updatePattern();
  }));
  document.querySelectorAll('[data-scheme]').forEach(b=>b.addEventListener('click',()=>{
    scheme=b.dataset.scheme;
    document.querySelectorAll('[data-scheme]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    updatePattern();
  }));
  document.querySelectorAll('[data-emblem]').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.emblem,src=id==='06-wordmark-lam'?'brand-svg-kit/emblem/lam-burgundy.svg':root+id+'/emblem-192.png';
    if(b.dataset.colour){scheme=b.dataset.colour==='inverse'?'inverse':'pack';document.querySelectorAll('[data-scheme]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.scheme===scheme)));updatePattern();}
    document.querySelectorAll('[data-emblem]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const mark=document.querySelector('.selected-mark');mark.style.maskImage=`url('${src}')`;mark.style.webkitMaskImage=`url('${src}')`;mark.hidden=false;
    document.getElementById('selected-name').textContent=names[id]+' · معاينة';
    document.getElementById('repeat-image').setAttribute('href',src);
    document.getElementById('emblem-repeat').removeAttribute('hidden');
    document.getElementById('repeat-empty').hidden=true;
    document.getElementById('applications').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }));
  const initialSrc='brand-svg-kit/emblem/lam-burgundy.svg';
  const initialMark=document.querySelector('.selected-mark');initialMark.style.maskImage=`url('${initialSrc}')`;initialMark.style.webkitMaskImage=`url('${initialSrc}')`;initialMark.hidden=false;
  document.getElementById('selected-name').textContent='اللام بساق طويلة · معاينة';
  document.getElementById('repeat-image').setAttribute('href',initialSrc);document.getElementById('emblem-repeat').removeAttribute('hidden');document.getElementById('repeat-empty').hidden=true;
  document.getElementById('clear-emblem').addEventListener('click',()=>{
    document.querySelectorAll('[data-emblem]').forEach(x=>x.setAttribute('aria-pressed','false'));
    document.querySelector('.selected-mark').hidden=true;
    document.getElementById('selected-name').textContent='اختر إمبلمًا للمعاينة';
    document.getElementById('emblem-repeat').setAttribute('hidden','');
    document.getElementById('repeat-empty').hidden=false;
  });
})();
