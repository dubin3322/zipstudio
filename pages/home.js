/* Home (index.html) — 계절 장소, 이웃 기록, 카드 목록, Hero 바람 */

// H3: 시연 계절에 보여 줄 장소 (첫 번째가 큰 사진)
const HOME_PICKS = {
  autumn: ['jeongbuk-toseong', 'unridan-gil', 'sangdang-sanseong', 'cheongnamdae'],
};
const season = DEMO_SEASON;
const picks = (HOME_PICKS[season] || PLACES.filter((p) => p.seasons[season]).map((p) => p.id)).slice(0, 4);

document.querySelector('[data-season-label]').textContent = SEASONS[season].en;
document.querySelector('[data-season-title]').textContent = `${SEASONS[season].ko}의 청주`;
document.querySelector('[data-season-link]').href = `places.html?season=${season}`;

document.querySelector('[data-home-places]').innerHTML = picks.map((id) => renderPlaceCard(placeById(id), season)).join('');

// H5: 최신 이웃 기록 3개
document.querySelector('[data-home-records]').innerHTML = allRecords().slice(0, 3).map(renderRecordCard).join('');

// H6: 카드 4장 → 각 카드의 장소로
document.querySelector('[data-home-cards]').innerHTML = CARDS.map((c) => `
  <a href="place.html?id=${c.placeId}&season=${c.season}">
    <span>${c.name}</span><span>${SEASONS[c.season].ko} · ${placeById(c.placeId).name}</span>
  </a>`).join('');

initReveal();

// H1: 마우스를 빠르게 움직이면 바람 → 풍경 소리 (소리를 켠 경우만), 누르면 한 번 울림
const hero = document.querySelector('[data-hero-area]');
let lastX = null, lastT = 0, lastRing = 0;

if (matchMedia('(hover: hover)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (lastX !== null) {
      const speed = Math.abs(e.clientX - lastX) / Math.max(now - lastT, 16);   // px/ms
      if (speed > 0.9 && now - lastRing > 1200) { playChime(Math.min(1, speed / 2)); lastRing = now; }
    }
    lastX = e.clientX; lastT = now;
  });
}
hero.addEventListener('click', (e) => {
  if (e.target.closest('a, button')) return;   // 소리 켜기 버튼은 따로
  soundOn ? playChime() : setSound(true);   // 처음 누르면 소리도 켜짐
});
