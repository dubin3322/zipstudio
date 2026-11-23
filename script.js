/* =========================================================
   풍담 風談 — script.js (모든 페이지 공통)
   각 페이지 HTML: <body data-page="…">, data.js → script.js → pages/*.js 순서
   ========================================================= */

/* ---------- 아이콘: 1.5px 선, 24 그리드 ---------- */
const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  chime: '<path d="M12 2v3"/><path d="M7 13a5 5 0 0 1 10 0v1H7Z"/><path d="M12 14v3"/><rect x="10" y="17" width="4" height="5" rx=".5"/>',
  sound: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  mute: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  share: '<path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
  comment: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/>',
  pin: '<path d="M12 21s-7-6.1-7-12a7 7 0 0 1 14 0c0 5.9-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  card: '<rect x="8" y="2" width="8" height="20" rx="1"/><path d="M12 5v2"/>',
};
function icon(name, label) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="icon" viewBox="0 0 24 24" ${a11y}>${ICONS[name] || ''}</svg>`;
}

/* ---------- 저장소 (localStorage, pd_ 접두어) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('pd_' + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('pd_' + key, JSON.stringify(value)); return true; }
    catch {
      toast('저장 공간이 가득 찼어요. 사진 수를 줄이거나 시연 초기화를 해 주세요.');
      return false;
    }
  },
};

/* ---------- 주소 파라미터 (?season=autumn) ---------- */
function getParam(name) { return new URLSearchParams(location.search).get(name); }
function setParams(obj) {
  const p = new URLSearchParams(location.search);
  Object.entries(obj).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
  const qs = p.toString();
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

/* ---------- 토스트 ---------- */
function toast(message, action) {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  if (action) {
    const btn = document.createElement(action.href ? 'a' : 'button');
    btn.textContent = action.label;
    if (action.href) btn.href = action.href;
    if (action.onClick) btn.addEventListener('click', () => { action.onClick(); el.remove(); });
    el.append(btn);
  }
  region.append(el);
  setTimeout(() => el.remove(), action ? 5000 : 3000);
}

/* ---------- 확인 모달 (네이티브 <dialog>: 포커스 가두기·Esc 기본 제공) ---------- */
function confirmModal({ title, message, confirmLabel = '확인', danger = false }) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.className = 'modal';
    dlg.innerHTML = `
      <h2 class="h3">${title}</h2>
      ${message ? `<p class="body-sm">${message}</p>` : ''}
      <form method="dialog" class="modal__actions">
        <button class="btn btn--secondary" value="cancel">취소</button>
        <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" value="ok">${confirmLabel}</button>
      </form>`;
    document.body.append(dlg);
    dlg.addEventListener('close', () => { resolve(dlg.returnValue === 'ok'); dlg.remove(); });
    dlg.showModal();
  });
}

/* ---------- 풍경 흔들림 ---------- */
function swingChime(el) {
  el.classList.remove('is-swinging');
  void el.offsetWidth; // 애니메이션 다시 시작
  el.classList.add('is-swinging');
}

/* ---------- 스크롤 등장 ---------- */
function initReveal(root = document) {
  const items = root.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- GNB · 모바일 메뉴 ---------- */
const NAV = [
  { href: 'about.html', label: 'ABOUT', pages: ['about'] },
  { href: 'places.html', label: 'PLACES', pages: ['places', 'place'] },
  { href: 'test.html', label: 'TEST', pages: ['test'] },
  { href: 'community.html', label: 'COMMUNITY', pages: ['community', 'post'] },
];

function renderHeader() {
  const slot = document.getElementById('site-header');
  if (!slot) return;
  const page = document.body.dataset.page;
  const links = NAV.map((n) => {
    const on = n.pages.includes(page);
    return `<a class="gnb__link${on ? ' is-active' : ''}" href="${n.href}"${on ? ' aria-current="page"' : ''}>${n.label}</a>`;
  }).join('');
  const sheetLinks = NAV.map((n) =>
    `<a href="${n.href}"${n.pages.includes(page) ? ' class="is-active" aria-current="page"' : ''}>${n.label}</a>`).join('');

  slot.innerHTML = `
    <div class="gnb" data-gnb>
      <div class="gnb__inner container">
        <a class="gnb__logo" href="index.html" aria-label="풍담 홈"><span class="gnb__logo-ko">풍담</span><span class="gnb__logo-han" aria-hidden="true">風談</span></a>
        <nav class="gnb__nav" aria-label="주 메뉴">${links}</nav>
        <div class="gnb__actions">
          <a class="icon-btn icon-btn--ghost" href="write.html" title="기록하기">${icon('pen', '기록하기')}</a>
          <a class="icon-btn icon-btn--ghost" href="my.html" title="내 기록">${icon('user', '내 기록')}</a>
          <button class="icon-btn icon-btn--ghost gnb__menu-btn" type="button" aria-expanded="false" aria-controls="menu-sheet">${icon('menu', '메뉴 열기')}</button>
        </div>
      </div>
    </div>
    <div class="menu-sheet" id="menu-sheet" hidden>
      <div class="menu-sheet__top">
        <a class="gnb__logo" href="index.html"><span class="gnb__logo-ko">풍담</span></a>
        <button class="icon-btn icon-btn--ghost" type="button" data-menu-close>${icon('close', '메뉴 닫기')}</button>
      </div>
      <nav class="menu-sheet__nav" aria-label="모바일 메뉴">${sheetLinks}</nav>
      <p class="menu-sheet__foot caption">감각으로 간직하는 여행의 한 조각 · 풍담</p>
    </div>`;

  const gnb = slot.querySelector('[data-gnb]');
  // Hero가 있는 페이지(<body data-hero>)는 처음엔 투명, 스크롤하면 바탕이 깔림
  if (document.body.hasAttribute('data-hero')) {
    const update = () => gnb.classList.toggle('is-transparent', window.scrollY < 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  const sheet = slot.querySelector('#menu-sheet');
  const openBtn = slot.querySelector('.gnb__menu-btn');
  const setMenu = (open) => {
    sheet.hidden = !open;
    openBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? sheet.querySelector('[data-menu-close]') : openBtn).focus();
  };
  openBtn.addEventListener('click', () => setMenu(true));
  sheet.querySelector('[data-menu-close]').addEventListener('click', () => setMenu(false));
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

function renderFooter() {
  const slot = document.getElementById('site-footer');
  if (!slot) return;
  slot.innerHTML = `
    <div class="footer">
      <div class="container">
        <div class="footer__top">
          <div>
            <p class="footer__logo">풍담</p>
            <p class="footer__tagline">風談 · 청주를 담은 풍경</p>
          </div>
          <nav class="footer__nav" aria-label="하단 메뉴">
            ${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join('')}
            <a href="write.html">기록하기</a><a href="my.html">내 기록</a>
          </nav>
          <div class="footer__contact">
            <span>문의 · 시연용</span>
            <a href="mailto:poongdam@gmail.com">poongdam@gmail.com</a>
            <a href="#" aria-disabled="true">Instagram</a>
          </div>
        </div>
        <div class="footer__bottom">
          <p>이 사이트는 창업 프로젝트 시연을 위한 프로토타입이며, 이웃 기록은 예시 콘텐츠입니다.</p>
          <p>© 2026 NeighborZIP STUDIO · <button type="button" data-reset-demo>시연 초기화</button></p>
        </div>
      </div>
    </div>`;
  slot.querySelector('[data-reset-demo]').addEventListener('click', resetDemo);
}

/* ---------- 시연 초기화: pd_ 로 시작하는 저장값만 지움 ---------- */
async function resetDemo() {
  const ok = await confirmModal({
    title: '시연을 처음 상태로 되돌릴까요?',
    message: '저장한 장소, 남긴 기록, 모은 카드가 모두 지워져요.',
    confirmLabel: '초기화', danger: true,
  });
  if (!ok) return;
  Object.keys(localStorage).filter((k) => k.startsWith('pd_')).forEach((k) => localStorage.removeItem(k));
  location.reload();
}

/* ---------- 데이터 도우미 (data.js 사용) ---------- */
const placeById = (id) => PLACES.find((p) => p.id === id);
const cardById = (id) => CARDS.find((c) => c.id === id);
const seasonOf = (key) => SEASONS[key] || SEASONS[DEMO_SEASON];

// 이웃이 쓴 기록(data.js) + 내가 쓴 기록(localStorage), 최신순
function allRecords() {
  return [...store.get('records', []), ...RECORDS].sort((a, b) => b.date.localeCompare(a.date));
}

// 사용자가 입력한 글자는 HTML로 해석되지 않게 바꿔서 넣기
function esc(text = '') {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// 장소 사진 n번째 (사진이 없으면 '' → 자리 표시). season은 계절 사진이 생길 때를 위해 받아만 둠
function placeImage(place, season, n = 1) {
  const count = (place && PLACE_PHOTOS[place.id]) || 0;
  return count ? `assets/images/places/${place.id}-${((n - 1) % count) + 1}.jpg` : '';
}
// 기록 사진: 직접 올린 사진 → 없으면 그 장소의 사진을 빌려 씀 (예시 기록용)
const recordImage = (r, n = 1) => (r.images && r.images[n - 1]) || placeImage(placeById(r.place), r.season, n + [...r.id].reduce((a, ch) => a + ch.charCodeAt(0), 0));

// 이미지 칸: 파일이 없으면 img가 지워지고 자리 표시 글자가 보임
function media(src, alt, label, ratio = '4x5') {
  return `<div class="media media--${ratio}">
    <span class="media__ph" aria-hidden="true">${esc(label)}</span>
    ${src ? `<img src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : ''}
  </div>`;
}

