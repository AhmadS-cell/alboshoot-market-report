from pathlib import Path
from html.parser import HTMLParser
import sys
class Robots(HTMLParser):
 def __init__(self):super().__init__();self.found=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag.lower()=='meta' and a.get('name','').lower()=='robots' and 'noindex' in [v.strip() for v in a.get('content','').lower().split(',')]:self.found=True
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
paths=[p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in ['.html','.htm'] and not any(x in p.parts for x in ['.git','node_modules'])]
missing=[]
for p in paths:
 parser=Robots();parser.feed(p.read_text(encoding='utf8'))
 if not parser.found:missing.append(str(p.relative_to(root)))
if missing:print('Missing noindex: '+'; '.join(missing));sys.exit(1)
print('PASS: noindex present in '+str(len(paths))+' served HTML documents')
