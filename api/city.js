// The Church Atlas — şehir landing sayfaları: /churches-in/:slug (ör. /churches-in/istanbul)
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';
const SITE='https://thechurchatlas.com';

const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'-';
const esc=s=>String(s==null?'':s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"').replace(/'/g,'&#39;');
const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:720px;margin:0 auto;padding:20px 18px 56px}'
+'nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem}'
+'h1{margin:.2rem 0 .4rem}'
+'.count{color:#64748b;margin-bottom:1rem}'
+'ul.churches{list-style:none;padding:0}'
+'ul.churches li{margin:.45rem 0}'
+'a{color:#1d4ed8;text-decoration:none}a:hover{text-decoration:underline}'
+'footer{margin-top:2.5rem;font-size:.85rem;color:#64748b}';

async function loadAll(){
  const rows=[];
  for(let off=0;off<50000;off+=1000){
    const r=await fetch(SUPABASE_URL+'/rest/v1/atlas_churches?select=id,name,city,country_code&city=not.is.null&order=id.asc&limit=1000&offset='+off,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
    if(!r.ok)throw new Error('supabase '+r.status);
    const batch=await r.json();
    rows.push(...batch);
    if(batch.length<1000)break;
  }
  return rows;
}

function buildCityMap(rows){
  const byBase={};
  for(const r of rows){
    const base=slugify(r.city);
    if(!byBase[base])byBase[base]=new Set();
    byBase[base].add(r.country_code);
  }
  const map={};
  for(const r of rows){
    const base=slugify(r.city);
    const ccs=byBase[base];
    const key=(ccs.size<=1)?base:base+'-'+String(r.country_code||'xx').toLowerCase();
    if(!map[key])map[key]={city:r.city,country_code:r.country_code,churches:[]};
    map[key].churches.push(r);
  }
  return map;
}

const page=({title,desc,canonical,image,ld,body})=>'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
  +'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="index,follow">\n'
  +'<link rel="canonical" href="'+esc(canonical)+'">\n'
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n'
  +'<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +'<meta property="og:url" content="'+esc(canonical)+'">\n<meta property="og:image" content="'+esc(image)+'">\n'
  +'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+esc(title)+'">\n<meta name="twitter:description" content="'+esc(desc)+'">\n<meta name="twitter:image" content="'+esc(image)+'">\n'
  +'<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
  +'<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';

module.exports=async function handler(req,res){
  try{
    const slug=String(req.query.slug||'').toLowerCase().replace(/[^a-z0-9-]/g,'');
    if(!slug)return res.status(404).send('Not found');
    const rows=await loadAll();
    const map=buildCityMap(rows);
    const g=map[slug];
    if(!g||!g.churches.length)return res.status(404).send(page({title:'Not found — The Church Atlas',desc:'Not found',canonical:'',image:SITE+'/og-image.png',ld:null,body:'<main><nav><a href="/">The Church Atlas</a></nav><h1>Not found</h1></main>'}));
    const city=g.city, cc=String(g.country_code||'').toUpperCase();
    let country='';
    try{country=cc?(new Intl.DisplayNames(['en'],{type:'region'}).of(cc)||''):'';}catch(e){}
    const n=g.churches.length;
    const place=[city,country].filter(Boolean).join(', ');
    const url=SITE+'/churches-in/'+slug;
    const title='Churches in '+city+(country?' ('+country+')':'')+' — The Church Atlas';
    const desc=clip('Directory of '+n+' churches in '+place+' — history, photos and map locations on The Church Atlas.',160);
    const list=g.churches.slice(0,300);
    const ld={'@context':'https://schema.org','@type':'ItemList',name:'Churches in '+city,url,
      numberOfItems:n,
      itemListElement:list.slice(0,30).map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,url:SITE+'/church/'+c.id}))};
    const body='<main>\n<nav><a href="/">The Church Atlas</a><a href="/collections">Collections</a><a href="/about.html">About</a></nav>\n'
      +'<h1>Churches in '+esc(city)+'</h1>\n<p class="count">'+n+' '+esc((n===1?'church':'churches')+(country?' in '+esc(place):''))+'</p>\n'
      +'<ul class="churches">'+list.map(c=>'<li><a href="/church/'+c.id+'">'+esc(c.name)+'</a></li>').join('\n')+'</ul>\n'
      +(n>300?'<p>+'+(n-300)+' more churches — see the <a href="/">map</a>.</p>\n':'')
      +'<footer><a href="/">The Church Atlas</a> — churches around the world</footer>\n</main>';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(page({title,desc,canonical:url,image:SITE+'/og-image.png',ld,body}));
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(502).send('Temporarily unavailable');
  }
};
