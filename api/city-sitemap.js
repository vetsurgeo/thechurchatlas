// The Church Atlas — şehir sayfaları site haritası: /sitemap-cities.xml
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';
const SITE='https://thechurchatlas.com';
const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'-';

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
    const seen=new Set();
    const urls=[];
    const byBase={};
    for(const r of rows){
      const base=slugify(r.city);
      if(!byBase[base])byBase[base]=new Set();
      byBase[base].add(r.country_code);
    }
    for(const [base,ccs] of Object.entries(byBase)){
      if(ccs.size<=1)urls.push(SITE+'/churches-in/'+base);
      else[...ccs].forEach(cc=>urls.push(SITE+'/churches-in/'+base+'-'+String(cc||'xx').toLowerCase()));
    }
    const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      +urls.map(u=>'  <url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>\n';
    res.setHeader('Content-Type','application/xml; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=86400, stale-while-revalidate=86400');
    res.status(200).send(xml);
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(502).send('Temporarily unavailable');
  }
};
