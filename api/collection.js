// The Church Atlas — koleksiyon sayfaları (sunucuda üretilir): /collections ve /collection/ADRES
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (anon) anahtar
const SITE='https://thechurchatlas.com';

// Koleksiyonlar: her kilise için kısa, doğrulanmış bir not (İngilizce ve Türkçe). Numara = kilisenin haritadaki numarası.
const COLLECTIONS={
  'rome-early-churches':{
    title:{en:'Rome: early churches with layers of history',tr:'Roma: katman katman tarihe sahip erken kiliseler'},
    intro:{en:'Rome\'s oldest churches were rarely built once. Many stand on older buildings, were rebuilt over the centuries and still carry mosaics, doors and foundations from very different eras. Four places to start.',
           tr:'Roma\'nın en eski kiliseleri nadiren tek seferde yapıldı. Çoğu daha eski yapıların üzerinde yükseliyor, yüzyıllar içinde yeniden inşa edildi ve çok farklı çağlardan mozaikleri, kapıları ve temelleri hâlâ taşıyor. Başlamak için dört yer.'},
    items:[
      {id:740,note:{en:'An early Christian basilica built around 422-432 on the Aventine Hill, famous for its carved cypress-wood doors.',tr:'Aventin Tepesi\'nde yaklaşık 422-432 arasında yapılmış erken Hristiyan bazilikası; oyma selvi ağacı kapılarıyla ünlüdür.'}},
      {id:703,note:{en:'A 12th-century church built above a 4th-century basilica, which stands over Roman buildings and a Mithraic temple.',tr:'12. yüzyıldan bir kilise; altında 4. yüzyıldan bir bazilika, onun da altında Roma yapıları ve bir Mithras tapınağı var.'}},
      {id:735,note:{en:'One of the oldest churches in Rome dedicated to Mary, rebuilt around 1140 and known for its apse mosaics.',tr:'Roma\'da Meryem\'e adanmış en eski kiliselerden biri; 1140 dolaylarında yeniden yapıldı, apsis mozaikleriyle tanınır.'}},
      {id:1241,note:{en:'One of Rome\'s four papal major basilicas, first built in the 5th century.',tr:'Roma\'nın dört papalık büyük bazilikasından biri; ilk olarak 5. yüzyılda yapıldı.'}}
    ]},
  'istanbul-three-stories':{
    title:{en:'Istanbul: a holy spring, a Catholic church and a seminary hill',tr:'İstanbul: bir ayazma, bir Katolik kilisesi ve bir ruhban okulu tepesi'},
    intro:{en:'Istanbul\'s churches tell very different stories: Byzantine devotion, Italian Catholic presence in Galata and the Orthodox school on Heybeliada. Three pages to explore.',
           tr:'İstanbul\'un kiliseleri çok farklı hikâyeler anlatır: Bizans\'tan kalma bir bağlılık, Galata\'daki İtalyan Katolik varlığı ve Heybeliada\'daki Ortodoks okulu. Keşfetmek için üç sayfa.'},
    items:[
      {id:502,note:{en:'A small Greek Orthodox church built around a holy spring, on the site of Byzantium\'s famous shrine of the Virgin. The present church dates to 1867.',tr:'Bizans\'ın ünlü Meryem Ana ziyaretgâhının yerinde, ayazmanın çevresine kurulmuş küçük bir Rum Ortodoks kilisesi. Bugünkü kilise 1867\'ye dayanır.'}},
      {id:415,note:{en:'A Catholic church below the Galata Tower, built in 1841-1843 by the Fossati brothers and run by Dominican priests.',tr:'Galata Kulesi\'nin altında, Fossati kardeşlerce 1841-1843\'te yapılmış ve Dominiken rahiplerce yönetilen bir Katolik kilisesi.'}},
      {id:523,note:{en:'The monastery on the Hill of Hope on Heybeliada, which was the main seminary of the Ecumenical Patriarchate until 1971.',tr:'Heybeliada\'da Ümit Tepesi\'ndeki manastır; 1971\'e kadar Fener Rum Patrikhanesi\'nin ana ruhban okuluna ev sahipliği yaptı.'}}
    ]},
  'helsinki-reykjavik':{
    title:{en:'Helsinki and Reykjavík: churches unlike any other',tr:'Helsinki ve Reykjavik: benzersiz kiliseler'},
    intro:{en:'Northern Europe\'s churches often break the mould: one carved out of granite, one in red brick with gilded domes, one inspired by basalt columns. Four contrasting buildings.',
           tr:'Kuzey Avrupa\'nın kiliseleri sık sık kalıpları aşar: biri granite oyulmuş, biri kırmızı tuğla ve yaldızlı kubbelerle, biri bazalt sütunlardan esinlenmiş. Dört farklı yapı.'},
    items:[
      {id:1369,note:{en:'A Lutheran church excavated directly into solid granite, opened in 1969, with a copper dome and about 180 skylights.',tr:'Doğrudan granit kayaya oyulmuş Lutheran kilisesi; 1969\'da açıldı, bakır kubbesi ve yaklaşık 180 ışıklığı var.'}},
      {id:1372,note:{en:'Often called the largest Orthodox church in Western Europe, in red brick with gilded domes, consecrated in 1868.',tr:'Batı Avrupa\'nın en büyük Ortodoks kilisesi olarak anılan, kırmızı tuğlalı ve yaldızlı kubbeli yapı; 1868\'de kutsandı.'}},
      {id:1297,note:{en:'The neoclassical Lutheran cathedral designed by Carl Ludvig Engel and completed in 1852.',tr:'Carl Ludvig Engel\'in tasarladığı ve 1852\'de tamamlanan neoklasik Lutheran katedrali.'}},
      {id:1578,note:{en:'Iceland\'s tallest church, built between 1945 and 1986 and inspired by Iceland\'s basalt columns.',tr:'İzlanda\'nın en yüksek kilisesi; 1945-1986 arasında yapıldı ve İzlanda\'nın bazalt sütunlarından esinlendi.'}}
    ]},
  'anatolia-monasteries-armenian':{
    title:{en:'Anatolia: a cliff monastery, a ruined monastery and an Armenian landmark',tr:'Anadolu: bir kaya manastırı, bir harabe manastır ve bir Ermeni kilisesi'},
    intro:{en:'Three places in eastern Anatolia and the Black Sea region that show how many layers of Christian heritage the region holds, and how fragile it can be.',
           tr:'Doğu Anadolu ve Karadeniz\'de, bölgenin Hristiyan mirasının kaç katmandan oluştuğunu ve ne kadar kırılgan olabildiğini gösteren üç yer.'},
    items:[
      {id:544,note:{en:'A Greek Orthodox monastery built into a cliff about 1,200 m above the Altındere Valley, dedicated to the Virgin Mary.',tr:'Altındere Vadisi\'nin yaklaşık 1200 m üzerinde kayalığa kurulmuş, Meryem Ana\'ya adanmış Rum Ortodoks manastırı.'}},
      {id:539,note:{en:'A partly ruined Armenian monastery near Trabzon, which was the seat of the local Armenian diocese until 1915.',tr:'Trabzon yakınında kısmen harabe hâlde bir Ermeni manastırı; 1915\'e kadar bölgenin Ermeni piskoposluk merkeziydi.'}},
      {id:557,note:{en:'Often described as the largest Armenian church in the Middle East, with seven altars; reopened for worship in 2011 and again in 2022.',tr:'Ortadoğu\'nun en büyük Ermeni kilisesi olarak anılır, yedi mihrabı vardır; 2011\'de ve 2022\'de yeniden ibadete açıldı.'}}
    ]}
};
const ORDER=Object.keys(COLLECTIONS);
const DEN={en:{Katolik:'Catholic',Ortodoks:'Orthodox','Oryantal Ortodoks':'Oriental Orthodox','Doğu Kilisesi':'Church of the East',Protestan:'Protestant',Anglikan:'Anglican','Diğer':'Other'},
           tr:{Katolik:'Katolik',Ortodoks:'Ortodoks','Oryantal Ortodoks':'Oryantal Ortodoks','Doğu Kilisesi':'Doğu Kilisesi',Protestan:'Protestan',Anglikan:'Anglikan','Diğer':'Diğer'}};
