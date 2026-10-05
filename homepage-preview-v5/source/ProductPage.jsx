import {asset,homeUrl,collectionUrl,collectionProducts} from './catalog.js';
import {ProductImage} from './Collection.jsx';
export function ProductPage({productId}) {
  const product=collectionProducts.find(p=>p.id===productId);
  return <section className="product-page container">
    <nav className="breadcrumbs" aria-label="مسار التنقل"><a href={homeUrl}>الرئيسية</a><span aria-hidden="true">/</span><a href={collectionUrl(product.categoryKey)}>{product.category}</a><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
    <div className="product-page-layout"><div className="product-page-photo"><ProductImage product={product} priority sizes="(max-width: 640px) 90vw, 550px"/></div><div className="product-page-copy"><span className="eyebrow">{product.category} · مُسدل</span><h1>{product.name}</h1><p className="price">{product.price} <span>ر.س</span></p><p className="product-page-description">{product.categoryKey==='bisht' ? `بشت ${product.color}${product.trim ? ` بتفاصيل زري ${product.trim}` : ''}، بانسدال يعكس روح مُسدل. قطعة تختارها لحضور يشبهك، في لحظاتك ومناسباتك.` : `اكتشف ${product.name} من مُسدل، وتأمّل القصة وتفاصيل القطعة.`}</p><dl className="product-specifications"><div><dt>اللون</dt><dd>{product.color}</dd></div>{product.trim && <div><dt>الزري</dt><dd>{product.trim}</dd></div>}{product.weightLabel && <div><dt>طابع النسيج</dt><dd>{product.weightLabel}</dd></div>}</dl><a className="text-link" href={collectionUrl(product.categoryKey)}>العودة إلى {product.category}<img className="icon" src={asset('icons/arrow-left.svg')} alt=""/></a></div></div>
  </section>;
}
