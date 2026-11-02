// The Church Atlas — Yedi Kilise rotası (/seven-churches): Vahiy'in yedi cemaati, günümüz Türkiye'sindeki yerleriyle
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (publishable/anon) anahtar
const SITE='https://thechurchatlas.com';

// Duraklar: Vahiy 2-3 mektupları ve sira (id'ler atlas_churches kayitlari)
const STOPS=[
 {id:4804,ref:'Rev 2:1-7',note:{
   en:'The letter praises the congregation\'s toil and endurance, but says they have abandoned their first love; the call is to remember and repent. The stop is the Church of Mary in Ephesus, a large basilica where the Council of 431 met.',
   tr:'Mektup cemaatin emeğini ve dayanıklılığını över ama ilk sevgilerini bıraktıklarını söyler; çağrı hatırlayıp tövbe etmektir. Durak, 431 Konsili\'nin toplandığı büyük bazilika Efes Meryem Kilisesi\'dir.'}},
 {id:4805,ref:'Rev 2:8-11',note:{
   en:'To a congregation in persecution and poverty — "but you are rich" — the letter calls for faithfulness unto death. The stop is ancient Smyrna, at the heart of today\'s İzmir.',
   tr:'Mektup, yoksulluk ve baskı içindeki — "ama gerçekte zengin" — cemaate ölümüne sadık kalma çağrısı yapar. Durak, bugünkü İzmir\'in merkezindeki antik Smyrna kentidir.'}},
 {id:4806,ref:'Rev 2:12-17',note:{
   en:'Written to the congregation in the city "where Satan\'s throne is"; the faithful witness Antipas is remembered. The stop is Pergamon, a UNESCO World Heritage Site above modern Bergama.',
   tr:'"Şeytan\'ın tahtının bulunduğu" kentteki cemaate yazılır; sadık tanık Antipas anılır. Durak, bugünkü Bergama\'nın üzerinde yükselen, UNESCO Dünya Mirası Pergamon\'dur.'}},
 {id:4807,ref:'Rev 2:18-29',note:{
   en:'The letter praises love, faith, service and patient endurance, but rebukes tolerance of false teaching. The stop is Thyatira, whose remains lie in today\'s Akhisar.',
   tr:'Mektup sevgi, iman, hizmet ve sabrı över ama yanlış öğretiye gösterilen hoşgörüyü kınar. Durak, kalıntıları bugünkü Akhisar\'da bulunan Thyatira\'dır.'}},
 {id:4808,ref:'Rev 3:1-6',note:{
   en:'"You have the reputation of being alive, but you are dead" — the letter calls the congregation to wake up. The stop is Sardis, the archaeological site at Sart near Salihli.',
   tr:'"Yaşadığın söyleniyor, ama ölüsün" — mektup cemaati uyanıp hatırlamaya çağırır. Durak, Salihli\'ye bağlı Sart\'taki Sardis arkeolojik alanıdır.'}},
 {id:4809,ref:'Rev 3:7-13',note:{
   en:'To a congregation with "little power" that has kept the word, the letter promises an open door and to be kept from the trial. The stop is Philadelphia, today\'s Alaşehir.',
   tr:'Gücü az ama sözü tutan cemaate mektup, açık bir kapı ve imtihandan korunma vaat eder. Durak, Filadelfya — bugünkü Alaşehir\'dir.'}},
 {id:4810,ref:'Rev 3:14-22',note:{
   en:'"Neither cold nor hot" — the famous warning to the lukewarm congregation of Laodicea. The stop is Laodikeia, the extensive archaeological site near Denizli.',
   tr:'"Ne soğuk ne sıcak" — Laodikya\'nın ılık cemaatine ünlü uyarı. Durak, Denizli yakınındaki geniş arkeolojik alan Laodikeia\'dır.'}}
];
const IDS=STOPS.map(s=>s.id);
const DEN={en:{'Erken Hristiyanlık':'Early Christianity'},tr:{'Erken Hristiyanlık':'Erken Hristiyanlık'}};
const UI={
  en:{h1:'The Seven Churches of Revelation',sub:'Vahiy\'in Yedi Kilisesi',
      intro:'Revelation 2-3 contain letters to seven congregations of the Roman province of Asia — all of them in today\'s Turkey. This route pairs each letter with its city and a page on this site.',
      open:'Open the page',cityIn:'All churches in',photoBy:'Photo:',other:'Türkçe'},
  tr:{h1:'Vahiy\'in Yedi Kilisesi',sub:'The Seven Churches of Revelation',
      intro:'Vahiy Kitabı\'nın 2-3. bölümlerinde, Roma döneminde Asya eyaletindeki yedi cemaate mektuplar yazılır — yedinin hepsi bugünkü Türkiye\'dedir. Bu rota her mektubu, kenti ve sitemizdeki sayfasıyla buluşturur.',
      open:'Sayfayı aç',cityIn:'Tüm kiliseler:',photoBy:'Fotoğraf:',other:'English'}
};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const httpsUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch(e){return null}};
const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};
const jsonLd=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const pickLang=q=>{const c=String(q||'').toLowerCase().split('-')[0];return UI[c]?c:'en'};
const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'-';