const UI={
  en:{h1All:'Collections',introAll:'Hand-picked groups of churches, each with a short, sourced note. Open a church to see its full page, photos and history.',open:'Open the page',more:'All collections',home:'The Church Atlas',
      ctaTitle:'Know these places?',cta:'If you have a photo or a correction for one of these churches, open its page and add it. Contributions are reviewed and credited by name.',ctaLink:'Open the map',churchesWord:'churches',photoBy:'Photo:'},
  tr:{h1All:'Koleksiyonlar',introAll:'Elle seçilmiş kilise grupları, her biri için kısa ve kaynaklı bir notla. Tam sayfa, fotoğraf ve tarihçe için kiliseyi açın.',open:'Sayfayı aç',more:'Tüm koleksiyonlar',home:'The Church Atlas',
      ctaTitle:'Bu yerleri biliyor musunuz?',cta:'Bu kiliselerden biri için fotoğrafınız ya da bir düzeltmeniz varsa, sayfasını açıp ekleyin. Katkılar incelenir ve adınızla yayınlanır.',ctaLink:'Haritayı aç',churchesWord:'kilise',photoBy:'Fotoğraf:'}
};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const httpsUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch(e){return null}};
const pickLang=q=>{const c=String(q||'').toLowerCase().split('-')[0];return UI[c]?c:'en'};
const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};
const jsonLd=o=>JSON.stringify(o).replace(/</g,'\\u003c');

