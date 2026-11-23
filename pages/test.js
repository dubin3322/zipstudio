/* TEST (test.html) — 시작 → 질문 5개 → 계산 → 결과 (+ 공유 링크·공유 이미지) */

const root = document.querySelector('[data-test]');
const TYPES = TEST.types;
const QS = TEST.questions;
let answers = [];
let step = 0;
let shuffled = [];   // 질문마다 섞인 선택지 순서

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/* ---------- 점수 계산 ----------
   선택 1개 = 그 유형 +1점. 동점이면 Q5(소리 질문) 선택이 우선,
   Q5가 동점 후보에 없으면 동점 후보 중 가장 마지막에 고른 유형. */
function scoreOf(list) {
  const scores = Object.fromEntries(Object.keys(TYPES).map((k) => [k, 0]));
  list.forEach((t) => { scores[t] += 1; });
  const max = Math.max(...Object.values(scores));
  const tied = Object.keys(scores).filter((k) => scores[k] === max);
  let result = tied[0];
  if (tied.length > 1) {
    result = tied.includes(list[4]) ? list[4] : [...list].reverse().find((t) => tied.includes(t));
  }
  const min = Math.min(...Object.values(scores));
  const lowest = Object.keys(scores).find((k) => scores[k] === min && k !== result);
  return { scores, result, lowest };
}

/* ---------- 시작 ---------- */
function renderStart() {
  setParams({ result: null });
  answers = []; step = 0;
  shuffled = QS.map((q) => shuffle(q.options));
  const mine = store.get('test', null);
  root.innerHTML = `
    <section class="test-start container">
      <div>
        <div class="test-start__cards" aria-hidden="true">
          ${CARDS.map((c) => `<div class="card-collect">${cardMedia(c)}</div>`).join('')}
        </div>
        <span class="eyebrow">TEST</span>
        <h1 class="h1" style="margin-top:16px">나는 청주의 어떤 바람일까?</h1>
        <p class="lead" style="margin:16px auto 0; max-width:480px">다섯 가지 질문, 약 1분.<br>당신의 여행 결에 맞는 청주의 장소를 찾아 드릴게요.</p>
        <button class="btn btn--primary btn--l" type="button" data-start>시작하기</button>
        ${mine ? `<p style="margin-top:16px"><a class="link-arrow" href="test.html?result=${mine.type}">지난 결과 보기 · ${TYPES[mine.type].name} <span data-icon="arrow"></span></a></p>` : ''}
        <p class="test-start__sign">이웃ZIP STUDIO</p>
      </div>
    </section>`;
  fillIcons(root);
  root.querySelector('[data-start]').addEventListener('click', () => renderQuestion());
}

/* ---------- 질문 ---------- */
function renderQuestion() {
  const q = QS[step];
  root.innerHTML = `
    <section class="test-q container">
      <div class="progress" style="--progress:${(step / QS.length) * 100}%"><div class="progress__bar"></div></div>
      <div class="test-q__top">
        <button class="link-arrow" type="button" data-prev style="color:var(--color-text-sub); background:none" ${step === 0 ? 'hidden' : ''}>${icon('left')}이전 질문</button>
        <span class="caption">${step + 1} / ${QS.length}</span>
      </div>
      <div class="test-q__slide">
        <h1 class="h2" tabindex="-1" data-q-title>Q${step + 1}. ${q.q}</h1>
        <p class="caption" style="margin-top:8px">직감대로 골라 주세요. 숫자 키 1~4로도 고를 수 있어요.</p>
        <div class="test-q__options" role="group" aria-label="선택지">
          ${shuffled[step].map(([text, type], i) => `
            <button class="option${answers[step] === type ? ' is-selected' : ''}" type="button" data-type="${type}">
              <span class="option__key">${'ABCD'[i]}</span>${text}
            </button>`).join('')}
        </div>
      </div>
    </section>`;
  root.querySelector('[data-q-title]').focus({ preventScroll: true });
  root.querySelector('[data-prev]').addEventListener('click', () => { step -= 1; renderQuestion(); });
  root.querySelectorAll('.option').forEach((btn) => btn.addEventListener('click', () => choose(btn)));
}

let choosing = false;
function choose(btn) {
  if (choosing) return;
  choosing = true;
  root.querySelectorAll('.option').forEach((b) => b.classList.toggle('is-selected', b === btn));
  answers[step] = btn.dataset.type;
  setTimeout(() => {
    choosing = false;
    step += 1;
    if (step < QS.length) renderQuestion();
    else renderLoading();
  }, 220);
}

document.addEventListener('keydown', (e) => {
  const opts = root.querySelectorAll('.test-q .option');
  const n = Number(e.key);
  if (opts.length && n >= 1 && n <= opts.length) choose(opts[n - 1]);
});

