/* MY (my.html, 다른 이웃은 my.html?user=…) — 프로필 · 다시 꺼내 보는 기록 · 풍담 카드 · 계절별 기록 · 저장한 장소 */

const root = document.querySelector('[data-my]');
const userId = getParam('user') || DEMO_USER.id;
const isMe = userId === DEMO_USER.id;
const recs = allRecords().filter((r) => r.user === userId);
const visited = [...new Set(recs.map((r) => r.place).filter((id) => placeById(id)))];
const cards = isMe ? store.get('cards', {}) : {};
const test = isMe ? store.get('test', null) : null;
const savedIds = isMe ? store.get('saved', []) : [];
const yearOf = (r) => Number(r.date.slice(0, 4));
document.title = `${isMe ? '내 기록' : `${userId}의 기록`} · 풍담`;

/* ---------- 회상할 기록: 오늘과 같은 계절의 지난해 기록 → 없으면 첫 기록 ---------- */
function pickMemory() {
  const thisYear = new Date().getFullYear();
  const past = recs.filter((r) => r.season === DEMO_SEASON && yearOf(r) < thisYear).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (past) {
    const diff = thisYear - yearOf(past);
    return { r: past, title: `${diff === 1 ? '1년 전' : `${yearOf(past)}년`} ${SEASONS[past.season].ko}, ${placeById(past.place)?.name || past.placeName}에서` };
  }
  const first = [...recs].sort((a, b) => a.date.localeCompare(b.date))[0];
  return first ? { r: first, title: '당신의 첫 청주' } : null;
}
const memory = isMe ? pickMemory() : null;

/* ---------- 계절별 묶음 (2026 가을, 2026 여름 …) ---------- */
function groups() {
  const out = [];
  recs.forEach((r) => {
    const key = `${yearOf(r)} ${SEASONS[r.season].ko}`;
    const g = out.find((x) => x.key === key);
    if (g) g.items.push(r); else out.push({ key, items: [r] });
  });
  return out;
}

function logItem(r) {
  const p = placeById(r.place) || { name: r.placeName || '기타 장소', district: r.district };
  return `
    <article class="log-item">
      ${media(recordImage(r), `${p.name}에서 남긴 사진`, p.name, '1x1')}
      <div>
        <p class="caption">${r.date} · ${SEASONS[r.season].ko}</p>
        <h3 class="h3" style="margin-top:4px"><a class="card__link" href="post.html?id=${r.id}">${esc(p.name)}</a></h3>
        <p class="caption">${DISTRICTS[p.district] || ''} · <span class="card__stat card__stat--revisit">${icon('chime')}다시 가고 싶어요 ${revisitCount(r)}</span></p>
        <p class="card__desc">${esc(r.title)}${r.body ? ` · ${esc(r.body)}` : ''}</p>
      </div>
    </article>`;
}

function savedList() {
  if (!savedIds.length) return `
    <div class="empty">${icon('heart')}<p class="h3" style="color:var(--color-text)">마음에 드는 장소를 모아 보세요</p>
      <p>장소 카드의 ♡를 누르면 이곳에 담겨요.</p><a class="btn btn--primary" href="places.html">PLACES 둘러보기</a></div>`;
  const items = savedIds.map(placeById).filter(Boolean)
    .map((p) => ({ p, done: visited.includes(p.id) }))
    .sort((a, b) => a.done - b.done);                         // 아직 가지 않은 곳 먼저
  return `<div class="grid grid--3">${items.map(({ p, done }) => `
    <div><span class="status${done ? ' status--done' : ''}" style="margin-bottom:12px">${done ? '다녀왔어요' : '아직 가지 않은 곳'}</span>${renderPlaceCard(p)}</div>`).join('')}</div>`;
}

