/* =========================================================
   풍담 風談 — data.js (시연용 데이터)
   장소·카드·이웃 기록·테스트. 문구를 바꾸려면 이 파일만 고치면 됨.
   이미지 파일이 아직 없으면 자리 표시(장소명)가 대신 보임.
   ========================================================= */

const DEMO_SEASON = 'autumn';      // 시연 계절 (가을 고정)
const DEMO_USER = { id: 'subin.e_', name: '이수빈' };

const SEASONS = {
  spring: { ko: '봄', en: 'SPRING', line: '무심천에 벚꽃이 흐드러지는 계절' },
  summer: { ko: '여름', en: 'SUMMER', line: '초정 약수가 차갑게 솟아오르는 계절' },
  autumn: { ko: '가을', en: 'AUTUMN', line: '토성 위로 노을이 길게 내려앉는 계절' },
  winter: { ko: '겨울', en: 'WINTER', line: '산성 위로 눈이 소리 없이 쌓이는 계절' },
};
const DISTRICTS = { sangdang: '상당구', seowon: '서원구', heungdeok: '흥덕구', cheongwon: '청원구' };

/* ---------- 장소 12곳 (풍담 쇼룸은 가상) ----------
   seasons: 이 장소가 소개되는 계절과 그 계절의 한 줄
   이미지: assets/images/places/<id>-<season>.jpg (4:5) */