/* ---------- 계산 중 ---------- */
function renderLoading() {
  const { result, lowest } = scoreOf(answers);
  store.set('test', { type: result, lowest, date: today() });   // 내 기록(MY)에 자동 저장
  root.innerHTML = `
    <section class="test-loading container">
      <div class="swing" data-loading-chime>${chimeSvg()}</div>
      <p class="h3">바람의 방향을 읽고 있어요…</p>
    </section>`;
  swingChime(root.querySelector('[data-loading-chime]'));
  setTimeout(() => {
    renderResult(result, lowest);
    window.scrollTo(0, 0);
  }, reduceMotion ? 200 : 1200);
}

/* ---------- 결과 ---------- */
const NEXT_TYPE = { blossom: 'pine', pine: 'sunset', sunset: 'breeze', breeze: 'blossom' };

function renderResult(key, lowestKey) {
  const type = TYPES[key];
  const mine = store.get('test', null);
  const isShared = !mine;                         // 테스트를 한 적 없는 사람이 링크로 들어옴
  const lowKey = lowestKey || (mine && mine.type === key && mine.lowest) || NEXT_TYPE[key];
  const card = cardById(type.card);
  const main = placeById(type.place);
  const now = PLACES.filter((p) => !p.virtual && p.seasons[DEMO_SEASON] && p.id !== main.id
    && p.themes.some((t) => type.tags.includes(t))).slice(0, 2);
  const odd = placeById(TYPES[lowKey].place);
  const records = allRecords().filter((r) => r.place === main.id).slice(0, 3);
  setParams({ result: key });
  document.title = `${type.name} · 나의 여행 바람 · 풍담`;

  root.innerHTML = `
    ${isShared ? `<p class="shared-banner">친구가 공유한 결과예요 <a href="test.html">나도 해보기</a></p>` : ''}
    <section class="result-hero season-${type.season}">
      <div class="container">
        <span class="eyebrow eyebrow--ko">당신의 여행 바람은</span>
        <h1 class="display">${type.name}</h1>
        <p class="result-hero__en">${type.en}</p>
        <p class="result-hero__sub">${type.sub}</p>
        <p class="result-hero__desc">${type.desc}</p>
        <div class="tag-list">${type.keywords.map((k) => `<span class="tag">#${k}</span>`).join('')}</div>
      </div>
    </section>

    <section class="section" style="padding-top:64px">
      <div class="container" style="display:grid; gap:72px">
        <article class="result-main season-${card.season}">
          <div class="card-collect" style="width:auto">${cardMedia(card)}</div>
          <div>
            <span class="eyebrow">대표 장소 · ${card.name}</span>
            <h2 class="h2" style="margin-top:12px">${main.name}</h2>
            <p class="caption" style="margin-top:4px">${DISTRICTS[main.district]} · 가장 아름다운 계절: ${SEASONS[card.season].ko}</p>
            <p style="margin-top:16px; color:var(--color-text-sub)">${main.about}</p>
            <a class="btn btn--primary" style="margin-top:24px" href="place.html?id=${main.id}&season=${card.season}">장소 보기</a>
          </div>
        </article>

        <div>
          <h2 class="h3">지금, ${SEASONS[DEMO_SEASON].ko}에 가기 좋은 곳</h2>
          <div class="related" style="margin-top:20px">${now.map((p) => renderPlaceRow(p)).join('')}</div>
        </div>

        <div>
          <h2 class="h3">의외로 잘 맞을지도 몰라요</h2>
          <div class="related" style="margin-top:20px">${renderPlaceRow(odd)}</div>
        </div>

        <div class="result-actions">
          <button class="btn btn--primary" type="button" data-share>${icon('share')}결과 공유하기</button>
          <button class="btn btn--secondary" type="button" data-image>${icon('image')}이미지 저장</button>
          ${isShared ? '' : `<a class="btn btn--secondary" href="my.html">내 기록에서 보기</a>`}
          <button class="btn btn--secondary" type="button" data-retry>다시 하기</button>
        </div>

        ${records.length ? `
        <div>
          <div class="page-head__row">
            <h2 class="h3">${main.name}을 다녀간 이웃들의 기록</h2>
            <a class="link-arrow" href="community.html?q=${encodeURIComponent(main.name)}">더 보기 ${icon('arrow')}</a>
          </div>
          <div class="grid grid--records" style="margin-top:20px">${records.map(renderRecordCard).join('')}</div>
        </div>` : ''}

        <div>
          <h2 class="h3">다른 바람도 궁금하다면</h2>
          <div class="type-links" style="margin-top:20px">
            ${Object.entries(TYPES).map(([k, t]) => `
              <a class="season-${t.season}" href="test.html?result=${k}"${k === key ? ' aria-current="true"' : ''}>
                <strong style="font-family:var(--font-serif); font-size:1.25rem; font-weight:400">${t.name}</strong>
                <span class="caption" style="color:inherit">${t.sub}</span>
              </a>`).join('')}
          </div>
        </div>
      </div>
    </section>`;

  initReveal(root);
  root.querySelector('[data-share]').addEventListener('click', () => shareLink(`test.html?result=${key}`, `나의 여행 바람은 ${type.name}`));
  root.querySelector('[data-image]').addEventListener('click', (e) => saveShareImage(key, e.currentTarget));
  root.querySelector('[data-retry]').addEventListener('click', () => { renderStart(); window.scrollTo(0, 0); });
}

/* ---------- 공유 이미지 (1080×1920, 인스타그램 스토리) ---------- */
const loadImage = (src) => new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = src; });

async function drawShareImage(key) {
  const t = TYPES[key];
  const card = cardById(t.card);
  const css = getComputedStyle(document.documentElement);
  const tint = css.getPropertyValue(`--color-${t.season}-tint`).trim();
  const deep = css.getPropertyValue(`--color-${t.season}`).trim();
  // 웹폰트가 다 불러와진 뒤에 그려야 글자가 기본 서체로 나오지 않음
  await Promise.all([document.fonts.load('500 34px "Pretendard Variable"')]).catch(() => {});

  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const g = c.getContext('2d');
  const sans = '"Pretendard Variable", -apple-system, sans-serif';
  const serif = '"Pretendard Variable", sans-serif';   // 명조 대신 산세리프
  g.fillStyle = tint; g.fillRect(0, 0, 1080, 1920);
  g.textAlign = 'center';

  g.fillStyle = '#5B5F58'; g.font = `500 34px ${sans}`; g.fillText('나의 여행 바람', 540, 250);
  g.fillStyle = deep; g.font = `300 180px ${serif}`; g.fillText(t.name, 540, 460);
  g.font = `600 30px ${sans}`; g.fillText(t.en.split('').join(' '), 540, 530);
  g.fillStyle = '#1F2320'; g.font = `400 52px ${serif}`; g.fillText(t.sub, 540, 630);

  // 카드 (일러스트가 있으면 그림, 없으면 카드 이름)
  const h = 720, w = Math.round(h * 384 / 1144), x = 540 - w / 2, y = 720;   // 실제 카드 비율
  g.fillStyle = '#FFFFFF'; g.fillRect(x, y, w, h);
  // 파일을 더블클릭해 열면(file://) 브라우저가 그림이 든 캔버스 저장을 막아서, 그때는 카드 이름만 씀
  const art = location.protocol === 'file:' ? null : await loadImage(`assets/images/cards/${card.id}.jpg`);
  if (art) g.drawImage(art, x, y, w, h);
  else { g.fillStyle = deep; g.font = `600 26px ${sans}`; card.name.split(' ').forEach((word, i) => g.fillText(word, 540, y + h / 2 + i * 40)); }
  g.strokeStyle = 'rgba(31,35,32,.15)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);

  g.fillStyle = deep; g.font = `500 40px ${sans}`; g.fillText(t.keywords.map((k) => `#${k}`).join('   '), 540, 1530);
  g.fillStyle = '#1F2320'; g.font = `400 40px ${sans}`; g.fillText(`대표 장소 · ${placeById(t.place).name}`, 540, 1610);

  g.fillStyle = 'rgba(31,35,32,.15)'; g.fillRect(140, 1720, 800, 2);
  g.fillStyle = '#5B5F58'; g.font = `400 30px ${sans}`; g.fillText('풍담 風談 · 나는 청주의 어떤 바람일까?', 540, 1790);
  g.font = `400 26px ${sans}`; g.fillText(location.host || 'poongdam', 540, 1840);

  return new Promise((res) => c.toBlob(res, 'image/png'));
}