/* ---------- 공통 카드 ---------- */
function renderPlaceCard(place, season = DEMO_SEASON) {
  return `
    <article class="card" data-reveal>
      ${media(placeImage(place, season), `${place.name}`, place.name)}
      <div class="card__body">
        <h3 class="card__title"><a class="card__link" href="place.html?id=${place.id}&season=${season}">${place.name}</a></h3>
        <span class="card__meta">${DISTRICTS[place.district] || ''}</span>
      </div>
    </article>`;
}

// 작은 가로형 장소 카드 (TEST 추천, 함께 가기 좋은 곳)
function renderPlaceRow(place, season = DEMO_SEASON) {
  const s = place.seasons[season] ? season : (Object.keys(place.seasons)[0] || season);
  const line = place.seasons[s] || place.about;
  return `
    <article class="card-row">
      ${media(placeImage(place, s), `${place.name}`, place.name, '1x1')}
      <div>
        <p class="card__title"><a class="card__link" href="place.html?id=${place.id}&season=${s}">${place.name}</a></p>
        <p class="caption">${DISTRICTS[place.district]} · ${line}</p>
      </div>
    </article>`;
}

function renderRecordCard(r) {
  const place = placeById(r.place) || { name: r.placeName || '기타 장소', district: r.district };
  const district = DISTRICTS[place.district] || '';
  const link = `<a class="card__link" href="post.html?id=${r.id}">`;
  const meta = `<span class="card__meta">${esc(place.name)} · ${esc(r.user)}</span>`;

  if (r.type === 'recommend') {   // 사진 없는 추천 글: 글자만
    return `
      <article class="card card-quote" data-reveal>
        <div class="media media--4x5"><p class="card-quote__text">${esc(r.title)}</p></div>
        <div class="card__body">
          <h3 class="card__title">${link}${esc(place.name)}</a></h3>
          <span class="card__meta">${district} · ${esc(r.user)}</span>
        </div>
      </article>`;
  }
  return `
    <article class="card" data-reveal>
      ${media(recordImage(r), `${place.name}에서 남긴 사진`, `${place.name}`)}
      <div class="card__body">
        <h3 class="card__title">${link}${esc(r.title)}</a></h3>
        ${meta}
      </div>
    </article>`;
}

