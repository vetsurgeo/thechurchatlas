// The Church Atlas — kilise sayfası (sunucuda üretilir)
// /church/ID adresine gelen isteği karşılar. Veriler Supabase'den alınır (herkese açık okuma izni olan veriler).
const SUPABASE_URL='https://siucplaufmjhqgdtorhf.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWNwbGF1Zm1qaHFnZHRvcmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU0MzksImV4cCI6MjEwNjc4MTQzOX0.dTo5uK-djOc3rkNrmJsahypGUw2-bHfwPFjcsx6-sso';   // yalnızca herkese açık (publishable/anon) anahtar
const SITE='https://thechurchatlas.com';
// Wikimedia, istek yapan programın kendini ve iletişim bilgisini tanıtmasını şart koşar (aksi halde istekleri engelleyebilir)
const WIKI_HEADERS={'User-Agent':'TheChurchAtlas/1.0 (https://thechurchatlas.com; info@thechurchatlas.com) Vercel-Function','Accept':'application/json'};

const LANGS=[["tr", "Türkçe"], ["en", "English"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"], ["pt", "Português"], ["nl", "Nederlands"], ["pl", "Polski"], ["ro", "Română"], ["ru", "Русский"], ["uk", "Українська"], ["el", "Ελληνικά"], ["hy", "Հայերեն"], ["ar", "العربية"], ["ja", "日本語"], ["ko", "한국어"], ["zh", "中文"]];
const DEN={"tr": {"Katolik": "Katolik", "Ortodoks": "Ortodoks", "Oryantal Ortodoks": "Oryantal Ortodoks", "Doğu Kilisesi": "Doğu Kilisesi", "Protestan": "Protestan", "Anglikan": "Anglikan", "Diğer": "Diğer"}, "en": {"Katolik": "Catholic", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Oriental Orthodox", "Doğu Kilisesi": "Church of the East", "Protestan": "Protestant", "Anglikan": "Anglican", "Diğer": "Other"}, "es": {"Katolik": "Católica", "Ortodoks": "Ortodoxa", "Oryantal Ortodoks": "Ortodoxa oriental", "Doğu Kilisesi": "Iglesia del Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Otra"}, "fr": {"Katolik": "Catholique", "Ortodoks": "Orthodoxe", "Oryantal Ortodoks": "Orthodoxe orientale", "Doğu Kilisesi": "Église de l'Orient", "Protestan": "Protestante", "Anglikan": "Anglicane", "Diğer": "Autre"}, "de": {"Katolik": "Katholisch", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Orientalisch-orthodox", "Doğu Kilisesi": "Kirche des Ostens", "Protestan": "Protestantisch", "Anglikan": "Anglikanisch", "Diğer": "Andere"}, "it": {"Katolik": "Cattolica", "Ortodoks": "Ortodossa", "Oryantal Ortodoks": "Ortodossa orientale", "Doğu Kilisesi": "Chiesa d'Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Altra"}, "pt": {"Katolik": "Católica", "Ortodoks": "Ortodoxa", "Oryantal Ortodoks": "Ortodoxa oriental", "Doğu Kilisesi": "Igreja do Oriente", "Protestan": "Protestante", "Anglikan": "Anglicana", "Diğer": "Outra"}, "nl": {"Katolik": "Katholiek", "Ortodoks": "Orthodox", "Oryantal Ortodoks": "Oriëntaals-orthodox", "Doğu Kilisesi": "Kerk van het Oosten", "Protestan": "Protestants", "Anglikan": "Anglicaans", "Diğer": "Overig"}, "pl": {"Katolik": "Katolicki", "Ortodoks": "Prawosławny", "Oryantal Ortodoks": "Orientalny prawosławny", "Doğu Kilisesi": "Kościół Wschodu", "Protestan": "Protestancki", "Anglikan": "Anglikański", "Diğer": "Inne"}, "ro": {"Katolik": "Catolică", "Ortodoks": "Ortodoxă", "Oryantal Ortodoks": "Ortodoxă orientală", "Doğu Kilisesi": "Biserica Răsăritului", "Protestan": "Protestantă", "Anglikan": "Anglicană", "Diğer": "Altele"}, "ru": {"Katolik": "Католическая", "Ortodoks": "Православная", "Oryantal Ortodoks": "Древневосточная", "Doğu Kilisesi": "Церковь Востока", "Protestan": "Протестантская", "Anglikan": "Англиканская", "Diğer": "Другая"}, "uk": {"Katolik": "Католицька", "Ortodoks": "Православна", "Oryantal Ortodoks": "Давньосхідна", "Doğu Kilisesi": "Церква Сходу", "Protestan": "Протестантська", "Anglikan": "Англіканська", "Diğer": "Інша"}, "el": {"Katolik": "Καθολική", "Ortodoks": "Ορθόδοξη", "Oryantal Ortodoks": "Προχαλκηδόνια", "Doğu Kilisesi": "Εκκλησία της Ανατολής", "Protestan": "Προτεσταντική", "Anglikan": "Αγγλικανική", "Diğer": "Άλλη"}, "hy": {"Katolik": "Կաթոլիկ", "Ortodoks": "Ուղղափառ", "Oryantal Ortodoks": "Արևելյան ուղղափառ", "Doğu Kilisesi": "Արևելքի եկեղեցի", "Protestan": "Բողոքական", "Anglikan": "Անգլիկան", "Diğer": "Այլ"}, "ar": {"Katolik": "كاثوليكية", "Ortodoks": "أرثوذكسية", "Oryantal Ortodoks": "أرثوذكسية شرقية", "Doğu Kilisesi": "كنيسة المشرق", "Protestan": "بروتستانتية", "Anglikan": "أنجليكانية", "Diğer": "أخرى"}, "ja": {"Katolik": "カトリック", "Ortodoks": "正教会", "Oryantal Ortodoks": "東方諸教会", "Doğu Kilisesi": "東方教会", "Protestan": "プロテスタント", "Anglikan": "聖公会", "Diğer": "その他"}, "ko": {"Katolik": "가톨릭", "Ortodoks": "정교회", "Oryantal Ortodoks": "오리엔트 정교회", "Doğu Kilisesi": "동방 교회", "Protestan": "개신교", "Anglikan": "성공회", "Diğer": "기타"}, "zh": {"Katolik": "天主教", "Ortodoks": "东正教", "Oryantal Ortodoks": "东方正统教会", "Doğu Kilisesi": "东方教会", "Protestan": "新教", "Anglikan": "圣公会", "Diğer": "其他"}};
const COMMENTS={"tr": "Ziyaretçi yorumları:", "en": "Visitor comments:", "es": "Comentarios de visitantes:", "fr": "Commentaires des visiteurs :", "de": "Kommentare von Besuchern:", "it": "Commenti dei visitatori:", "pt": "Comentários de visitantes:", "nl": "Reacties van bezoekers:", "pl": "Komentarze odwiedzających:", "ro": "Comentariile vizitatorilor:", "ru": "Комментарии посетителей:", "uk": "Коментарі відвідувачів:", "el": "Σχόλια επισκεπτών:", "hy": "Այցելուների մեկնաբանություններ՝", "ar": "تعليقات الزوار:", "ja": "訪問者のコメント：", "ko": "방문자 댓글:", "zh": "访客评论："};
const CREDIT={"tr": "Fotoğraf: Wikipedia / Wikimedia Commons", "en": "Photo: Wikipedia / Wikimedia Commons", "es": "Foto: Wikipedia / Wikimedia Commons", "fr": "Photo : Wikipédia / Wikimedia Commons", "de": "Foto: Wikipedia / Wikimedia Commons", "it": "Foto: Wikipedia / Wikimedia Commons", "pt": "Foto: Wikipédia / Wikimedia Commons", "nl": "Foto: Wikipedia / Wikimedia Commons", "pl": "Zdjęcie: Wikipedia / Wikimedia Commons", "ro": "Fotografie: Wikipedia / Wikimedia Commons", "ru": "Фото: Википедия / Wikimedia Commons", "uk": "Фото: Вікіпедія / Wikimedia Commons", "el": "Φωτογραφία: Βικιπαίδεια / Wikimedia Commons", "hy": "Լուսանկար՝ Վիքիպեդիա / Wikimedia Commons", "ar": "الصورة: ويكيبيديا / ويكيميديا كومنز", "ja": "写真：Wikipedia / Wikimedia Commons", "ko": "사진: Wikipedia / Wikimedia Commons", "zh": "照片：维基百科 / Wikimedia Commons"};
const WIKI_SRC={"tr": "Wikipedia'dan · CC BY-SA 4.0", "en": "From Wikipedia · CC BY-SA 4.0", "es": "De Wikipedia · CC BY-SA 4.0", "fr": "Depuis Wikipédia · CC BY-SA 4.0", "de": "Aus Wikipedia · CC BY-SA 4.0", "it": "Da Wikipedia · CC BY-SA 4.0", "pt": "Da Wikipédia · CC BY-SA 4.0", "nl": "Van Wikipedia · CC BY-SA 4.0", "pl": "Z Wikipedii · CC BY-SA 4.0", "ro": "De pe Wikipedia · CC BY-SA 4.0", "ru": "Из Википедии · CC BY-SA 4.0", "uk": "З Вікіпедії · CC BY-SA 4.0", "el": "Από τη Βικιπαίδεια · CC BY-SA 4.0", "hy": "Վիքիպեդիայից · CC BY-SA 4.0", "ar": "من ويكيبيديا · CC BY-SA 4.0", "ja": "Wikipedia より · CC BY-SA 4.0", "ko": "위키백과 · CC BY-SA 4.0", "zh": "来自维基百科 · CC BY-SA 4.0"};
const CLAIM_UI={
  en:{link:'Church official? Correct or claim this page',badge:'Verified by a church representative'},
  tr:{link:'Kilise yetkilisi misiniz? Bu sayfayı düzeltin ya da sahiplenin',badge:'Kilise temsilcisince doğrulandı'},
  it:{link:'Sei un responsabile della chiesa? Correggi o rivendica questa pagina',badge:'Verificata da un rappresentante della chiesa'}
};
const WIKI_READ={"tr": "Wikipedia'da oku", "en": "Read on Wikipedia", "es": "Leer en Wikipedia", "fr": "Lire sur Wikipédia", "de": "Auf Wikipedia lesen", "it": "Leggi su Wikipedia", "pt": "Ler na Wikipédia", "nl": "Lees op Wikipedia", "pl": "Czytaj w Wikipedii", "ro": "Citește pe Wikipedia", "ru": "Читать в Википедии", "uk": "Читати у Вікіпедії", "el": "Διαβάστε στη Βικιπαίδεια", "hy": "Կարդալ Վիքիպեդիայում", "ar": "اقرأ في ويكيبيديا", "ja": "Wikipedia で読む", "ko": "위키백과에서 읽기", "zh": "在维基百科阅读"};
const CREDIT_USER={"tr": "Fotoğraf: ziyaretçi katkısı · {name}", "en": "Photo: visitor contribution · {name}", "es": "Foto: aportación de un visitante · {name}", "fr": "Photo : contribution d'un visiteur · {name}", "de": "Foto: Beitrag eines Besuchers · {name}", "it": "Foto: contributo di un visitatore · {name}", "pt": "Foto: contribuição de um visitante · {name}", "nl": "Foto: bijdrage van een bezoeker · {name}", "pl": "Zdjęcie: wkład odwiedzającego · {name}", "ro": "Fotografie: contribuția unui vizitator · {name}", "ru": "Фото: вклад посетителя · {name}", "uk": "Фото: внесок відвідувача · {name}", "el": "Φωτογραφία: συνεισφορά επισκέπτη · {name}", "hy": "Լուսանկար՝ այցելուի ներդրում · {name}", "ar": "الصورة: مساهمة زائر · {name}", "ja": "写真：訪問者の投稿 · {name}", "ko": "사진: 방문자 기여 · {name}", "zh": "照片：访客投稿 · {name}"};
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

// Wikidata kaydı: P18 görsel dosyası ve Vikipedi bağlantıları tek istekte alınır
async function wikidataEntity(qid){
  if(!/^Q\d+$/.test(String(qid||'')))return null;
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),2500);
  try{
    const r=await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims|sitelinks&format=json&ids='+qid,{signal:ctrl.signal,headers:WIKI_HEADERS});
    if(!r.ok)return null;
    const j=await r.json();
    const e=j&&j.entities&&j.entities[qid];
    if(!e)return null;
    const p18=e.claims&&e.claims.P18&&e.claims.P18[0]&&e.claims.P18[0].mainsnak&&e.claims.P18[0].mainsnak.datavalue&&e.claims.P18[0].mainsnak.datavalue.value;
    const links={};
    Object.keys(e.sitelinks||{}).forEach(k=>{const m=k.match(/^([a-z]{2,3})wiki$/);if(m&&e.sitelinks[k]&&typeof e.sitelinks[k].title==='string')links[m[1]]=e.sitelinks[k].title});
    return{image:p18?'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(p18)+'?width=1200':null,links};
  }catch(e){return null}finally{clearTimeout(timer)}
}

async function wikipediaImage(titles){
  if(!titles||typeof titles!=='object')return null;
  for(const lang of ['en','tr']){
    const t=titles[lang];
    if(typeof t!=='string'||!t||t.length>200)continue;
    const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),2500);
    try{
      const r=await fetch('https://'+lang+'.wikipedia.org/w/api.php?action=query&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=1200&format=json&titles='+encodeURIComponent(t),{signal:ctrl.signal,headers:WIKI_HEADERS});
      if(!r.ok)continue;
      const j=await r.json();
      const pages=Object.values((j&&j.query&&j.query.pages)||{});
      const src=pages[0]&&pages[0].thumbnail&&pages[0].thumbnail.source;
      const ok=httpsUrl(src);
      if(ok)return ok;
    }catch(e){}finally{clearTimeout(timer)}
  }
  return null;
}

function clipSentences(text,max){
  const t=String(text||'').replace(/\s+/g,' ').trim();
  if(t.length<=max)return t;
  const cut=t.slice(0,max);
  const i=Math.max(cut.lastIndexOf('. '),cut.lastIndexOf('! '),cut.lastIndexOf('? '),cut.lastIndexOf('。'));
  return i>max*0.5?cut.slice(0,i+1):cut.slice(0,max-1).trimEnd()+'…';
}

// Hangi Vikipedi maddesi? Önce sayfa dili, sonra İngilizce, sonra Türkçe, en son bulunan ilk dil
function pickWikiTitle(c,entity,lang){
  const prefs=[...new Set([lang,'en','tr'])];
  const wt=(c.wiki_titles&&typeof c.wiki_titles==='object')?c.wiki_titles:{};
  const links=(entity&&entity.links)||{};
  for(const l of prefs){
    const t=(typeof wt[l]==='string'&&wt[l])||links[l];
    if(t&&t.length<=200)return{wlang:l,title:t};
  }
  const first=Object.keys(links).sort()[0];
  if(first&&links[first].length<=200)return{wlang:first,title:links[first]};
  return null;
}

async function wikiSummary(pick){
  if(!pick||!/^[a-z]{2,3}$/.test(pick.wlang))return null;
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),2500);
  try{
    const r=await fetch('https://'+pick.wlang+'.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(pick.title.replace(/ /g,'_')),{signal:ctrl.signal,headers:WIKI_HEADERS});
    if(!r.ok)return null;
    const j=await r.json();
    if(!j||j.type==='disambiguation'||typeof j.extract!=='string'||j.extract.trim().length<40)return null;
    const url=httpsUrl(j.content_urls&&j.content_urls.desktop&&j.content_urls.desktop.page)||('https://'+pick.wlang+'.wikipedia.org/wiki/'+encodeURIComponent(pick.title.replace(/ /g,'_')));
    return{text:clipSentences(j.extract,700),url,wlang:pick.wlang};
  }catch(e){return null}finally{clearTimeout(timer)}
}

