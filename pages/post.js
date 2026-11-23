/* 기록 상세 (post.html?id=…) — 사진 · 장소 칩(허브 연결) · 반응 · 댓글 · 이 장소의 다른 기록 */

const root = document.querySelector('[data-post]');
const record = allRecords().find((r) => r.id === getParam('id'));

if (!record) {
  root.innerHTML = `
    <div class="notfound">
      <h1 class="h2">찾는 기록이 없어요</h1>
      <p class="lead">지워졌거나 주소가 바뀐 기록이에요.</p>
      <a class="btn btn--primary" href="community.html">이웃 기록 보기</a>
    </div>`;
} else {
  const place = placeById(record.place) || { name: record.placeName || '기타 장소', district: record.district, about: '', seasons: {} };
  const isMine = record.user === DEMO_USER.id;
  const isUserMade = record.id.startsWith('u');          // 직접 쓴 기록만 지울 수 있음 (예시 기록은 보호)
  const my = reactionOf(record.id);
  const others = allRecords().filter((r) => r.id !== record.id && r.place === record.place);
  const fill = allRecords().filter((r) => r.id !== record.id && r.place !== record.place && r.season === record.season);
  const more = [...others, ...fill].slice(0, 4);
  document.title = `${record.title} · 이웃 기록 · 풍담`;

  const slides = Array.from({ length: Math.max(record.photos, 1) }, (_, i) =>
    media(recordImage(record, i + 1), `${place.name}에서 남긴 사진 ${i + 1}`, `${place.name} · 사진 ${i + 1}`, '4x5')).join('');

  root.innerHTML = `
    <div class="post">
      <article>
        <div class="post__author">
          <span class="avatar">${esc(record.user[0])}</span>
          <div>
            <a href="my.html${isMine ? '' : `?user=${encodeURIComponent(record.user)}`}">${esc(record.user)}</a>
            <p class="caption">${record.date} · ${SEASONS[record.season].ko}</p>
          </div>
          ${isUserMade ? `<button class="btn btn--secondary btn--s post__menu" type="button" data-delete>지우기</button>` : ''}
        </div>

        <div class="carousel">
          <div class="carousel__track" data-track tabindex="0" aria-label="사진 ${record.photos}장">${slides}</div>
          ${record.photos > 1 ? `
            <button class="icon-btn carousel__btn carousel__btn--prev" type="button" data-slide="-1">${icon('left', '이전 사진')}</button>
            <button class="icon-btn carousel__btn carousel__btn--next" type="button" data-slide="1">${icon('right', '다음 사진')}</button>` : ''}
        </div>
        ${record.photos > 1 ? `<div class="dots" data-dots>${Array.from({ length: record.photos }, (_, i) => `<span${i ? '' : ' class="is-active"'}></span>`).join('')}</div>` : ''}

        <a class="post__place" href="${placeById(record.place) ? `place.html?id=${record.place}&season=${record.season}` : 'places.html'}">${icon('pin')}${esc(place.name)} · ${DISTRICTS[place.district] || ''} ${icon('arrow')}</a>
        <p class="eyebrow eyebrow--ko" style="display:block; margin-top:28px">${record.type === 'recommend' ? '장소 추천' : '여행 기록'}</p>
        <h1 class="h2" style="font-family:var(--font-sans); font-weight:600; margin-top:8px">${esc(record.title)}</h1>
        ${record.body ? `<p class="post__body">${esc(record.body)}</p>` : ''}
        ${record.tags.length ? `<div class="tag-list" style="margin-top:20px">${record.tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}</div>` : ''}

        <div class="post__reactions">
          <button class="reaction${my.like ? ' is-on' : ''}" type="button" data-react="like" aria-pressed="${!!my.like}">${icon('heart')}좋아요 <span data-n>${record.likes + (my.like ? 1 : 0)}</span></button>
          <button class="reaction reaction--revisit${my.revisit ? ' is-on' : ''}" type="button" data-react="revisit" aria-pressed="${!!my.revisit}"><span class="swing">${icon('chime')}</span>다시 가고 싶어요 <span data-n>${revisitCount(record)}</span></button>
          <button class="reaction" type="button" data-share>${icon('share')}공유</button>
        </div>

        <section aria-labelledby="c-title" style="margin-top:32px">
          <h2 class="h3" id="c-title">댓글 <span data-c-count>${commentsOf(record).length}</span></h2>
          <div data-comments></div>
          <form class="comment-form" data-comment-form>
            <label class="field"><span class="sr-only">댓글</span>
              <input class="field__input" type="text" maxlength="200" placeholder="댓글 남기기" data-comment-input>
            </label>
            <button class="btn btn--secondary" type="submit">등록</button>
          </form>
        </section>
      </article>

      <aside class="post__aside" aria-label="이어서 보기">
        ${placeById(record.place) ? `<div><h2 class="h3">이 장소</h2><div style="margin-top:12px">${renderPlaceRow(place, record.season)}</div></div>` : ''}
        ${more.length ? `<div>
          <h2 class="h3">${others.length ? '이 장소의 다른 기록' : '같은 계절의 기록'}</h2>
          <div class="grid" style="grid-template-columns:repeat(2, minmax(0, 1fr)); margin-top:12px">${more.map(renderRecordCard).join('')}</div>
        </div>` : ''}
      </aside>
    </div>`;

  /* 댓글 */
  function renderComments() {
    const list = commentsOf(record);
    root.querySelector('[data-c-count]').textContent = list.length;
    root.querySelector('[data-comments]').innerHTML = list.length ? list.map((c) => `
      <div class="comment">
        <span class="avatar">${esc(c.user[0])}</span>
        <p><span class="comment__name">${esc(c.user)}</span><span class="comment__text">${esc(c.text)}</span><br><span class="caption">${c.time}</span></p>
        <span></span>
      </div>`).join('') : '<p class="caption" style="padding:16px 0">첫 댓글을 남겨 주세요.</p>';
  }
  renderComments();
  root.querySelector('[data-comment-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = root.querySelector('[data-comment-input]');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const all = store.get('comments', {});
    all[record.id] = [...(all[record.id] || []), { user: DEMO_USER.id, text, time: today() }];
    store.set('comments', all);
    input.value = '';
    renderComments();
  });

  /* 반응 */
  root.querySelectorAll('[data-react]').forEach((btn) => btn.addEventListener('click', () => {
    const key = btn.dataset.react;
    const on = !btn.classList.contains('is-on');
    setReaction(record.id, key, on);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on);
    btn.querySelector('[data-n]').textContent = key === 'like' ? record.likes + (on ? 1 : 0) : revisitCount(record);
    if (key === 'revisit' && on) { swingChime(btn.querySelector('.swing')); playChime(0.6); }
  }));
  root.querySelector('[data-share]').addEventListener('click', () => shareLink(location.href, record.title));

  /* 사진 넘기기 (CSS scroll-snap + 점 표시) */
  const track = root.querySelector('[data-track]');
  const dots = root.querySelectorAll('[data-dots] span');
  track.addEventListener('scroll', () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, n) => d.classList.toggle('is-active', n === i));
  }, { passive: true });
  root.querySelectorAll('[data-slide]').forEach((b) => b.addEventListener('click', () =>
    track.scrollBy({ left: track.clientWidth * Number(b.dataset.slide), behavior: 'smooth' })));

  /* 지우기 (직접 쓴 기록만) */
  const del = root.querySelector('[data-delete]');
  if (del) del.addEventListener('click', async () => {
    const ok = await confirmModal({ title: '이 기록을 지울까요?', message: '지운 기록은 되돌릴 수 없어요.', confirmLabel: '지우기', danger: true });
    if (!ok) return;
    store.set('records', store.get('records', []).filter((r) => r.id !== record.id));
    location.href = 'my.html';
  });

  if (getParam('new')) {
    setParams({ new: null });
    toast('기록이 올라갔어요. 내 기록에서 언제든 다시 꺼내 볼 수 있어요.', { label: '내 기록', href: 'my.html' });
  }
  initReveal(root);
}
