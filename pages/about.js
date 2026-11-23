/* ABOUT (about.html) — 이름 · 왜 · 어떻게 · 네 가지 상징 · 풍경의 구성 · 카드 4장 · 온라인 풍경(#wind) · 여정 · 팀 */

const root = document.querySelector('[data-about]');

// 상징 일러스트 (가는 선, 임시: 일러스트 파일이 생기면 교체)
const SYMBOL_ART = {
  magnolia: '<path d="M50 78V48"/><path d="M50 50c-9-6-12-19-6-30 7 5 9 16 6 30Z"/><path d="M50 50c9-6 12-19 6-30-7 5-9 16-6 30Z"/><path d="M50 52c-13 2-23-6-25-17 10-1 20 6 25 17Z"/><path d="M50 52c13 2 23-6 25-17-10-1-20 6-25 17Z"/>',
  zelkova: '<path d="M50 82V52M50 62l-10-8M50 58l9-7"/><path d="M22 46c0-14 12-24 28-24s28 10 28 24-12 16-28 16-28-2-28-16Z"/>',
  magpie: '<path d="M30 62 C34 50 44 44 55 44 C58 37 64 33 70 33 C75 33 79 37 79 41 L86 43 L79 45.5 C78 52 73 58 66 62 C58 67 47 69 39 67 Z"/>   <path d="M40 65 L12 84 C13 86 15 87 17 86 L46 68"/>   <path d="M44 52 C50 57 58 59 67 56"/>   <path d="M55 44 C60 48 64 52 66 56"/>   <path d="M52 68 L51 78 M51 78 L47 80 M51 78 L54 80 M59 66 L59 77 M59 77 L56 79 M59 77 L62 79"/>   <circle cx="72.5" cy="38.5" r="1.3" fill="currentColor"/>',
  jikji: '<rect x="28" y="26" width="44" height="48" rx="2"/><path d="M36 36h28M36 46h28M36 56h20M36 66h24"/><rect x="58" y="54" width="8" height="8"/>',
};
const SYMBOLS = [
  { key: 'magnolia', ko: '백목련', en: 'Magnolia', role: '청주시화', back: '이른 봄, 잎보다 먼저 피는 흰 꽃. 풍담 풍경의 반투명 목련 장식이 되었어요.' },
  { key: 'zelkova', ko: '느티나무', en: 'Zelkova', role: '청주시목', back: '오래 그 자리를 지키며 그늘을 내어 주는 나무. 마을의 쉼터가 되어 온 청주의 나무예요.' },
  { key: 'magpie', ko: '까치', en: 'Magpie', role: '청주시조', back: '반가운 소식을 전한다고 여겨 온 새. 청주의 하늘을 가장 가까이에서 나는 이웃이에요.' },
  { key: 'jikji', ko: '직지', en: 'Jikji', role: '청주의 역사', back: '청주 흥덕사에서 찍어낸, 지금 남아 있는 가장 오래된 금속활자본. 기록의 도시 청주를 상징해요.' },
];
const PARTS = [
  { y: 29, name: '도자 종', text: '바람이 지나갈 때 맑은 소리를 내는 몸체' },
  { y: 49, name: '목련 장식', text: '청주시화 백목련을 반투명하게 빚은 장식' },
  { y: 58, name: '구슬', text: '바람의 무게를 잡아 주는 청자빛 추' },
  { y: 72, name: '기록 카드', text: '장소 일러스트와 NFC를 담은 카드 (약 10.5 × 4.5cm)' },
  { y: 89, name: '향 오일', text: '카드에 한 방울 머금게 하는 장소의 향' },
];
const JOURNEY = ['풍경을 걸다', '카드를 태그하다', '장소를 기록하다', '다시 꺼내 보다', '기억이 선명해지다', '다시 청주로'];
const TEAM = [
  { file: 'byeon-jinkyung', name: '변진경', role: '리서치 · 사업화' },
  { file: 'lee-subin', name: '이수빈', role: '웹서비스 기획 · 디자인' },
  { file: 'kim-minseo', name: '김민서', role: '제품 · 패키지 디자인' },
];

