import { useEffect, useRef, useState } from 'react';
import { asset, homeUrl, collectionUrl, productUrl, products, collections } from './catalog.js';
import { paginate } from './pagination.js';

function ProductImage({product, detail = false, priority = false}) {
  const stem = detail ? product.detail.replace('.png', '') : product.id;
  return <img src={asset(`photos/collection/${stem}-800.webp`)} srcSet={`${asset(`photos/collection/${stem}-400.webp`)} 400w, ${asset(`photos/collection/${stem}-800.webp`)} 800w`} sizes="(max-width: 640px) 46vw, (max-width: 1000px) 45vw, 280px" alt={detail ? `تفاصيل ${product.name}` : product.alt} width="800" height="1000" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />;
}

export function Collection({pageKey, pageNumber = 1}) {
  const info = collections[pageKey];
  const catalog = pageKey === 'all' ? products : products.filter(p => p.id === pageKey);
  const {items, page, pageCount, total} = paginate(catalog, pageNumber);
  const headerPhoto = pageKey === 'all' ? 'details-fabric' : catalog[0].detail.replace('.png','');
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const dialog = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);
  const close = () => { dialog.current.close(); setSelected(null); opener.current?.focus(); };
  const views = selected ? [
    {src:asset(`photos/collection/${selected.id}-800.webp`), alt:selected.alt, label:'من الأمام'},
    ...(selected.alternate ? [{src:asset(`photos/collection/${selected.alternate}`), alt:`زاوية أخرى من ${selected.name}`, label:'زاوية أخرى'}] : []),
    {src:asset(`photos/collection/${selected.detail.replace('.png','')}-800.webp`), alt:`تفاصيل ${selected.name}`, label:'التفاصيل'},
  ] : [];
  return <>
    <section className="collection-intro container">
      <nav className="breadcrumbs" aria-label="مسار التنقل"><a href={homeUrl}>الرئيسية</a><span aria-hidden="true">/</span>{pageKey !== 'all' && <><a href={collectionUrl()}>المجموعة</a><span aria-hidden="true">/</span></>}<span aria-current="page">{info.title}</span></nav>
      <div className="collection-cover"><img src={asset(`photos/collection/${headerPhoto}-banner.webp`)} alt="" width="1440" height="300" fetchPriority="high"/><div className="collection-heading"><span className="eyebrow">من تراثنا، على ذوقك</span><h1>{info.title}</h1><p>{info.description}</p></div></div>
    </section>
    <section className="collection-products container" aria-label={`قطع ${info.title}`}>
      <div className="collection-toolbar"><span>{total === 1 ? 'قطعة واحدة' : `${new Intl.NumberFormat('ar-SA').format(total)} قطع`}</span><a className="collection-help" href="#sizes" onClick={e => {e.preventDefault(); document.querySelector('[data-size-guide]')?.click();}}>دليل المقاسات<img className="icon" src={asset('icons/ruler-2.svg')} alt="" /></a></div>
      <ul className={`collection-grid ${items.length === 1 ? 'single-product' : ''}`}>
        {items.map((product, index) => <li className="collection-card" key={product.id}>
          <div className="collection-photo">
            <a href={productUrl(product.id)} aria-label={`تفاصيل ${product.name}`}><ProductImage product={product} priority={index < 2}/></a>
            <button className="quick-view" aria-label={`نظرة أقرب إلى ${product.name}`} onClick={e => {opener.current = e.currentTarget;setImageIndex(0);setSelected(product);}}>نظرة أقرب<img className="icon" src={asset('icons/search.svg')} alt="" /></button>
          </div>
          <div className="collection-product-info"><span className="product-category">{product.category}</span><h2><a href={productUrl(product.id)}>{product.name}</a></h2><p className="product-color">{product.color}</p><p className="price">{product.price} <span>ر.س</span></p></div>
        </li>)}
      </ul>
      {pageCount > 1 && <nav className="collection-pagination" aria-label="صفحات المجموعة">{page > 1 && <a href={collectionUrl(pageKey,page-1)} rel="prev" aria-label="الصفحة السابقة">السابق</a>}{Array.from({length:pageCount},(_,i) => <a key={i} href={collectionUrl(pageKey,i+1)} aria-label={`صفحة ${i+1}`} aria-current={page === i+1 ? 'page' : undefined}>{new Intl.NumberFormat('ar-SA').format(i+1)}</a>)}{page < pageCount && <a href={collectionUrl(pageKey,page+1)} rel="next" aria-label="الصفحة التالية">التالي</a>}</nav>}
      <p className="collection-end">{pageKey === 'all' ? 'هذه هي مجموعتنا، بكل تفاصيلها.' : <a className="text-link" href={collectionUrl()}>اكتشف كل القطع<img className="icon" src={asset('icons/arrow-left.svg')} alt="" /></a>}</p>
    </section>
    <section className="collection-editorial container" aria-labelledby="collection-editorial-title"><img src={asset('photos/collection/heritage-banner.webp')} alt="رجل ببشت وامرأة بعباية، في مشهد نهاري من هوية مُسدل" width="1440" height="720" loading="lazy"/><div><span className="eyebrow">أصالة تمشي معك</span><h2 id="collection-editorial-title">لكل لحظة، حضور.</h2><a className="text-link" href={`${homeUrl}#heritage`}>حكاية مُسدل<img className="icon" src={asset('icons/arrow-left.svg')} alt="" /></a></div></section>
    <section className="collection-story container"><span className="eyebrow">هذا هو مُسدل</span><h2>{info.story}</h2><p>{info.text}</p><a className="text-link" href={`${homeUrl}#heritage`}>تعرّف إلى مُسدل<img className="icon" src={asset('icons/arrow-left.svg')} alt="" /></a></section>
    {selected && <dialog className="product-dialog" ref={dialog} aria-labelledby="quick-view-title" onCancel={e => {e.preventDefault();close();}} onClick={e => {if(e.target === dialog.current)close();}}>
      <button className="icon-button product-dialog-close" aria-label="إغلاق المعاينة" onClick={close}><img className="icon" src={asset('icons/x.svg')} alt="" /></button>
      <div className="quick-gallery"><img className="quick-gallery-photo" src={views[imageIndex].src} alt={views[imageIndex].alt} width="800" height="1000"/><div className="gallery-views" aria-label="صور القطعة">{views.map((view,index) => <button key={view.label} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>{view.label}</button>)}</div></div>
      <div className="quick-copy"><span className="eyebrow">{selected.category}</span><h2 id="quick-view-title">{selected.name}</h2><p>{selected.color}</p><p className="price">{selected.price} <span>ر.س</span></p><p className="quick-description">تأمّل القطعة من قرب، واكتشف تفاصيلها.</p><a className="primary-button" href={productUrl(selected.id)}>تفاصيل القطعة<img className="icon" src={asset('icons/arrow-left.svg')} alt=""/></a></div>
    </dialog>}
  </>;
}