// Dış servislere toplam süre sınırı: işlev 10 sn'yi aşıp hata vermesin
function withDeadline(promise,ms,fallback){
  let t;
  return Promise.race([promise,new Promise(r=>{t=setTimeout(()=>r(fallback),ms)})]).finally(()=>clearTimeout(t));
}

async function enrich(c,lang,needImage,needSummary){
  const none={image:null,summary:null};
  if(!needImage&&!needSummary)return none;
  const entity=c.wikidata?await wikidataEntity(c.wikidata):null;
  const pick=needSummary?pickWikiTitle(c,entity,lang):null;
  const [summary,pageImage]=await Promise.all([
    pick?wikiSummary(pick):null,
    (needImage&&!(entity&&entity.image))?wikipediaImage(Object.assign({},entity&&entity.links&&{en:entity.links.en,tr:entity.links.tr},c.wiki_titles)):null
  ]);
  return{image:(entity&&entity.image)||pageImage||null,summary};
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
+'.addr{margin:-4px 0 10px;font-size:.88rem;color:#475569}.verified{display:inline-block;font-size:.75rem;font-weight:600;color:#166534;background:#dcfce7;border-radius:999px;padding:3px 12px;margin:0 0 10px}.claim{font-size:.85rem;margin-top:24px}.credit{font-size:.72rem;color:#94a3b8;margin:6px 0 0}.comment{background:#f1f5f9;border-radius:8px;padding:8px 10px;margin:6px 0;font-size:.9rem}'
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

// Gizliliğe saygılı ziyaret sayacı: çerez, IP adresi ya da kişi kimliği yok; JavaScript çalıştırmayan botlar zaten sayılmaz
function trackScript(id,lang){
  return '<script>(function(){try{if(navigator.doNotTrack==="1"||navigator.globalPrivacyControl||navigator.webdriver||localStorage.getItem("noTrack")==="1")return;'
   +'var k="hit:church:'+id+'";if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1");'
   +'var p=new URLSearchParams(location.search),s=String(p.get("src")||p.get("utm_source")||"").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,30),r="";'
   +'try{var h=new URL(document.referrer).hostname.replace(/^www\\./,"");if(h&&h!==location.hostname.replace(/^www\\./,""))r=h}catch(e){}'
   +'var b=JSON.stringify({k:"page",c:'+Number(id)+',l:"'+lang+'",r:r,s:s});'
   +'if(!(navigator.sendBeacon&&navigator.sendBeacon("/api/hit",new Blob([b],{type:"application/json"}))))fetch("/api/hit",{method:"POST",headers:{"Content-Type":"application/json"},body:b,keepalive:true})'
   +'}catch(e){}})()</script>';
}

// Ziyaretçi fotoğrafının sahibi (bağlantı verdiyse tıklanabilir)
// Doğrulanmış (veritabanına kayıtlı) fotoğraf için yazar · lisans · kaynak atfı
function curatedImage(c){
  const url=httpsUrl(c.image_url);if(!url)return null;
  return{url,page:httpsUrl(c.image_page_url),author:String(c.image_author||'').trim(),license:String(c.image_license||'').trim(),licenseUrl:httpsUrl(c.image_license_url),source:String(c.image_source||'').trim()};
}
function curatedCreditHtml(im,lang){
  const label=String(CREDIT[lang]||CREDIT.en).split(/\s*[:：՝]/)[0];
  const a=(href,text)=>href?'<a href="'+esc(href)+'" rel="noopener nofollow">'+esc(text)+'</a>':esc(text);
  const parts=[];
  if(im.author)parts.push(a(im.page,im.author));
  if(im.license)parts.push(a(im.licenseUrl,im.license));
  if(im.source)parts.push(im.author?esc(im.source):a(im.page,im.source));
  return '<p class="credit">'+esc(label)+': '+parts.join(' · ')+'</p>\n';
}

function userCreditHtml(x,lang){
  const parts=(CREDIT_USER[lang]||CREDIT_USER.en).split('{name}');
  const link=httpsUrl(x.credit_url);
  const who=link?'<a href="'+esc(link)+'" rel="nofollow ugc noopener">'+esc(x.name)+'</a>':esc(x.name);
  return '<p class="credit">'+esc(parts[0]||'')+who+esc(parts[1]||'')+'</p>\n';
}

function buildChurchPage(c,contribs,nearby,lang,wikiImage,summary){
  const ui=UI[lang],den=(DEN[lang]||DEN.en)[c.denomination]||c.denomination||'';
  const country=countryLabel(c,lang);
  const place=[c.city,c.region&&c.region!==c.city?c.region:'',country].filter(Boolean).join(', ');
  const url=SITE+'/church/'+c.id;
  const photos=contribs.map(x=>httpsUrl(x.photo_url)).filter(Boolean);
  const curated=curatedImage(c);
  const heroUrl=photos[0]||(curated&&curated.url)||wikiImage||null;  // ziyaretçi fotoğrafı > doğrulanmış fotoğraf > Wikimedia görseli
  const image=heroUrl||SITE+'/og-image.png';
  const title=c.name+(place?' · '+place:'')+' | The Church Atlas';
  const ownText=String(c.description||'').trim();
  const addr=String(c.address||'').trim();
  const base=ownText||(summary&&summary.text)||([den,place].filter(Boolean).join(' · ')+' — '+(TAG[lang]||TAG.en));
  const desc=clip((addr?addr+(place?', '+place:'')+'. ':'')+base,155);

  const ld={'@context':'https://schema.org','@type':'Church',name:c.name,url,description:clip(ownText,500)||clip(summary&&summary.text,500)||undefined,
    inLanguage:lang,
    image:photos.length?photos.slice(0,6):(curated?[curated.url]:(wikiImage?[wikiImage]:undefined)),
    geo:(c.lat!=null&&c.lng!=null)?{'@type':'GeoCoordinates',latitude:c.lat,longitude:c.lng}:undefined,
    address:(place||addr)?{'@type':'PostalAddress',streetAddress:addr||undefined,addressLocality:c.city||undefined,addressRegion:c.region||undefined,addressCountry:c.country_code||country||undefined}:undefined,
    sameAs:c.wikidata?['https://www.wikidata.org/wiki/'+c.wikidata]:undefined,
    isPartOf:{'@type':'WebSite',name:'The Church Atlas',url:SITE+'/'}};

  const mapUrl='/?church='+c.id+'&lang='+lang;
  const paras=String(c.description||'').split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>'<p>'+esc(s)+'</p>').join('');
  const comments=contribs.filter(x=>x.comment).slice(0,5).map(x=>'<div class="comment">💬 <strong>'+esc(x.name)+'</strong>: '+esc(x.comment)+'</div>').join('');
  const body='<main>\n<nav><a href="/">The Church Atlas</a><a href="/collections?lang='+lang+'">'+(lang==='tr'?'Koleksiyonlar':'Collections')+'</a><a href="/'+(lang==='tr'?'hakkinda':'about')+'.html">'+(lang==='tr'?'Hakkında':'About')+'</a></nav>\n'
   +(heroUrl?'<img class="hero" src="'+esc(heroUrl)+'" alt="'+esc(c.name)+'">\n'+(photos[0]?userCreditHtml(contribs.find(x=>httpsUrl(x.photo_url)),lang):curated?curatedCreditHtml(curated,lang):'<p class="credit">'+esc(CREDIT[lang]||CREDIT.en)+'</p>\n'):'')
   +'<h1>'+esc(c.name)+'</h1>\n<span class="badge">'+esc(den)+'</span>\n'+(place?'<p class="place">'+esc(place)+'</p>\n':'')
   +(addr?'<p class="addr">📍 '+esc(addr)+'</p>\n':'')
   +(c.verified_at?'<p class="verified">✓ '+esc((CLAIM_UI[lang]||CLAIM_UI.en).badge)+(c.verified_by?' · '+esc(c.verified_by):'')+'</p>\n':'')
   +paras+'\n'
   +((!paras&&summary)?'<p lang="'+esc(summary.wlang)+'">'+esc(summary.text)+'</p>\n<p class="credit">'+esc(WIKI_SRC[lang]||WIKI_SRC.en)+' — <a href="'+esc(summary.url)+'" rel="noopener nofollow">'+esc(WIKI_READ[lang]||WIKI_READ.en)+'</a></p>\n':'')
   +'<a class="cta" href="'+esc(mapUrl)+'" rel="nofollow">'+esc(ui.openMap)+' →</a>\n'
   +(photos.length>1?'<h2>'+esc(ui.photos)+'</h2>\n<div class="grid">'+photos.slice(1,13).map(p=>'<img loading="lazy" src="'+esc(p)+'" alt="'+esc(c.name)+'">').join('')+'</div>\n':'')
   +(comments?'<h2>'+esc(COMMENTS[lang]||COMMENTS.en)+'</h2>\n'+comments+'\n':'')
   +'<p class="claim"><a href="/?church='+c.id+'&claim=1&lang='+lang+'" rel="nofollow">'+esc((CLAIM_UI[lang]||CLAIM_UI.en).link)+'</a></p>\n'
   +(nearby.length?'<h2>'+esc(ui.nearby.replace('{place}',c.city||c.region||country))+'</h2>\n<ul class="links">'+nearby.map(n=>'<li><a href="/church/'+n.id+(lang===((String(c.country_code||'').toUpperCase()==='TR')?'tr':'en')?'':'?lang='+lang)+'">'+esc(n.name)+'</a></li>').join('')+'</ul>\n':'')
   +'<footer>'+LANGS.map(([code,name])=>'<a href="/church/'+c.id+'?lang='+code+'" hreflang="'+code+'" rel="nofollow">'+esc(name)+'</a>').join('')
   +'<p class="credit">Locations and names: &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> contributors, <a href="https://opendatacommons.org/licenses/odbl/" rel="noopener">ODbL</a></p></footer>\n</main>\n'
   +trackScript(c.id,lang);
  return page({title,desc,lang,canonical:url,robots:'index,follow',image,ld,body});
}

