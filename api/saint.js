// The Church Atlas — "Anadolu'dan dünyaya azizler": /saints ve /saint/:slug sayfaları (sunucuda üretilir)
// Veri tamamen veritabanından gelir (atlas_saints + atlas_church_saints); yeni aziz eklemek için kod değişikliği gerekmez.
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (anon) anahtar
const SITE='https://thechurchatlas.com';

const DEN={en:{Katolik:'Catholic',Ortodoks:'Orthodox','Oryantal Ortodoks':'Oriental Orthodox','Doğu Kilisesi':'Church of the East',Protestan:'Protestant',Anglikan:'Anglican','Diğer':'Other'},
           tr:{Katolik:'Katolik',Ortodoks:'Ortodoks','Oryantal Ortodoks':'Oryantal Ortodoks','Doğu Kilisesi':'Doğu Kilisesi',Protestan:'Protestan',Anglikan:'Anglikan','Diğer':'Diğer'}};
const UI={
  en:{home:'The Church Atlas',all:'All saints',h1All:'Saints of Anatolia',
      introAll:'Many churches around the world are named after saints who were born or lived in Anatolia, today’s Türkiye. Pick a saint to follow the lines from their home town to the churches that bear their name.',
      tail:'from Anatolia to the world',churches:'churches',countries:'countries',feast:'Feast day',
      roles:{birth:'birthplace (by tradition)',bishop:'the city where he served as bishop',death:'place of death',life:'lived here'},
      mapTitle:'Map',mapHint:'Lines run from Anatolia to each church. Tap a dot to open the church.',
      showAll:'Show the whole world',withNote:{peter:'with Saint Peter',barnabas:'with Saint Barnabas'},withStat:{peter:'shared with Saint Peter'},listTitle:'Churches by country',open:'Open the page',
      note:'This map shows only the churches listed in The Church Atlas. Around the world there are many more churches dedicated to this saint. Each church was matched by hand; churches of other saints with a similar name are left out.',
      sources:'Source',ctaTitle:'Missing or mismatched church?',cta:'Open the map, find the church and send a correction from its page.',ctaLink:'Open the map',
      origins:'Where the story begins'},
  tr:{home:'The Church Atlas',all:'Tüm azizler',h1All:'Anadolu’nun azizleri',
      introAll:'Dünyadaki pek çok kilise, Anadolu’da doğmuş ya da yaşamış azizlerin adını taşır. Bir aziz seçin; memleketinden, adını taşıyan kiliselere uzanan çizgileri izleyin.',
      tail:'Anadolu’dan dünyaya',churches:'kilise',countries:'ülke',feast:'Yortu günü',
      roles:{birth:'doğum yeri (geleneğe göre)',bishop:'piskoposluk yaptığı kent',death:'öldüğü yer',life:'yaşadığı yer'},
      mapTitle:'Harita',mapHint:'Çizgiler Anadolu’dan her kiliseye uzanır. Kiliseyi açmak için noktaya dokunun.',
      showAll:'Tüm dünyayı göster',withNote:{peter:'Petrus’la birlikte',barnabas:'Barnabas’la birlikte'},withStat:{peter:'Petrus’la ortak'},listTitle:'Ülkelere göre kiliseler',open:'Sayfayı aç',
      note:'Bu harita yalnızca The Church Atlas’ta kayıtlı kiliseleri gösterir. Dünyada bu azize adanmış çok daha fazla kilise vardır. Her kilise elle eşleştirilmiştir; benzer adlı başka azizlerin kiliseleri listeye alınmamıştır.',
      sources:'Kaynak',ctaTitle:'Eksik ya da yanlış eşleşmiş bir kilise mi var?',cta:'Haritayı açın, kiliseyi bulun ve sayfasından düzeltme gönderin.',ctaLink:'Haritayı aç',
      origins:'Hikâyenin başladığı yer'}
};

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const httpsUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch(e){return null}};
const pickLang=q=>{const c=String(q||'').toLowerCase().split('-')[0];return UI[c]?c:'en'};
const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};
const jsonSafe=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
// Veritabanında şehirler Türkçe kayıtlı; İngilizce sayfada yaygın İngilizce adları gösterilir
const CITY={en:{'sakız':'Chios','sisam':'Samos','selanik':'Thessaloniki','istanbul':'Istanbul','i̇stanbul':'Istanbul','roma':'Rome','florans':'Florence','venedik':'Venice',
  'napoli':'Naples','milano':'Milan','moskova':'Moscow','kişinev':'Chișinău','praha':'Prague','köln':'Cologne','san jose':'San Jose','atina':'Athens','viyana':'Vienna',
  'kudüs':'Jerusalem','sivastopol':'Sevastopol','lizbon':'Lisbon','varşova':'Warsaw','budapeşte':'Budapest','bükreş':'Bucharest','belgrad':'Belgrade','sofya':'Sofia','brüksel':'Brussels','cenevre':'Geneva'},
  tr:{'san jose':'San Jose','praha':'Prag'}};
