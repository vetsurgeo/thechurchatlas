// The Church Atlas — kilise sayfası (sunucuda üretilir)
// /church/ID adresine gelen isteği karşılar. Veriler Supabase'den alınır (herkese açık okuma izni olan veriler).
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (publishable/anon) anahtar
const SITE='https://thechurchatlas.com';

const LANGS=[["tr", "Türkçe"], ["en", "English"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"], ["pt", "Português"], ["nl", "Nederlands"], ["pl", "Polski"], ["ro", "Română"], ["ru", "Русский"], ["uk", "Українська"], ["el", "Ελληνικά"], ["hy", "Հայերեն"], ["ar", "العربية"], ["ja", "日本語"], ["ko", "한국어"], ["zh", "中文"]];
const DEN={"tr": {"Katolik": "Katolik", "Ortodoks": "Ortodoks", "Oryantal Ortodoks": "Oryantal Ortodoks", "Doğu Kilisesi": "Doğu Kilisesi", "Protestan": "Protestan", "Anglikan": "Anglikan", "Diğer": "Diğer"}, "en": {"Katolik": "Catholic", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Oriental Orthodox", "Doğu Kilisesi": "Church of the East", "Protestan": "Protestant", "Anglikan": "Anglican", "Diğer": "Other"}, "es": {"Katolik": "Católica", "Ortodoks": "Ortodoxa", "Oryantal Ortodoks": "Ortodoxa oriental", "Doğu Kilisesi": "Iglesia del Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Otra"}, "fr": {"Katolik": "Catholique", "Ortodoks": "Orthodoxe", "Oryantal Ortodoks": "Orthodoxe orientale", "Doğu Kilisesi": "Église de l'Orient", "Protestan": "Protestante", "Anglikan": "Anglicane", "Diğer": "Autre"}, "de": {"Katolik": "Katholisch", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Orientalisch-orthodox", "Doğu Kilisesi": "Kirche des Ostens", "Protestan": "Protestantisch", "Anglikan": "Anglikanisch", "Diğer": "Andere"}, "it": {"Katolik": "Cattolica", "Ortodoks": "Ortodossa", "Oryantal Ortodoks": "Ortodossa orientale", "Doğu Kilisesi": "Chiesa d'Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Altra"}, "pt": {"Katolik": "Católica", "Ortodoks": "Ortodoxa", "Oryantal Ortodoks": "Ortodoxa oriental", "Doğu Kilisesi": "Igreja do Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Outra"}, "nl": {"Katolik": "Katholiek", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Oriëntaals-orthodox", "Doğu Kilisesi": "Kerk van het Oosten", "Protestan": "Protestants", "Anglikan": "Anglicaans", "Diğer": "Overig"}, "pl": {"Katolik": "Katolicki", "Ortodoks": "Prawosławny", "Oryantal Ortodoks": "Orientalny prawosławny", "Doğu Kilisesi": "Kościół Wschodu", "Protestan": "Protestancki", "Anglikan": "Anglikański", "Diğer": "Inne"}, "ro": {"Katolik": "Catolică", "Ortodoks": "Ortodoxă", "Oryantal Ortodoks": "Ortodoxă orientală", "Doğu Kilisesi": "Biserica Răsăritului", "Protestan": "Protestantă", "Anglikan": "Anglicană", "Diğer": "Altele"}, "ru": {"Katolik": "Католическая", "Ortodoks": "Православная", "Oryantal Ortodoks": "Древневосточная", "Doğu Kilisesi": "Церковь Востока", "Protestan": "Протестантская", "Anglikan": "Англиканская", "Diğer": "Другая"}, "uk": {"Katolik": "Католицька", "Ortodoks": "Православна", "Oryantal Ortodoks": "Давньосхідна", "Doğu Kilisesi": "Церква Сходу", "Protestan": "Протестантська", "Anglikan": "Англіканська", "Diğer": "Інша"}, "el": {"Katolik": "Καθολική", "Ortodoks": "Ορθόδοξη", "Oryantal Ortodoks": "Προχαλκηδόνια", "Doğu Kilisesi": "Εκκλησία της Ανατολής", "Protestan": "Προτεσταντική", "Anglikan": "Αγγλικανική", "Diğer": "Άλλη"}, "hy": {"Katolik": "Կաթոլիկ", "Ortodoks": "Ուղղափառ", "Oryantal Ortodoks": "Արևելյան ուղղափառ", "Doğu Kilisesi": "Արևելքի եկեղեցի", "Protestan": "Բողոքական", "Anglikan": "Անգլիկան", "Diğer": "Այլ"}, "ar": {"Katolik": "كاثوليكية", "Ortodoks": "أرثوذكسية", "Oryantal Ortodoks": "أرثوذكسية شرقية", "Doğu Kilisesi": "كنيسة المشرق", "Protestan": "بروتستانتية", "Anglikan": "أنجليكانية", "Diğer": "أخرى"}, "ja": {"Katolik": "カトリック", "Ortodoks": "正教会", "Oryantal Ortodoks": "東方諸教会", "Doğu Kilisesi": "東方教会", "Protestan": "プロテスタント", "Anglikan": "聖公会", "Diğer": "その他"}, "ko": {"Katolik": "가톨릭", "Ortodoks": "정교회", "Oryantal Ortodoks": "오리엔트 정교회", "Doğu Kilisesi": "동방 교회", "Protestan": "개신교", "Anglikan": "성공회", "Diğer": "기타"}, "zh": {"Katolik": "天主教", "Ortodoks": "东正教", "Oryantal Ortodoks": "东方正统教会", "Doğu Kilisesi": "东方教会", "Protestan": "新教", "Anglikan": "圣公会", "Diğer": "其他"}};
const COMMENTS={"tr": "Ziyaretçi yorumları:", "en": "Visitor comments:", "es": "Comentarios de visitantes:", "fr": "Commentaires des visiteurs :", "de": "Kommentare von Besuchern:", "it": "Commenti dei visitatori:", "pt": "Comentários de visitantes:", "nl": "Reacties van bezoekers:", "pl": "Komentarze odwiedzających:", "ro": "Comentariile vizitatorilor:", "ru": "Комментарии посетителей:", "uk": "Коментарі відвідувачів:", "el": "Σχόλια επισκεπτών:", "hy": "Այցելուների մեկնաբանություններ՝", "ar": "تعليقات الزوار:", "ja": "訪問者のコメント：", "ko": "방문자 댓글:", "zh": "访客评论："};
const TAG={"en": "World Church Heritage Map", "tr": "Dünya Kilise Mirası Haritası", "es": "Mapa del patrimonio de las iglesias del mundo", "fr": "Carte du patrimoine des églises du monde", "de": "Weltkarte des Kirchenerbes", "it": "Mappa del patrimonio delle chiese del mondo", "pt": "Mapa do patrimônio das igrejas do mundo", "nl": "Wereldkaart van het kerkelijk erfgoed", "pl": "Mapa dziedzictwa kościołów świata", "ro": "Harta patrimoniului bisericilor din lume", "ru": "Карта церковного наследия мира", "uk": "Мапа церковної спадщини світу", "el": "Χάρτης της εκκλησιαστικής κληρονομιάς του κόσμου", "hy": "Աշխարհի եկեղեցական ժառանգության քարտեզ", "ar": "خريطة التراث الكنسي في العالم", "ja": "世界の教会遺産マップ", "ko": "세계 교회 유산 지도", "zh": "世界教堂遗产地图"};
const UI={"en": {"openMap": "Open on the map", "photos": "Photos", "nearby": "More churches in {place}"}, "tr": {"openMap": "Haritada aç", "photos": "Fotoğraflar", "nearby": "{place} bölgesindeki diğer kiliseler"}, "es": {"openMap": "Abrir en el mapa", "photos": "Fotos", "nearby": "Más iglesias en {place}"}, "fr": {"openMap": "Ouvrir sur la carte", "photos": "Photos", "nearby": "Autres églises à {place}"}, "de": {"openMap": "Auf der Karte öffnen", "photos": "Fotos", "nearby": "Weitere Kirchen in {place}"}, "it": {"openMap": "Apri sulla mappa", "photos": "Foto", "nearby": "Altre chiese a {place}"}, "pt": {"openMap": "Abrir no mapa", "photos": "Fotos", "nearby": "Mais igrejas em {place}"}, "nl": {"openMap": "Openen op de kaart", "photos": "Foto's", "nearby": "Meer kerken in {place}"}, "pl": {"openMap": "Otwórz na mapie", "photos": "Zdjęcia", "nearby": "Więcej kościołów: {place}"}, "ro": {"openMap": "Deschide pe hartă", "photos": "Fotografii", "nearby": "Mai multe biserici în {place}"}, "ru": {"openMap": "Открыть на карте", "photos": "Фотографии", "nearby": "Другие церкви: {place}"}, "uk": {"openMap": "Відкрити на мапі", "photos": "Фотографії", "nearby": "Інші церкви: {place}"}, "el": {"openMap": "Άνοιγμα στον χάρτη", "photos": "Φωτογραφίες", "nearby": "Περισσότερες εκκλησίες: {place}"}, "hy": {"openMap": "Բացել քարտեզում", "photos": "Լուսանկարներ", "nearby": "Այլ եկեղեցիներ՝ {place}"}, "ar": {"openMap": "افتح على الخريطة", "photos": "الصور", "nearby": "كنائس أخرى في {place}"}, "ja": {"openMap": "地図で開く", "photos": "写真", "nearby": "{place}の他の教会"}, "ko": {"openMap": "지도에서 열기", "photos": "사진", "nearby": "{place}의 다른 교회"}, "zh": {"openMap": "在地图上打开", "photos": "照片", "nearby": "{place}的更多教堂"}};
const LOCALE={"en": "en_US", "tr": "tr_TR", "es": "es_ES", "fr": "fr_FR", "de": "de_DE", "it": "it_IT", "pt": "pt_BR", "nl": "nl_NL", "pl": "pl_PL", "ro": "ro_RO", "ru": "ru_RU", "uk": "uk_UA", "el": "el_GR", "hy": "hy_AM", "ar": "ar_AR", "ja": "ja_JP", "ko": "ko_KR", "zh": "zh_CN"};

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const httpsUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch(e){return null}};
const pickLang=q=>{const c=String(q||'').toLowerCase().split('-')[0];return UI[c]?c:'en'};

async function rest(path){
  const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  if(!r.ok)throw new Error('supabase '+r.status);
  return r.json();
}

function countryLabel(c,lang){
  const code=String(c.country_code||'').toUpperCase();
  if(code){try{const n=new Intl.DisplayNames([lang],{type:'region'}).of(code);if(n&&n!==code)return n}catch(e){}}
  return c.country||'';
}

const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};
const jsonLd=o=>JSON.stringify(o).replace(/</g,'\\u003c');

