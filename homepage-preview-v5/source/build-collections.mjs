import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';
const root = process.cwd();
const out = path.join(root,'dist/client');
const template = fs.readFileSync(path.join(out,'index.html'),'utf8');
const base = template.match(/src="([^"]*)assets\/index-[^"]+\.js"/)?.[1] || '/';
await build({root,base,build:{ssr:'src/prerender.jsx',outDir:'dist/prerender',emptyOutDir:true}});
const {render,collections,collectionProducts,categoryProducts,collectionInfo,seasons,collectionUrl,productUrl,asset,homeUrl,PAGE_SIZE} = await import('../dist/prerender/prerender.js');
const origin = 'https://ahmads-cell.github.io';
const absolute = value => new URL(value,origin).href;
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const writePage = (key, page = 1, season = 'all') => {
  const info = collectionInfo(key,season);
  const url = absolute(collectionUrl(key,page,season));
  const items = categoryProducts(key,season).slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const title = info.seoTitle + (page>1 ? ` — صفحة ${page}` : '');
  const structured = {'@context':'https://schema.org','@graph':[
    {'@type':'CollectionPage','@id':url,name:title,description:info.description,url,inLanguage:'ar',mainEntity:{'@type':'ItemList',itemListElement:items.map((p,i)=>({'@type':'ListItem',position:(page-1)*PAGE_SIZE+i+1,name:p.name,url:absolute(productUrl(p.id))}))}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'الرئيسية',item:absolute(homeUrl)},{'@type':'ListItem',position:2,name:info.title,item:url}]}
  ]};
  const metadata = `<meta name="description" content="${escape(info.description)}"/>\n<meta name="robots" content="noindex,follow"/>\n<link rel="canonical" href="${url}"/>\n<meta property="og:type" content="website"/>\n<meta property="og:locale" content="ar_SA"/>\n<meta property="og:site_name" content="مُسدل"/>\n<meta property="og:title" content="${escape(title)}"/>\n<meta property="og:description" content="${escape(info.description)}"/>\n<meta property="og:url" content="${url}"/>\n<meta property="og:image" content="${absolute(asset(`photos/collection/${(items[0] || categoryProducts(key)[0]).imageStem}-800.webp`))}"/>\n<meta name="twitter:card" content="summary_large_image"/>\n<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>`;
  const html = template.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace('</head>',`${metadata}\n</head>`).replace('<div id="root"></div>',`<div id="root">${render(key,page,null,season)}</div>`);
  const relative = collectionUrl(key,page,season).slice(base.length);
  fs.mkdirSync(path.dirname(path.join(out,relative)),{recursive:true});
  fs.writeFileSync(path.join(out,relative),html);
};
for(const key of Object.keys(collections)) {
  for(const season of Object.keys(seasons)) {
    const total = categoryProducts(key,season).length;
    for(let page=1;page<=Math.max(1,Math.ceil(total/PAGE_SIZE));page++) writePage(key,page,season);
  }
}
console.log('Prerendered collections with descriptions, metadata, breadcrumbs and pagination. Preview is noindex until real catalog/domain handoff.');

// Preserve existing preview links when the catalog fits into fewer pages.
for(const [key,page] of [['bisht',2],['all',2],['all',3]]) {
  const relative=collectionUrl(key,page).slice(base.length),file=path.join(out,relative);
  if(!fs.existsSync(file)) {
    const target=collectionUrl(key);
    fs.writeFileSync(file,`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${absolute(target)}"><title>مجموعة مُسدل</title></head><body><a href="${target}">افتح المجموعة</a><script>location.replace(${JSON.stringify(target)})</script></body></html>`);
  }
}

for(const product of collectionProducts) {
  const url=absolute(productUrl(product.id));
  const title=product.name+' | مُسدل';
  const description=product.name+' من مجموعة '+product.category+' لدى مُسدل. اكتشف صور القطعة ولونها وتفاصيلها.';
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'WebPage',name:title,url,description,inLanguage:'ar'},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'الرئيسية',item:absolute(homeUrl)},
      {'@type':'ListItem',position:2,name:product.category,item:absolute(collectionUrl(product.categoryKey))},
      {'@type':'ListItem',position:3,name:product.name,item:url}
    ]}
  ]};
  const metadata='<meta name="description" content="'+escape(description)+'"/><meta name="robots" content="noindex,follow"/><link rel="canonical" href="'+url+'"/><meta property="og:type" content="website"/><meta property="og:locale" content="ar_SA"/><meta property="og:title" content="'+escape(title)+'"/><meta property="og:description" content="'+escape(description)+'"/><meta property="og:url" content="'+url+'"/><meta property="og:image" content="'+absolute(asset('photos/collection/'+product.imageStem+'-800.webp'))+'"/><meta name="twitter:card" content="summary_large_image"/><script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>';
  const html=template.replace(/<title>.*?<\/title>/,'<title>'+escape(title)+'</title>').replace('</head>',metadata+'\n</head>').replace('<div id="root"></div>','<div id="root">'+render(null,1,product.id)+'</div>');
  const relative=productUrl(product.id).slice(base.length);
  fs.mkdirSync(path.dirname(path.join(out,relative)),{recursive:true});
  fs.writeFileSync(path.join(out,relative),html);
}
