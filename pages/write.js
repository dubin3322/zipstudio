/* 기록하기 (write.html?place=…&season=…) — 사진(최대 4장, 줄여서 저장) · 장소 · 계절 · 제목 · 내용 · 태그 */

const form = document.querySelector('[data-write]');
const MAX_PHOTOS = 4;
const preset = { place: placeById(getParam('place')), season: SEASONS[getParam('season')] ? getParam('season') : DEMO_SEASON };
const photos = [];     // 줄인 사진 dataURL
let dirty = false;

const placeOptions = Object.entries(DISTRICTS).map(([dk, dname]) => `
  <optgroup label="${dname}">
    ${PLACES.filter((p) => p.district === dk).map((p) => `<option value="${p.id}"${preset.place && preset.place.id === p.id ? ' selected' : ''}>${p.name}</option>`).join('')}
  </optgroup>`).join('');

form.innerHTML = `
  <div>
    <label class="upload" data-drop>
      ${icon('image')}
      <strong>사진을 올려 주세요</strong>
      <span class="caption">끌어다 놓거나 눌러서 선택해요 · JPG, PNG · 최대 4장 (시연용)</span>
      <input class="sr-only" type="file" accept="image/jpeg,image/png" multiple data-file>
    </label>
    <div class="write__photos" data-thumbs></div>
    <p class="field__error" data-error="photos" hidden></p>
  </div>

  <div class="write__form">
    <div class="post__author" style="margin:0">
      <span class="avatar">${DEMO_USER.id[0]}</span><strong>${DEMO_USER.id}</strong>
    </div>

    <fieldset class="field" style="border:0; padding:0; margin:0">
      <legend class="field__label" style="margin-bottom:8px">유형</legend>
      <div class="chip-group" data-type>
        <button class="chip is-active" type="button" data-value="record" aria-pressed="true">여행 기록</button>
        <button class="chip" type="button" data-value="recommend" aria-pressed="false">장소 추천</button>
      </div>
    </fieldset>

    <div class="field" data-field="place">
      <label class="field__label" for="w-place">장소 *</label>
      <select class="field__input" id="w-place" data-place>
        <option value="">장소를 골라 주세요</option>
        ${placeOptions}
        <option value="other">기타 (직접 입력)</option>
      </select>
      <div class="write__other" data-other hidden>
        <input class="field__input" type="text" maxlength="30" placeholder="장소 이름" aria-label="장소 이름" data-other-name>
        <select class="field__input" aria-label="구" data-other-district>${Object.entries(DISTRICTS).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select>
      </div>
      <span class="field__error" data-error="place" hidden></span>
    </div>

    <fieldset class="field" style="border:0; padding:0; margin:0">
      <legend class="field__label" style="margin-bottom:8px">계절</legend>
      <div class="chip-group" data-season>
        ${Object.entries(SEASONS).map(([k, s]) => `<button class="chip${k === preset.season ? ' is-active' : ''}" type="button" data-value="${k}" aria-pressed="${k === preset.season}">${s.ko}</button>`).join('')}
      </div>
    </fieldset>

    <div class="field" data-field="title">
      <label class="field__label" for="w-title">제목 *</label>
      <input class="field__input" id="w-title" type="text" maxlength="40" placeholder="이웃들에게 당신의 여행을 한 줄로 들려주세요" data-title>
      <span class="field__error" data-error="title" hidden></span>
    </div>

    <div class="field">
      <label class="field__label" for="w-body">내용</label>
      <textarea class="field__input" id="w-body" maxlength="2200" placeholder="그날의 바람, 소리, 향은 어땠나요?" data-body></textarea>
      <span class="field__meta"><span></span><span class="caption" data-counter>0/2200</span></span>
    </div>

    <div class="field">
      <label class="field__label" for="w-tags">태그</label>
      <input class="field__input" id="w-tags" type="text" placeholder="노을, 산책처럼 쉼표로 나눠 적어요" data-tags>
      <div class="write__suggest" data-suggest></div>
    </div>

    <label class="check"><input type="checkbox" data-revisit> 나도 이곳에 다시 오고 싶어요</label>

    <div class="write__actions">
      <button class="btn btn--secondary" type="button" data-cancel>취소</button>
      <button class="btn btn--primary" type="submit">기록 올리기</button>
    </div>
  </div>`;

const $ = (s) => form.querySelector(s);

/* ---------- 칩 선택 (유형·계절) ---------- */
function bindChips(group, onChange) {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    group.querySelectorAll('.chip').forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
    dirty = true;
    if (onChange) onChange(chip.dataset.value);
  });
}
const value = (group) => group.querySelector('.is-active').dataset.value;
bindChips($('[data-type]'), (type) => {
  $('[data-body]').placeholder = type === 'recommend'
    ? '이곳을 어떤 이웃에게 추천하고 싶나요? 가기 좋은 시간이나 작은 팁도 좋아요.'
    : '그날의 바람, 소리, 향은 어땠나요?';
});
bindChips($('[data-season]'));