const t = test && TEST.types[test.type];
root.innerHTML = `
  <section class="container">
    <div class="profile">
      <span class="avatar avatar--l">${esc(userId[0])}</span>
      <div>
        <h1 class="h2" style="font-family:var(--font-sans); font-weight:600">${esc(userId)}</h1>
        ${isMe ? `<p class="caption">${DEMO_USER.name}</p>` : ''}
        <p class="profile__stats">
          <span>기록<strong>${recs.length}</strong></span>
          <span>다녀온 장소<strong>${visited.length}</strong></span>
          ${isMe ? `<span>모은 카드<strong>${Object.keys(cards).length}/4</strong></span>` : ''}
        </p>
        ${isMe ? (t
          ? `<a class="wind-badge season-${t.season}" href="test.html?result=${test.type}">나의 여행 바람 · ${t.name}</a>`
          : `<a class="link-arrow" style="margin-top:8px" href="test.html">나의 바람 알아보기 ${icon('arrow')}</a>`) : ''}
      </div>
    </div>
  </section>

  ${memory ? `
  <section class="section section--alt" style="padding-block:96px">
    <div class="container memory season-${memory.r.season}" data-memory>
      ${media(recordImage(memory.r), '지난 여행에서 남긴 사진', placeById(memory.r.place)?.name || '', '16x9')}
      <div>
        <span class="eyebrow">다시 꺼내 보는 기록</span>
        <h2 class="h2" style="margin-top:16px">${memory.title}</h2>
        <p style="margin-top:16px; color:var(--color-text-sub)">“${esc(memory.r.body.split('.')[0] || memory.r.title)}.”</p>
        <p class="caption" style="margin-top:8px">${memory.r.date}</p>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:28px">
          <a class="btn btn--secondary" href="post.html?id=${memory.r.id}">다시 읽기</a>
          ${placeById(memory.r.place) ? `<a class="btn btn--primary" href="place.html?id=${memory.r.place}&season=${DEMO_SEASON}">이 계절에 다시 가 볼까요?</a>` : ''}
        </div>
      </div>
    </div>
  </section>` : ''}

  ${isMe ? `
  <section class="section" id="cards" style="padding-block:96px 0">
    <div class="container">
      <h2 class="h3">나의 풍담 카드
        <span class="progress progress--inline" style="--progress:${Object.keys(cards).length * 25}%"><span class="progress__bar" style="display:block"></span></span>
        <span class="caption" style="margin-left:8px">${Object.keys(cards).length} / 4</span></h2>
      <div class="collect-row" style="margin-top:24px">
        ${CARDS.map((c) => cards[c.id] ? `
          <a class="card-collect" href="about.html?card=${c.id}#wind">${cardMedia(c)}<p class="caption" style="margin-top:8px">${cards[c.id]} 태그</p></a>` : `
          <a class="card-collect is-empty" href="place.html?id=poongdam-showroom">
            <div class="media media--card"><span class="media__ph">아직 만나지<br>못한 카드</span></div>
            <p class="caption" style="margin-top:8px">${SEASONS[c.season].ko} · 쇼룸에서 만나기</p></a>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <section class="section">
    <div class="container">
      <div class="tabs" role="tablist" aria-label="내 기록 보기">
        <button class="tab is-active" type="button" role="tab" data-tab="log" aria-selected="true">${isMe ? '나의 기록' : '기록'} ${recs.length}</button>
        ${isMe ? `<button class="tab" type="button" role="tab" data-tab="saved" aria-selected="false">저장한 장소 ${savedIds.length}</button>` : ''}
      </div>
      <div style="margin-top:40px" data-panel="log">
        ${recs.length ? groups().map((g) => `
          <div class="log-group">
            <h3 class="log-group__head h3" style="font-family:var(--font-serif); font-weight:400">${g.key}</h3>
            <div class="log-list">${g.items.map(logItem).join('')}</div>
          </div>`).join('') : `
          <div class="empty">${icon('pen')}<p class="h3" style="color:var(--color-text)">아직 남긴 기록이 없어요</p>
            <p>첫 번째 청주를 들려주세요.</p>${isMe ? '<a class="btn btn--primary" href="write.html">기록하기</a>' : ''}</div>`}
      </div>
      ${isMe ? `<div style="margin-top:40px" data-panel="saved" hidden>${savedList()}</div>` : ''}
    </div>
  </section>`;

/* 탭 전환 (#saved 로 들어오면 저장한 장소부터) */
function showTab(key) {
  root.querySelectorAll('[data-tab]').forEach((b) => { const on = b.dataset.tab === key; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
  root.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== key; });
}
root.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) showTab(b.dataset.tab); });
if (isMe && location.hash === '#saved') { showTab('saved'); root.querySelector('[data-tab="saved"]').scrollIntoView(); }

/* 회상 카드: 화면에 들어오면 흐릿한 사진이 천천히 선명해짐 (기억이 선명해지는 연출) */
const mem = root.querySelector('[data-memory]');
if (mem) {
  if (reduceMotion || !('IntersectionObserver' in window)) mem.classList.add('is-visible');
  else {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => mem.classList.add('is-visible'), 300); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(mem);
  }
}
initReveal(root);
