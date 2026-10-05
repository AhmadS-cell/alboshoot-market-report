import { asset, homeUrl, collectionUrl, productUrl, categoryProducts, collectionInfo, seasons } from './catalog.js';
import { paginate, PAGE_SIZE } from './pagination.js';

const number = n => new Intl.NumberFormat('ar-SA').format(n);
export function ProductName({name}) {
  const parts=name.split(' بزري ');
  return <>{parts[0]}{parts.length>1 && <> <span className="product-name-trim">بزري {parts[1]}</span></>}</>;
}
export function ProductImage({product, priority = false, sizes = '(max-width: 640px) 46vw, (max-width: 1000px) 45vw, 280px'}) {
  const stem=product.imageStem;
  return <img src={asset('photos/collection/'+stem+'-800.webp')} srcSet={asset('photos/collection/'+stem+'-400.webp')+' 400w, '+asset('photos/collection/'+stem+'-800.webp')+' 800w'} sizes={sizes} alt={product.alt} width="800" height="1000" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"/>;
}
export function Collection({pageKey, pageNumber = 1, season = 'all'}) {
  const info=collectionInfo(pageKey,season);
  const catalog=categoryProducts(pageKey,season);
  const {items,page,pageCount,total}=paginate(catalog,pageNumber);
  const headerPhoto=pageKey==='all' ? 'details-fabric' : pageKey+'-detail';
  const first=total ? (page-1)*PAGE_SIZE+1 : 0,last=total ? first+items.length-1 : 0;
  return <>
    <section className="collection-intro container">
      <nav className="breadcrumbs" aria-label="مسار التنقل"><a href={homeUrl}>الرئيسية</a><span aria-hidden="true">/</span><span aria-current="page">{info.title}</span></nav>
      <div className="collection-cover"><img src={asset('photos/collection/'+headerPhoto+'-banner.webp')} alt="" width="1440" height="300" fetchPriority="high"/><div className="collection-heading"><span className="eyebrow">من تراثنا، على ذوقك</span><h1>{info.title}</h1><p>{info.description}</p></div></div>
    </section>
    <section className="collection-products container" aria-label={'قطع '+info.title}>
      <nav className="season-filters" aria-label="تصفية القطع حسب الموسم">{Object.entries(seasons).map(([key,label])=>{
        const count=categoryProducts(pageKey,key).length;
        return count || key==='all' ? <a key={key} href={collectionUrl(pageKey,1,key)} aria-current={season===key ? 'page' : undefined}>{label}</a> : <span key={key} aria-disabled="true">{label}</span>;
      })}</nav>
      <div className="collection-toolbar"><span aria-label={'عرض المنتجات '+first+' إلى '+last+' من '+total}>({number(first)}{last!==first && <>–{number(last)}</>} من {number(total)})</span></div>
      <ul className="collection-grid">
        {items.map((product,index)=><li className="collection-card" key={product.id}>
          <a className="collection-card-link" href={productUrl(product.id)}>
            <div className="collection-photo"><ProductImage product={product} priority={index<2}/></div>
            <div className="collection-product-info"><h2><ProductName name={product.name}/></h2><p className="product-color"><span className="product-tag">{product.color}</span>{product.trim && <span className="product-tag">زري {product.trim}</span>}</p><p className="price">{product.price} <span>ر.س</span></p></div>
          </a>
        </li>)}
      </ul>
      {!total && <p className="collection-empty">لا تتوفر قطع لهذا الموسم حاليًا.</p>}
      {pageCount>1 && <nav className="collection-pagination" aria-label="صفحات المجموعة">
        {page>1 ? <a className="pagination-direction" href={collectionUrl(pageKey,page-1,season)} rel="prev" aria-label="الصفحة السابقة"><img className="icon" src={asset('icons/chevron-right.svg')} alt=""/>السابق</a> : <span className="pagination-direction is-disabled" aria-disabled="true"><img className="icon" src={asset('icons/chevron-right.svg')} alt=""/>السابق</span>}
        {Array.from({length:pageCount},(_,i)=><a key={i} href={collectionUrl(pageKey,i+1,season)} aria-label={'صفحة '+(i+1)} aria-current={page===i+1 ? 'page' : undefined}>{number(i+1)}</a>)}
        {page<pageCount ? <a className="pagination-direction" href={collectionUrl(pageKey,page+1,season)} rel="next" aria-label="الصفحة التالية">التالي<img className="icon" src={asset('icons/chevron-left.svg')} alt=""/></a> : <span className="pagination-direction is-disabled" aria-disabled="true">التالي<img className="icon" src={asset('icons/chevron-left.svg')} alt=""/></span>}
      </nav>}
    </section>
    <section className="collection-editorial container" aria-labelledby="collection-editorial-title"><img src={asset('photos/collection/heritage-banner.webp')} alt="رجل ببشت وامرأة بعباية، في مشهد نهاري من هوية مُسدل" width="1440" height="720" loading="lazy"/><div><span className="eyebrow">أصالة تمشي معك</span><h2 id="collection-editorial-title">لكل لحظة، حضور.</h2><a className="text-link" href={homeUrl+'#heritage'}>حكاية مُسدل<img className="icon" src={asset('icons/arrow-left.svg')} alt=""/></a></div></section>
    <section className="collection-story container"><span className="eyebrow">هذا هو مُسدل</span><h2>{info.story}</h2><p>{info.text}</p></section>
  </>;
}