const cityName=(c,lang)=>{const k=String(c||'').trim().toLocaleLowerCase('tr');return (CITY[lang]&&CITY[lang][k])||String(c||'').trim()};
const tx=(o,lang)=>(o&&typeof o==='object'&&(o[lang]||o.en||o.tr))||'';

async function rest(path){
  const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  if(!r.ok)throw new Error('supabase '+r.status);
  return r.json();
}
function countryName(code,fallback,lang){
  code=String(code||'').toUpperCase();
  if(code){try{const n=new Intl.DisplayNames([lang],{type:'region'}).of(code);if(n&&n!==code)return n}catch(e){}}
  return fallback||code||'';
}
function feastText(md,lang){
  const m=/^(\d{2})-(\d{2})$/.exec(String(md||''));if(!m)return '';
  try{return new Intl.DateTimeFormat(lang,{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2000,Number(m[1])-1,Number(m[2]))))}catch(e){return ''}
}
// Geçerli çıkış noktaları; çizgiler "doğum yeri" dışındaki ilk noktadan (yoksa ilkinden) çıkar
function originsOf(s){
  const list=(Array.isArray(s.origin_places)?s.origin_places:[]).map(o=>({name:String(o&&o.name||''),role:String(o&&o.role||''),lat:num(o&&o.lat),lng:num(o&&o.lng)}))
    .filter(o=>o.name&&o.lat!==null&&o.lng!==null&&Math.abs(o.lat)<=90&&Math.abs(o.lng)<=180);
  const hub=list.find(o=>o.role!=='birth')||list[0]||null;
  return {list,hub};
}

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:860px;margin:0 auto;padding:20px 18px 56px}nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem;flex-wrap:wrap}'
+'a{color:#2563eb}h1{font-size:1.75rem;line-height:1.25;color:#0f172a;margin:14px 0 6px}h2{font-size:1.15rem;color:#0f172a;margin:30px 0 8px}h3{font-size:1rem;color:#0f172a;margin:22px 0 6px}'
+'.stats{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px}.stat{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:8px 14px;font-size:.9rem}.stat b{color:#0f172a;font-size:1.15rem;margin-right:4px}'
+'.origins{list-style:none;padding:0;margin:6px 0 0}.origins li{margin:2px 0}.star{color:#b45309}'
+'#map{height:440px;border-radius:14px;border:1px solid #e2e8f0;background:#e2e8f0;margin-top:8px;z-index:0}.hint{font-size:.82rem;color:#64748b;margin:6px 0 0}#map-all{font:inherit;font-size:.82rem;margin-left:6px;padding:3px 10px;border-radius:999px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;cursor:pointer}'
+'.ray{stroke-dasharray:5 9;animation:flow 26s linear infinite}@keyframes flow{to{stroke-dashoffset:-280}}@media (prefers-reduced-motion:reduce){.ray{animation:none}}'
+'.hub{font-size:22px;line-height:22px;color:#b45309;text-shadow:0 0 3px #fff,0 0 3px #fff}'
+'.rows{list-style:none;padding:0;margin:0;background:#fff;border:1px solid #e2e8f0;border-radius:14px}.rows li{padding:9px 14px;border-top:1px solid #f1f5f9;display:flex;gap:10px;justify-content:space-between;align-items:baseline;flex-wrap:wrap}.rows li:first-child{border-top:0}'
+'.rows a{color:#0f172a;font-weight:600;text-decoration:none}.rows a:hover{text-decoration:underline}.place{color:#64748b;font-size:.85rem}'
+'.badge.with{background:#fef3c7;color:#92400e;text-transform:none}.badge{display:inline-block;font-size:.66rem;font-weight:700;padding:2px 8px;border-radius:12px;background:#e2e8f0;color:#334155;text-transform:uppercase;margin-left:6px}'
+'.note{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:10px 14px;font-size:.88rem;margin-top:18px}'
+'.card{display:block;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;margin:12px 0;text-decoration:none;color:inherit}.card strong{color:#0f172a;font-size:1.05rem}.card span{display:block;font-size:.88rem;color:#64748b}'
+'.cta{background:#0f172a;color:#fff;border-radius:14px;padding:16px 18px;margin-top:28px}.cta a{color:#fff;font-weight:600}.cta p{margin:6px 0 0}'
+'.src{font-size:.8rem;color:#64748b;margin-top:14px}footer{margin-top:36px;font-size:.78rem;color:#94a3b8}';

