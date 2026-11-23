/* NFC 도착 (tag.html?card=jeongbuk) — 모바일 기준. 도착 연출 → 카드 수집 → 다음 행동 세 가지 */

const root = document.querySelector('[data-tag]');
const card = cardById(getParam('card'));

const topBar = `
  <div class="tag-top">
    <a class="gnb__logo" href="index.html" aria-label="풍담 홈"><span class="gnb__logo-ko">풍담</span><span class="gnb__logo-han" aria-hidden="true">風談</span></a>
    <button class="icon-btn icon-btn--ghost" type="button" data-sound-toggle aria-pressed="false" style="width:auto; padding:0 8px; gap:6px; display:inline-flex; font-size:var(--fs-sm)"></button>
  </div>`;

if (!card) {
  /* 카드 주소가 잘못된 경우: 카드를 직접 고르게 함 */
  root.innerHTML = `${topBar}
    <div class="empty">
      ${icon('card')}
      <h1 class="h3" style="color:var(--color-text)">카드를 읽지 못했어요</h1>
      <p>다시 한번 대 보시거나, 아래에서 카드를 골라 주세요.</p>
    </div>
    <div class="collect-row" style="justify-content:center">
      ${CARDS.map((c) => `<a class="card-collect" style="width:72px" href="tag.html?card=${c.id}">${cardMedia(c)}<p class="caption" style="margin-top:6px">${SEASONS[c.season].ko}</p></a>`).join('')}
    </div>`;
  setSound(false);
} else {
  const place = placeById(card.placeId);
  const collected = store.get('cards', {});
  const firstTime = !collected[card.id];
  if (firstTime) { collected[card.id] = today(); store.set('cards', collected); }
  const total = Object.keys(collected).length;
  const records = allRecords().filter((r) => r.place === place.id);
  const revisitTotal = records.reduce((sum, r) => sum + revisitCount(r), 0);
  const firstVisit = !store.get('visited', false);
  store.set('visited', true);
  document.title = `${card.name} · 바람이 닿았어요 · 풍담`;

  root.innerHTML = `${topBar}
    <section class="tag-card season-${card.season}" aria-labelledby="card-name">
      <div class="card-collect swing" data-card-art>${cardMedia(card)}</div>
      <div class="tag-card__info">
        <p class="tag-card__name" id="card-name">${card.name}</p>
        <h1 class="h2">${place.name}</h1>
        <p class="caption">${DISTRICTS[place.district]} · ${SEASONS[card.season].ko}</p>
      </div>
      <div class="tag-card__text">
        <p class="tag-card__scent">${card.scent}</p>
        <p class="caption" style="margin-top:8px">카드에 향 오일을 한 방울 떨어뜨려 보세요.</p>
      </div>
    </section>

    <div class="tag-actions">
      <a class="btn btn--primary btn--l btn--block" href="write.html?place=${place.id}&season=${card.season}">${icon('pen')}그날을 기록하기</a>
      <a class="btn btn--secondary btn--l btn--block" href="place.html?id=${place.id}&season=${card.season}">이 장소 다시 보기</a>
      <a class="btn btn--secondary btn--l btn--block" href="community.html?q=${encodeURIComponent(place.name)}">이웃들의 ${place.name}</a>
    </div>

    ${records.length ? `
    <section style="margin-top:56px">
      <div class="page-head__row" style="align-items:center">
        <h2 class="h3">이웃의 기록</h2>
        ${revisitTotal ? `<span class="revisit-line body-sm">${icon('chime')}이웃 ${revisitTotal}명이 다시 가고 싶어 해요</span>` : ''}
      </div>
      <div class="hscroll" style="margin-top:16px">${records.slice(0, 3).map(renderRecordCard).join('')}</div>
    </section>` : ''}

    <div style="margin-top:56px; display:grid; gap:8px; justify-items:center; text-align:center">
      <a class="link-arrow" href="index.html">풍담 둘러보기 ${icon('arrow')}</a>
      ${firstVisit ? `<a class="caption hover-line" style="padding:12px" href="about.html">풍담이 처음이라면?</a>` : ''}
    </div>

    <div class="tag-intro" data-intro role="dialog" aria-modal="true" aria-labelledby="intro-msg">
      <div class="swing" data-intro-chime>${chimeSvg()}</div>
      <p class="tag-intro__msg" id="intro-msg">바람이 닿았어요.</p>
      <div class="tag-intro__actions">
        <button class="btn btn--primary btn--l" type="button" data-enter="sound">${icon('sound')}소리와 함께 보기</button>
        <button class="btn btn--secondary btn--l" type="button" data-enter="quiet">조용히 보기</button>
      </div>
    </div>`;

  setSound(false);
  initReveal(root);
  const intro = root.querySelector('[data-intro]');
  swingChime(root.querySelector('[data-intro-chime]'));
  intro.querySelector('[data-enter]').focus();

  intro.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-enter]');
    if (!btn) return;
    if (btn.dataset.enter === 'sound') setSound(true);       // 이 탭이 소리를 허락하는 순간
    intro.classList.add('is-leaving');
    setTimeout(() => intro.remove(), 800);
    swingChime(root.querySelector('[data-card-art]'));
    setTimeout(() => {
      if (firstTime) toast(`${card.name} 카드가 내 기록에 담겼어요 · ${total}/4`, { label: '보기', href: 'my.html#cards' });
      else toast(`다시 만났네요. 이 카드를 처음 태그한 날: ${collected[card.id]}`);
    }, 600);
  });
}