const PLACES = [
  { id: 'musimcheon', name: '무심천 벚꽃길', nameEn: 'Musimcheon Blossom Road', district: 'seowon', area: '서원구 무심서로 구간',
    themes: ['자연', '산책'], cardId: 'musimcheon', stay: '약 1시간',
    seasons: { spring: '둑길을 따라 벚꽃이 터널처럼 이어져요.' },
    about: '청주 도심을 가로지르는 하천. 봄이면 양쪽 둑에 벚꽃이 가득 피어, 걷기만 해도 계절이 바뀐 걸 알게 돼요.',
    tip: '사람이 적은 아침에 가면 꽃잎 떨어지는 소리까지 들려요.', related: ['yonghwasa', 'cheongnamdae'] },
  { id: 'yonghwasa', name: '용화사', nameEn: 'Yonghwasa Temple', district: 'seowon', area: '서원구 무심서로',
    themes: ['역사', '고요'], stay: '약 30분',
    seasons: { spring: '벚꽃길 끝에서 잠시 숨을 고르는 곳.', autumn: '물든 무심천 곁에서 조용히 머물러요.' },
    about: '무심천 곁의 오래된 절. 꽃길의 소란을 지나 조용히 머물기 좋아요.',
    tip: '경내에서는 목소리를 낮춰 주세요.', related: ['musimcheon'] },
  { id: 'garosugil', name: '청주 가로수길', nameEn: 'Platanus Tunnel Road', district: 'heungdeok', area: '흥덕구',
    themes: ['자연', '드라이브'], stay: '드라이브 약 10분',
    seasons: { summer: '플라타너스 그늘이 길 전체를 덮어요.', autumn: '노랗게 물든 잎이 터널 위로 흩날려요.' },
    about: '청주로 들어오는 관문 길. 70여 년 된 플라타너스가 터널을 이뤄요. 걷기보다는 천천히 달리며 보는 길이에요.',
    tip: '차로 지나가는 길이에요. 함께 탄 사람이 창밖을 담아 주세요.', related: ['mmca-cheongju', 'goinswae'] },
  { id: 'goinswae', name: '청주고인쇄박물관 · 흥덕사지', nameEn: 'Cheongju Early Printing Museum', district: 'heungdeok', area: '흥덕구 운천동',
    themes: ['역사', '실내'], stay: '약 1시간 30분',
    seasons: { summer: '더운 날, 직지의 고향에서 쉬어 가기.', winter: '추운 날 실내에서 만나는 직지 이야기.' },
    about: '세계에서 가장 오래된 금속활자본 『직지』를 찍어낸 절터 곁의 박물관. 청주의 상징 직지를 가장 가까이에서 만나요.',
    tip: '근처 운리단길과 묶어서 걸어 보세요.', related: ['unridan-gil'] },
  { id: 'unridan-gil', name: '운리단길', nameEn: 'Unridan-gil', district: 'heungdeok', area: '흥덕구 운천동',
    themes: ['카페', '골목'], stay: '약 2시간',
    seasons: { spring: '꽃 핀 담장 사이로 작은 가게들이 문을 열어요.', autumn: '작은 카페와 소품 가게가 이어지는 골목.' },
    about: '흥덕구 운천동의 골목길. 걷다 들어가고, 또 걷다 들어가게 되는 곳이에요.',
    tip: '주말에만 여는 가게도 있어요.', related: ['goinswae', 'poongdam-showroom'] },
  { id: 'jeongbuk-toseong', name: '정북동토성', nameEn: 'Jeongbuk-dong Earthen Fortress', district: 'cheongwon', area: '청원구 정북동',
    themes: ['역사', '노을'], cardId: 'jeongbuk', stay: '약 1시간',
    seasons: { autumn: '토성 위 소나무 너머로 노을이 내려앉아요.' },
    about: '들판 한가운데 낮게 놓인 오래된 흙의 성. 해 질 무렵 소나무 실루엣이 그대로 한 장의 그림이 돼요.',
    tip: '해 지기 30분 전에 도착하면 가장 좋아요.', related: ['sangdang-sanseong', 'chojeong-haenggung'] },
  { id: 'mmca-cheongju', name: '국립현대미술관 청주', nameEn: 'MMCA Cheongju', district: 'cheongwon', area: '청원구',
    themes: ['예술', '실내'], stay: '약 2시간',
    seasons: { summer: '더위를 피해 미술관 수장고 속으로.', winter: '담배 공장이 미술관이 된 곳에서, 따뜻하게.' },
    about: '옛 연초제조창을 고쳐 만든 미술관. 작품이 보관되는 수장고 안까지 직접 들어가 볼 수 있어요.',
    tip: '쉬는 날이 있으니 방문 전에 확인해 주세요.', related: ['garosugil'] },
  { id: 'chojeong-haenggung', name: '초정행궁', nameEn: 'Chojeong Haenggung', district: 'cheongwon', area: '청원구 내수읍',
    themes: ['역사', '쉼'], cardId: 'chojeong', stay: '약 1시간 30분',
    seasons: { summer: '탄산 약수가 차갑게 솟는 여름, 행궁 그늘에서 쉬어 가요.', autumn: '약수 곁 행궁에서 느긋한 오후를.', winter: '약수에 발을 담그고 몸을 녹여요.' },
    about: '세종이 머물며 눈병을 치료했다고 전해지는 초정약수 곁에 재현한 행궁. 족욕 체험장이 있어요.',
    tip: '작은 수건을 챙겨 가면 족욕이 더 편해요.', related: ['jeongbuk-toseong'] },
  { id: 'sangdang-sanseong', name: '상당산성', nameEn: 'Sangdang Mountain Fortress', district: 'sangdang', area: '상당구 산성동',
    themes: ['역사', '산책'], cardId: 'sangdang', stay: '약 2시간',
    seasons: { summer: '숲 그늘 아래 성곽을 따라 걸어요.', autumn: '물든 성곽 위로 청주 시내가 내려다보여요.', winter: '눈 내린 성곽길을 소리 없이 걸어요.' },
    about: '산 능선을 따라 4km 남짓 이어지는 조선시대 돌 성곽. 성 위에서 청주 시내가 내려다보여요.',
    tip: '성 안 마을에서 따뜻한 한 끼로 마무리해 보세요.', related: ['jeongbuk-toseong', 'suamgol'] },
  { id: 'cheongnamdae', name: '청남대', nameEn: 'Cheongnamdae', district: 'sangdang', area: '상당구 문의면',
    themes: ['자연', '산책'], stay: '반나절',
    seasons: { spring: '호숫가 길을 따라 봄꽃이 피어나요.', autumn: '대청호를 끼고 걷는 단풍길. 늦가을엔 국화가 정원을 채워요.' },
    about: '옛 대통령 별장. 호수와 숲, 정원이 이어져 반나절은 머물게 돼요.',
    tip: '주말과 축제 기간에는 예약 안내를 먼저 확인해 주세요.', related: ['sangdang-sanseong'] },
  { id: 'suamgol', name: '수암골', nameEn: 'Suamgol', district: 'sangdang', area: '상당구 수동',
    themes: ['야경', '카페'], stay: '약 1시간 30분',
    seasons: { autumn: '언덕 위에서 노을과 야경을 차례로.', winter: '찬 공기 속에서 더 또렷해지는 청주의 야경.' },
    about: '우암산 자락의 옛 마을. 벽화 골목을 지나 전망대에 오르면 청주 시내가 한눈에 보여요.',
    tip: '사람이 사는 마을이에요. 늦은 밤에는 조용히 걸어 주세요.', related: ['sangdang-sanseong'] },
  { id: 'poongdam-showroom', name: '풍담 쇼룸 · 운리단길', nameEn: 'Poongdam Showroom', district: 'heungdeok', area: '흥덕구 운리단길 일대 (가상 위치)',
    themes: [], virtual: true, stay: '약 30분', hours: '화~일 12:00~19:00 · 월요일 휴무 (가상)',
    seasons: {},
    about: '풍담을 처음 만나는 곳. 바람이 드나드는 작은 방에서 네 장의 카드와 네 가지 향을 직접 경험해 보세요.',
    tip: '풍경 소리 듣기 · 카드 향 맡아 보기 · 카드 교체 · NFC 태그 체험', related: ['unridan-gil'] },
];

