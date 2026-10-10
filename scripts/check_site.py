#!/usr/bin/env python3
"""Dependency-free structural and JavaScript checks for Rook's static site."""
import collections, pathlib, subprocess, sys
from html.parser import HTMLParser

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.elements=[]; self.scripts=[]; self.in_script=False; self.script=''
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.elements.append((tag,attrs))
        if tag=='script' and attrs.get('type','') not in ('application/ld+json','application/json'):
            self.in_script=True; self.script=''
    def handle_data(self,data):
        if self.in_script:self.script+=data
    def handle_endtag(self,tag):
        if tag=='script' and self.in_script:
            self.scripts.append(self.script); self.in_script=False

path=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'index.html')
source=path.read_text(); page=Page(); page.feed(source)
ids=[a['id'] for _,a in page.elements if 'id' in a]; errors=[]
for key,n in collections.Counter(ids).items():
    if n>1:errors.append(f'Duplicate ID: {key}')
for tag,a in page.elements:
    href=a.get('href','')
    if href.startswith('#') and href[1:] and href[1:] not in ids:errors.append(f'Missing anchor: {href}')
    for attr in ['aria-labelledby','aria-describedby','aria-controls']:
        for target in a.get(attr,'').split():
            if target not in ids:errors.append(f'Missing {attr} target: {target}')
    if tag=='img' and 'alt' not in a:errors.append('Image missing alt attribute')
    if tag=='input' and not a.get('id'):errors.append('Input missing ID')
if sum(t=='h1' for t,a in page.elements)!=1:errors.append('Expected exactly one h1')
if not any(t=='meta' and a.get('name')=='viewport' for t,a in page.elements):errors.append('Missing viewport')
if not any(t=='meta' and a.get('name')=='description' for t,a in page.elements):errors.append('Missing description')
if not any(t=='html' and a.get('lang') for t,a in page.elements):errors.append('Missing document language')
for i,script in enumerate(page.scripts):
    result=subprocess.run(['node','--check'],input=script,text=True,capture_output=True)
    if result.returncode:errors.append(f'Script {i}: {result.stderr}')
if errors:
    print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(ids)} unique IDs; fragment and ARIA references; document metadata; {len(page.scripts)} script syntax check(s).')
print('These are source checks, not a substitute for desktop/mobile browser testing.')