root.innerHTML = `
  <!-- A1 이름 -->
  <section class="about-hero">
    <div class="about-hero__shadow" aria-hidden="true">${chimeSvg()}</div>
    <div class="container" style="position:relative">
      <span class="eyebrow">ABOUT</span>
      <h1 class="about-hero__han" style="margin-top:24px">風談</h1>
      <p class="about-hero__gloss">바람 풍 風 · 이야기 담 談</p>
      <p class="about-hero__line">바람이 들려주는 청주의 이야기, 풍담.</p>
      <p class="caption">by 이웃ZIP STUDIO</p>
      <button class="btn btn--secondary" type="button" data-sound-toggle aria-pressed="false"></button>
    </div>
  </section>

  <!-- A2 왜 -->
  <section class="section">
    <div class="container why">
      <div class="why__sticky">
        <span class="eyebrow">WHY</span>
        <h2 class="h1" style="margin-top:16px">청주의 상징은<br>아직 평면에<br>머물러 있습니다.</h2>
      </div>
      <ol class="why__list">
        <li data-reveal><p class="why__num">01</p><h3 class="h3" style="margin-top:8px">보여주기만 하는 상징</h3>
          <p style="margin-top:8px; color:var(--color-text-sub)">백목련, 느티나무, 까치, 직지. 분명한 상징이 있지만 소장하고 싶은 형태로 만난 적은 드뭅니다.</p></li>
        <li data-reveal><p class="why__num">02</p><h3 class="h3" style="margin-top:8px">서랍 속으로 사라지는 기념품</h3>
          <p style="margin-top:8px; color:var(--color-text-sub)">엽서, 스티커, 마그넷. 평면 기념품은 공간에 오래 머물기 어렵습니다.</p></li>
        <li data-reveal><p class="why__num">03</p><h3 class="h3" style="margin-top:8px">여행이 끝나면 끊기는 연결</h3>
          <p style="margin-top:8px; color:var(--color-text-sub)">기념품을 산 뒤, 청주와의 관계는 그곳에서 멈춥니다.</p></li>
      </ol>
    </div>
  </section>

  <!-- A3 어떻게 -->
  <section class="section section--alt">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">HOW</span>
        <h2 class="h2">보여주는 기념품에서,<br>보고 듣고 맡고 기록하는 풍경으로.</h2>
      </div>
      <div class="kinetic">
        ${[['SEE', '보다', '청주의 상징을 입체로 빚은 형태'], ['HEAR', '듣다', '바람이 지나갈 때 울리는 도자의 맑은 소리'],
           ['SCENT', '맡다', '장소를 떠올리게 하는 향'], ['RECORD', '기록하다', '카드를 태그해 이어지는 여행 기록']].map(([w, ko, d]) => `
          <div class="kinetic__line" data-reveal>
            <span class="kinetic__word">${w}</span>
            <span class="kinetic__paren">( ${ko} )</span>
            <span class="kinetic__desc">${d}</span>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- A4 네 가지 상징 -->
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">FOUR SYMBOLS</span>
        <h2 class="h2">청주가 품은 네 가지 상징</h2>
        <p class="lead">카드를 누르면 이야기가 펼쳐져요.</p>
      </div>
      <div class="grid grid--4">
        ${SYMBOLS.map((s) => `
          <div class="flip" data-reveal>
            <button type="button" data-flip aria-pressed="false" aria-label="${s.ko} 이야기 보기">
              <span class="flip__inner">
                <span class="flip__face symbol">
                  <span class="media media--4x5"><svg viewBox="0 0 100 100" aria-hidden="true">${SYMBOL_ART[s.key]}</svg></span>
                  <span><span class="caption">${s.role}</span><span class="h3" style="display:block">${s.ko} <span class="caption">${s.en}</span></span></span>
                </span>
                <span class="flip__face flip__back"><span class="eyebrow">${s.en}</span><span class="h3">${s.ko}</span><span class="body-sm">${s.back}</span></span>
              </span>
            </button>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- A5 풍경의 구성 -->
  <section class="section section--alt">
    <div class="container anatomy">
      <div class="anatomy__figure" data-reveal>
        ${chimeSvg()}
        ${PARTS.map((p, i) => `<button class="hotspot" type="button" style="left:50%; top:${p.y}%" data-part="${i}" aria-label="${p.name}">${i + 1}</button>`).join('')}
      </div>
      <div data-reveal>
        <span class="eyebrow">OBJECT</span>
        <h2 class="h2" style="margin-top:16px">하나의 풍경, 다섯 개의 결</h2>
        <ol class="anatomy__list" style="margin-top:32px">
          ${PARTS.map((p, i) => `<li data-part-row="${i}"><span>${i + 1}</span><span><strong>${p.name}</strong><br><span class="body-sm" style="color:var(--color-text-sub)">${p.text}</span></span></li>`).join('')}
        </ol>
        <p class="caption" style="margin-top:16px">전체 길이 약 33cm (예정)</p>
        <a class="btn btn--secondary" style="margin-top:24px" href="place.html?id=poongdam-showroom">쇼룸에서 직접 들어 보기</a>
      </div>
    </div>
  </section>

  <!-- A6 카드 4장 -->
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">FOUR CARDS</span>
        <h2 class="h2">카드 한 장에 계절 하나, 장소 하나</h2>
        <p class="lead">풍경 아래에 거는 기록 카드. 계절마다 바꿔 걸고, 휴대폰을 가까이 대면 그 장소의 이야기가 열립니다.</p>
      </div>
      <div class="grid grid--4">
        ${CARDS.map((c) => { const p = placeById(c.placeId); return `
          <div class="flip season-${c.season}" data-reveal>
            <button type="button" data-flip aria-pressed="false" aria-label="${c.name} 카드 뒤집기">
              <span class="flip__inner">
                <span class="flip__face"><span class="card-collect" style="width:min(100%, 200px); display:block">${cardMedia(c)}</span>
                  <span class="caption" style="display:block; margin-top:12px">${c.name}</span></span>
                <span class="flip__face flip__back">
                  <span class="eyebrow" style="color:var(--season)">${SEASONS[c.season].ko} · ${DISTRICTS[p.district]}</span>
                  <span class="h3">${p.name}</span>
                  <span class="body-sm" style="font-family:var(--font-serif)">${c.scent}</span>
                </span>
              </span>
            </button>
            <a class="link-arrow" href="place.html?id=${p.id}&season=${c.season}" style="font-size:var(--fs-sm)">장소 보기 ${icon('arrow')}</a>
          </div>`; }).join('')}
      </div>
    </div>
  </section>

  <!-- A7 온라인 풍경 -->
  <section class="section section--alt" id="wind">
    <div class="container wind">
      <div class="section-head section-head--center" style="margin-bottom:0">
        <span class="eyebrow">ONLINE WIND CHIME</span>
        <h2 class="h2">풍경이 없어도, 바람은 불어요.</h2>
        <p class="lead">카드 한 장을 걸고, 화면 위로 바람을 보내 보세요.</p>
      </div>
      <div class="chip-group wind__cards" role="group" aria-label="카드 고르기" data-wind-cards>
        ${CARDS.map((c) => `<button class="chip season-${c.season}" type="button" data-wind-card="${c.id}" aria-pressed="false">${SEASONS[c.season].ko} · ${c.name}</button>`).join('')}
      </div>
      <div class="wind__stage" data-stage>
        <img class="wind__bg" alt="" data-wind-bg onerror="this.hidden=true">
        <div class="wind__chime" data-wind-chime>${chimeSvg()}</div>
        <p class="wind__meter" aria-live="polite" data-meter>마우스나 손가락을 화면 위에서 움직여 보세요</p>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center">
        <button class="btn btn--primary" type="button" data-gust>바람 보내기</button>
        <button class="btn btn--secondary" type="button" data-sound-toggle aria-pressed="false"></button>
      </div>
      <a class="link-arrow" href="#" data-wind-place>이 장소 보러 가기 ${icon('arrow')}</a>
    </div>
  </section>

  <!-- A8 다시 이어지는 여행 -->
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">JOURNEY</span>
        <h2 class="h2">기록이 선명할수록, 다시 떠나고 싶어집니다.</h2>
      </div>
      <ol class="timeline">${JOURNEY.map((s, i) => `<li data-reveal><span class="caption">0${i + 1}</span><strong>${s}</strong></li>`).join('')}</ol>
      <p class="notice" style="margin-top:40px">여행 기록이 기억을 선명하게 하고, 재방문 의도를 높인다는 연구 결과에 기반했습니다. (이현애·정남호·구철모, 2016)</p>
    </div>
  </section>

  <!-- A9 팀 · 마무리 -->
  <section class="section section--alt">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">TEAM</span>
        <h2 class="h2">이웃ZIP STUDIO</h2>
      </div>
      <div class="team">
        ${TEAM.map((m) => `<div data-reveal>${media(`assets/images/team/${m.file}.jpg`, `${m.name} 사진`, m.name)}<p class="h3">${m.name}</p><p class="caption">${m.role}</p></div>`).join('')}
      </div>
    </div>
  </section>
  <section class="closing">
    <p data-reveal>이제, 당신의 청주를 들려주세요.</p>
    <p class="hero__en" style="font-family:var(--font-sans); font-size:var(--fs-sm); margin-top:12px">Travel to the city of your choice.</p>
    <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:32px">
      <a class="btn btn--primary" href="test.html">TEST 시작하기</a>
      <a class="btn btn--secondary" href="places.html">PLACES 둘러보기</a>
    </div>
  </section>`;

setSound(false);   // 새로 그린 소리 버튼들의 글자 채우기

/* ---------- 카드 뒤집기 ---------- */
root.addEventListener('click', (e) => {
  const b = e.target.closest('[data-flip]');
  if (!b) return;
  const flip = b.closest('.flip');
  const on = flip.classList.toggle('is-flipped');
  b.setAttribute('aria-pressed', on);
});

/* ---------- 풍경의 구성: 번호 ↔ 설명 연결 ---------- */
function highlight(i) { root.querySelectorAll('[data-part-row]').forEach((li) => li.classList.toggle('is-active', li.dataset.partRow === String(i))); }
root.querySelectorAll('[data-part]').forEach((b) => {
  b.addEventListener('mouseenter', () => highlight(b.dataset.part));
  b.addEventListener('focus', () => highlight(b.dataset.part));
  b.addEventListener('click', () => highlight(b.dataset.part));
});

/* ---------- 온라인 풍경 ---------- */
const stage = root.querySelector('[data-stage]');
const windChime = root.querySelector('[data-wind-chime]');
const meter = root.querySelector('[data-meter]');
let current = cardById(getParam('card')) || cardById('jeongbuk');
// 계절마다 바람 소리의 결이 다름 (높을수록 차고 가는 바람)
const WIND_TONE = { spring: 1600, summer: 800, autumn: 1200, winter: 2600 };

function selectCard(card) {
  current = card;
  const place = placeById(card.placeId);
  stage.className = `wind__stage season-${card.season}`;
  root.querySelectorAll('[data-wind-card]').forEach((b) => {
    const on = b.dataset.windCard === card.id;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', on);
  });
  const bg = root.querySelector('[data-wind-bg]');
  bg.hidden = false;
  bg.src = placeImage(place, card.season);
  const link = root.querySelector('[data-wind-place]');
  link.href = `place.html?id=${place.id}&season=${card.season}`;
  link.firstChild.textContent = `${place.name} 보러 가기 `;
}
root.querySelector('[data-wind-cards]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-wind-card]');
  if (b) selectCard(cardById(b.dataset.windCard));
});
selectCard(current);