async function rest(path){
  const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  if(!r.ok)throw new Error('supabase '+r.status);
  return r.json();
}
function placeOf(c,lang){
  let country=c.country||'';
  const code=String(c.country_code||'').toUpperCase();
  if(code){try{const n=new Intl.DisplayNames([lang],{type:'region'}).of(code);if(n&&n!==code)country=n}catch(e){}}
  return [c.city,c.region&&c.region!==c.city?c.region:'',country].filter(Boolean).join(', ');
}

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:760px;margin:0 auto;padding:20px 18px 56px}nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem}'
+'a{color:#2563eb}h1{font-size:1.7rem;line-height:1.25;color:#0f172a;margin:14px 0 8px}h2{font-size:1.1rem;color:#0f172a;margin:30px 0 8px}'
+'.card{display:flex;gap:14px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:12px;margin:12px 0;align-items:flex-start}'
+'.card img{width:110px;height:110px;object-fit:cover;border-radius:10px;background:#e2e8f0;flex:none}.thumb-empty{width:110px;height:110px;border-radius:10px;background:#e2e8f0;flex:none;display:flex;align-items:center;justify-content:center;font-size:2rem}'
+'.card h3{margin:0 0 2px;font-size:1.05rem}.card h3 a{color:#0f172a;text-decoration:none}.badge{display:inline-block;font-size:.68rem;font-weight:700;padding:2px 9px;border-radius:12px;background:#e2e8f0;color:#334155;text-transform:uppercase}'
+'.place{color:#64748b;font-size:.85rem;margin:2px 0 6px}.note{margin:0 0 6px;font-size:.92rem}.credit{font-size:.7rem;color:#94a3b8;margin:0}'
+'.cta{background:#0f172a;color:#fff;border-radius:14px;padding:16px 18px;margin-top:28px}.cta a{color:#fff;font-weight:600}.cta p{margin:6px 0 0}'
+'.more{margin-top:26px;font-size:.9rem}footer{margin-top:36px;font-size:.78rem;color:#94a3b8}';

function page({title,desc,lang,canonical,image,ld,body,robots}){
  return '<!DOCTYPE html>\n<html lang="'+lang+'">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="'+(robots||'index,follow')+'">\n'
  +(canonical?'<link rel="canonical" href="'+esc(canonical)+'">\n':'')
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +(canonical?'<meta property="og:url" content="'+esc(canonical)+'">\n':'')+'<meta property="og:image" content="'+esc(image)+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#0f172a">\n'
  +'<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+jsonLd(ld)+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';
}

