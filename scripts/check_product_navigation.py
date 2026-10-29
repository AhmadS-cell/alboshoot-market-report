"""Regression checks for the report's product entry points and accessory references."""
from pathlib import Path
from html.parser import HTMLParser
import re, sys

ROOT = Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.sections=[]; self.navlinks=[]; self.links=[]; self.images=[]; self.nav=False; self.noindex=False; self.ids=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='section':self.sections.append(a.get('id'))
        if tag=='nav':self.nav=True
        if tag=='a':
            self.links.append(a.get('href',''))
            if self.nav:self.navlinks.append(a.get('href',''))
        if tag=='img':self.images.append(a)
        if tag=='meta' and a.get('name')=='robots':self.noindex='noindex' in a.get('content','')
    def handle_endtag(self, tag):
        if tag=='nav':self.nav=False

def load(path):return (ROOT/path).read_text(encoding='utf8')
files=['index.html','future-textiles-2026-10-16/index.html','accessories-2026-10-29/index.html']
for path in files:
    text=load(path);page=Page(text)
    assert page.noindex, path+' missing noindex'
    assert page.sections[-1]=='sources',path+' sources must be last'
    assert page.navlinks[-1]=='#sources',path+' final contents link must be sources'
    assert len(page.ids)==len(set(page.ids)),path+' duplicate IDs'
    assert page.navlinks==['#'+s for s in page.sections],path+' contents/section order mismatch'
    if path!='accessories-2026-10-29/index.html':
        for i,sid in enumerate(page.sections,1):
            nav=re.search(r'<a[^>]*href="#'+re.escape(sid)+r'"[^>]*>(.*?)</a>',re.search(r'<nav.*?</nav>',text,re.S).group(),re.S)
            assert nav and re.match(rf'{i:02}[. ·]',nav[1]),(path,sid,'contents numbering')
    for link in page.links:
        if link.startswith(('https:','http:','mailto:','tel:')) or not link:continue
        clean=link.split('?')[0].split('#')[0]
        target=(ROOT/Path(path).parent/clean).resolve() if clean else (ROOT/path).resolve()
        if 'approved=5d31d9d' in link or clean.endswith('accessories-2026-10-29/index.html'):
            assert target.is_file(),(path,link,'missing local target')
root=load('index.html');rootpage=Page(root)
packaging=re.search(r'<section[^>]*id="packaging"[^>]*>.*?<h2[^>]*>(.*?)</h2>',root,re.S)
assert packaging and packaging[1].startswith('29 ·'),'packaging heading/contents numbering mismatch'
primary='future-textiles-2026-10-16/index.html?approved=5d31d9d'
assert primary in rootpage.links and root.count(primary)>=2,'primary approved study link missing'
assert root.index('class="products-entry"')<root.index('<main'),'product entry must be above report content'
assert rootpage.sections[1]=='products','product directory must follow overview'
accessories=load('accessories-2026-10-29/index.html');a=Page(accessories)
assert len(a.images)==9,'all nine internet image references must remain available'
assert accessories.count('مرجع مختار للاستلهام</p>')==6,'six selected references required'
assert accessories.count('اقتراح إضافي للمراجعة</p>')==3,'three watch proposals must stay unapproved'
assert all(i.get('alt') and i.get('width') and i.get('height') for i in a.images),'image accessibility/layout dimensions'
assert len([i for i in a.ids if i.startswith('reference-')])==9,'stable reference anchors'
print('PASS: primary product entry, nine references, status labels, noindex, sources-last and ordered navigation')