// 장소 사진 장수 → assets/images/places/<id>-1.jpg, -2.jpg …
// (프로토타입: 계절 구분 없이 같은 사진. 계절 사진이 생기면 placeImage()만 바꾸면 됨)
const PLACE_PHOTOS = {
  musimcheon: 3, yonghwasa: 1, garosugil: 2, goinswae: 1, 'unridan-gil': 4, 'jeongbuk-toseong': 2,
  'mmca-cheongju': 2, 'chojeong-haenggung': 1, 'sangdang-sanseong': 2, cheongnamdae: 1, suamgol: 2,
  'poongdam-showroom': 2,
};

/* ---------- 풍담 카드 4장 ---------- */
const CARDS = [
  { id: 'musimcheon', name: 'MUSIM BLOOM', placeId: 'musimcheon', season: 'spring',
    scent: '벚꽃으로 분홍빛이 도는 봄의 무심천. 섬세한 꽃향에 물가의 맑은 공기를 더한, 달지 않고 산뜻한 향이에요.' },
  { id: 'chojeong', name: 'CHOJEONG SPARKLE', placeId: 'chojeong-haenggung', season: 'summer',
    scent: '초정의 탄산 약수처럼 맑고 시원한 향. 물빛 노트에 시트러스와 허브를 더해, 기포가 톡 터지는 느낌을 담았어요.' },
  { id: 'jeongbuk', name: 'JEONGBUK SUNSET', placeId: 'jeongbuk-toseong', season: 'autumn',
    scent: '토성 너머 들판에 천천히 내려앉는 노을. 마른 풀에 앰버와 나무, 깨끗한 머스크를 더한 하루의 마지막 빛 같은 향이에요.' },
  { id: 'sangdang', name: 'SANGDANG BREEZE', placeId: 'sangdang-sanseong', season: 'winter',
    scent: '소나무 숲에 둘러싸인 상당산성 성곽길의 바람. 솔잎과 시더우드, 이끼를 담은 차분한 우디 그린 향이에요.' },
];

/* ---------- 이웃 기록 (예시 콘텐츠) ----------
   type: 'record'(여행 기록) | 'recommend'(장소 추천)
   photos: 사진 장수 → assets/images/records/<id>-<n>.jpg */
