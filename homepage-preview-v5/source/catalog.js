export const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
export const homeUrl = `${import.meta.env.BASE_URL}index.html`;
export const collectionUrl = (key = 'all', page = 1, season = 'all') => `${import.meta.env.BASE_URL}collections/${key === 'all' ? 'index' : key}${season !== 'all' ? `-${season}` : ''}${page > 1 ? `-${page}` : ''}.html`;
export const productUrl = id => `${import.meta.env.BASE_URL}products/${id}.html`;
// Concept catalog carried over from the approved homepage, not live inventory.
export const products = [
  { id:'bisht', name:'بشت سمت أسود بزري ذهبي', category:'البشوت', price:'٢٬٨٠٠', photo:'bisht.png', detail:'bisht-detail.png', color:'أسود', trim:'ذهبي', alt:'بشت سمت أسود بزري ذهبي، فوق ثوب أبيض' },
  { id:'thobe', name:'الثوب السعودي', category:'الثياب والدشاديش', price:'٦٥٠', photo:'thobe.png', detail:'thobe-detail.png', color:'أبيض', alt:'الثوب السعودي الأبيض، من الأمام' },
  { id:'abaya', name:'عباية رواء', category:'العبايات', price:'٨٩٠', photo:'abaya.png', detail:'abaya-detail.png', alternate:'abaya-angle.webp', color:'أسود', alt:'عباية رواء السوداء بقصة منسدلة، من الأمام' },
  { id:'farwa', name:'الفروة الفحمية', category:'الفروات', price:'١٬٩٥٠', photo:'farwa.png', detail:'farwa-detail.png', color:'فحمي', alt:'الفروة الفحمية بتفاصيل حوافها، من الأمام' },
];
// Extra concept pieces let the team review a populated category and pagination.
// Production pricing and material labels must come from verified catalog data.
export const collectionProducts = [
  ...products.map(p=>({...p,name:p.id==='thobe' ? 'ثوب سعودي أبيض' : p.id==='abaya' ? 'عباية رواء سوداء' : p.name,categoryKey:p.id,imageStem:p.id,seasons:p.id==='farwa' ? ['winter'] : p.id==='thobe' ? ['winter','summer','spring'] : p.id==='abaya' ? ['summer','spring'] : ['spring']})),
  {id:'bisht-camel-gold',categoryKey:'bisht',name:'بشت جملي خفيف بزري ذهبي',category:'البشوت',price:'٢٬٤٠٠',imageStem:'bisht-camel-gold',color:'جملي',trim:'ذهبي',weightLabel:'خفيف',seasons:['summer'],alt:'بشت جملي خفيف بزري ذهبي فوق ثوب سعودي أبيض'},
  {id:'bisht-brown-thick-gold',categoryKey:'bisht',name:'بشت شتوي بني سميك بزري ذهبي',category:'البشوت',price:'٢٬٩٥٠',imageStem:'bisht-brown-thick-gold',color:'بني',trim:'ذهبي',weightLabel:'سميك',seasons:['winter'],alt:'بشت شتوي بني سميك بزري ذهبي، من الأمام'},
  {id:'bisht-navy-silver',categoryKey:'bisht',name:'بشت كحلي خفيف بزري فضي',category:'البشوت',price:'٢٬٦٥٠',imageStem:'bisht-navy-silver',color:'كحلي',trim:'فضي',weightLabel:'خفيف',seasons:['spring'],alt:'بشت كحلي خفيف بزري فضي، من الأمام'},
  {id:'bisht-ivory-gold',categoryKey:'bisht',name:'بشت عاجي خفيف بزري ذهبي',category:'البشوت',price:'٢٬٥٠٠',imageStem:'bisht-ivory-gold',color:'عاجي',trim:'ذهبي',weightLabel:'خفيف',seasons:['summer'],alt:'بشت عاجي خفيف بزري ذهبي فوق ثوب أبيض'},
  {id:'bisht-black-thick-gold',categoryKey:'bisht',name:'بشت شتوي أسود سميك بزري ذهبي',category:'البشوت',price:'٣٬١٠٠',imageStem:'bisht-black-thick-gold',color:'أسود',trim:'ذهبي',weightLabel:'سميك',seasons:['winter'],alt:'بشت شتوي أسود سميك بزري ذهبي، من الأمام'},
];
export const seasons = {all:'الكل',winter:'شتوي',summer:'صيفي',spring:'ربيعي'};
export const categoryProducts = (key,season='all') => collectionProducts.filter(p=>(key==='all' || p.categoryKey===key) && (season==='all' || p.seasons.includes(season))); 
export function productIdFromPath(path) {
  const id=path.match(/\/products\/([a-z-]+)\.html$/)?.[1];
  return collectionProducts.some(p=>p.id===id) ? id : null;
}
export const collections = {
  all: { title:'مجموعة مُسدل', description:'بشوت، ثياب، عبايات وفروات. قطع من تراثنا، تختار منها ما يشبهك.', seoTitle:'مجموعة مُسدل | بشوت وثياب وعبايات وفروات', story:'من تراثنا، لكل لحظة.', text:'تجمع مجموعة مُسدل البشوت والثياب السعودية والعبايات والفروات في مكان واحد. اكتشف القطع، تأمل تفاصيلها، واختر ما يناسب يومك ولحظاتك.' },
  bisht: { title:'البشوت', description:'حضور من تراثنا، وتفاصيل تليق بلحظاتك.', seoTitle:'البشوت | مجموعة مُسدل', story:'البشت، حضور يبقى.', text:'في بشوت مُسدل، يلتقي الانسدال الهادئ بتفاصيل الزري. اكتشف البشت الأسود والبني والجملي والكحلي والعاجي، بزري ذهبي أو فضي، وبطابع خفيف أو سميك. تأمّل كل قطعة، واختر حضورًا يشبهك في لحظاتك ومناسباتك.' },
  thobe: { title:'الثياب والدشاديش', description:'قطع تشبه يومك، بروح من تراثنا.', seoTitle:'الثياب السعودية والدشاديش | مجموعة مُسدل', story:'في يومك، وفي لحظاتك.', text:'الثوب السعودي من مُسدل، بلونه الأبيض وقصّته الهادئة، يرافق ذوقك من اليوم العادي إلى المناسبة. اكتشف مجموعة الثياب والدشاديش، وتأمّل تفاصيل الياقة والأكمام، واختر القطعة الأقرب لذوقك.' },
  abaya: { title:'العبايات', description:'انسياب هادئ، وحضور يشبهك.', seoTitle:'العبايات | مجموعة مُسدل', story:'رواء، في كل خطوة.', text:'عبايات مُسدل، بانسدال هادئ وتفاصيل بسيطة تمنح القطعة حضورها. عباية رواء السوداء تترك للقصة مجالًا للتعبير عن ذوقك، في يومك ولحظاتك. اكتشفي العباية من زوايا مختلفة، وتأمّلي تفاصيلها قبل اختيارك.' },
  farwa: { title:'الفروات', description:'روح من إرثنا، لأيامك الباردة.', seoTitle:'الفروات | مجموعة مُسدل', story:'قطعة من إرثنا.', text:'الفروة قطعة من تراثنا تعود إلى أيامنا بطابع مُسدل. اكتشف الفروة الفحمية بلونها الهادئ وتفاصيل حوافها، واختر ما يشبه حضورك في الأيام الباردة. تأمّل القصة من صورها، وتعرّف إلى تفاصيل القطعة أكثر.' },
};
export function pageKeyFromPath(path) {
  const match = path.match(/\/collections\/(index|bisht|thobe|abaya|farwa)(?:-(winter|summer|spring))?(?:-\d+)?\.html$/);
  return match ? (match[1] === 'index' ? 'all' : match[1]) : null;
}

export const seasonFromPath = path => path.match(/\/collections\/(?:index|bisht|thobe|abaya|farwa)-(winter|summer|spring)(?:-\d+)?\.html$/)?.[1] || 'all';
export function collectionInfo(key,season='all') {
  const info=collections[key];
  if(season==='all')return info;
  const suffix={winter:'الشتوية',summer:'الصيفية',spring:'الربيعية'}[season];
  return {...info,title:info.title+' '+suffix,seoTitle:info.title+' '+suffix+' | مُسدل',description:info.title+' '+suffix+' من مُسدل. اكتشف القطع وألوانها وتفاصيلها.',story:info.title+' '+suffix,text:season==='winter' && key==='bisht' ? 'اكتشف البشوت الشتوية من مُسدل، بالأسود والبني وبتفاصيل زري ذهبية. بشوت بطابع نسيج سميك وانسدال هادئ، تختار منها ما يشبه حضورك في الأيام الباردة والمناسبات.' : 'اكتشف '+info.title+' '+suffix+' من مُسدل، وتأمّل ألوان القطع وقصّاتها وتفاصيلها. اختر القطعة التي تشبه ذوقك وترافق لحظاتك.'};
}