const CSS='body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;line-height:1.65}'
+'main{max-width:720px;margin:0 auto;padding:20px 18px 56px}'
+'nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:.9rem}'
+'a{color:#2563eb}h1{font-size:1.7rem;line-height:1.25;color:#0f172a;margin:14px 0 6px}h2{font-size:1.05rem;color:#0f172a;margin:30px 0 8px}'
+'.hero{width:100%;max-height:420px;object-fit:cover;border-radius:14px;background:#e2e8f0;display:block}'
+'.badge{display:inline-block;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:12px;background:#e2e8f0;color:#334155;text-transform:uppercase}'
+'.place{color:#64748b;margin:4px 0 14px}.cta{display:inline-block;margin:16px 0 4px;background:#0f172a;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px}'
+'.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.grid img{width:100%;height:120px;object-fit:cover;border-radius:10px;background:#e2e8f0}'
+'.comment{background:#f1f5f9;border-radius:8px;padding:8px 10px;margin:6px 0;font-size:.9rem}'
+'ul.links{padding-left:20px}ul.links li{margin:4px 0}footer{margin-top:40px;font-size:.8rem;color:#94a3b8}footer a{margin-right:10px;white-space:nowrap}';

function page({title,desc,lang,canonical,robots,image,ld,body}){
  return '<!DOCTYPE html>\n<html lang="'+lang+'" dir="'+(lang==='ar'?'rtl':'ltr')+'">\n<head>\n<meta charset="UTF-8">\n'
  +'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  +'<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n<meta name="robots" content="'+robots+'">\n'
  +(canonical?'<link rel="canonical" href="'+esc(canonical)+'">\n':'')
  +'<meta property="og:type" content="website">\n<meta property="og:site_name" content="The Church Atlas">\n'
  +'<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n'
  +(canonical?'<meta property="og:url" content="'+esc(canonical)+'">\n':'')
  +'<meta property="og:image" content="'+esc(image)+'">\n<meta property="og:locale" content="'+(LOCALE[lang]||'en_US')+'">\n'
  +'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+esc(title)+'">\n'
  +'<meta name="twitter:description" content="'+esc(desc)+'">\n<meta name="twitter:image" content="'+esc(image)+'">\n'
  +'<meta name="theme-color" content="#0f172a">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
  +'<style>'+CSS+'</style>\n'+(ld?'<script type="application/ld+json">'+jsonLd(ld)+'</script>\n':'')
  +'</head>\n<body>\n'+body+'\n</body>\n</html>\n';
}

