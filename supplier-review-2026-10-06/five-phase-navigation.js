(() => {
  const sidebar = document.querySelector('.supplier-sidebar');
  const toggle = document.querySelector('.supplier-menu-toggle');
  const sections = [...document.querySelectorAll('#supplier-main > section')];
  const toc = [...document.querySelectorAll('#supplier-toc a')];
  const boxes = [...document.querySelectorAll('[data-phase-box]')];
  const filters = [...document.querySelectorAll('[data-phase-filter]')];
  const status = document.getElementById('phase-filter-status');
  let current = 0;
  const closeMenu = () => { sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => { const open = sidebar.classList.toggle('open'); toggle.setAttribute('aria-expanded',String(open)); });
  function selectPhase(value, expand = true) {
    filters.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.phaseFilter === value)));
    boxes.forEach(box => { box.hidden = value !== 'all' && box.dataset.phaseBox !== value; if (expand && value !== 'all') { const detail = box.querySelector('.phase-products'); if (detail) detail.open = true; } });
    const groups = [...document.querySelectorAll('.new-card')].filter(c => value === 'all' || c.dataset.phase === value).length;
    status.textContent = value === 'all' ? '5 مراحل؛ عينتان للبداية، و38 عائلة بصرية إضافية موزعة للمقارنة.' : 'Phase ' + value + (value === '1' ? ' · تصميمان للبداية فقط؛ لا إضافة ثالثة الآن.' : ' · ' + groups + ' عائلات بصرية من الإضافات؛ ليست عدد أصناف شراء.');
  }
  filters.forEach(b => b.addEventListener('click', () => selectPhase(b.dataset.phaseFilter)));
  function reveal(hash) {
    let id; try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id); if (!target) return;
    const box = target.closest('[data-phase-box]');
    if (box) selectPhase(box.dataset.phaseBox);
    for (let parent=target.parentElement; parent; parent=parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    closeMenu(); reveal(a.hash);
    if (matchMedia('(max-width:760px)').matches) setTimeout(() => document.getElementById(a.hash.slice(1))?.scrollIntoView({block:'start'}),0);
  }));
  window.addEventListener('hashchange', () => reveal(location.hash));
  function active(index) {
    current=index;toc.forEach((a,i)=>{ if(i===index)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current'); });
    document.getElementById('supplier-prev').disabled=index===0;
    document.getElementById('supplier-next').disabled=index===sections.length-1;
    if (matchMedia('(min-width:761px)').matches) {
      const a=toc[index], rect=a.getBoundingClientRect(), area=sidebar.getBoundingClientRect();
      if(rect.top<area.top+12)sidebar.scrollTop-=area.top+12-rect.top;
      if(rect.bottom>area.bottom-65)sidebar.scrollTop+=rect.bottom-(area.bottom-65);
    }
  }
  let scheduled=false;
  function onScroll(){ if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;const margin=parseFloat(getComputedStyle(sections[0]).scrollMarginTop)||0;const offset=padding+margin+12;let index=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<=offset)index=i;});if(index!==current)active(index);}); }
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  const go = index => { closeMenu();location.hash=sections[index].id;sections[index].scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}); };
  document.getElementById('supplier-prev').addEventListener('click',()=>go(Math.max(0,current-1)));
  document.getElementById('supplier-next').addEventListener('click',()=>go(Math.min(sections.length-1,current+1)));
  active(0);reveal(location.hash);onScroll();
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
})();
