// The Church Atlas — şehir hub sayfası: /cities
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';
const SITE='https://thechurchatlas.com';

const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'-';
const esc=s=>String(s==null?'':s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"').replace(/'/g,'&#39;');

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:720px;margin:0 auto;padding:20px 18px 56px}'
+'nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem}'
+'h1{margin:.2rem 0 .4rem}'
+'p.count{color:#64748b;margin-bottom:1rem}'
+'ul.cities{list-style:none;padding:0;columns:2;column-gap:24px}'
+'ul.cities li{margin:.35rem 0;break-inside:avoid}'
+'a{color:#1d4ed8;text-decoration:none}a:hover{text-decoration:underline}'
+'footer{margin-top:2.5rem;font-size:.85rem;color:#64748b}';

const page=({title,desc,ld,body})=>'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
  +'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="index,follow">\n'
  +'<link rel="canonical" href="'+SITE+'/cities">\n'
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +'<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
  +'<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';

module.exports=async function handler(req,res){
  try{
    const rows=[];
    for(let off=0;off<50000;off+=1000){
      const r=await fetch(SUPABASE_URL+'/rest/v1/atlas_churches?select=city,country_code&city=not.is.null&order=id.asc&limit=1000&offset='+off,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
      if(!r.ok)throw new Error('supabase '+r.status);
      const batch=await r.json();
      rows.push(...batch);
      if(batch.length<1000)break;
    }
    const byBase={};   // base slug -> Set(ulke)
    const agg={};      // slug -> {city, cc, n}
    for(const r of rows){
      const base=slugify(r.city);
      if(!byBase[base])byBase[base]=new Set();
      byBase[base].add(r.country_code);
    }
    for(const r of rows){
      const base=slugify(r.city);
      if(!base||base==='-')continue;
      const ccs=byBase[base];
      const key=(ccs.size<=1)?base:base+'-'+String(r.country_code||'xx').toLowerCase();
      if(!agg[key])agg[key]={city:r.city,country_code:r.country_code,n:0};
      agg[key].n++;
    }
    const cities=Object.entries(agg).map(([slug,g])=>({slug,city:g.city,n:g.n})).sort((a,b)=>b.n-a.n);
    const total=cities.reduce((s,x)=>s+x.n,0);
    const title='Churches by city — The Church Atlas';
    const desc='Browse '+cities.length+' cities with '+total+' churches on The Church Atlas — Istanbul, Rome, Helsinki and more.';
    const ld={'@context':'https://schema.org','@type':'ItemList',name:'Churches by city',url:SITE+'/cities',numberOfItems:cities.length,
      itemListElement:cities.slice(0,30).map((x,i)=>({'@type':'ListItem',position:i+1,name:'Churches in '+x.city,url:SITE+'/churches-in/'+x.slug}))};
    const body='<main>\n<nav><a href="/">The Church Atlas</a><a href="/collections">Collections</a><a href="/about.html">About</a></nav>\n'
      +'<h1>Churches by city</h1>\n<p class="count">'+cities.length+' cities · '+total+' churches</p>\n'
      +'<ul class="cities">'+cities.map(x=>'<li><a href="/churches-in/'+x.slug+'">'+esc(x.city)+'</a> <span style="color:#64748b">('+x.n+')</span></li>').join('\n')+'</ul>\n'
      +'<footer><a href="/">The Church Atlas</a> — churches around the world</footer>\n</main>';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=86400, stale-while-revalidate=86400');
    res.status(200).send(page({title,desc,ld,body}));
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(502).send('Temporarily unavailable');
  }
};