function page({title,desc,lang,canonical,ld,body,robots,head}){
  return '<!DOCTYPE html>\n<html lang="'+lang+'">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="'+(robots||'index,follow')+'">\n'
  +(canonical?'<link rel="canonical" href="'+esc(canonical)+'">\n<link rel="alternate" hreflang="en" href="'+esc(canonical)+'?lang=en">\n<link rel="alternate" hreflang="tr" href="'+esc(canonical)+'?lang=tr">\n<link rel="alternate" hreflang="x-default" href="'+esc(canonical)+'">\n':'')
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +(canonical?'<meta property="og:url" content="'+esc(canonical)+'">\n':'')+'<meta property="og:image" content="'+SITE+'/og-image.png">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#0f172a">\n'
  +'<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'+(head||'')+'<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+jsonSafe(ld)+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';
}
const langNav=(path,lang)=>'<span>'+['en','tr'].map(l=>l===lang?'<strong>'+l.toUpperCase()+'</strong>':'<a href="'+path+'?lang='+l+'" hreflang="'+l+'">'+l.toUpperCase()+'</a>').join(' · ')+'</span>';
const FOOT='<footer>Locations and names: &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> contributors, <a href="https://opendatacommons.org/licenses/odbl/" rel="noopener">ODbL</a></footer>';

// Harita betiği: kavisli çizgiler çıkış noktasından her kiliseye uzanır
function mapScript(){
  return '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>\n<script>(function(){try{'
  +'var D=JSON.parse(document.getElementById("saint-data").textContent);if(!window.L||!D.hub)return;'
  +'var map=L.map("map",{scrollWheelZoom:false,worldCopyJump:true,zoomSnap:0.5});map.on("click",function(){map.scrollWheelZoom.enable()});'
  +'L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:\'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opendatacommons.org/licenses/odbl/">ODbL</a>\'}).addTo(map);'
  +'function arc(a,b){var dx=b[0]-a[0],dy=b[1]-a[1],k=0.18,ox=-dy*k,oy=dx*k;if(ox<0){ox=-ox;oy=-oy}var c=[(a[0]+b[0])/2+ox,(a[1]+b[1])/2+oy],p=[],n=36;'
  +'for(var i=0;i<=n;i++){var t=i/n,u=1-t;p.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]])}return p}'
  +'function h(s){return String(s==null?"":s).replace(/[&<>"\']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;","\'":"&#39;"}[c]})}'
  +'var hub=[D.hub.lat,D.hub.lng],pts=[hub];'
  +'D.churches.forEach(function(c){var q=[c.lat,c.lng];pts.push(q);'
  +'if(Math.abs(q[0]-hub[0])+Math.abs(q[1]-hub[1])>0.02)L.polyline(arc(hub,q),{color:"#b45309",weight:1.3,opacity:.55,className:"ray",interactive:false}).addTo(map);'
  +'L.circleMarker(q,{radius:5,color:"#fff",weight:1.5,fillColor:"#2563eb",fillOpacity:.95}).addTo(map).bindPopup("<strong>"+h(c.name)+"</strong><br>"+h(c.place)+\'<br><a href="\'+h(c.url)+\'">\'+h(D.open)+" →</a>")});'
  +'D.origins.forEach(function(o){pts.push([o.lat,o.lng]);L.marker([o.lat,o.lng],{icon:L.divIcon({className:"hub",html:"★",iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:1000,title:o.name}).addTo(map).bindPopup("<strong>"+h(o.name)+"</strong><br>"+h(o.label))});'
  // Açılışta ana kümeye odaklan: çok uzaktaki birkaç kilise (ör. tek bir ABD kilisesi) haritayı küçültmesin
  +'var near=pts.filter(function(q){return Math.abs(q[1]-hub[1])<=60&&Math.abs(q[0]-hub[0])<=30}),far=pts.length-near.length,main=(far>0&&far<=pts.length*0.15)?near:pts;'
  +'map.fitBounds(L.latLngBounds(main).pad(0.08));'
  +'if(main!==pts){var bt=document.getElementById("map-all");if(bt){bt.hidden=false;bt.onclick=function(){map.fitBounds(L.latLngBounds(pts).pad(0.08));bt.hidden=true}}}'
  +'}catch(e){}})()</script>';
}