module.exports=async function handler(req,res){
  const q=req.query||{};
  let rawLang=q.lang;
  if(!rawLang){try{rawLang=new URL(req.url||'/',SITE).searchParams.get('lang')}catch(e){}}
  const explicit=!!rawLang;
  let lang=pickLang(rawLang);
  const id=/^\d{1,9}$/.test(String(q.id||''))?Number(q.id):0;
  if(!id)return notFound(res,lang);
  try{
    const [rows,contribs]=await Promise.all([
      rest('atlas_churches?id=eq.'+id+'&select=*&limit=1'),
      rest('atlas_contributions?church_id=eq.'+id+'&status=eq.approved&select=*&order=created_at.desc&limit=30')
    ]);
    const c=rows[0];
    if(!c)return notFound(res,lang);
    // Dil belirtilmediyse: Türkiye'deki kiliseler Türkçe, diğerleri İngilizce açılır
    if(!explicit&&String(c.country_code||'').toUpperCase()==='TR')lang='tr';
    const hasUserPhoto=contribs.some(x=>httpsUrl(x.photo_url));
    const needSummary=!String(c.description||'').trim();
    // Wikimedia/Wikidata çağrıları ve yakın kiliseler aynı anda yapılır; dış servislere toplam 5 sn tanınır
    const [extra,nearby]=await Promise.all([
      withDeadline(enrich(c,lang,!hasUserPhoto&&!httpsUrl(c.image_url),needSummary),5000,{image:null,summary:null}).catch(()=>({image:null,summary:null})),
      c.city?rest('atlas_churches?city=eq.'+encodeURIComponent(c.city)+'&id=neq.'+id+'&select=id,name&order=id.asc&limit=12').catch(()=>[]):Promise.resolve([])
    ]);
    const wikiImage=extra.image,summary=extra.summary;
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Language',lang);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(buildChurchPage(c,contribs,nearby,lang,wikiImage,summary));
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.status(502).send('Temporarily unavailable');
  }
};
module.exports.buildChurchPage=buildChurchPage;