async function saveShareImage(key, btn) {
  btn.disabled = true;
  const blob = await drawShareImage(key);
  btn.disabled = false;
  if (!blob) { toast('이미지를 만들지 못했어요. 다시 눌러 주세요.'); return; }
  const file = new File([blob], `poongdam-${key}.png`, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {          // 아이폰: 공유 창 → '이미지 저장'
    try { await navigator.share({ files: [file], title: '나의 여행 바람' }); } catch { /* 사용자가 닫음 */ }
    return;
  }
  const a = document.createElement('a');                                     // PC: 바로 다운로드
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('이미지를 저장했어요');
}

/* ---------- 시작 ---------- */
const initial = getParam('result');
if (initial && TYPES[initial]) renderResult(initial);
else renderStart();

// 점수 로직 자체 점검: test.html#selfcheck 로 열면 콘솔에 결과가 나옴
if (location.hash === '#selfcheck') {
  console.assert(scoreOf(['sunset', 'sunset', 'pine', 'pine', 'sunset']).result === 'sunset', '최다 득표');
  console.assert(scoreOf(['pine', 'pine', 'sunset', 'breeze', 'sunset']).result === 'sunset', '동점 → Q5 우선');
  console.assert(scoreOf(['blossom', 'sunset', 'sunset', 'blossom', 'pine']).result === 'blossom', '동점·Q5 없음 → 마지막 선택');
  console.log('test.js self-check 끝');
}