/* ---------- 장소 저장 (모든 페이지의 [data-save] 버튼) ---------- */
function setSaved(id, on) {
  const list = store.get('saved', []).filter((x) => x !== id);
  if (on) list.unshift(id);
  store.set('saved', list);
  document.querySelectorAll(`[data-save="${id}"]`).forEach((b) => {
    b.classList.toggle('is-saved', on);
    b.setAttribute('aria-pressed', on);
  });
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-save]');
  if (!btn) return;
  const id = btn.dataset.save;
  const on = !btn.classList.contains('is-saved');
  setSaved(id, on);
  swingChime(btn);
  if (on) toast('저장한 장소에 담았어요', { label: '보러 가기', href: 'my.html#saved' });
  else toast('저장을 취소했어요', { label: '되돌리기', onClick: () => setSaved(id, true) });
});

/* ---------- 풍경 소리 (Web Audio로 직접 합성: 음원 파일 없이 동작) ---------- */
let audioCtx = null;
let soundOn = false;   // 모바일은 사용자가 버튼을 눌러야만 소리를 낼 수 있음

function playChime(strength = 1) {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime;
  const base = 880 * (0.97 + Math.random() * 0.06);          // 칠 때마다 음이 살짝 다름
  [[1, 1], [2.76, 0.45], [5.4, 0.2], [8.93, 0.08]].forEach(([ratio, gain]) => {  // 종의 배음
    const osc = audioCtx.createOscillator();
    const vol = audioCtx.createGain();
    osc.frequency.value = base * ratio;
    vol.gain.setValueAtTime(0.0001, t);
    vol.gain.exponentialRampToValueAtTime(0.16 * gain * strength, t + 0.01);
    vol.gain.exponentialRampToValueAtTime(0.0001, t + 3 / Math.sqrt(ratio));
    osc.connect(vol).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 3.2);
  });
}