function notFound(res,lang){
  const body='<main><nav><a href="/">← The Church Atlas</a></nav><h1>404</h1><p><a href="/">thechurchatlas.com</a></p></main>';
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=60');
  res.setHeader('X-Robots-Tag','noindex');
  res.status(404).send(page({title:'Not found — The Church Atlas',desc:'Not found',lang,canonical:'',robots:'noindex',image:SITE+'/og-image.png',ld:null,body}));
}

function buildChurchPage(c,contribs,nearby,lang){
  const ui=UI[lang],den=(DEN[lang]||DEN.en)[c.denomination]||c.denomination||'';
  const country=countryLabel(c,lang);
  const place=[c.city,c.region&&c.region!==c.city?c.region:'',country].filter(Boolean).join(', ');
  const url=SITE+'/church/'+c.id;
  const photos=contribs.map(x=>httpsUrl(x.photo_url)).filter(Boolean);
  const image=photos[0]||SITE+'/og-image.png';
  const title=c.name+(place?' · '+place:'')+' | The Church Atlas';
  const desc=clip(c.description,155)||clip([den,place].filter(Boolean).join(' · ')+' — '+(TAG[lang]||TAG.en),155);

  const ld={'@context':'https://schema.org','@type':'Church',name:c.name,url,description:clip(c.description,500)||undefined,
    image:photos.length?photos.slice(0,6):undefined,
    geo:(c.lat!=null&&c.lng!=null)?{'@type':'GeoCoordinates',latitude:c.lat,longitude:c.lng}:undefined,
    address:place?{'@type':'PostalAddress',addressLocality:c.city||undefined,addressRegion:c.region||undefined,addressCountry:c.country_code||country||undefined}:undefined,
    sameAs:c.wikidata?['https://www.wikidata.org/wiki/'+c.wikidata]:undefined,
    isPartOf:{'@type':'WebSite',name:'The Church Atlas',url:SITE+'/'}};

  const mapUrl='/?church='+c.id+'&lang='+lang;
  const paras=String(c.description||'').split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>'<p>'+esc(s)+'</p>').join('');
  const comments=contribs.filter(x=>x.comment).slice(0,5).map(x=>'<div class="comment">💬 <strong>'+esc(x.name)+'</strong>: '+esc(x.comment)+'</div>').join('');
  const body='<main>\n<nav><a href="/">The Church Atlas</a><a href="/'+(lang==='tr'?'hakkinda':'about')+'.html">ℹ</a></nav>\n'
   +(photos[0]?'<img class="hero" src="'+esc(photos[0])+'" alt="'+esc(c.name)+'">\n':'')
   +'<h1>'+esc(c.name)+'</h1>\n<span class="badge">'+esc(den)+'</span>\n'+(place?'<p class="place">'+esc(place)+'</p>\n':'')
   +paras+'\n<a class="cta" href="'+esc(mapUrl)+'">'+esc(ui.openMap)+' →</a>\n'
   +(photos.length>1?'<h2>'+esc(ui.photos)+'</h2>\n<div class="grid">'+photos.slice(1,13).map(p=>'<img loading="lazy" src="'+esc(p)+'" alt="'+esc(c.name)+'">').join('')+'</div>\n':'')
   +(comments?'<h2>'+esc(COMMENTS[lang]||COMMENTS.en)+'</h2>\n'+comments+'\n':'')
   +(nearby.length?'<h2>'+esc(ui.nearby.replace('{place}',c.city||c.region||country))+'</h2>\n<ul class="links">'+nearby.map(n=>'<li><a href="/church/'+n.id+'?lang='+lang+'">'+esc(n.name)+'</a></li>').join('')+'</ul>\n':'')
   +'<footer>'+LANGS.map(([code,name])=>'<a href="/church/'+c.id+'?lang='+code+'" hreflang="'+code+'">'+esc(name)+'</a>').join('')+'</footer>\n</main>';
  return page({title,desc,lang,canonical:url,robots:'index,follow',image,ld,body});
}

module.exports=async function handler(req,res){
  const q=req.query||{};
  let rawLang=q.lang;
  if(!rawLang){try{rawLang=new URL(req.url||'/',SITE).searchParams.get('lang')}catch(e){}}
  const lang=pickLang(rawLang);
  const id=/^\d{1,9}$/.test(String(q.id||''))?Number(q.id):0;
  if(!id)return notFound(res,lang);
  try{
    const [rows,contribs]=await Promise.all([
      rest('atlas_churches?id=eq.'+id+'&select=*&limit=1'),
      rest('atlas_contributions?church_id=eq.'+id+'&status=eq.approved&select=name,comment,photo_url,created_at&order=created_at.desc&limit=30')
    ]);
    const c=rows[0];
    if(!c)return notFound(res,lang);
    let nearby=[];
    if(c.city){try{nearby=await rest('atlas_churches?city=eq.'+encodeURIComponent(c.city)+'&id=neq.'+id+'&select=id,name&order=id.asc&limit=12')}catch(e){}}
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Language',lang);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(buildChurchPage(c,contribs,nearby,lang));
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.status(502).send('Temporarily unavailable');
  }
};
module.exports.buildChurchPage=buildChurchPage;
