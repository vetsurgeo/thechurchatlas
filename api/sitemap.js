// The Church Atlas — kiliselerin site haritası (sunucuda üretilir): /sitemap-churches.xml
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';
const SITE='https://thechurchatlas.com';

module.exports=async function handler(req,res){
  try{
    const rows=[];
    for(let off=0;off<50000;off+=1000){
      const r=await fetch(SUPABASE_URL+'/rest/v1/atlas_churches?select=id,image_url&order=id.asc&limit=1000&offset='+off,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
      if(!r.ok)throw new Error('supabase '+r.status);
      const batch=await r.json();
      rows.push(...batch);
      if(batch.length<1000)break;
    }
    const dbImg={};rows.forEach(x=>{const u=String(x.image_url||'');if(/^https:/.test(u))dbImg[x.id]=u});
    const photos={};   // church_id -> [https url] (ziyaretçi fotolari)
    for(let off=0;off<50000;off+=1000){
      const r=await fetch(SUPABASE_URL+'/rest/v1/atlas_contributions?status=eq.approved&select=church_id,photo_url&order=church_id.asc&limit=1000&offset='+off,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
      if(!r.ok)break;
      const batch=await r.json();
      batch.forEach(x=>{const u=String(x.photo_url||'');if(/^https:/.test(u)){(photos[x.church_id]=photos[x.church_id]||[]).push(u)}});
      if(batch.length<1000)break;
    }
    const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
      +rows.map(x=>'  <url><loc>'+SITE+'/church/'+x.id+'</loc>'+((photos[x.id]||[]).concat(dbImg[x.id]?[dbImg[x.id]]:[])).slice(0,5).map(u=>'<image:image><image:loc>'+u.replace(/&/g,'&')+'</image:loc></image:image>').join('')+'</url>').join('\n')+'\n</urlset>\n';
    res.setHeader('Content-Type','application/xml; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(502).send('Temporarily unavailable');
  }
};