// 바람 소리: 잡음을 걸러서 '쉬익' 하는 바람을 만듦 (음원 파일 없이)
function windSound(strength) {
  if (!soundOn || !audioCtx) return;
  const len = audioCtx.sampleRate * 1.6;
  const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const vol = audioCtx.createGain();
  src.buffer = buf;
  filter.type = 'bandpass';
  filter.frequency.value = WIND_TONE[current.season];
  filter.Q.value = 0.8;
  const t = audioCtx.currentTime;
  vol.gain.setValueAtTime(0.0001, t);
  vol.gain.exponentialRampToValueAtTime(0.05 * strength + 0.01, t + 0.4);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
  src.connect(filter).connect(vol).connect(audioCtx.destination);
  src.start(t);
}

let lastX = null, lastT = 0, lastRing = 0, settle;
function blow(speed) {                      // speed: 방향이 있는 바람 세기 (-1 ~ 1 정도)
  const tilt = Math.max(-6, Math.min(6, speed * 8));
  windChime.style.setProperty('--tilt', `${tilt}deg`);
  const strength = Math.min(1, Math.abs(speed));
  meter.textContent = strength > 0.6 ? '센바람' : strength > 0.25 ? '산들바람' : '실바람';
  const now = performance.now();
  if (strength > 0.25 && now - lastRing > 900) { playChime(strength); windSound(strength); lastRing = now; }
  clearTimeout(settle);
  settle = setTimeout(() => windChime.style.setProperty('--tilt', '0deg'), 220);
}
stage.addEventListener('pointermove', (e) => {
  const now = performance.now();
  if (lastX !== null && !reduceMotion) blow((e.clientX - lastX) / Math.max(now - lastT, 16));
  lastX = e.clientX; lastT = now;
});
stage.addEventListener('pointerleave', () => { lastX = null; });
root.querySelector('[data-gust]').addEventListener('click', () => {
  if (!soundOn) setSound(true);              // 버튼을 누른 순간 소리를 허락받음
  blow(0.9);
  setTimeout(() => blow(-0.5), 450);
});

initReveal(root);
// 다른 페이지에서 #wind 로 들어온 경우, 그려진 뒤에 위치로 이동
if (location.hash === '#wind') root.querySelector('#wind').scrollIntoView();