function buildCollectionPage(slug,churches,photos,lang){
  const col=COLLECTIONS[slug],ui=UI[lang],den=DEN[lang]||DEN.en;
  const byId=new Map(churches.map(c=>[c.id,c]));
  const photoOf=new Map();
  photos.forEach(p=>{const u=httpsUrl(p.photo_url);if(u&&!photoOf.has(p.church_id))photoOf.set(p.church_id,{url:u,by:p.name})});
  const url=SITE+'/collection/'+slug;
  const cards=col.items.map(it=>{
    const c=byId.get(it.id);if(!c)return '';
    const ph=photoOf.get(it.id);
    const link='/church/'+it.id+'?lang='+lang+'&src=collection';
    return '<div class="card">'
      +(ph?'<img loading="lazy" src="'+esc(ph.url)+'" alt="'+esc(c.name)+'">':'<div class="thumb-empty" aria-hidden="true">⛪</div>')
      +'<div><h3><a href="'+esc(link)+'">'+esc(c.name)+'</a></h3><span class="badge">'+esc(den[c.denomination]||c.denomination||'')+'</span>'
      +'<p class="place">'+esc(placeOf(c,lang))+'</p><p class="note">'+esc(it.note[lang]||it.note.en)+'</p>'
      +(ph?'<p class="credit">'+esc(ui.photoBy)+' '+esc(ph.by)+'</p>':'')
      +'<a href="'+esc(link)+'">'+esc(ui.open)+' →</a></div></div>';
  }).join('');
  const items=col.items.filter(it=>byId.has(it.id));
  const firstPhoto=items.map(it=>photoOf.get(it.id)).find(Boolean);
  const title=col.title[lang]||col.title.en;
  const intro=col.intro[lang]||col.intro.en;
  const ld={'@context':'https://schema.org','@type':'CollectionPage',name:title,url,description:clip(intro,300),inLanguage:lang,
    isPartOf:{'@type':'WebSite',name:'The Church Atlas',url:SITE+'/'},
    mainEntity:{'@type':'ItemList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,url:SITE+'/church/'+it.id}))}};
  const body='<main>\n<nav><a href="/">'+esc(ui.home)+'</a><a href="/collections?lang='+lang+'">'+esc(ui.more)+'</a></nav>\n<h1>'+esc(title)+'</h1>\n<p>'+esc(intro)+'</p>\n'+cards
    +'<div class="cta"><strong>'+esc(ui.ctaTitle)+'</strong><p>'+esc(ui.cta)+' <a href="/?lang='+lang+'&src=collection-cta">'+esc(ui.ctaLink)+' →</a></p></div>\n'
    +'<p class="more"><a href="/collections?lang='+lang+'">'+esc(ui.more)+'</a></p>\n<footer>Locations and names: &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> contributors, <a href="https://opendatacommons.org/licenses/odbl/" rel="noopener">ODbL</a></footer>\n</main>';
  return page({title:title+' | The Church Atlas',desc:clip(intro,155),lang,canonical:url,image:firstPhoto?firstPhoto.url:SITE+'/og-image.png',ld,body});
}

function buildIndexPage(lang){
  const ui=UI[lang];
  const list=ORDER.map(slug=>{const c=COLLECTIONS[slug];
    return '<div class="card"><div class="thumb-empty" aria-hidden="true">⛪</div><div><h3><a href="/collection/'+slug+'?lang='+lang+'">'+esc(c.title[lang]||c.title.en)+'</a></h3>'
      +'<p class="note">'+esc(clip(c.intro[lang]||c.intro.en,170))+'</p><p class="credit">'+c.items.length+' '+esc(ui.churchesWord)+'</p></div></div>'}).join('');
  const body='<main>\n<nav><a href="/">'+esc(ui.home)+'</a><span></span></nav>\n<h1>'+esc(ui.h1All)+'</h1>\n<p>'+esc(ui.introAll)+'</p>\n'+list+'\n</main>';
  const ld={'@context':'https://schema.org','@type':'CollectionPage',name:ui.h1All,url:SITE+'/collections',inLanguage:lang,
    mainEntity:{'@type':'ItemList',itemListElement:ORDER.map((slug,i)=>({'@type':'ListItem',position:i+1,url:SITE+'/collection/'+slug}))}};
  return page({title:ui.h1All+' | The Church Atlas',desc:clip(ui.introAll,155),lang,canonical:SITE+'/collections',image:SITE+'/og-image.png',ld,body});
}

module.exports=async function handler(req,res){
  const q=req.query||{};
  let rawLang=q.lang;
  if(!rawLang){try{rawLang=new URL(req.url||'/',SITE).searchParams.get('lang')}catch(e){}}
  const lang=pickLang(rawLang);
  const slug=String(q.slug||'');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  if(!slug){
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(buildIndexPage(lang));
  }
  if(!Object.prototype.hasOwnProperty.call(COLLECTIONS,slug)){
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60');res.setHeader('X-Robots-Tag','noindex');
    return res.status(404).send(page({title:'Not found | The Church Atlas',desc:'Not found',lang,canonical:'',image:SITE+'/og-image.png',ld:null,robots:'noindex',body:'<main><nav><a href="/collections">Collections</a></nav><h1>404</h1></main>'}));
  }
  try{
    const ids=COLLECTIONS[slug].items.map(i=>i.id).join(',');
    const [churches,photos]=await Promise.all([
      rest('atlas_churches?id=in.('+ids+')&select=id,name,city,region,country,country_code,denomination'),
      rest('atlas_contributions?church_id=in.('+ids+')&status=eq.approved&photo_url=not.is.null&select=church_id,name,photo_url&order=created_at.desc')
    ]);
    res.setHeader('Content-Language',lang);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(buildCollectionPage(slug,churches,photos,lang));
  }catch(e){
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.status(502).send('Temporarily unavailable');
  }
};
module.exports.buildCollectionPage=buildCollectionPage;
module.exports.buildIndexPage=buildIndexPage;
module.exports.COLLECTIONS=COLLECTIONS;