function setSound(on) {
  soundOn = on;
  if (on) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
    playChime();
  }
  document.querySelectorAll('[data-sound-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', on);
    b.innerHTML = `${icon(on ? 'sound' : 'mute')}<span>${on ? '바람 소리 끄기' : '바람 소리 켜기'}</span>`;
  });
}
document.addEventListener('click', (e) => { if (e.target.closest('[data-sound-toggle]')) setSound(!soundOn); });

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 풍경 선 그림 (Hero·NFC·TEST·ABOUT 공용). 누끼 이미지가 생기면 이 함수만 바꾸면 됨
function chimeSvg() {   // 실제 제품 사진을 따라 그린 풍경 (종 · 추 · 목련 · 구슬 · 카드)
  return `<svg viewBox="0 0 200 640" aria-hidden="true"><g stroke="#1F2320" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
  <path d="M100 0V118" stroke="#3A3D3A" stroke-width="1.6"/>
  <circle cx="100" cy="58" r="5.5" fill="#F4F2EC"/>
  <ellipse cx="100" cy="116" rx="3" ry="4" fill="none"/>
  <path d="M80 138 C80 130 85 126 90 128 C91 122 95 120 100 120 C105 120 109 122 110 128 C115 126 120 130 120 138 Z" fill="#5E5243"/>
  <path d="M90 128 C92 133 94 136 95 138 M110 128 C108 133 106 136 105 138 M100 121 V138" stroke="#3A322A" stroke-width=".8"/>
  <path d="M65 238 L67 176 C67 150 82 136 100 136 C118 136 133 150 133 176 L135 238 Z" fill="#FFFFFF"/>
  <path d="M75 170 C76 156 84 146 94 142" fill="none" stroke="#D9D8D3" stroke-width="2"/>
  <ellipse cx="100" cy="238" rx="35" ry="5" fill="#ECEBE6"/>
  <circle cx="100" cy="244" r="11" fill="#5E5243"/>
  <circle cx="96" cy="240" r="3" fill="#8A7C68" stroke="none"/>
  <path d="M100 255 V296" stroke-width="1.2"/>
  <ellipse cx="100" cy="264" rx="2.2" ry="3.2" fill="none"/>
  <g fill="#FFFFFF" stroke-width=".9">
    <path d="M100 312 C94 300 96 292 100 286 C104 292 106 300 100 312 Z"/>
    <path d="M100 314 C92 306 84 296 84 286 C93 290 99 302 100 314 Z"/>
    <path d="M100 314 C108 306 116 296 116 286 C107 290 101 302 100 314 Z"/>
    <path d="M100 316 C86 318 74 312 68 302 C80 300 92 306 100 314 Z"/>
    <path d="M100 316 C114 318 126 312 132 302 C120 300 108 306 100 314 Z"/>
    <path d="M100 314 C90 318 82 328 80 340 C90 334 97 326 100 316 Z"/>
    <path d="M100 314 C110 318 118 328 120 340 C110 334 103 326 100 316 Z"/>
    <path d="M100 314 C95 324 96 334 100 344 C104 334 105 324 100 314 Z"/>
  </g>
  <path d="M100 344 V416" stroke="#3A3D3A" stroke-width="1.6"/>
  <circle cx="100" cy="362" r="4.5" fill="#8FA696"/>
  <circle cx="100" cy="384" r="6.5" fill="#7E9888"/>
  <path d="M95 412 L105 418 M105 412 L95 418" stroke-width="1.2"/>
  <rect x="70" y="420" width="60" height="178" fill="#FFFFFF"/>
  <circle cx="100" cy="427" r="2.4" fill="#FFFFFF"/>
  <rect x="116" y="432" width="9" height="17" fill="none" stroke="#3E7A55" stroke-width=".8"/>
  <path d="M118.5 436 h4 M118.5 440 h4 M118.5 444 h4" stroke="#3E7A55" stroke-width=".6"/>
  <path d="M76 452 h30 M76 458 h24" stroke-width="3"/>
  <path d="M76 467 h47 M76 471 h45 M76 475 h47 M76 479 h42 M76 483 h46 M76 487 h30" stroke="#8A8D86" stroke-width=".8"/>
  <path d="M75 594 V546 L82 534 L92 530 L100 524 L110 530 L120 534 L125 546 V594 Z" fill="#1F2320"/>
  <path d="M103 530 C97 540 112 548 105 560 C98 571 113 580 108 594 L116 594 C121 580 107 571 113 560 C120 548 105 540 108 530 Z" fill="#FFFFFF" stroke="none"/>
  <g fill="#1F2320" stroke="none"><circle cx="86" cy="526" r="4"/><circle cx="100" cy="518" r="5"/><circle cx="114" cy="526" r="4"/></g>
  <path d="M86 530 V536 M100 523 V530 M114 530 V536" stroke-width="1"/>
  <path d="M80 594 C80 582 81 574 82 566 M84 594 C85 584 86 578 88 572" stroke="#FFFFFF" stroke-width="1"/>
  <rect x="70" y="420" width="60" height="178" fill="none"/>
</g></svg>`;
}

