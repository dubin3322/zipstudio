/* COMMUNITY (community.html) — 유형 탭 · 계절 칩 · 구 칩 · 검색 · 정렬 · 12개씩 더 보기. 상태는 주소에 저장 */

const PAGE = 12;
const state = {
  type: ['record', 'recommend'].includes(getParam('type')) ? getParam('type') : '',
  season: SEASONS[getParam('season')] ? getParam('season') : '',
  district: DISTRICTS[getParam('district')] ? getParam('district') : '',
  q: getParam('q') || '',
  sort: getParam('sort') === 'revisit' ? 'revisit' : 'latest',
  shown: PAGE,
};

const el = (s) => document.querySelector(s);
el('[data-types]').innerHTML = [['', '전체'], ['record', '여행 기록'], ['recommend', '장소 추천']]
  .map(([k, n]) => `<button class="tab" type="button" role="tab" data-type="${k}">${n}</button>`).join('');
el('[data-seasons]').innerHTML = [['', '전체'], ...Object.entries(SEASONS).map(([k, s]) => [k, s.ko])]
  .map(([k, n]) => `<button class="chip" type="button" data-season="${k}">${n}</button>`).join('');
el('[data-districts]').innerHTML = [['', '전체'], ...Object.entries(DISTRICTS)]
  .map(([k, n]) => `<button class="chip" type="button" data-district="${k}">${n}</button>`).join('');
el('[data-search]').value = state.q;
el('[data-sort]').value = state.sort;

function matches(r) {
  const p = placeById(r.place);
  const district = p ? p.district : r.district;
  const q = state.q.trim().toLowerCase();
  const text = [r.title, r.body, r.user, p ? p.name : r.placeName, ...(r.tags || [])].join(' ').toLowerCase();
  return (!state.type || r.type === state.type)
    && (!state.season || r.season === state.season)
    && (!state.district || district === state.district)
    && (!q || text.includes(q.replace(/^#/, '')));
}

function render() {
  const mark = (attr, val) => document.querySelectorAll(`[${attr}]`).forEach((b) => {
    const on = b.getAttribute(attr) === val;
    b.classList.toggle('is-active', on);
    b.setAttribute(b.classList.contains('tab') ? 'aria-selected' : 'aria-pressed', on);
  });
  mark('data-type', state.type);
  mark('data-season', state.season);
  mark('data-district', state.district);

  let list = allRecords().filter(matches);
  if (state.sort === 'revisit') list = list.sort((a, b) => revisitCount(b) - revisitCount(a));
  el('[data-count]').textContent = `기록 ${list.length}개`;
  el('[data-grid]').innerHTML = list.length
    ? list.slice(0, state.shown).map(renderRecordCard).join('')
    : `<div class="empty" style="grid-column:1/-1">
         ${icon('comment')}
         <p class="h3" style="color:var(--color-text)">아직 이 조건의 기록이 없어요</p>
         <p>첫 번째 이웃이 되어 주세요.</p>
         <a class="btn btn--primary" href="write.html${state.season ? `?season=${state.season}` : ''}">기록하기</a>
       </div>`;
  el('[data-more-wrap]').hidden = list.length <= state.shown;
  setParams({ type: state.type, season: state.season, district: state.district, q: state.q.trim(), sort: state.sort === 'latest' ? '' : state.sort });
  initReveal(el('[data-grid]'));
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-type], [data-season], [data-district]');
  if (!b || b.closest('[data-grid]')) return;
  ['type', 'season', 'district'].forEach((k) => { if (b.hasAttribute(`data-${k}`)) state[k] = b.getAttribute(`data-${k}`); });
  state.shown = PAGE;
  render();
});
let typing;
el('[data-search]').addEventListener('input', (e) => {
  clearTimeout(typing);
  typing = setTimeout(() => { state.q = e.target.value; state.shown = PAGE; render(); }, 200);
});
el('[data-sort]').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
el('[data-more]').addEventListener('click', () => { state.shown += PAGE; render(); });

render();