const RECORDS = [
  { id: 'r01', user: 'subin.e_', type: 'record', place: 'jeongbuk-toseong', season: 'autumn', date: '2025.10.12', photos: 3,
    title: '노을이 생각보다 오래 머물렀다', body: '친구랑 해 지는 시간에 맞춰 갔다. 소나무 뒤로 해가 넘어가는데 하늘이 계속 색을 바꿨다. 내년 가을에도 꼭 다시 와야지.',
    tags: ['노을', '가을'], likes: 24, revisit: 19, comments: [{ user: 'hanul.walk', text: '여기 진짜 좋죠. 저도 다시 가고 싶어요', time: '2025.10.13' }] },
  { id: 'r02', user: 'subin.e_', type: 'record', place: 'sangdang-sanseong', season: 'summer', date: '2026.07.14', photos: 2,
    title: '성곽 위는 생각보다 시원했다', body: '무더운 여름에 청주에 놀러 와서 즐거웠다. 더워서 힘들긴 했지만 하늘도 예쁘고 재미있었다. 다음엔 다른 친구들이랑도 같이 와야지.',
    tags: ['산책', '여름'], likes: 12, revisit: 18,
    comments: [{ user: 'min2u15', text: '우리 또 청주 놀러 가자', time: '2026.07.14' }, { user: 'kidoki.do', text: '나랑도!!', time: '2026.07.14' }] },
  { id: 'r03', user: 'subin.e_', type: 'record', place: 'sangdang-sanseong', season: 'winter', date: '2026.01.12', photos: 2,
    title: '눈 내린 성곽길', body: '발자국 소리만 들리는 길이었다. 내려와서 산성 마을에서 먹은 따뜻한 한 끼가 오래 기억날 것 같다.',
    tags: ['겨울', '산책'], likes: 20, revisit: 14, comments: [] },
  { id: 'r04', user: 'subin.e_', type: 'record', place: 'poongdam-showroom', season: 'autumn', date: '2026.10.03', photos: 1,
    title: '풍경 소리를 처음 들었다', body: '카드마다 향이 달라서 하나씩 맡아 봤다. 정북동토성 카드 향이 제일 좋았다.',
    tags: ['풍담'], likes: 11, revisit: 8, comments: [] },
  { id: 'r05', user: 'subin.e_', type: 'recommend', place: 'unridan-gil', season: 'spring', date: '2026.04.20', photos: 1,
    title: '봄에는 골목 끝까지 걸어 보세요', body: '꽃 핀 담장 사이로 작은 가게들이 이어져요. 천천히 걸으면 한 시간이 금방 가요.',
    tags: ['골목', '봄'], likes: 13, revisit: 9, comments: [] },
  { id: 'r06', user: 'subin.e_', type: 'record', place: 'goinswae', season: 'summer', date: '2026.08.02', photos: 2,
    title: '직지를 이렇게 가까이 본 건 처음', body: '더운 날 들어가서 시원하게 둘러봤다. 금속활자를 직접 보니 신기했다.',
    tags: ['역사', '실내'], likes: 9, revisit: 6, comments: [] },
  { id: 'r07', user: 'hanul.walk', type: 'record', place: 'jeongbuk-toseong', season: 'autumn', date: '2026.10.18', photos: 3,
    title: '해가 지는 20분 동안 아무 말도 안 했다', body: '소나무 뒤로 해가 넘어가는데, 같이 간 친구도 나도 조용해졌다.',
    tags: ['노을', '사진'], likes: 52, revisit: 41,
    comments: [{ user: 'dal.mood', text: '사진만 봐도 조용해지네요', time: '2026.10.18' }, { user: 'subin.e_', text: '저도 작년에 이 시간에 갔어요', time: '2026.10.19' }] },
  { id: 'r08', user: 'kidoki.do', type: 'recommend', place: 'unridan-gil', season: 'autumn', date: '2026.10.15', photos: 1,
    title: '비 오는 날 더 좋은 골목', body: '창 넓은 카페에 앉아 빗소리 듣기. 소품 가게는 주말에만 여는 곳도 있으니 확인하고 가세요.',
    tags: ['카페', '비'], likes: 18, revisit: 12, comments: [] },
  { id: 'r09', user: 'min2u15', type: 'record', place: 'suamgol', season: 'autumn', date: '2026.10.11', photos: 2,
    title: '전망대에서 본 청주', body: '노을 보러 올라갔다가 야경까지 보고 내려왔다.',
    tags: ['야경', '노을'], likes: 31, revisit: 27, comments: [] },
  { id: 'r10', user: 'pine.note', type: 'recommend', place: 'goinswae', season: 'summer', date: '2026.08.09', photos: 1,
    title: '더운 날 실내 코스로', body: '직지가 왜 청주의 자랑인지 알게 됨. 근처 운리단길이랑 묶어서 가면 좋아요.',
    tags: ['역사', '실내'], likes: 14, revisit: 9, comments: [] },
  { id: 'r11', user: 'dal.mood', type: 'record', place: 'cheongnamdae', season: 'autumn', date: '2026.10.26', photos: 3,
    title: '단풍길 끝에서 국화 향', body: '호숫가 길을 천천히 걸었다. 반나절이 금방 갔다.',
    tags: ['단풍', '산책'], likes: 40, revisit: 33, comments: [] },
  { id: 'r12', user: 'slow.sunday', type: 'record', place: 'chojeong-haenggung', season: 'winter', date: '2026.01.20', photos: 1,
    title: '족욕하고 나니 몸이 다 녹았다', body: '추운 날 갔는데 발이 따뜻해지니 하루가 느긋해졌다.',
    tags: ['쉼', '겨울'], likes: 19, revisit: 15, comments: [] },
  { id: 'r13', user: 'hanul.walk', type: 'recommend', place: 'musimcheon', season: 'spring', date: '2026.04.03', photos: 1,
    title: '벚꽃은 아침 일찍', body: '사람 적은 아침 시간에 가면 꽃잎 떨어지는 소리까지 들려요.',
    tags: ['벚꽃', '산책'], likes: 35, revisit: 22, comments: [] },
  { id: 'r14', user: 'dal.mood', type: 'record', place: 'garosugil', season: 'summer', date: '2026.07.28', photos: 2,
    title: '초록 터널을 지나 청주로', body: '버스 창밖으로 플라타너스가 끝없이 이어졌다. 청주에 왔다는 실감이 났다.',
    tags: ['초록', '여름'], likes: 21, revisit: 17, comments: [] },
  { id: 'r15', user: 'pine.note', type: 'record', place: 'sangdang-sanseong', season: 'autumn', date: '2026.10.20', photos: 2,
    title: '성곽 한 바퀴, 발밑이 전부 단풍', body: '천천히 한 바퀴 도는 데 두 시간쯤 걸렸다. 성 위에서 본 시내가 생각보다 가까웠다.',
    tags: ['단풍', '산책'], likes: 26, revisit: 21, comments: [] },
  { id: 'r16', user: 'min2u15', type: 'record', place: 'mmca-cheongju', season: 'winter', date: '2026.02.08', photos: 2,
    title: '수장고 안을 걸어 다니는 기분', body: '작품이 보관된 공간에 들어가 보는 게 신기했다. 추운 날 실내 코스로 딱.',
    tags: ['예술', '실내'], likes: 16, revisit: 11, comments: [] },
  { id: 'r17', user: 'kidoki.do', type: 'record', place: 'yonghwasa', season: 'spring', date: '2026.04.05', photos: 1,
    title: '꽃길 끝의 조용한 절', body: '벚꽃길에서 사람에 치이다가 들어오니 갑자기 조용해졌다.',
    tags: ['고요', '봄'], likes: 10, revisit: 7, comments: [] },
  { id: 'r18', user: 'slow.sunday', type: 'recommend', place: 'chojeong-haenggung', season: 'autumn', date: '2026.10.17', photos: 1,
    title: '족욕 뒤에는 찻집에서 한 잔', body: '족욕하고 행궁 안 찻집에서 따뜻한 차 한 잔. 오후가 느리게 흘러가요.',
    tags: ['쉼', '차'], likes: 15, revisit: 13, comments: [] },
  { id: 'r19', user: 'hanul.walk', type: 'record', place: 'suamgol', season: 'winter', date: '2026.01.30', photos: 1,
    title: '겨울밤 전망대', body: '손이 시렸지만 공기가 맑아서 불빛이 더 또렷했다.',
    tags: ['야경', '겨울'], likes: 12, revisit: 10, comments: [] },
  { id: 'r20', user: 'dal.mood', type: 'recommend', place: 'garosugil', season: 'autumn', date: '2026.11.02', photos: 1,
    title: '가을엔 창문을 내리고', body: '노랗게 물든 잎이 차 위로 떨어져요. 천천히 지나가 주세요.',
    tags: ['드라이브', '가을'], likes: 22, revisit: 18, comments: [] },
];

