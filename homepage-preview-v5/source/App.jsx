import { useEffect, useRef, useState } from 'react';
const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const productUrl = category => `https://ahmads-cell.github.io/alboshoot-market-report/product-page-outline.html?category=${category}#product-start`;
const products = [
  { id:'bisht', name:'بشت سمت', category:'البشوت', price:'٢٬٨٠٠', photo:'bisht.png', detail:'bisht-detail.png' },
  { id:'thobe', name:'الثوب السعودي', category:'الثياب والدشاديش', price:'٦٥٠', photo:'thobe.png', detail:'thobe-detail.png' },
  { id:'abaya', name:'عباية رواء', category:'العبايات', price:'٨٩٠', photo:'abaya.png', detail:'abaya-detail.png' },
  { id:'farwa', name:'الفروة الفحمية', category:'الفروات', price:'١٬٩٥٠', photo:'farwa.png', detail:'farwa-detail.png' },
];
const heroSlides = [
  { photo:'hero-daylight.png', title:'لكل لحظة، حضور.', text:'قطع من تراثنا، تعيش معك اليوم.', label:'تسوّق المجموعة', href:'#categories' },
  { photo:'heritage-daylight.png', title:'من تراثنا، لحياتنا.', text:'حضور يشبهك، في كل خطوة.', label:'استكشف القطع', href:'#arrivals' },
];
const services = {
  sizes:{ title:'دليل المقاسات', text:'ابدأ بقياس قطعة مناسبة لديك وهي مسطّحة، ثم قارن طولها وعرضها وقياس الكم بجدول مقاسات المنتج. دليل كل قطعة تجده في صفحة المنتج.', link:'راجع صفحة القطعة', href:productUrl('bisht') },
  policy:{ title:'سياسة التوصيل والاستبدال', text:'ستُتاح تفاصيل مواعيد التوصيل وشروط الاستبدال مع افتتاح المتجر.' },
  contact:{ title:'تواصل معنا', text:'نسعد بمساعدتك في اختيار قطعتك. قنوات التواصل ستُتاح مع افتتاح المتجر.' },
  cart:{ title:'سلة التسوق', text:'سلتك فارغة حاليًا. خذ وقتك في اكتشاف القطع.', link:'اكتشف المجموعة', href:'#arrivals' },
};
function Icon({name}) { return <img className="icon" src={asset(`icons/${name}.svg`)} alt="" aria-hidden="true"/>; }
function TextLink({href,children,onClick}) { return <a className="text-link" href={href} onClick={onClick}>{children}<Icon name="arrow-left"/></a>; }
function ProductRail({id,title,subtitle,items}) {
  const rail=useRef(null);
  const [position,setPosition]=useState({start:true,end:false});
  const update=()=>{const el=rail.current;if(!el)return;const distance=Math.abs(el.scrollLeft);setPosition({start:distance<4,end:distance>=el.scrollWidth-el.clientWidth-4});};
  useEffect(()=>{const observer=new ResizeObserver(update);observer.observe(rail.current);return()=>observer.disconnect();},[]);
  const move=next=>{const el=rail.current;const card=el.querySelector('.product-card');el.scrollBy({left:(card.clientWidth+parseFloat(getComputedStyle(el).gap))*(next?-1:1),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  return <section className="container product-section section-space" id={id} aria-labelledby={`${id}-title`}>
    <div className="section-heading"><div><h2 id={`${id}-title`}>{title}</h2><p>{subtitle}</p></div><TextLink href="#categories">كل القطع</TextLink></div>
    <div className="product-rail" ref={rail} onScroll={update} tabIndex="0" aria-label={`منتجات ${title}`}>
      {items.map(p=><a className="product-card" href={productUrl(p.id)} key={p.id}><div className="product-photo"><img src={asset(`photos/${p.photo}`)} alt={p.name} width="1122" height="1402"/></div><div className="product-info"><span>{p.category}</span><h3>{p.name}</h3><p className="price">{p.price} <span>ر.س</span></p></div></a>)}
    </div>
    <div className="rail-bottom"><div className="rail-controls"><button className="icon-button" disabled={position.start} onClick={()=>move(false)} aria-label={`القطع السابقة — ${title}`}><Icon name="chevron-right"/></button><button className="icon-button" disabled={position.end} onClick={()=>move(true)} aria-label={`القطع التالية — ${title}`}><Icon name="chevron-left"/></button></div></div>
  </section>;
}
export function App() {
  const [slide,setSlide]=useState(0);const [menu,setMenu]=useState(false);const [search,setSearch]=useState(false);const [query,setQuery]=useState('');const [modal,setModal]=useState(null);const dialog=useRef(null);const hero=heroSlides[slide];
  useEffect(()=>{if(modal)dialog.current.showModal();},[modal]);
  const openService=key=>event=>{event.preventDefault();setModal(key);};
  const closeDialog=()=>{dialog.current.close();setModal(null);};
  const filtered=products.filter(p=>`${p.name} ${p.category}`.includes(query.trim()));
  return <>
    <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
    <header className="site-header"><div className="header-main container"><div className="header-actions"><button className="icon-button mobile-menu" aria-label="قائمة الأقسام" aria-expanded={menu} onClick={()=>{setMenu(!menu);setSearch(false);}}><Icon name={menu?'x':'menu-2'}/></button><button className="icon-button" aria-label="بحث عن قطعة" aria-expanded={search} onClick={()=>{setSearch(!search);setMenu(false);}}><Icon name={search?'x':'search'}/></button></div><a className="brand" href="#top" aria-label="مُسدل — الرئيسية"><img src={asset('brand/wordmark.svg')} alt="مُسدل" width="779" height="444"/></a><button className="icon-button" aria-label="سلة التسوق" onClick={()=>setModal('cart')}><Icon name="shopping-bag"/></button></div>
    <nav className={`main-nav ${menu?'is-open':''}`} aria-label="أقسام المتجر" onClick={()=>setMenu(false)}><a href="#arrivals">وصل حديثًا</a>{products.map(p=><a key={p.id} href={productUrl(p.id)}>{p.category}</a>)}<a href="#gifting">الهدايا</a></nav>
    {search&&<div className="search-panel container"><label htmlFor="search">عن أي قطعة تبحث؟</label><input id="search" type="search" placeholder="ابحث عن بشت، ثوب، عباية…" autoFocus value={query} onChange={e=>setQuery(e.target.value)}/><div className="search-results">{filtered.length?filtered.map(p=><a key={p.id} href={productUrl(p.id)}>{p.name}<Icon name="arrow-left"/></a>):<p>لم نجد قطعة بهذا الاسم. جرّب اسم الفئة.</p>}</div></div>}
    </header>
    <main id="main">
      <section className={`hero slide-${slide}`} id="top" aria-label="المجموعة الرئيسية" aria-roledescription="عارض صور"><img className="hero-photo" src={asset(`photos/${hero.photo}`)} alt="رجل ببشت أسود وامرأة بعباية سوداء في أجواء نهارية" width="1774" height="887" fetchPriority="high"/><div className="hero-copy" aria-live="polite"><span className="eyebrow">مُسدل، من تراثنا</span><h1>{hero.title}</h1><p>{hero.text}</p><a className="primary-button" href={hero.href}>{hero.label}<Icon name="arrow-left"/></a></div>
      {heroSlides.length>1&&<div className="hero-pagination"><button className="icon-button" aria-label="البانر السابق" onClick={()=>setSlide((slide+heroSlides.length-1)%heroSlides.length)}><Icon name="chevron-right"/></button><div className="dots">{heroSlides.map((_,index)=><button key={index} className={index===slide?'active':''} aria-label={`البانر ${index+1}`} aria-pressed={index===slide} onClick={()=>setSlide(index)}/>)}</div><button className="icon-button" aria-label="البانر التالي" onClick={()=>setSlide((slide+1)%heroSlides.length)}><Icon name="chevron-left"/></button></div>}
      </section>
      <section className="brand-intro container section-space"><span className="eyebrow">هذا هو مُسدل</span><h2>مُسدل.. من إرثنا، على ذوقك.</h2><p>في مُسدل، نجمع روح تراثنا وذوق اليوم. بشوت، ثياب، عبايات وفروات.<br className="desktop-break"/> تختار منها اللي يشبهك، ليومك وللحظات اللي تهمّك.</p></section>
      <section className="container categories" id="categories" aria-label="اكتشف فئات مُسدل">{products.map(p=><a className="category" key={p.id} href={productUrl(p.id)}><img src={asset(`photos/${p.detail}`)} alt={`تفاصيل ${p.category}`} width="1122" height="1402"/><div><h3>{p.category}</h3><Icon name="arrow-left"/></div></a>)}</section>
      <ProductRail id="arrivals" title="وصل حديثًا" subtitle="قطع جديدة، وحضور يبقى." items={[products[1],products[2],products[3],products[0]]}/>
      <section className="heritage container section-space" id="heritage"><div className="centered-copy"><span className="eyebrow">أصالة تمشي معك</span><h2>قطع تراثية، للحظاتك.</h2><p>من يومك البسيط، إلى يومك المميّز.</p><TextLink href="#curated">استكشف المجموعة</TextLink></div><img className="editorial-photo" src={asset('photos/heritage-daylight.png')} alt="بشت وعباية في مشهد نهاري يعكس التراث السعودي" width="1774" height="887"/></section>
      <section className="details-banner container" id="details"><img src={asset('photos/details-fabric.png')} alt="لقطة قريبة لنسيج البشت وتفاصيل الزري الذهبي" width="1891" height="832"/><div className="details-copy"><span className="eyebrow">الجمال في التفاصيل</span><h2>اكتشف التفاصيل.</h2><p>في النسيج، في الزري، وفي كل لمسة.</p><TextLink href={productUrl('bisht')}>شاهد القطعة</TextLink></div></section>
      <ProductRail id="curated" title="اختيارات مُسدل" subtitle="قطع نحبّها. ونختارها لك." items={[products[0],products[2],products[1],products[3]]}/>
      <section className="gifting container section-space" id="gifting"><div className="section-heading"><div><span className="eyebrow">لمن له مكانة</span><h2>حضور يستحق أن يُهدى.</h2><p>قطعة تعبّر عن ذوقك، وعن مكانته عندك.</p></div><TextLink href="#curated">اختر هديتك</TextLink></div><img className="editorial-photo" src={asset('photos/gifting-approved-mailer-daylight.png')} alt="تغليف مُسدل: الكيس البرغندي المعتمد بمقابض فاتحة وباترن اللام، وبوكس أبيض قابل للطي بغطاء متصل وألسنة إغلاق جانبية، وغلاف ورقي عليه اللام وباترن الانسياب" width="1829" height="860" loading="lazy"/></section>
      <section className="services container section-space" aria-label="نساعدك تختار"><a href="#sizes" onClick={openService('sizes')}><Icon name="ruler-2"/><span>دليل المقاسات</span><Icon name="arrow-left"/></a><a href="#policy" onClick={openService('policy')}><Icon name="package"/><span>سياسة التوصيل والاستبدال</span><Icon name="arrow-left"/></a><a href="#contact" onClick={openService('contact')}><Icon name="messages"/><span>تواصل معنا</span><Icon name="arrow-left"/></a></section>
    </main>
    <footer className="site-footer"><div className="footer-pattern" aria-hidden="true"/><div className="footer-content container"><div className="footer-brand"><a href="#top" aria-label="مُسدل — الرئيسية"><img src={asset('brand/wordmark-inverse.svg')} alt="مُسدل" width="779" height="444"/></a><p>من تراثنا، لكل لحظة.</p></div><div className="footer-links"><div><h3>اكتشف مُسدل</h3><a href="#arrivals">وصل حديثًا</a><a href="#curated">اختيارات مُسدل</a><a href="#gifting">الهدايا</a></div><div><h3>نحن معك</h3><a href="#sizes" onClick={openService('sizes')}>دليل المقاسات</a><a href="#policy" onClick={openService('policy')}>التوصيل والاستبدال</a><a href="#contact" onClick={openService('contact')}>تواصل معنا</a></div></div></div><div className="footer-bottom container"><span>© مُسدل ٢٠٢٦</span></div></footer>
    <dialog ref={dialog} className="service-dialog" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===dialog.current)closeDialog();}}><button className="icon-button dialog-close" aria-label="إغلاق النافذة" onClick={closeDialog}><Icon name="x"/></button>{modal&&<><h2>{services[modal].title}</h2><p>{services[modal].text}</p>{services[modal].link&&<TextLink href={services[modal].href} onClick={closeDialog}>{services[modal].link}</TextLink>}</>}</dialog>
  </>;
}
