/* PLACES 목록 (places.html) — 계절 탭(주) + 구 필터(보조), 상태는 주소에 저장
   이름 목록: 마우스를 올리면 사진이 안개 속에서 떠오름 (모바일은 작은 사진이 옆에) */

const state = {
  season: SEASONS[getParam('season')] ? getParam('season') : DEMO_SEASON,
  district: DISTRICTS[getParam('district')] ? getParam('district') : '',
};

const tabs = document.querySelector('[data-season-tabs]');
const chips = document.querySelector('[data-districts]');
const list = document.querySelector('[data-list]');
const count = document.querySelector('[data-count]');

tabs.innerHTML = Object.entries(SEASONS).map(([k, s]) =>
  `<button class="tab" type="button" role="tab" data-season="${k}">${s.en} ${s.ko}</button>`).join('');
chips.innerHTML = [['', '전체'], ...Object.entries(DISTRICTS)].map(([k, name]) =>
  `<button class="chip" type="button" data-district="${k}" aria-pressed="false">${name}</button>`).join('');

function row(p, i, s, card) {
  const n = String(i + 1).padStart(2, '0');
  return `
    <li class="plist__item">
      <a class="plist__link" href="place.html?id=${p.id}&season=${s}">
        <span class="plist__no">${n}</span>
        <span class="plist__name">${p.name}<span class="plist__en">${p.nameEn}</span></span>
        <span class="plist__line">${p.seasons[s]}</span>
        <span class="plist__district">${DISTRICTS[p.district]}${card ? `<span class="plist__mark">풍담 카드</span>` : ''}</span>
        <span class="plist__img" aria-hidden="true">${media(placeImage(p, s), '', p.name)}</span>
      </a>
    </li>`;
}

function render() {
  const s = state.season;
  tabs.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.season === s;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
  });
  chips.querySelectorAll('.chip').forEach((c) => {
    const on = c.dataset.district === state.district;
    c.classList.toggle('is-active', on);
    c.setAttribute('aria-pressed', on);
  });
  document.querySelector('[data-season-line]').textContent = SEASONS[s].line;

  // 이 계절 풍담 카드의 장소를 맨 위로
  const card = CARDS.find((c) => c.season === s);
  const places = PLACES
    .filter((p) => !p.virtual && p.seasons[s] && (!state.district || p.district === state.district))
    .sort((a, b) => (b.id === card.placeId) - (a.id === card.placeId));

  count.textContent = `${places.length} PLACES`;
  list.innerHTML = places.length
    ? places.map((p, i) => row(p, i, s, p.id === card.placeId && card)).join('')
    : `<li class="empty">
         <p class="h3" style="color:var(--color-text)">이 계절, 이 구에는 아직 소개된 장소가 없어요</p>
         <p>다른 구를 둘러보거나, 직접 다녀온 곳을 기록해 주세요.</p>
         <a class="link-arrow" href="write.html?season=${s}">기록하기 <span data-icon="arrow"></span></a>
       </li>`;
  fillIcons(list);
  setParams({ season: s === DEMO_SEASON ? null : s, district: state.district || null });
}

tabs.addEventListener('click', (e) => {
  const t = e.target.closest('[data-season]');
  if (!t) return;
  state.season = t.dataset.season;
  render();
});
chips.addEventListener('click', (e) => {
  const c = e.target.closest('[data-district]');
  if (!c) return;
  state.district = c.dataset.district;
  render();
});

// 사진이 마우스를 따라 가로로 움직임
list.addEventListener('mousemove', (e) => {
  list.style.setProperty('--mx', `${e.clientX - list.getBoundingClientRect().left}px`);
});

render();
initReveal();
