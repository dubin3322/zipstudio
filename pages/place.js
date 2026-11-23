/* 장소 상세 (place.html?id=…&season=…) — 사이트의 허브: 계절 · 소개 · 카드 · 이웃 기록 · 함께 가기 */

const root = document.querySelector('[data-place]');
const place = placeById(getParam('id'));

if (!place) {
  root.innerHTML = `
    <div class="container notfound">
      <span class="eyebrow">PLACES</span>
      <h1 class="h2">찾는 장소가 없어요</h1>
      <p class="lead">주소가 바뀌었거나 아직 소개되지 않은 장소예요.</p>
      <a class="btn btn--primary" href="places.html">PLACES 둘러보기</a>
    </div>`;
} else {
  const seasonKeys = Object.keys(place.seasons);
  let season = place.seasons[getParam('season')] ? getParam('season')
    : (place.seasons[DEMO_SEASON] ? DEMO_SEASON : (seasonKeys[0] || DEMO_SEASON));
  const card = place.cardId ? cardById(place.cardId) : null;
  const records = allRecords().filter((r) => r.place === place.id);
  const revisitTotal = records.reduce((sum, r) => sum + revisitCount(r), 0);
  const saved = store.get('saved', []).includes(place.id);
  document.title = `${place.name} · PLACES · 풍담`;

  root.innerHTML = `
    <section class="place-hero season-${season}" data-hero-img>
      ${media(placeImage(place, season), `${SEASONS[season].ko}의 ${place.name}`, `${place.name} · ${SEASONS[season].ko}`, '16x9')}
    </section>

    <section class="container season-${season}" data-season-scope>
      <div class="place-title">
        <div>
          <nav class="breadcrumb" aria-label="현재 위치">
            <a href="places.html">PLACES</a><span aria-hidden="true">/</span>
            ${seasonKeys.length ? `<a href="places.html?season=${season}" data-crumb-season>${SEASONS[season].ko}</a><span aria-hidden="true">/</span>` : ''}
            <span aria-current="page">${place.name}</span>
          </nav>
          <h1 class="h1" style="margin-top:16px">${place.name}</h1>
          <p class="place-title__en">${place.nameEn}</p>
          <div class="place-meta">
            <span class="tag">${DISTRICTS[place.district]}</span>
            ${place.themes.map((t) => `<span class="tag">${t}</span>`).join('')}
            ${card ? `<span class="badge">${icon('card')}풍담 카드 · ${card.name}</span>` : ''}
            ${place.virtual ? '<span class="badge badge--virtual">가상 · 시연용</span>' : ''}
          </div>
        </div>
        <div class="place-title__actions">
          <button class="btn btn--secondary${saved ? ' is-saved' : ''}" type="button" data-save="${place.id}" aria-pressed="${saved}">${icon('heart')}저장</button>
          <button class="btn btn--secondary" type="button" data-share>${icon('share')}공유</button>
        </div>
      </div>

      ${seasonKeys.length ? `
      <div class="season-view">
        <div class="media media--4x5" data-season-img></div>
        <div>
          <div class="tabs" role="tablist" aria-label="계절별 모습">
            ${Object.entries(SEASONS).map(([k, s]) => `<button class="tab" type="button" role="tab" data-season="${k}"${place.seasons[k] ? '' : ' disabled title="이 계절의 기록을 기다려요"'}>${s.ko}</button>`).join('')}
          </div>
          <p class="h2" style="margin-top:32px" data-season-text></p>
        </div>
      </div>` : ''}
    </section>

    <section class="section">
      <div class="container split split--reverse">
        <div>
          <span class="eyebrow">ABOUT THIS PLACE</span>
          <h2 class="h2" style="margin-top:16px">이 장소에 대해</h2>
          <p style="margin-top:24px">${place.about}</p>
          <dl class="info-rows">
            <div><dt>위치</dt><dd>${place.area}</dd></div>
            <div><dt>머무는 시간</dt><dd>${place.stay}</dd></div>
            ${place.hours ? `<div><dt>운영</dt><dd>${place.hours}</dd></div>` : ''}
          </dl>
          <p class="tip season-${season}" data-tip>${place.virtual ? '할 수 있는 것 · ' : ''}${place.tip}</p>
          <p class="notice" style="margin-top:16px">운영 정보는 시연용 기준이에요. 방문 전 공식 안내를 확인해 주세요.</p>
        </div>
        ${card ? `
        <div class="card-panel season-${card.season}">
          <div class="card-collect" style="width:auto">${cardMedia(card)}</div>
          <div>
            <span class="eyebrow">풍담 카드</span>
            <p class="h3" style="margin-top:10px">${card.name}</p>
            <p style="margin-top:12px; font-family:var(--font-serif)">${card.scent}</p>
            <p class="body-sm" style="margin-top:12px; color:var(--color-text-sub)">이 장소는 풍담 카드에 담겨 있어요. 카드를 가지고 있다면 휴대폰을 가까이 대 보세요.</p>
            <a class="btn btn--secondary btn--s" style="margin-top:16px" href="about.html?card=${card.id}#wind">${icon('sound')}온라인 풍경으로 듣기</a>
          </div>
        </div>` : `
        <div class="media media--4x5">${''}<span class="media__ph" aria-hidden="true">${place.name}</span></div>`}
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="page-head__row">
          <div>
            <span class="eyebrow">COMMUNITY</span>
            <h2 class="h2" style="margin-top:16px">이 장소의 기록 ${records.length}</h2>
            ${revisitTotal ? `<p class="revisit-line" style="margin-top:12px">${icon('chime')}이웃 ${revisitTotal}명이 다시 가고 싶어 해요.</p>` : ''}
          </div>
          <a class="btn btn--primary" href="write.html?place=${place.id}&season=${season}" data-write-link>${icon('pen')}이 장소 기록하기</a>
        </div>
        <div class="grid grid--records" style="margin-top:32px">
          ${records.length ? records.slice(0, 6).map(renderRecordCard).join('') : `
            <div class="empty" style="grid-column:1/-1">${icon('comment')}<p class="h3" style="color:var(--color-text)">아직 남겨진 기록이 없어요</p><p>첫 번째 이웃이 되어 주세요.</p></div>`}
        </div>
        ${records.length > 6 ? `<div class="more"><a class="btn btn--secondary" href="community.html?q=${encodeURIComponent(place.name)}">기록 더 보기</a></div>` : ''}
      </div>
    </section>

    ${place.related.length ? `
    <section class="section">
      <div class="container">
        <h2 class="h3">함께 가기 좋은 곳</h2>
        <div class="related" style="margin-top:20px">${place.related.map((id) => renderPlaceRow(placeById(id), season)).join('')}</div>
      </div>
    </section>` : ''}`;

  /* 계절 탭: 사진·문장·주소가 함께 바뀜 */
  function showSeason(s) {
    season = s;
    root.querySelectorAll('[data-season]').forEach((t) => {
      const on = t.dataset.season === s;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
    });
    const scope = root.querySelector('[data-season-scope]');
    scope.className = `container season-${s}`;
    root.querySelector('[data-tip]').className = `tip season-${s}`;
    root.querySelector('[data-season-img]').outerHTML =
      `<div data-season-img>${media(placeImage(place, s), `${SEASONS[s].ko}의 ${place.name}`, `${place.name} · ${SEASONS[s].ko}`)}</div>`;
    root.querySelector('[data-season-text]').textContent = place.seasons[s];
    const crumb = root.querySelector('[data-crumb-season]');
    if (crumb) { crumb.textContent = SEASONS[s].ko; crumb.href = `places.html?season=${s}`; }
    root.querySelector('[data-write-link]').href = `write.html?place=${place.id}&season=${s}`;
    setParams({ season: s });
  }
  if (seasonKeys.length) {
    showSeason(season);
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-season]');
      if (t && !t.disabled) showSeason(t.dataset.season);
    });
  }
  root.querySelector('[data-share]').addEventListener('click', () => shareLink(location.href, `${place.name} · 풍담`));
  initReveal(root);
}
