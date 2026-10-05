export const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
export const homeUrl = `${import.meta.env.BASE_URL}index.html`;
export const collectionUrl = (key = 'all', page = 1) => `${import.meta.env.BASE_URL}collections/${key === 'all' ? 'index' : key}${page > 1 ? `-${page}` : ''}.html`;
export const productUrl = category => `https://ahmads-cell.github.io/alboshoot-market-report/product-page-outline.html?category=${category}#product-start`;
// Concept catalog carried over from the approved homepage, not live inventory.
export const products = [
  { id:'bisht', name:'بشت سمت', category:'البشوت', price:'٢٬٨٠٠', photo:'bisht.png', detail:'bisht-detail.png', alternate:'bisht-angle.webp', color:'أسود · زري ذهبي', alt:'بشت سمت الأسود بحواف زري ذهبية، فوق ثوب أبيض' },
  { id:'thobe', name:'الثوب السعودي', category:'الثياب والدشاديش', price:'٦٥٠', photo:'thobe.png', detail:'thobe-detail.png', color:'أبيض', alt:'الثوب السعودي الأبيض، من الأمام' },
  { id:'abaya', name:'عباية رواء', category:'العبايات', price:'٨٩٠', photo:'abaya.png', detail:'abaya-detail.png', alternate:'abaya-angle.webp', color:'أسود', alt:'عباية رواء السوداء بقصة منسدلة، من الأمام' },
  { id:'farwa', name:'الفروة الفحمية', category:'الفروات', price:'١٬٩٥٠', photo:'farwa.png', detail:'farwa-detail.png', color:'فحمي', alt:'الفروة الفحمية بتفاصيل حوافها، من الأمام' },
];
export const collections = {
  all: { title:'مجموعة مُسدل', description:'بشوت، ثياب، عبايات وفروات. قطع من تراثنا، تختار منها ما يشبهك.', seoTitle:'مجموعة مُسدل | بشوت وثياب وعبايات وفروات', story:'من تراثنا، لكل لحظة.', text:'تجمع مجموعة مُسدل البشوت والثياب السعودية والعبايات والفروات في مكان واحد. اكتشف القطع، تأمل تفاصيلها، واختر ما يناسب يومك ولحظاتك.' },
  bisht: { title:'البشوت', description:'حضور من تراثنا، وتفاصيل تليق بلحظاتك.', seoTitle:'البشوت | مجموعة مُسدل', story:'البشت، حضور يبقى.', text:'في بشوت مُسدل، يلتقي الانسدال الهادئ بتفاصيل الزري. بشت سمت بلونه الأسود وحوافه الذهبية، قطعة تختارها للحظات التي لها مكانة عندك. تأمّل تفاصيل البشت، واختر حضورًا يشبهك في مناسبتك.' },
  thobe: { title:'الثياب والدشاديش', description:'قطع تشبه يومك، بروح من تراثنا.', seoTitle:'الثياب السعودية والدشاديش | مجموعة مُسدل', story:'في يومك، وفي لحظاتك.', text:'الثوب السعودي من مُسدل، بلونه الأبيض وقصّته الهادئة، يرافق ذوقك من اليوم العادي إلى المناسبة. اكتشف مجموعة الثياب والدشاديش، وتأمّل تفاصيل الياقة والأكمام، ثم راجع دليل المقاسات لاختيار القطعة الأقرب لك.' },
  abaya: { title:'العبايات', description:'انسياب هادئ، وحضور يشبهك.', seoTitle:'العبايات | مجموعة مُسدل', story:'رواء، في كل خطوة.', text:'عبايات مُسدل، بانسدال هادئ وتفاصيل بسيطة تمنح القطعة حضورها. عباية رواء السوداء تترك للقصة مجالًا للتعبير عن ذوقك، في يومك ولحظاتك. اكتشفي العباية من زوايا مختلفة، وتأمّلي تفاصيلها قبل اختيارك.' },
  farwa: { title:'الفروات', description:'روح من إرثنا، لأيامك الباردة.', seoTitle:'الفروات | مجموعة مُسدل', story:'قطعة من إرثنا.', text:'الفروة قطعة من تراثنا تعود إلى أيامنا بطابع مُسدل. اكتشف الفروة الفحمية بلونها الهادئ وتفاصيل حوافها، واختر ما يشبه حضورك في الأيام الباردة. تأمّل القصة من صورها، وراجع دليل المقاسات للتعرّف إلى القطعة أكثر.' },
};
export function pageKeyFromPath(path) {
  const match = path.match(/\/collections\/(index|bisht|thobe|abaya|farwa)(?:-\d+)?\.html$/);
  return match ? (match[1] === 'index' ? 'all' : match[1]) : null;
}
