// Builds the AdSpot website: one home page and one partner page per language, from i18n/*.json.
// No dependencies: `node build.js` writes everything into _site/.
const fs = require('fs');
const path = require('path');

const BASE = 'https://jeremstyke.github.io/adspot/';
const BOT = 'https://t.me/PostOnAdSpotBot?start=src_site';
const CHANNEL = 'https://t.me/adspotchannel';
const ADD = 'https://t.me/PostOnAdSpotBot?startchannel&admin=post_messages+edit_messages+delete_messages';
const RTL = new Set(['ar', 'fa', 'he', 'ur']);
const OUT = path.join(__dirname, '_site');

const langs = fs.readdirSync(path.join(__dirname, 'i18n')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'en.json'), 'utf8'));
const dicts = {};
for (const l of langs) dicts[l] = { ...en, ...JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', l + '.json'), 'utf8')) };
const order = ['en', ...langs.filter((l) => l !== 'en').sort((a, b) => dicts[a].lang_name.localeCompare(dicts[b].lang_name, 'en'))];

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dir = (l) => (l === 'en' ? '' : l + '/');
const url = (l, page) => BASE + dir(l) + (page === 'partners' ? 'partners/' : '');
const rel = (from, l, page) => {
  const depth = (from.l === 'en' ? 0 : 1) + (from.page === 'partners' ? 1 : 0);
  return '../'.repeat(depth) + dir(l) + (page === 'partners' ? 'partners/' : '') || './';
};

const ROCKET = `<svg viewBox="-130 -210 260 520" aria-hidden="true"><path d="M0 150 Q-38 215 0 300 Q38 215 0 150Z" fill="#ffd23f" stroke="#3a0a1f" stroke-width="14" stroke-linejoin="round"/><path d="M0 175 Q-16 220 0 262 Q16 220 0 175Z" fill="#fff"/><path d="M-58 60 L-112 140 L-104 168 L-50 140 Z" fill="#ffd23f" stroke="#3a0a1f" stroke-width="14" stroke-linejoin="round"/><path d="M58 60 L112 140 L104 168 L50 140 Z" fill="#ffd23f" stroke="#3a0a1f" stroke-width="14" stroke-linejoin="round"/><path d="M0 -190 Q78 -110 70 40 L58 150 L-58 150 L-70 40 Q-78 -110 0 -190Z" fill="#fff" stroke="#3a0a1f" stroke-width="16" stroke-linejoin="round"/><path d="M0 -190 Q46 -150 60 -100 L-60 -100 Q-46 -150 0 -190Z" fill="#ff5a36" stroke="#3a0a1f" stroke-width="14" stroke-linejoin="round"/><circle cx="0" cy="-20" r="34" fill="#6fd3ff" stroke="#3a0a1f" stroke-width="14"/><circle cx="-10" cy="-30" r="9" fill="#fff"/><rect x="-9" y="70" width="18" height="96" rx="9" fill="#ffd23f" stroke="#3a0a1f" stroke-width="12"/></svg>`;
const LOGO = `<span class="logo">${ROCKET}</span>`;
const ICON = {
  gift: '<path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

const CSS = `
:root{--bg:#fffaf5;--bg2:#fff3ea;--card:#fff;--ink:#1d1014;--mut:#6f5f66;--line:#f1e3d8;--g1:#ff6a3d;--g2:#e8336b;--g3:#a8247e;--yel:#ffd23f;--dark:#1d1014;--tg:#2aa3e8;--shadow:0 20px 50px -24px rgba(120,30,50,.35)}
@media (prefers-color-scheme:dark){:root{--bg:#120a0d;--bg2:#1a1013;--card:#1f1418;--ink:#f8efe9;--mut:#b9a6ad;--line:#33242a;--dark:#0b0608;--shadow:0 20px 50px -24px rgba(0,0,0,.7)}}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
html{overflow-x:clip}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 "Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",Arial,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:clip}
a{color:inherit}
h1,h2,h3,.disp{font-family:"Bricolage Grotesque","Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif;letter-spacing:-.02em;line-height:1.08;margin:0}
.w{max-width:1120px;margin:0 auto;padding:0 20px}
.ic{width:22px;height:22px;flex:none}
.logo{width:40px;height:40px;border-radius:50%;background:linear-gradient(140deg,var(--g1),var(--g2) 60%,var(--g3));display:inline-grid;place-items:center;flex:none;box-shadow:0 6px 16px -6px rgba(232,51,107,.6)}
.logo svg{width:52%;height:auto;transform:rotate(35deg)}
.grad{background:linear-gradient(100deg,var(--g1),var(--g2) 55%,var(--g3));-webkit-background-clip:text;background-clip:text;color:transparent}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 24px;border-radius:14px;font-weight:700;text-decoration:none;font-size:16px;transition:transform .15s,box-shadow .15s;white-space:nowrap}
.btn:hover{transform:translateY(-2px)}
.btn.p{background:linear-gradient(120deg,var(--g1),var(--g2));color:#fff;box-shadow:0 14px 30px -12px rgba(232,51,107,.7)}
.btn.s{background:var(--card);border:1px solid var(--line)}
.btn.y{background:var(--yel);color:#3a0a1f}
.btn .ic{width:18px;height:18px}
[dir=rtl] .btn .ic,[dir=rtl] .more .ic{transform:scaleX(-1)}
header{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:saturate(1.6) blur(14px);-webkit-backdrop-filter:saturate(1.6) blur(14px);border-bottom:1px solid transparent}
header.sc{border-bottom-color:var(--line)}
.nav{display:flex;align-items:center;gap:22px;height:68px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;text-decoration:none}
.links{display:flex;gap:22px;margin-inline-start:auto;font-weight:600;font-size:15px}
.links a{text-decoration:none;color:var(--mut)}.links a:hover{color:var(--ink)}
.nav .btn{padding:10px 16px;font-size:14px}
details.lang{position:relative}
details.lang summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-weight:700;font-size:14px;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--card)}
details.lang summary::-webkit-details-marker{display:none}
details.lang summary .ic{width:17px;height:17px}
.lmenu{position:absolute;inset-inline-end:0;top:calc(100% + 8px);width:min(560px,calc(100vw - 32px));max-height:70vh;overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:2px}
.lmenu a{padding:8px 10px;border-radius:9px;text-decoration:none;font-size:14px;font-weight:600}
.lmenu a:hover{background:var(--bg2)}.lmenu a.on{background:var(--ink);color:var(--bg)}
.hero{padding:64px 0 40px;position:relative}
.hero::before{content:"";position:absolute;inset:-120px -20% auto;height:620px;background:radial-gradient(closest-side,rgba(255,106,61,.20),transparent),radial-gradient(closest-side at 70% 40%,rgba(232,51,107,.16),transparent);z-index:-1;pointer-events:none}
.hg{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.badge{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:var(--card);border:1px solid var(--line);font-weight:700;font-size:13.5px;color:var(--mut)}
.badge i{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
.hero h1{font-size:clamp(40px,6.2vw,72px);font-weight:800;margin:20px 0 18px}
.hero h1 span{display:block}
.lead{font-size:clamp(17px,2vw,20px);color:var(--mut);max-width:560px;margin:0 0 30px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.stats{display:flex;gap:34px;margin-top:40px;flex-wrap:wrap}
.stats b{display:block;font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:34px;line-height:1;font-weight:800}
.stats span{font-size:14px;color:var(--mut);font-weight:600}
.phone{position:relative;margin-inline:auto;width:min(360px,100%);border-radius:36px;padding:14px;background:linear-gradient(160deg,#2a1a20,#0f0a0c);box-shadow:var(--shadow),inset 0 0 0 2px rgba(255,255,255,.06)}
.screen{border-radius:26px;overflow:hidden;background:#b9d4a8 radial-gradient(circle at 20% 20%,rgba(255,255,255,.25) 0 2px,transparent 3px) 0 0/34px 34px}
@media (prefers-color-scheme:dark){.screen{background-color:#1b2a36}}
.tbar{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,.92);color:#111}
@media (prefers-color-scheme:dark){.tbar{background:#212d3b;color:#fff}}
.tbar .logo{width:34px;height:34px}.tbar b{display:block;font-size:14px}.tbar small{font-size:12px;opacity:.6}
.msgs{padding:14px 12px 16px}
.post{background:#fff;color:#111;border-radius:16px 16px 16px 6px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.12)}
@media (prefers-color-scheme:dark){.post{background:#182533;color:#eef}}
.pimg{aspect-ratio:16/9;background:linear-gradient(135deg,var(--g1),var(--g2) 60%,var(--g3));display:grid;place-items:center;position:relative;overflow:hidden}
.pimg svg{height:70%;transform:rotate(35deg);filter:drop-shadow(0 10px 18px rgba(0,0,0,.25))}
.pimg::after{content:"";position:absolute;inset:auto -20% -60% -20%;height:90%;background:radial-gradient(closest-side,rgba(255,255,255,.35),transparent)}
.pbd{padding:10px 12px 8px;font-size:14px;line-height:1.45}
.pbd b{display:block;margin-bottom:6px;font-size:15px}
.pbd .q{border-inline-start:3px solid var(--tg);background:rgba(42,163,232,.1);padding:4px 8px;border-radius:4px;margin:8px 0;font-size:13px}
.pbd .l{color:var(--tg);font-weight:600}
.ptime{text-align:end;font-size:11px;opacity:.5;padding:0 10px 6px}
.kb{display:grid;gap:5px;margin-top:5px}
.kb div{background:rgba(0,0,0,.25);color:#fff;text-align:center;padding:9px;border-radius:10px;font-size:13.5px;font-weight:700}
.chip{position:absolute;display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--line);padding:10px 14px;border-radius:14px;font-weight:700;font-size:14px;box-shadow:var(--shadow);animation:fl 6s ease-in-out infinite}
.chip .ic{width:18px;height:18px;color:var(--g2)}
.chip.a{top:18%;inset-inline-start:-34px}.chip.b{bottom:16%;inset-inline-end:-30px;animation-delay:-3s}
@keyframes fl{50%{transform:translateY(-10px)}}
section{padding:72px 0}
.kick{display:inline-block;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--g2);margin-bottom:12px}
.h2{font-size:clamp(30px,4.2vw,46px);font-weight:800;margin-bottom:36px;max-width:720px}
.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.f{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:26px;transition:transform .2s,box-shadow .2s}
.f:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.f .t{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#fff;margin-bottom:18px;background:linear-gradient(140deg,var(--g1),var(--g2))}
.f:nth-child(2) .t{background:linear-gradient(140deg,#8b5cf6,#d946ef)}.f:nth-child(3) .t{background:linear-gradient(140deg,#0ea5e9,#2563eb)}.f:nth-child(4) .t{background:linear-gradient(140deg,#10b981,#059669)}.f:nth-child(5) .t{background:linear-gradient(140deg,#f59e0b,#ef4444)}.f:nth-child(6) .t{background:linear-gradient(140deg,#64748b,#334155)}
.f h3{font-size:20px;margin-bottom:8px}.f p{margin:0;color:var(--mut);font-size:15.5px}
.alt{background:var(--bg2)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;counter-reset:s}
.st{position:relative;padding:28px;border-radius:22px;background:var(--card);border:1px solid var(--line)}
.st::before{counter-increment:s;content:counter(s);display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--bg);font-weight:800;font-size:18px;margin-bottom:16px;font-family:"Bricolage Grotesque",system-ui,sans-serif}
.st h3{font-size:21px;margin-bottom:8px}.st p{margin:0;color:var(--mut)}
.what{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.what span{padding:12px 18px;border-radius:999px;background:var(--card);border:1px solid var(--line);font-weight:700}
.extra{display:flex;align-items:center;gap:18px;margin-top:40px;padding:22px 24px;border-radius:20px;background:var(--card);border:1px dashed color-mix(in srgb,var(--g2) 45%,var(--line))}
.extra .s{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:var(--yel);color:#3a0a1f;flex:none}
.extra b{display:block;font-size:18px}.extra p{margin:2px 0 0;color:var(--mut)}
.band{background:var(--dark);color:#fbeee8;border-radius:32px;padding:56px;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;position:relative;overflow:hidden}
.band::before{content:"";position:absolute;width:520px;height:520px;inset-inline-end:-160px;top:-200px;background:radial-gradient(closest-side,rgba(232,51,107,.45),transparent);pointer-events:none}
.band .kick{color:var(--yel)}
.band h2{font-size:clamp(28px,3.8vw,42px);font-weight:800;margin-bottom:16px}
.band p{color:#d8c4cb;margin:0 0 26px;font-size:17px}
.band ul{list-style:none;margin:0;padding:0;display:grid;gap:12px;position:relative}
.band li{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);padding:14px 16px;border-radius:14px;font-weight:600}
.band li .ic{color:var(--yel);margin-top:2px}
.more{display:inline-flex;align-items:center;gap:6px;color:#fbeee8;font-weight:700;margin-inline-start:16px;text-decoration:none;opacity:.85}
.more .ic{width:18px;height:18px}
.faq{max-width:780px}
.faq details{background:var(--card);border:1px solid var(--line);border-radius:16px;margin-bottom:10px;padding:0 22px}
.faq summary{cursor:pointer;list-style:none;padding:18px 0;font-weight:700;font-size:17px;display:flex;justify-content:space-between;gap:16px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:24px;line-height:1;color:var(--g2);transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin:0 0 18px;color:var(--mut)}
.final{text-align:center;border-radius:32px;padding:64px 24px;background:linear-gradient(130deg,var(--g1),var(--g2) 55%,var(--g3));color:#fff;position:relative;overflow:hidden}
.final h2{font-size:clamp(30px,4.6vw,52px);font-weight:800;margin-bottom:12px}
.final p{margin:0 0 28px;font-size:18px;opacity:.92}
.final .logo{width:64px;height:64px;margin-bottom:20px;background:rgba(255,255,255,.18);box-shadow:none}
footer{padding:48px 0 40px;color:var(--mut);font-size:14px}
.ft{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center;padding-bottom:26px;border-bottom:1px solid var(--line);margin-bottom:22px}
.ft .brand{color:var(--ink)}
.ft nav{display:flex;gap:18px;flex-wrap:wrap}.ft nav a{text-decoration:none;font-weight:600}.ft nav a:hover{color:var(--ink)}
.langs{display:flex;flex-wrap:wrap;gap:6px 14px}.langs a{text-decoration:none;font-size:13px}.langs a:hover{color:var(--ink)}.langs a.on{color:var(--ink);font-weight:700}
.by{margin-top:22px}
.pp-hero{text-align:center;padding:72px 0 30px}
.pp-hero h1{font-size:clamp(40px,6.4vw,74px);font-weight:800;margin:20px 0 18px}
.pp-hero h1 span{display:block}
.pp-hero .lead{margin:0 auto 30px}
.pp-hero .ctas{justify-content:center}
.rules{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.rules div{display:flex;gap:12px;align-items:flex-start;padding:18px 20px;border-radius:16px;background:var(--card);border:1px solid var(--line);font-weight:600}
.rules .ic{color:#16a34a;margin-top:2px}
.back{display:inline-flex;align-items:center;gap:6px;font-weight:700;text-decoration:none;color:var(--mut);margin-top:26px}
.back .ic{width:18px;height:18px;transform:scaleX(-1)}[dir=rtl] .back .ic{transform:none}
.rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}.rv.in{opacity:1;transform:none}
:focus-visible{outline:3px solid var(--g2);outline-offset:3px;border-radius:6px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}html{scroll-behavior:auto}}
@media (max-width:920px){.hg,.band{grid-template-columns:1fr}.feats{grid-template-columns:1fr 1fr}.steps{grid-template-columns:1fr}.links{display:none}.band{padding:36px 24px}.chip.a{inset-inline-start:-6px}.chip.b{inset-inline-end:-6px}.hero{padding-top:36px}}
@media (max-width:600px){.feats,.rules{grid-template-columns:1fr}.nav .btn{display:none}details.lang{margin-inline-start:auto}section{padding:56px 0}.stats{gap:22px}.extra{flex-direction:column;align-items:flex-start}.more{margin:16px 0 0;display:flex}}
`;

const REVEAL = `<script>
(function(){var h=document.querySelector('header');addEventListener('scroll',function(){h.classList.toggle('sc',scrollY>8)},{passive:true});
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
document.querySelectorAll('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in')});
document.querySelectorAll('[data-l]').forEach(function(a){a.addEventListener('click',function(){try{localStorage.setItem('adspot_lang',a.getAttribute('data-l'))}catch(e){}})});})();
</script>`;
// on the English root only: send a first-time visitor to their own language
const AUTO = (langsList) => `<script>
(function(){try{if(localStorage.getItem('adspot_lang'))return;var L=${JSON.stringify(langsList)};var n=(navigator.languages||[navigator.language||'en']);for(var i=0;i<n.length;i++){var c=String(n[i]).toLowerCase().slice(0,2);if(c==='nb'||c==='nn')c='no';if(c==='en')return;if(c==='iw')c='he';if(c==='fil')c='tl';if(L.indexOf(c)>-1){if(document.referrer.indexOf(location.host)>-1)return;location.replace(location.pathname.replace(/\\/(partners\\/)?$/,'/')+c+'/'+(/partners\\/?$/.test(location.pathname)?'partners/':''));return}}}catch(e){}})();
</script>`;

function head(l, page, T) {
  const title = page === 'partners' ? T.pp_meta_title : T.meta_title;
  const desc = page === 'partners' ? T.pp_meta_desc : T.meta_desc;
  const alt = order.map((x) => `<link rel="alternate" hreflang="${x}" href="${url(x, page)}">`).join('');
  return `<!doctype html>
<html lang="${l}" dir="${RTL.has(l) ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url(l, page)}">
${alt}<link rel="alternate" hreflang="x-default" href="${url('en', page)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AdSpot">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(l, page)}">
<meta property="og:image" content="${BASE}img/og.png">
<meta property="og:locale" content="${l}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#e8336b">
<link rel="icon" href="${BASE}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'AdSpot', applicationCategory: 'BusinessApplication', operatingSystem: 'Telegram', url: url(l, page), description: desc, inLanguage: l, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, author: { '@type': 'Person', name: 'jeremstyke', url: 'https://t.me/jeremstyke' } })}</script>
<style>${CSS.replace(/\n/g, '')}</style>
</head>`;
}

function nav(l, page, T) {
  const from = { l, page };
  const home = rel(from, l, 'home');
  const menu = order.map((x) => `<a href="${rel(from, x, page)}" hreflang="${x}" lang="${x}" data-l="${x}"${x === l ? ' class="on" aria-current="true"' : ''}>${esc(dicts[x].lang_name)}</a>`).join('');
  return `<header><div class="w nav">
<a class="brand" href="${home}">${LOGO}AdSpot</a>
<nav class="links"><a href="${home}#how">${esc(T.nav_how)}</a><a href="${rel(from, l, 'partners')}">${esc(T.nav_partners)}</a><a href="${home}#faq">${esc(T.nav_faq)}</a></nav>
<details class="lang"><summary aria-label="${esc(T.lang_label)}">${ic('globe')}${l.toUpperCase()}</summary><div class="lmenu">${menu}</div></details>
<a class="btn p" href="${BOT}">${esc(T.nav_cta)}</a>
</div></header>`;
}

function foot(l, page, T) {
  const from = { l, page };
  const home = rel(from, l, 'home');
  const all = order.map((x) => `<a href="${rel(from, x, page)}" hreflang="${x}" lang="${x}" data-l="${x}"${x === l ? ' class="on"' : ''}>${esc(dicts[x].lang_name)}</a>`).join('');
  return `<footer><div class="w">
<div class="ft"><a class="brand" href="${home}">${LOGO}AdSpot</a><nav><a href="${BOT}">@PostOnAdSpotBot</a><a href="${CHANNEL}">@adspotchannel</a><a href="${rel(from, l, 'partners')}">${esc(T.nav_partners)}</a><a href="https://github.com/jeremstyke/adspot">GitHub</a></nav></div>
<div class="langs">${all}</div>
<div class="by">AdSpot · ${esc(T.footer_rights)} · by <a href="https://t.me/jeremstyke">@jeremstyke</a></div>
</div></footer>`;
}

function home(l) {
  const T = dicts[l];
  const from = { l, page: 'home' };
  const feats = [['gift', 'f1'], ['spark', 'f2'], ['eye', 'f3'], ['shield', 'f4'], ['users', 'f5'], ['grid', 'f6']]
    .map(([i, k]) => `<div class="f rv"><div class="t">${ic(i)}</div><h3>${esc(T[k])}</h3><p>${esc(T[k + 'd'])}</p></div>`).join('');
  const steps = ['s1', 's2', 's3'].map((k) => `<div class="st rv"><h3>${esc(T[k])}</h3><p>${esc(T[k + 'd'])}</p></div>`).join('');
  const what = [['📣', 'w1'], ['💬', 'w2'], ['🤖', 'w3'], ['📱', 'w4'], ['🌐', 'w5'], ['🎮', 'w6']].map(([e, k]) => `<span>${e} ${esc(T[k])}</span>`).join('');
  const faq = [1, 2, 3, 4, 5].map((n) => `<details><summary>${esc(T['q' + n])}</summary><p>${esc(T['a' + n])}</p></details>`).join('');
  const bullets = ['pt_b1', 'pt_b2', 'pt_b3', 'pt_b4'].map((k) => `<li>${ic('check')}<span>${esc(T[k])}</span></li>`).join('');
  return `${head(l, 'home', T)}
<body>
${l === 'en' ? AUTO(order.filter((x) => x !== 'en')) : ''}${nav(l, 'home', T)}
<main>
<section class="hero"><div class="w hg">
<div>
<span class="badge"><i></i>${esc(T.badge)}</span>
<h1><span>${esc(T.h1a)}</span><span class="grad">${esc(T.h1b)}</span></h1>
<p class="lead">${esc(T.sub)}</p>
<div class="ctas"><a class="btn p" href="${BOT}">${esc(T.cta)}${ic('arrow')}</a><a class="btn s" href="${CHANNEL}">${esc(T.see)}</a></div>
<div class="stats"><div><b>1</b><span>${esc(T.stat1)}</span></div><div><b>40+</b><span>${esc(T.stat2)}</span></div><div><b>100%</b><span>${esc(T.stat3)}</span></div></div>
</div>
<div style="position:relative">
<div class="phone" aria-hidden="true"><div class="screen">
<div class="tbar">${LOGO}<div><b>AdSpot 📢 Free ads</b><small>@adspotchannel</small></div></div>
<div class="msgs"><div class="post"><div class="pimg">${ROCKET}</div><div class="pbd" dir="auto"><b>${esc(T.mock_title)}</b>${esc(T.mock_text)}<div class="q">💼 Business&nbsp;&nbsp;🌍 Worldwide</div><span class="l">📢 Post your ad for free</span><br><span class="l">#business #growth</span></div><div class="ptime">12:04</div></div>
<div class="kb"><div>🚀 ${esc(T.mock_btn)}</div></div></div>
</div></div>
<div class="chip a">${ic('spark')}AI</div>
<div class="chip b">${ic('shield')}100%</div>
</div>
</div></section>

<section><div class="w">
<span class="kick">${esc(T.f_kicker)}</span>
<h2 class="h2">${esc(T.f_title)}</h2>
<div class="feats">${feats}</div>
</div></section>

<section class="alt" id="how"><div class="w">
<span class="kick">${esc(T.how_kicker)}</span>
<h2 class="h2">${esc(T.how_title)}</h2>
<div class="steps">${steps}</div>
<h3 style="font-size:24px;margin:52px 0 14px">${esc(T.what_title)}</h3>
<div class="what">${what}</div>
<div class="extra rv"><div class="s">${ic('star')}</div><div><b>${esc(T.extra_title)}</b><p>${esc(T.extra_d)}</p></div></div>
</div></section>

<section id="partners"><div class="w">
<div class="band rv">
<div style="position:relative"><span class="kick">${esc(T.pt_kicker)}</span><h2>${esc(T.pt_title)}</h2><p>${esc(T.pt_sub)}</p>
<a class="btn y" href="${ADD}">${esc(T.pt_cta)}</a><a class="more" href="${rel(from, l, 'partners')}">${esc(T.pt_more)}${ic('arrow')}</a></div>
<ul>${bullets}</ul>
</div>
</div></section>

<section class="alt" id="faq"><div class="w">
<h2 class="h2">${esc(T.faq_title)}</h2>
<div class="faq">${faq}</div>
</div></section>

<section><div class="w">
<div class="final rv">${LOGO}<h2>${esc(T.final_title)}</h2><p>${esc(T.final_sub)}</p><a class="btn y" href="${BOT}">${esc(T.cta)}${ic('arrow')}</a></div>
</div></section>
</main>
${foot(l, 'home', T)}
${REVEAL}
</body>
</html>
`;
}

function partners(l) {
  const T = dicts[l];
  const from = { l, page: 'partners' };
  const steps = ['pp_s1', 'pp_s2', 'pp_s3'].map((k) => `<div class="st rv"><h3>${esc(T[k])}</h3><p>${esc(T[k + 'd'])}</p></div>`).join('');
  const rules = ['pp_r1', 'pp_r2', 'pp_r3', 'pp_r4'].map((k) => `<div class="rv">${ic('check')}<span>${esc(T[k])}</span></div>`).join('');
  const faq = [1, 2, 3].map((n) => `<details><summary>${esc(T['pp_q' + n])}</summary><p>${esc(T['pp_a' + n])}</p></details>`).join('');
  const bullets = ['pt_b1', 'pt_b2', 'pt_b3', 'pt_b4'].map((k) => `<li>${ic('check')}<span>${esc(T[k])}</span></li>`).join('');
  return `${head(l, 'partners', T)}
<body>
${l === 'en' ? AUTO(order.filter((x) => x !== 'en')) : ''}${nav(l, 'partners', T)}
<main>
<section class="pp-hero hero"><div class="w">
<span class="badge"><i></i>${esc(T.pt_kicker)}</span>
<h1><span>${esc(T.pp_h1a)}</span><span class="grad">${esc(T.pp_h1b)}</span></h1>
<p class="lead">${esc(T.pp_sub)}</p>
<div class="ctas"><a class="btn p" href="${ADD}">${esc(T.pt_cta)}${ic('arrow')}</a></div>
</div></section>
<section><div class="w">
<h2 class="h2">${esc(T.pp_how)}</h2>
<div class="steps">${steps}</div>
</div></section>
<section class="alt"><div class="w">
<h2 class="h2">${esc(T.pp_rules)}</h2>
<div class="rules">${rules}</div>
</div></section>
<section><div class="w">
<div class="band rv"><div style="position:relative"><h2>${esc(T.pt_title)}</h2><p>${esc(T.pt_sub)}</p><a class="btn y" href="${ADD}">${esc(T.pt_cta)}</a></div><ul>${bullets}</ul></div>
</div></section>
<section class="alt"><div class="w">
<h2 class="h2">${esc(T.faq_title)}</h2>
<div class="faq">${faq}</div>
<a class="back" href="${rel(from, l, 'home')}">${ic('arrow')}${esc(T.back)}</a>
</div></section>
</main>
${foot(l, 'partners', T)}
${REVEAL}
</body>
</html>
`;
}

function write(p, s) { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); }

fs.rmSync(OUT, { recursive: true, force: true });
for (const l of order) {
  write(dir(l) + 'index.html', home(l));
  write(dir(l) + 'partners/index.html', partners(l));
}
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6a3d"/><stop offset=".6" stop-color="#e8336b"/><stop offset="1" stop-color="#a8247e"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g)"/><g transform="translate(50 50) rotate(35) scale(.13)">${ROCKET.replace(/<svg[^>]*>|<\/svg>/g, '')}</g></svg>`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
const sm = order.flatMap((l) => ['home', 'partners'].map((pg) => `<url><loc>${url(l, pg)}</loc>${order.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${url(x, pg)}"/>`).join('')}</url>`)).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`);
write('404.html', home('en').replace('<head>', `<head><base href="${BASE}">`));
write('.nojekyll', '');
console.log(`Built ${order.length} languages, ${order.length * 2} pages`);