// 오늘 날짜를 2026.11.23 형식으로
function today() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 공유: 휴대폰은 공유 창, 안 되면 링크 복사
async function shareLink(url, title) {
  const full = new URL(url, location.href).href;
  if (navigator.share) {
    try { await navigator.share({ title, url: full }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(full); toast('링크를 복사했어요'); }
  catch { prompt('이 링크를 복사해 주세요', full); }
}

// 카드 이미지 칸 (3:7)
function cardMedia(card) {
  return media(`assets/images/cards/${card.id}.jpg`, `${card.name} 카드 일러스트`, card.name, 'card');
}

// 기록 하나에 대한 내 반응 (좋아요 / 다시 가고 싶어요)
const reactionOf = (id) => store.get('reactions', {})[id] || {};
function setReaction(id, key, on) {
  const all = store.get('reactions', {});
  all[id] = { ...all[id], [key]: on };
  store.set('reactions', all);
}
const revisitCount = (r) => r.revisit + (reactionOf(r.id).revisit ? 1 : 0);
const commentsOf = (r) => [...(r.comments || []), ...(store.get('comments', {})[r.id] || [])];

/* ---------- 시연 데이터: 처음 방문 시 카드 1/4 수집 상태 ---------- */
function seedDemoData() {
  if (store.get('seeded', false)) return;
  store.set('cards', { sangdang: '2026.01.12' });
  store.set('seeded', true);
}

// HTML 안의 <span data-icon="arrow"></span> 을 아이콘으로 바꿈
function fillIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
}

/* ---------- 시작 ---------- */
seedDemoData();
renderHeader();
renderFooter();
fillIcons();
setSound(false);
initReveal();