/* ---------- 여행 테스트 ---------- */
const TEST = {
  // 결과 유형: tags 를 가진 장소가 추천됨, season 은 결과 화면 배경색
  types: {
    blossom: { name: '꽃바람', en: 'BLOSSOM WIND', sub: '계절을 따라 걷는 산책자', season: 'spring', card: 'musimcheon', place: 'musimcheon',
      desc: '당신의 여행은 걷는 데서 시작돼요. 목적지보다 가는 길이 더 오래 기억에 남는 사람.', keywords: ['걷기', '계절', '자연'], tags: ['자연', '산책'] },
    pine: { name: '솔바람', en: 'PINE WIND', sub: '오래된 길을 걷는 탐험가', season: 'winter', card: 'sangdang', place: 'sangdang-sanseong',
      desc: '돌 하나, 흙 한 줌에 담긴 시간이 궁금한 사람. 아는 만큼 보이는 여행을 좋아해요.', keywords: ['역사', '이야기', '전망'], tags: ['역사'] },
    sunset: { name: '노을바람', en: 'SUNSET WIND', sub: '순간을 담는 기록자', season: 'autumn', card: 'jeongbuk', place: 'jeongbuk-toseong',
      desc: '빛이 가장 예쁜 시간을 기다릴 줄 아는 사람. 당신의 사진첩이 곧 여행기예요.', keywords: ['노을', '사진', '감성'], tags: ['노을', '야경', '카페', '골목', '예술'] },
    breeze: { name: '실바람', en: 'BREEZE', sub: '천천히 머무는 휴식가', season: 'summer', card: 'chojeong', place: 'chojeong-haenggung',
      desc: '가장 약한 바람처럼 서두르지 않는 여행. 잘 쉬고 오는 것도 훌륭한 여행이에요.', keywords: ['쉼', '여유', '머무름'], tags: ['쉼', '실내', '드라이브', '고요'] },
  },
  // 각 선택지 = 한 유형 +1점. 화면에서는 순서를 섞어서 보여 줌. 동점이면 Q5 선택이 우선.
  questions: [
    { q: '여행지에 도착했어요. 가장 먼저 하고 싶은 일은?', options: [
      ['꽃이 핀 길부터 천천히 걸어 볼래요', 'blossom'], ['이 동네의 오래된 이야기부터 알고 싶어요', 'pine'],
      ['분위기 좋은 카페를 찾아 사진부터 찍어요', 'sunset'], ['왔다는 것만으로 충분해요. 일단 좀 쉴래요', 'breeze']] },
    { q: '여행 사진첩에 가장 많은 사진은?', options: [
      ['하늘과 나무, 꽃', 'blossom'], ['오래된 건물과 돌담', 'pine'], ['노을 속 실루엣', 'sunset'], ['맛있었던 음식과 창밖 풍경', 'breeze']] },
    { q: '여행에서 가장 좋아하는 시간대는?', options: [
      ['공기가 맑은 아침', 'blossom'], ['햇살이 단단한 한낮', 'pine'], ['하늘이 물드는 해 질 녘', 'sunset'], ['아무 계획 없는 늦은 오후', 'breeze']] },
    { q: '친구가 "이번 여행 어땠어?" 하고 묻는다면', options: [
      ['걷기만 해도 좋았어', 'blossom'], ['생각보다 알게 된 게 많았어', 'pine'], ['사진 보여 줄게. 진짜 예뻐', 'sunset'], ['푹 쉬다 왔어', 'breeze']] },
    { q: '바람이 분다면, 어떤 소리를 듣고 싶나요?', options: [
      ['꽃잎이 스치는 소리', 'blossom'], ['성벽 위를 지나가는 바람 소리', 'pine'], ['들판의 풀이 일렁이는 소리', 'sunset'], ['처마 끝 풍경이 울리는 소리', 'breeze']] },
  ],
};