function buildSaintPage(s,churches,lang){
  const ui=UI[lang],den=DEN[lang]||DEN.en;
  const name=tx(s.names,lang)||s.slug;
  const story=tx(s.story,lang);
  const {list:origins,hub}=originsOf(s);
  const url=SITE+'/saint/'+s.slug;
  const src='saint-'+s.slug;
  const rows=churches.filter(c=>c&&num(c.lat)!==null&&num(c.lng)!==null).map(c=>({
    id:c.id,name:c.name,lat:num(c.lat),lng:num(c.lng),code:String(c.country_code||'').toUpperCase(),
    country:countryName(c.country_code,c.country,lang),city:cityName(c.city,lang),den:den[c.denomination]||c.denomination||'',
    url:'/church/'+c.id+'?lang='+lang+'&src='+src,
    with:(/^with:([a-z]+)$/.exec(String(c.note||''))||[])[1]||''}));
  // Ülkelere göre grupla: önce kilise sayısı çok olan
  const groups=new Map();
  rows.forEach(r=>{if(!groups.has(r.country))groups.set(r.country,[]);groups.get(r.country).push(r)});
  const coll=new Intl.Collator(lang);
  const ordered=[...groups.entries()].sort((a,b)=>b[1].length-a[1].length||coll.compare(a[0],b[0]));
  ordered.forEach(g=>g[1].sort((a,b)=>coll.compare(a.city,b.city)||coll.compare(a.name,b.name)));
  const list=ordered.map(([country,items])=>'<h3>'+esc(country)+' <span class="place">('+items.length+')</span></h3>\n<ul class="rows">'
    +items.map(r=>'<li><span><a href="'+esc(r.url)+'">'+esc(r.name)+'</a>'+(r.den?'<span class="badge">'+esc(r.den)+'</span>':'')+(r.with&&ui.withNote[r.with]?'<span class="badge with">'+esc(ui.withNote[r.with])+'</span>':'')+'</span><span class="place">'+esc(r.city)+'</span></li>').join('')+'</ul>').join('\n');
  const feast=feastText(s.feast_day,lang);
  const withPeter=rows.filter(r=>r.with==='peter').length;
  const title=name+': '+ui.tail;
  const data={hub,open:ui.open,
    origins:origins.map(o=>({name:o.name,lat:o.lat,lng:o.lng,label:ui.roles[o.role]||''})),
    churches:rows.map(r=>({name:r.name,lat:r.lat,lng:r.lng,place:[r.city,r.country].filter(Boolean).join(', ')+(r.with&&ui.withNote[r.with]?' · '+ui.withNote[r.with]:''),url:r.url}))};
  const sources=(Array.isArray(s.sources)?s.sources:[]).map(httpsUrl).filter(Boolean);
  const ld={'@context':'https://schema.org','@type':'CollectionPage',name:title,url,description:clip(story,300),inLanguage:lang,
    isPartOf:{'@type':'WebSite',name:'The Church Atlas',url:SITE+'/'},
    about:{'@type':'Person',name,...(s.wikidata&&/^Q\d+$/.test(s.wikidata)?{sameAs:'https://www.wikidata.org/wiki/'+s.wikidata}:{})},
    mainEntity:{'@type':'ItemList',numberOfItems:rows.length,itemListElement:rows.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.name,url:SITE+'/church/'+r.id}))}};
  const body='<main>\n<nav><a href="/">'+esc(ui.home)+'</a><a href="/saints?lang='+lang+'">'+esc(ui.all)+'</a>'+langNav('/saint/'+esc(s.slug),lang)+'</nav>\n'
    +'<h1>'+esc(title)+'</h1>\n'
    +'<div class="stats"><span class="stat"><b>'+rows.length+'</b>'+esc(ui.churches)+'</span><span class="stat"><b>'+groups.size+'</b>'+esc(ui.countries)+'</span>'
    +(withPeter?'<span class="stat"><b>'+withPeter+'</b>'+esc(ui.withStat.peter)+'</span>':'')
    +(feast?'<span class="stat">'+esc(ui.feast)+': <b>'+esc(feast)+'</b></span>':'')+'</div>\n'
    +(story?'<p>'+esc(story)+'</p>\n':'')
    +(origins.length?'<h2>'+esc(ui.origins)+'</h2>\n<ul class="origins">'+origins.map(o=>'<li><span class="star">★</span> <strong>'+esc(o.name)+'</strong>'+(ui.roles[o.role]?': '+esc(ui.roles[o.role]):'')+'</li>').join('')+'</ul>\n':'')
    +'<h2>'+esc(ui.mapTitle)+'</h2>\n<div id="map" role="img" aria-label="'+esc(title)+'"></div>\n<p class="hint">'+esc(ui.mapHint)+' <button id="map-all" type="button" hidden>'+esc(ui.showAll)+'</button></p>\n'
    +'<p class="note">'+esc(ui.note)+'</p>\n'
    +'<h2>'+esc(ui.listTitle)+'</h2>\n'+list+'\n'
    +(sources.length?'<p class="src">'+esc(ui.sources)+': '+sources.map(u=>'<a href="'+esc(u)+'" rel="noopener">'+esc(new URL(u).hostname.replace(/^www\./,''))+'</a>').join(', ')+'</p>\n':'')
    +'<div class="cta"><strong>'+esc(ui.ctaTitle)+'</strong><p>'+esc(ui.cta)+' <a href="/?lang='+lang+'&src='+src+'" rel="nofollow">'+esc(ui.ctaLink)+' →</a></p></div>\n'
    +FOOT+'\n</main>\n<script type="application/json" id="saint-data">'+jsonSafe(data)+'</script>\n'+mapScript();
  return page({title:title+' | The Church Atlas',desc:clip(story||title,155),lang,canonical:url,ld,body,
    head:'<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">\n'});
}