/* ---------- 장소 → 추천 태그 ---------- */
function updateSuggest() {
  const p = placeById($('[data-place]').value);
  $('[data-other]').hidden = $('[data-place]').value !== 'other';
  const current = $('[data-tags]').value.split(',').map((t) => t.trim()).filter(Boolean);
  $('[data-suggest]').innerHTML = (p ? p.themes : []).map((t) =>
    `<button type="button" data-add-tag="${t}" aria-pressed="${current.includes(t)}">#${t}</button>`).join('');
}
$('[data-place]').addEventListener('change', () => { dirty = true; clearError('place'); updateSuggest(); });
$('[data-suggest]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-add-tag]');
  if (!b) return;
  const tags = $('[data-tags]').value.split(',').map((t) => t.trim()).filter(Boolean);
  const t = b.dataset.addTag;
  $('[data-tags]').value = (tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]).join(', ');
  updateSuggest();
});
updateSuggest();

$('[data-body]').addEventListener('input', (e) => { $('[data-counter]').textContent = `${e.target.value.length}/2200`; dirty = true; });
$('[data-title]').addEventListener('input', () => { dirty = true; clearError('title'); });

/* ---------- 사진: 긴 변 800px로 줄여 JPG로 (브라우저 저장 공간이 약 5MB라서) ---------- */
function shrink(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 800 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

async function addFiles(files) {
  const list = [...files].filter((f) => /image\/(jpeg|png)/.test(f.type));
  if (photos.length + list.length > MAX_PHOTOS) toast('사진은 4장까지 올릴 수 있어요');
  for (const f of list.slice(0, MAX_PHOTOS - photos.length)) {
    const url = await shrink(f);
    if (url) photos.push(url);
  }
  dirty = true;
  clearError('photos');
  renderThumbs();
}
function renderThumbs() {
  $('[data-thumbs]').innerHTML = photos.map((src, i) => `
    <div class="write__thumb">
      <div class="media media--1x1"><img src="${src}" alt="올린 사진 ${i + 1}"></div>
      <button type="button" data-remove="${i}" aria-label="사진 ${i + 1} 지우기">${icon('close')}</button>
    </div>`).join('');
}
$('[data-file]').addEventListener('change', (e) => { addFiles(e.target.files); e.target.value = ''; });
$('[data-thumbs]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-remove]');
  if (b) { photos.splice(Number(b.dataset.remove), 1); renderThumbs(); }
});
const drop = $('[data-drop]');
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-dragover'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-dragover'); }));
drop.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));

/* ---------- 검사 · 저장 ---------- */
function showError(key, msg) {
  const el = form.querySelector(`[data-error="${key}"]`);
  el.textContent = msg; el.hidden = false;
  const field = form.querySelector(`[data-field="${key}"]`);
  if (field) field.classList.add('is-error');
}
function clearError(key) {
  const el = form.querySelector(`[data-error="${key}"]`);
  el.hidden = true;
  const field = form.querySelector(`[data-field="${key}"]`);
  if (field) field.classList.remove('is-error');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const placeVal = $('[data-place]').value;
  const otherName = $('[data-other-name]').value.trim();
  const title = $('[data-title]').value.trim();
  const errors = [];
  if (!photos.length) { showError('photos', '사진을 한 장 이상 올려 주세요'); errors.push(drop); }
  if (!placeVal || (placeVal === 'other' && !otherName)) { showError('place', '장소를 골라 주세요'); errors.push($('[data-place]')); }
  if (!title) { showError('title', '제목을 적어 주세요'); errors.push($('[data-title]')); }
  if (errors.length) { errors[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); errors[0].focus?.(); return; }

  const record = {
    id: `u${Date.now()}`,
    user: DEMO_USER.id,
    type: value($('[data-type]')),
    place: placeVal === 'other' ? 'other' : placeVal,
    placeName: placeVal === 'other' ? otherName : undefined,
    district: placeVal === 'other' ? $('[data-other-district]').value : undefined,
    season: value($('[data-season]')),
    date: today(),
    photos: photos.length,
    images: photos,
    title,
    body: $('[data-body]').value.trim(),
    tags: $('[data-tags]').value.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8),
    likes: 0,
    revisit: 0,
    comments: [],
  };
  const mine = store.get('records', []);
  if (!store.set('records', [record, ...mine])) return;          // 저장 공간 부족 → script.js가 안내
  if ($('[data-revisit]').checked) setReaction(record.id, 'revisit', true);
  dirty = false;
  location.href = `post.html?id=${record.id}&new=1`;
});

/* ---------- 취소 · 이탈 확인 ---------- */
$('[data-cancel]').addEventListener('click', async () => {
  if (dirty && !(await confirmModal({ title: '작성 중인 기록이 사라져요', message: '나갈까요?', confirmLabel: '나가기' }))) return;
  dirty = false;
  history.length > 1 ? history.back() : (location.href = 'community.html');
});
addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