async function rest(path){
  const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  if(!r.ok)throw new Error('supabase '+r.status);
  return r.json();
}

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:760px;margin:0 auto;padding:20px 18px 56px}nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem}'
+'a{color:#2563eb}h1{font-size:1.7rem;line-height:1.25;color:#0f172a;margin:14px 0 2px}h2{font-size:1.1rem;color:#0f172a;margin:30px 0 8px}'
+'.sub{color:#64748b;font-size:1.02rem;margin:0 0 8px}.intro{margin:6px 0 10px}'
+'.card{display:flex;gap:14px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:12px;margin:12px 0;align-items:flex-start}'
+'.card img{width:110px;height:110px;object-fit:cover;border-radius:10px;background:#e2e8f0;flex:none}.thumb-empty{width:110px;height:110px;border-radius:10px;background:#e2e8f0;flex:none;display:flex;align-items:center;justify-content:center;font-size:2rem}'
+'.card h3{margin:0 0 2px;font-size:1.05rem}.card h3 a{color:#0f172a;text-decoration:none}.badge{display:inline-block;font-size:.68rem;font-weight:700;padding:2px 9px;border-radius:12px;background:#e2e8f0;color:#334155;text-transform:uppercase}'
+'.place{color:#64748b;font-size:.85rem;margin:2px 0 6px}.note{margin:0 0 6px;font-size:.92rem}.ref{color:#2563eb;font-size:.78rem;font-weight:600}'
+'.credit{font-size:.7rem;color:#94a3b8;margin:0}footer{margin-top:36px;font-size:.78rem;color:#94a3b8}footer a{margin-right:10px;white-space:nowrap}';

function page({title,desc,lang,canonical,image,ld,body}){
  return '<!DOCTYPE html>\n<html lang="'+lang+'">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="index,follow">\n'
  +'<link rel="canonical" href="'+esc(canonical)+'">\n'
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +'<meta property="og:url" content="'+esc(canonical)+'">\n<meta property="og:image" content="'+esc(image)+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#0f172a">\n'
  +'<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+jsonLd(ld)+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';
}

function buildRoutePage(rows,lang){
  const ui=UI[lang],den=DEN[lang]||DEN.en;
  const byId=new Map(rows.map(c=>[c.id,c]));
  const url=SITE+'/seven-churches';
  const cards=STOPS.map((s,i)=>{
    const c=byId.get(s.id);if(!c)return '';
    const ph=httpsUrl(c.image_url);
    const citySlug=c.city?slugify(c.city):'';
    const link='/church/'+s.id+'?lang='+lang+'&src=route';
    return '<div class="card">'
      +(ph?'<img loading="lazy" src="'+esc(ph)+'" alt="'+esc(c.name)+'">':'<div class="thumb-empty" aria-hidden="true">⛪</div>')
      +'<div><h3><a href="'+esc(link)+'">'+(i+1)+'. '+esc(c.name)+'</a></h3><span class="badge">'+esc(den[c.denomination]||c.denomination||'')+'</span>'
      +'<p class="place">'+esc([c.city,c.region,c.country].filter(Boolean).join(', '))+' · <span class="ref">'+esc(s.ref)+'</span></p>'
      +'<p class="note">'+esc(s.note[lang]||s.note.en)+'</p>'
      +(ph&&c.image_author?'<p class="credit">'+esc(ui.photoBy)+' '+esc(c.image_author)+' · '+esc(c.image_license||'')+'</p>':'')
      +'<a href="'+esc(link)+'">'+esc(ui.open)+' →</a>'
      +(citySlug&&citySlug!=='-'?' · <a href="/churches-in/'+citySlug+'">'+esc(ui.cityIn)+' '+esc(c.city)+'</a>':'')
      +'</div></div>';
  }).join('');
  const firstPhoto=STOPS.map(s=>byId.get(s.id)).map(c=>c&&httpsUrl(c.image_url)).find(Boolean);
  const title=ui.h1;
  const ld={'@context':'https://schema.org','@type':'CollectionPage',name:title,url,description:clip(ui.intro,300),inLanguage:lang,
    isPartOf:{'@type':'WebSite',name:'The Church Atlas',url:SITE+'/'},
    mainEntity:{'@type':'ItemList',itemListElement:STOPS.map((s,i)=>({'@type':'ListItem',position:i+1,url:SITE+'/church/'+s.id}))}};
  const body='<main>\n<nav><a href="/">'+esc(UI.en.home||'The Church Atlas')+'</a><a href="/seven-churches?lang='+(lang==='tr'?'en':'tr')+'">'+esc(ui.other)+'</a></nav>\n'
  +'<h1>'+esc(title)+'</h1>\n<p class="sub">'+esc(ui.sub)+'</p>\n<p class="intro">'+esc(ui.intro)+'</p>\n'+cards
  +'<footer><a href="/seven-churches?lang=tr">Yedi Kilise Rotası</a><a href="/seven-churches?lang=en">Seven Churches Route</a>'
  +'<p class="credit">Locations and names: &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> contributors, <a href="https://opendatacommons.org/licenses/odbl/" rel="noopener">ODbL</a></p></footer>\n</main>';
  return page({title:title+' | The Church Atlas',desc:clip(ui.intro,155),lang,canonical:url,image:firstPhoto||SITE+'/og-image.png',ld,body});
}

module.exports=async function handler(req,res){
  const q=req.query||{};
  let rawLang=q.lang;
  if(!rawLang){try{rawLang=new URL(req.url||'/',SITE).searchParams.get('lang')}catch(e){}}
  const lang=pickLang(rawLang);
  try{
    const rows=await rest('atlas_churches?id=in.('+IDS.join(',')+')&select=id,name,city,region,country,country_code,denomination,image_url,image_author,image_license');
    if(rows.length<IDS.length)throw new Error('eksik kayit');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Language',lang);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(buildRoutePage(rows,lang));
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.status(502).send('Temporarily unavailable');
  }
};
module.exports.buildRoutePage=buildRoutePage;