function buildIndexPage(saints,lang){
  const ui=UI[lang];
  const cards=saints.map(s=>{const {list}=originsOf(s);
    return '<a class="card" href="/saint/'+esc(s.slug)+'?lang='+lang+'"><strong>'+esc(tx(s.names,lang)||s.slug)+'</strong>'
      +(list.length?'<span>★ '+esc(list.map(o=>o.name).join(' · '))+'</span>':'')+'<span>'+esc(clip(tx(s.story,lang),150))+'</span></a>'}).join('\n');
  const ld={'@context':'https://schema.org','@type':'CollectionPage',name:ui.h1All,url:SITE+'/saints',inLanguage:lang,
    mainEntity:{'@type':'ItemList',itemListElement:saints.map((s,i)=>({'@type':'ListItem',position:i+1,url:SITE+'/saint/'+s.slug}))}};
  const body='<main>\n<nav><a href="/">'+esc(ui.home)+'</a>'+langNav('/saints',lang)+'</nav>\n<h1>'+esc(ui.h1All)+'</h1>\n<p>'+esc(ui.introAll)+'</p>\n'+cards+'\n'+FOOT+'\n</main>';
  return page({title:ui.h1All+' | The Church Atlas',desc:clip(ui.introAll,155),lang,canonical:SITE+'/saints',ld,body});
}

function notFound(res,lang){
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=60');res.setHeader('X-Robots-Tag','noindex');
  return res.status(404).send(page({title:'Not found | The Church Atlas',desc:'Not found',lang,canonical:'',ld:null,robots:'noindex',body:'<main><nav><a href="/saints">'+esc(UI[lang].all)+'</a></nav><h1>404</h1></main>'}));
}

module.exports=async function handler(req,res){
  const q=req.query||{};
  let rawLang=q.lang;
  if(!rawLang){try{rawLang=new URL(req.url||'/',SITE).searchParams.get('lang')}catch(e){}}
  const lang=pickLang(rawLang);
  const slug=String(q.slug||'').toLowerCase();
  res.setHeader('Content-Type','text/html; charset=utf-8');
  try{
    if(!slug){
      const saints=await rest('atlas_saints?select=slug,names,origin_places,story&order=id.asc');
      res.setHeader('Content-Language',lang);
      res.setHeader('Cache-Control','public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
      return res.status(200).send(buildIndexPage(saints,lang));
    }
    if(!/^[a-z0-9-]{1,40}$/.test(slug))return notFound(res,lang);
    const found=await rest('atlas_saints?slug=eq.'+slug+'&select=*&limit=1');
    if(!found.length)return notFound(res,lang);
    const links=await rest('atlas_church_saints?saint_id=eq.'+Number(found[0].id)+'&select=note,atlas_churches(id,name,city,country,country_code,denomination,lat,lng)&limit=2000');
    const churches=links.map(l=>l.atlas_churches?{...l.atlas_churches,note:l.note}:null).filter(Boolean);
    res.setHeader('Content-Language',lang);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(buildSaintPage(found[0],churches,lang));
  }catch(e){
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','text/plain; charset=utf-8');
    return res.status(502).send('Temporarily unavailable');
  }
};
module.exports.buildSaintPage=buildSaintPage;
module.exports.buildIndexPage=buildIndexPage;
module.exports.originsOf=originsOf;
