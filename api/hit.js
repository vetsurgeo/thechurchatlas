// The Church Atlas — gizliliğe saygılı ziyaret sayacı (sunucu ucu): POST /api/hit
// IP adresi, çerez ya da kişi kimliği saklanmaz. Yalnızca günlük toplam sayılar artırılır.
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (anon) anahtar

const BOT=/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|java\b|go-http|headless|lighthouse|pingdom|uptime|monitor|scrapy|httpclient|axios|node-fetch/i;
const OK_HOST=h=>h==='thechurchatlas.com'||h==='www.thechurchatlas.com'||h.endsWith('.vercel.app');

module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.status(405).end();return}
  const ua=String(req.headers['user-agent']||'');
  if(!ua||BOT.test(ua)){res.status(204).end();return}            // botlar sayılmaz
  try{
    // Yalnızca kendi sayfalarımızdan gelen istekler (Origin yoksa Referer'a bakılır)
    const h=new URL(String(req.headers.origin||req.headers.referer||'')).hostname;
    if(!OK_HOST(h)){res.status(204).end();return}
  }catch(e){res.status(204).end();return}

  let b=req.body;
  if(typeof b==='string'){try{b=JSON.parse(b)}catch(e){b=null}}
  if(!b||typeof b!=='object'){res.status(204).end();return}

  const device=/ipad|tablet/i.test(ua)?'tablet':/mobi|android|iphone/i.test(ua)?'mobile':'desktop';
  const country=String(req.headers['x-vercel-ip-country']||'').toUpperCase().slice(0,2);   // yalnızca ülke kodu; IP kullanılmaz
  const str=(v,n)=>typeof v==='string'?v.slice(0,n):'';
  const church=Number.isInteger(b.c)&&b.c>0&&b.c<1e9?b.c:null;

  try{
    await fetch(SUPABASE_URL+'/rest/v1/rpc/atlas_hit',{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({p_kind:str(b.k,10),p_church:church,p_lang:str(b.l,5),p_country:country,p_ref:str(b.r,80),p_src:str(b.s,40),p_device:device})
    });
  }catch(e){}
  res.status(204).end();
};
